"use server";

import { headers } from "next/headers";

export async function getRequestUrl() {
  const headerList = await headers();
  const url = new URL(headerList.get("referer") ?? "");

  return url;
}
