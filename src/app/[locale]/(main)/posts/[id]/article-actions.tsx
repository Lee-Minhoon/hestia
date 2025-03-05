import { MdDelete, MdEdit, MdOutlineArrowBack } from "react-icons/md";

import { Button } from "@/components/ui/button";
import { Post } from "@/lib/db/schema";
import { Link } from "@/lib/i18n/routing";
import { Pages, toUrl } from "@/lib/routes";

interface ArticleActionsProps {
  previous?: string;
  post: Post;
  isOwner: boolean;
}

export default function ArticleActions({
  previous,
  post,
  isOwner,
}: ArticleActionsProps) {
  return (
    <div className="flex justify-between">
      <Button asChild variant="outline">
        <Link href={previous ?? toUrl(Pages.Posts)}>
          <MdOutlineArrowBack />
          Back
        </Link>
      </Button>
      {isOwner && (
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href={toUrl(Pages.PostEdit, { id: post.id })}>
              <MdEdit />
              Edit
            </Link>
          </Button>
          <Button variant="outline">
            <MdDelete />
            Delete
          </Button>
        </div>
      )}
    </div>
  );
}
