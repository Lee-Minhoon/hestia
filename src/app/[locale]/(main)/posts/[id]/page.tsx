import { and, count, eq, isNull } from "drizzle-orm";
import DOMPurify from "isomorphic-dompurify";
import { clamp } from "lodash-es";
import { Metadata } from "next";
import { BlogPosting } from "schema-dts";

import { Paginator } from "@/components/ui/pagination";
import { auth } from "@/lib/auth";
import db from "@/lib/db";
import { withPagination, withSorting } from "@/lib/db/query-helpers";
import { comments, users } from "@/lib/db/schema";
import { JsonLd } from "@/lib/metadata";
import { QueryParamKeys } from "@/lib/queryParams";
import { paginationSchema } from "@/lib/validation";

import ArticleActions from "./article-actions";
import Comment from "./comment";
import CommentUpsertForm from "./comment-upsert-form";
import WriterCard from "./writer-card";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  const post = await db.query.posts.findFirst({
    where: (posts, { eq }) => eq(posts.id, Number(id)),
  });

  return {
    title: post?.title,
    description: post?.content,
  };
}

export default async function PostDetail({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    [QueryParamKeys.PageIndex]?: string;
    [QueryParamKeys.SortBy]?: string;
    [QueryParamKeys.Next]?: string;
  }>;
}) {
  const { id } = await params;

  const { next, ...rest } = await searchParams;

  const { pageIndex } = paginationSchema.parse(rest);

  const post = await db.query.posts.findFirst({
    where: (posts, { and, eq, isNull }) =>
      and(eq(posts.id, Number(id)), isNull(posts.deletedAt)),
  });

  if (!post) {
    return <div>Post not found</div>;
  }

  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, post.userId),
  });

  if (!user) {
    return <div>User not found</div>;
  }

  const condition = and(
    eq(comments.postId, post.id),
    isNull(comments.deletedAt)
  );

  const qb = db
    .select()
    .from(comments)
    .leftJoin(users, eq(comments.userId, users.id))
    .where(condition)
    .$dynamic();

  const commentCount = (
    await db.select({ count: count() }).from(comments).where(condition)
  )[0].count;

  const pageSize = 10;

  const registeredComments = await withPagination(
    withSorting(qb, [{ table: comments, column: "id", order: "asc" }]),
    clamp(pageIndex, 0, Math.ceil(commentCount / pageSize)),
    pageSize
  ).execute();

  const session = await auth();

  const jsonLd = JsonLd<BlogPosting>({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    datePublished: post.createdAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: {
      "@type": "Person",
      name: user.name,
    },
  });

  return (
    <div className="flex flex-col gap-4">
      <ArticleActions
        previous={next}
        post={post}
        isOwner={post.userId === Number(session?.user?.id)}
      />
      <article className="flex flex-col rounded-md border p-4 gap-4">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <header className="flex flex-col gap-4 pb-4 border-b">
          <h1 className="font-bold text-xl break-words">{post.title}</h1>
          <div className="flex justify-between">
            <WriterCard user={user} />
            <time className="text-sm text-muted-foreground">
              {post.createdAt.toLocaleString()}
            </time>
          </div>
        </header>
        <main className="min-h-[200px]">
          <div
            className="prose max-w-full"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(post.content),
            }}
          />
        </main>
        <section className="flex flex-col gap-4">
          <h2 className="text-sm font-bold">{`Comments ${commentCount}`}</h2>
          <ul className="flex flex-col">
            {registeredComments.map((comment) => (
              <Comment key={comment.comment.id} comment={comment} />
            ))}
          </ul>
          <Paginator
            pageIndex={pageIndex}
            pageSize={pageSize}
            rowCount={commentCount}
          />
          <CommentUpsertForm postId={post.id} />
        </section>
      </article>
    </div>
  );
}
