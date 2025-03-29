"use server";

import { QueryKey } from "@tanstack/react-query";
import { isEqual } from "lodash-es";
import { cookies } from "next/headers";
import { z } from "zod";

const storeKey = "invalidateQuery";

const queryKeySchema = z.array(z.unknown());
const requestSchema = z.array(queryKeySchema);

function parse(request: string) {
  const { data } = requestSchema.safeParse(JSON.parse(request));
  return data;
}

export async function requestQueryInvalidation(queryKey: QueryKey) {
  const cookieStore = await cookies();
  const value = cookieStore.get(storeKey)?.value;

  // if the cookie already exists, append the new query key to the existing array
  if (value) {
    const queuedRequest = parse(value);
    if (queuedRequest) {
      queuedRequest.push([...queryKey]);
      cookieStore.set(storeKey, JSON.stringify(queuedRequest));
      return;
    }
  }

  // otherwise, create a new array with the new query key
  cookieStore.set(storeKey, JSON.stringify([[...queryKey]]));
}

export async function getQueuedQueryInvalidation(): Promise<QueryKey[]> {
  const cookieStore = await cookies();
  const value = cookieStore.get(storeKey)?.value;
  if (!value) return [];

  return parse(value) ?? [];
}

export async function resolveQueryInvalidation(queryKey: QueryKey) {
  const queuedRequest = await getQueuedQueryInvalidation();
  if (!queuedRequest) return;

  const index = queuedRequest.findIndex((key) => isEqual(key, queryKey));

  if (index !== -1) {
    const cookieStore = await cookies();
    queuedRequest.splice(index, 1);
    cookieStore.set(storeKey, JSON.stringify(queuedRequest));
  }
}
