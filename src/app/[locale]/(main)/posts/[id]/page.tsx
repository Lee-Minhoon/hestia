import DOMPurify from "isomorphic-dompurify";
import { Metadata } from "next";
import { BlogPosting } from "schema-dts";

import { auth } from "@/lib/auth";
import db from "@/lib/db";
import { JsonLd } from "@/lib/metadata";
import { QueryParamKeys } from "@/lib/queryParams";

import ArticleActions from "./article-actions";
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
    [QueryParamKeys.Next]?: string;
  }>;
}) {
  const { id } = await params;

  const { next } = await searchParams;

  const post = await db.query.posts.findFirst({
    where: (posts, { eq }) => eq(posts.id, Number(id)),
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
      </article>
    </div>
  );
}
