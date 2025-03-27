import { auth } from "@/lib/auth";
import { getPostById } from "@/server-actions/post";
import { getUserById } from "@/server-actions/user";

import PostUpsertForm from "../../post-upsert-form";

export default async function PostEdit({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const post = await getPostById(Number(id));

  if (!post) {
    return <div>Post not found</div>;
  }

  const user = await getUserById(post.userId);

  if (!user) {
    return <div>User not found</div>;
  }

  const session = await auth();

  if (post.userId !== Number(session?.user?.id)) {
    return <div>Permission denied</div>;
  }

  return <PostUpsertForm post={post} />;
}
