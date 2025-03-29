import { getQueuedQueryInvalidation } from "@/lib/react-query/invalidation";

import QueryInvalidator from "./query-invalidator";

export default async function CookieDispatcher() {
  const queryKey = await getQueuedQueryInvalidation();

  return <QueryInvalidator queryKeys={queryKey} />;
}
