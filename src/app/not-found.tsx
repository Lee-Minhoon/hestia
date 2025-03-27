import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Pages, toUrl } from "@/lib/routes";

export default async function NotFound() {
  return (
    <html lang="en">
      <body>
        <div className="flex flex-col items-center justify-center h-screen gap-4 pb-16">
          <h2>Not Found</h2>
          <p>Could not find requested resource</p>
          <Button asChild>
            <Link href={toUrl(Pages.Home)}>Go Home</Link>
          </Button>
        </div>
      </body>
    </html>
  );
}
