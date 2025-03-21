"use client";

import { format } from "date-fns";
import { DeleteIcon, EditIcon, Ellipsis } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDisclosure } from "@/hooks/use-disclosure";
import { CommentWithUser } from "@/lib/db/schema";

import CommentUpdateForm from "./comment-update-form";

interface CommentProps {
  comment: CommentWithUser;
  onDelete: (id: number) => void;
}

export default function Comment({ comment, onDelete }: CommentProps) {
  const updateForm = useDisclosure();

  return (
    <li className="flex py-4 border-b last:border-b-0">
      {updateForm.isOpen ? (
        <div className="flex-1">
          <CommentUpdateForm
            comment={comment.comment}
            onCancel={updateForm.onClose}
          />
        </div>
      ) : (
        <div className="flex flex-1 gap-2">
          <Avatar className="w-10 h-10">
            <AvatarImage src={comment.user?.image ?? undefined} alt="profile" />
            <AvatarFallback />
          </Avatar>
          <div className="flex flex-1 flex-col overflow-hidden">
            <div className="flex gap-2">
              <h2 className="text-sm truncate">{comment.user?.name ?? ""}</h2>
              <time className="text-sm text-muted-foreground">
                {format(comment.comment.createdAt, "yyyy-MM-dd HH:mm")}
              </time>
            </div>
            <p className="text-sm break-words">{comment.comment.content}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Ellipsis />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={updateForm.onOpen}>
                <EditIcon />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(comment.comment.id)}>
                <DeleteIcon />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </li>
  );
}
