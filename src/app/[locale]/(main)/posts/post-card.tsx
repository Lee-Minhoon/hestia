import { format } from "date-fns";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PostWithUser } from "@/lib/db/schema";
import { cn } from "@/lib/utils";

interface PostCardProps extends React.ComponentProps<typeof Card> {
  data: PostWithUser;
}

export default function PostCard({ data, className, ...props }: PostCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)} {...props}>
      <CardHeader>
        <div className="flex gap-4 overflow-hidden">
          <Avatar className="size-10">
            <AvatarImage src={data.user?.image ?? undefined} alt="profile" />
            <AvatarFallback />
          </Avatar>
          <div className="flex flex-col overflow-hidden">
            <CardTitle className="text-sm truncate">
              {data.post.title}
            </CardTitle>
            <CardDescription className="truncate">
              {data.user?.name}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="truncate">{data.post.content}</p>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-xs text-muted-foreground">
          {`Created on ${format(new Date(data.post.createdAt), "yyyy-MM-dd HH:mm")}`}
        </p>
      </CardFooter>
    </Card>
  );
}
