import { useCallback, useMemo, useState } from "react";

import { Nullable } from "@/types/common";

function useActiveId<T = number>(initialValue: Nullable<T> = null) {
  const [id, setId] = useState<Nullable<T>>(initialValue);

  const active = useCallback((value: T) => setId(value), []);
  const deactive = useCallback(() => setId(null), []);
  const activated = useMemo(() => !!id, [id]);

  return {
    id,
    activated,
    active,
    deactive,
  };
}

export { useActiveId };
