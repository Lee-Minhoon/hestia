import { headers } from "next/headers";
import { getLocale, getTranslations } from "next-intl/server";

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
import { Locale } from "@/lib/i18n/locale";
import { Link } from "@/lib/i18n/routing";
import { QueryParamKeys } from "@/lib/queryParams";
import { isPrivatePage, Pages, toUrl, withLocale } from "@/lib/routes";

export default async function Account() {
  const t = await getTranslations("MainLayout");
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
              <form
                action={async () => {
                  "use server";

                  const url = new URL((await headers()).get("referer") ?? "");
                  const locale = (await getLocale()) as Locale;

                  if (isPrivatePage(url.pathname)) {
                    url.searchParams.set(QueryParamKeys.Next, url.pathname);
                    url.pathname = withLocale(toUrl(Pages.Signin), locale);
                  }

                  await signOut({
                    redirectTo: url.toString(),
                  });
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
