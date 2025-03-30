import { and, count, eq, isNull } from "drizzle-orm";
import DOMPurify from "isomorphic-dompurify";
import { clamp } from "lodash-es";
import { ArrowLeftIcon } from "lucide-react";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { BlogPosting } from "schema-dts";

import { ProgressLink } from "@/components/progress-link";
import { ScrollIntoView } from "@/components/scroll-into-view";
import { Button } from "@/components/ui/button";
import { Paginator } from "@/components/ui/pagination";
import { auth } from "@/lib/auth";
import db from "@/lib/db";
import { withPagination, withSorting } from "@/lib/db/query-helpers";
import { comments, likes, users } from "@/lib/db/schema";
import { JsonLd } from "@/lib/metadata";
import { QueryParamKeys } from "@/lib/queryParams";
import { Pages, toUrl } from "@/lib/routes";
import { paginationSchema } from "@/lib/validation";
import { getPostById } from "@/server-actions/post";
import { getUserById } from "@/server-actions/user";

import ArticleActions from "./article-actions";
import ArticleAuthor from "./article-author";
import AuthorActions from "./author-actions";
import CommentCreateForm from "./comment-create-form";
import CommentList from "./comment-list";

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
  const t = await getTranslations("Common");

  const { id } = await params;

  const { next, ...rest } = await searchParams;

  const { pageIndex } = paginationSchema.parse(rest);

  const post = await getPostById(Number(id));

  if (!post) {
    return <div>Post not found</div>;
  }

  const user = await getUserById(post.userId);

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

  const liked = !!(await db.query.likes.findFirst({
    where: and(
      eq(likes.postId, post.id),
      eq(likes.userId, Number(session?.user?.id))
    ),
  }));

  const likeCount = (
    await db
      .select({ count: count() })
      .from(likes)
      .where(eq(likes.postId, post.id))
  )[0].count;

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

  const isAuthor = post.userId === Number(session?.user?.id);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between">
        <Button asChild variant="outline">
          <ProgressLink href={next ?? toUrl(Pages.Posts)}>
            <ArrowLeftIcon />
            {t("back")}
          </ProgressLink>
        </Button>
        {isAuthor && <AuthorActions previous={next} post={post} />}
      </div>
      <article className="flex flex-col rounded-md border p-4 gap-4">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <header className="flex flex-col gap-4 pb-4 border-b">
          <h1 className="font-bold text-xl break-words">{post.title}</h1>
          <div className="flex justify-between">
            <ArticleAuthor user={user} />
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
          <ScrollIntoView>
            <ArticleActions
              postId={Number(id)}
              liked={liked}
              likeCount={likeCount}
              commentCount={commentCount}
            />
            <CommentList comments={registeredComments} />
          </ScrollIntoView>
          <Paginator
            pageIndex={pageIndex}
            pageSize={pageSize}
            rowCount={commentCount}
          />
          <CommentCreateForm postId={post.id} />
        </section>
      </article>
    </div>
  );
}
