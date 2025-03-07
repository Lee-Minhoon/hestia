import { FaUserAlt } from "react-icons/fa";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/lib/db/schema";

interface WriterCardProps {
  user: User;
}

export default function WriterCard({ user }: WriterCardProps) {
  return (
    <div className="flex items-center gap-2">
      <Avatar className="w-10 h-10">
        <AvatarImage src={user.image ?? undefined} alt="profile" />
        <AvatarFallback>
          <FaUserAlt />
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <h2 className="text-sm truncate">{user.name}</h2>
        <p className="text-sm text-muted-foreground">{user.email}</p>
      </div>
    </div>
  );
}
