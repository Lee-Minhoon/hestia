import { getTranslations } from "next-intl/server";

import { ProgressLink } from "@/components/progress-link";
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
import { auth } from "@/lib/auth";
import { Pages, toUrl } from "@/lib/routes";

import SignoutForm from "./signout-form";

export default async function Account() {
  const t = await getTranslations("Auth");

  const session = await auth();

  return (
    <nav className="flex">
      {session?.user ? (
        <Sheet>
          <SheetTrigger>
            <Avatar className="size-10">
              <AvatarImage
                src={session.user.image ?? undefined}
                alt="profile"
              />
              <AvatarFallback />
            </Avatar>
          </SheetTrigger>
          <SheetContent className="flex flex-col gap-0">
            <SheetHeader>
              <div className="flex gap-4">
                <Avatar className="size-10">
                  <AvatarImage
                    src={session.user.image ?? undefined}
                    alt="profile"
                  />
                  <AvatarFallback />
                </Avatar>
                <div className="flex flex-col">
                  <SheetTitle className="text-sm">
                    {session.user.name}
                  </SheetTitle>
                  <SheetDescription>{session.user.email}</SheetDescription>
                </div>
              </div>
            </SheetHeader>
            <div className="px-4">
              <Separator />
            </div>
            <SheetFooter>
              <SignoutForm />
            </SheetFooter>
          </SheetContent>
        </Sheet>
      ) : (
        <ul className="flex gap-2">
          <li>
            <Button asChild variant={"outline"}>
              <ProgressLink href={toUrl(Pages.Signin)}>
                {t("signin")}
              </ProgressLink>
            </Button>
          </li>
          <li>
            <Button asChild>
              <ProgressLink href={toUrl(Pages.Signup)}>
                {t("signup")}
              </ProgressLink>
            </Button>
          </li>
        </ul>
      )}
    </nav>
  );
}
