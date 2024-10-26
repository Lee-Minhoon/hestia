"use client";

import {
  queryOptions,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";

const baseUrl = "http://localhost:3000";

export default function QueryTest() {
  const queryClient = useQueryClient();
  const { data } = useSuspenseQuery(
    queryOptions({
      queryKey: ["test"],
      queryFn: async () => {
        return fetch(`${baseUrl}/api`).then((res) => res.json());
      },
    })
  );

  return (
    <div>
      <p>{data.data}</p>
      <button
        onClick={() => queryClient.invalidateQueries({ queryKey: ["test"] })}
      >
        Refresh
      </button>
    </div>
  );
}
