import { NextRequest } from "next/server";

import { fileStorage } from "@/lib/storage";
import { uploadSchema } from "@/lib/validation";

const getFileUrl = (type: string, name: string) => {
  if (type.startsWith("image/")) {
    return `/api/images/${name}`;
  }
  throw new Error("Invalid type");
};

export async function POST(req: NextRequest) {
  const data = await req.formData();

  const upload = uploadSchema.safeParse(Object.fromEntries(data));

  if (!upload.success) {
    return Response.json(
      { message: "Invalid data", error: upload.error },
      { status: 400 }
    );
  }

  const file = upload.data.file;
  const filename = crypto.randomUUID();
  const buffer = await file.arrayBuffer();
  fileStorage.set(filename, buffer);

  return Response.json({
    data: getFileUrl(file.type, filename),
    message: "Successfully uploaded",
  });
}
