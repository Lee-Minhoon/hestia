import { getTranslations } from "next-intl/server";
import { FaUserAlt } from "react-icons/fa";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { auth, signOut } from "@/lib/auth";
import { Link } from "@/lib/i18n/routing";
import { Pages, toUrl } from "@/lib/routes";

export default async function Account() {
  const t = await getTranslations("MainLayout");
  const session = await auth();

  return (
    <nav className="flex">
      {session?.user ? (
        <Sheet>
          <SheetTrigger>
            <Avatar>
              <AvatarImage
                src={session.user.image || undefined}
                alt="profile"
              />
              <AvatarFallback>
                <FaUserAlt />
              </AvatarFallback>
            </Avatar>
          </SheetTrigger>
          <SheetContent className="flex flex-col gap-4">
            <SheetHeader>
              <div className="flex gap-4">
                <Avatar>
                  <AvatarImage
                    src={session.user.image || undefined}
                    alt="profile"
                  />
                  <AvatarFallback>
                    <FaUserAlt />
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <SheetTitle className="text-sm">
                    {session.user.name}
                  </SheetTitle>
                  <SheetDescription>{session.user.email}</SheetDescription>
                </div>
              </div>
            </SheetHeader>
            <Separator />
            <SheetFooter>
              <form
                action={async () => {
                  "use server";
                  await signOut();
                }}
              >
                <Button variant={"outline"}>{t("Signout")}</Button>
              </form>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      ) : (
        <ul className="flex gap-2">
          <li>
            <Button asChild variant={"outline"}>
              <Link href={toUrl(Pages.Signin)}>{t("Signin")}</Link>
            </Button>
          </li>
          <li>
            <Button asChild>
              <Link href={toUrl(Pages.Signup)}>{t("Signup")}</Link>
            </Button>
          </li>
        </ul>
      )}
    </nav>
  );
}
