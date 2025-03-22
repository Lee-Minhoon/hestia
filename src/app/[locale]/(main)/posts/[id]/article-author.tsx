import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/lib/db/schema";

interface ArticleAuthorProps {
  user: User;
}

export default function ArticleAuthor({ user }: ArticleAuthorProps) {
  return (
    <div className="flex items-center gap-2">
      <Avatar className="size-10">
        <AvatarImage src={user.image ?? undefined} alt="profile" />
        <AvatarFallback />
      </Avatar>
      <div className="flex flex-col">
        <h2 className="text-sm truncate">{user.name}</h2>
        <p className="text-sm text-muted-foreground">{user.email}</p>
      </div>
    </div>
  );
}
