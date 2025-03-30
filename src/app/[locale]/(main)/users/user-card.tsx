import { format } from "date-fns";
import { useTranslations } from "next-intl";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { User } from "@/lib/db/schema";

interface UserCardProps {
  data: User;
}

export default function UserCard({ data: user }: UserCardProps) {
  const t = useTranslations("User");

  return (
    <Card>
      <CardHeader>
        <div className="flex gap-4 overflow-hidden">
          <Avatar className="size-10">
            <AvatarImage src={user.image ?? undefined} alt="profile" />
            <AvatarFallback />
          </Avatar>
          <div className="flex flex-col overflow-hidden">
            <CardTitle className="text-sm truncate">{user.name}</CardTitle>
            <CardDescription className="truncate">{user.email}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        Some user details
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-xs text-muted-foreground">
          {t("joinedOn", { date: format(user.createdAt, "yyyy-MM-dd HH:mm") })}
        </p>
      </CardFooter>
    </Card>
  );
}
