import { auth } from "@/lib/auth";
import db from "@/lib/db";

import PostUpsertForm from "../../post-upsert-form";

export default async function PostEdit({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

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

  if (post.userId !== Number(session?.user?.id)) {
    return <div>Permission denied</div>;
  }

  return <PostUpsertForm post={post} />;
}
