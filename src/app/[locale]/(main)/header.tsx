import { Link } from "@/lib/i18n/routing";
import { Pages, toUrl } from "@/lib/routes";

import Account from "./account";
import Navigations from "./navigations";
import Settings from "./settings";

export default function MainLayoutHeader() {
  return (
    <div className="flex p-4 border-b-1 items-center justify-center">
      <div className="flex w-content justify-between h-10">
        <nav className="flex items-center gap-10">
          <Link
            href={toUrl(Pages.Home)}
            className="text-xl font-bold text-muted-foreground transition-colors hover:text-primary"
          >
            HESTIA
          </Link>
          <Navigations />
        </nav>
        <div className="flex items-center gap-10">
          <Settings />
          <Account />
        </div>
      </div>
    </div>
  );
}
