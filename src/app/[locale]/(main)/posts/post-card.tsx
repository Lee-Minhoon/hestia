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

interface PostCardProps {
  data: PostWithUser;
}

export default function PostCard({ data }: PostCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex gap-4">
          <Avatar className="size-10">
            <AvatarImage src={data.user?.image ?? undefined} alt="profile" />
            <AvatarFallback />
          </Avatar>
          <div className="flex flex-col overflow-hidden">
            <CardTitle className="text-sm">{data.post.title}</CardTitle>
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
          {`Created on ${format(new Date(data.post.createdAt), "PPpp")}`}
        </p>
      </CardFooter>
    </Card>
  );
}
