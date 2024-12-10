import {
  InfiniteData,
  QueryFunctionContext,
  useSuspenseInfiniteQuery,
} from "@tanstack/react-query";

import { User } from "../db/schema";
import { QueryParamKeys } from "../queryParams";
import { buildUrl, Endpoints, toUrl } from "../routes";

type QueryKey = [string, object | undefined];

type ResponseData<T> = {
  data: T;
  message: string;
};

type CursorParams = {
  [QueryParamKeys.Limit]: number;
  [QueryParamKeys.Order]: "desc" | "asc";
};

type CursorData<T> = {
  data: T[];
  nextCursor: number | null;
  prevCursor: number | null;
};

const fetcher = async (context: QueryFunctionContext<QueryKey>) => {
  const { queryKey, pageParam } = context;
  const [url, params] = queryKey;
  const queryParams = new URLSearchParams(Object.entries(params ?? {}));
  if (pageParam && typeof pageParam === "number") {
    queryParams.set(QueryParamKeys.Cursor, pageParam.toString());
  }
  return await fetch(buildUrl(url, queryParams)).then((res) => res.json());
};

const useLoadMore = <T>(url: string, params?: object) => {
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
};

export const useLoadMoreUsers = (params?: CursorParams) => {
  return useLoadMore<User>(toUrl(Endpoints.Users), params);
};
