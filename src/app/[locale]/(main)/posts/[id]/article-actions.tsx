"use client";

import { useActionState } from "react";

import { HeartIcon, MessageCircleIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useActionToast } from "@/hooks/use-action-toast";
import { initState } from "@/lib/action";
import { createLikeAction, deleteLikeAction } from "@/lib/actions/like";

interface ArticleActionsProps {
  postId: number;
  liked: boolean;
  likeCount: number;
  commentCount: number;
}

export default function ArticleActions({
  postId,
  liked,
  likeCount,
  commentCount,
}: ArticleActionsProps) {
  return (
    <div className="flex gap-2">
      <LikeToggleForm postId={postId} liked={liked} likeCount={likeCount} />
      <Button size="sm" variant="outline">
        <MessageCircleIcon />
        {commentCount}
      </Button>
    </div>
  );
}

interface LikeToggleFormProps {
  postId: number;
  likeCount: number;
  liked: boolean;
}

function LikeToggleForm({ postId, likeCount, liked }: LikeToggleFormProps) {
  const createLikeWithPostId = createLikeAction.bind(null, postId);
  const deleteLikeWithPostId = deleteLikeAction.bind(null, postId);

  const [state, dispatch, isPending] = useActionState(
    liked ? deleteLikeWithPostId : createLikeWithPostId,
    initState()
  );
  useActionToast(state);

  return (
    <form action={dispatch}>
      <Button type="submit" size="sm" variant="outline" disabled={isPending}>
        <HeartIcon
          className={liked ? "fill-foreground stroke-foreground" : ""}
        />
        {likeCount}
      </Button>
    </form>
  );
}
