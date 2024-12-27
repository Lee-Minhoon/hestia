import { NextRequest } from "next/server";

import { fileStorage } from "@/lib/storage";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;
  const file = fileStorage.get(filename);

  if (!file) {
    return Response.json({ message: "Image not found" }, { status: 404 });
  }

  const res = new Response(file);
  res.headers.set("Content-Type", "image/png");

  return res;
}
