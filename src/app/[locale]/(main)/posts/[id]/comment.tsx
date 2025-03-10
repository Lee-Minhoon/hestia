import { FaUserAlt } from "react-icons/fa";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CommentWithUser } from "@/lib/db/schema";

interface CommentProps {
  comment: CommentWithUser;
}

export default function Comment({ comment }: CommentProps) {
  return (
    <li className="flex py-4 gap-2 border-b last:border-b-0">
      <Avatar className="w-10 h-10">
        <AvatarImage src={comment.user?.image ?? undefined} alt="profile" />
        <AvatarFallback>
          <FaUserAlt />
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col overflow-hidden">
        <div className="flex gap-2">
          <h2 className="text-sm truncate">{comment.user?.name ?? ""}</h2>
          <time className="text-sm text-muted-foreground">
            {comment.comment.createdAt.toLocaleString()}
          </time>
        </div>
        <p className="text-sm break-words">{comment.comment.content}</p>
      </div>
    </li>
  );
}
