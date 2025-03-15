import {
  InfiniteData,
  QueryFunctionContext,
  useSuspenseInfiniteQuery,
} from "@tanstack/react-query";
import { z } from "zod";

import { Nullable, Optional } from "@/types/common";

import { ResponseData } from "../api";
import { PostWithUser, User } from "../db/schema";
import { QueryParamKeys } from "../queryParams";
import { buildUrl, Endpoints, toUrl } from "../routes";
import { getBaseUrl } from "../utils";
import { cursorSchema } from "../validation";

type QueryKey = [string, Optional<object>];

type CursorParams = z.infer<typeof cursorSchema>;

type CursorData<T> = {
  data: T[];
  nextCursor: Nullable<number>;
  prevCursor: Nullable<number>;
};

async function fetcher(context: QueryFunctionContext<QueryKey>) {
  const { queryKey, pageParam } = context;
  const [url, params] = queryKey;
  const queryParams = new URLSearchParams(Object.entries(params ?? {}));
  if (pageParam && typeof pageParam === "number") {
    queryParams.set(QueryParamKeys.Cursor, pageParam.toString());
  }
  return await fetch(buildUrl(`${getBaseUrl()}${url}`, queryParams)).then(
    (res) => res.json()
  );
}

function useLoadMore<T>(url: string, params?: object) {
  return useSuspenseInfiniteQuery<
    ResponseData<CursorData<T>>,
    Error,
    InfiniteData<ResponseData<CursorData<T>>>,
    QueryKey
  >({
    queryKey: [url, params],
    queryFn: ({ pageParam, ...rest }) => fetcher({ pageParam, ...rest }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.data.nextCursor,
    getPreviousPageParam: (firstPage) => firstPage.data.prevCursor,
  });
}

export function useLoadMoreUsers(params?: CursorParams) {
  return useLoadMore<User>(toUrl(Endpoints.Users), params);
}

export function useLoadMorePosts(params?: CursorParams) {
  return useLoadMore<PostWithUser>(toUrl(Endpoints.Posts), params);
}
