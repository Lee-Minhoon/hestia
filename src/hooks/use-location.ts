import { useSearchParams } from "next/navigation";

import { usePathname } from "@/lib/i18n/navigation";
import { buildUrl } from "@/lib/routes";

function useLocation() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return buildUrl(pathname, searchParams);
}

export default useLocation;
