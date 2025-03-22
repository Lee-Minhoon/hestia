"use client";

import { useActionState } from "react";

import copy from "copy-to-clipboard";
import {
  ForwardIcon,
  HeartIcon,
  LinkIcon,
  MessageCircleIcon,
} from "lucide-react";
import { toast } from "sonner";

import { ScrollIntoViewTrigger } from "@/components/scroll-into-view";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
    <div className="flex justify-between">
      <div className="flex gap-2">
        <LikeToggleForm postId={postId} liked={liked} likeCount={likeCount} />
        <ScrollIntoViewTrigger asChild options={{ behavior: "smooth" }}>
          <Button size="sm" variant="outline">
            <MessageCircleIcon />
            {commentCount}
          </Button>
        </ScrollIntoViewTrigger>
      </div>
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="outline">
              <ForwardIcon />
              Share
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                if (copy(window.location.href)) {
                  toast.success("Link copied to clipboard");
                } else {
                  toast.error("Failed to copy link to clipboard");
                }
              }}
            >
              <LinkIcon />
              Copy Link
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
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
