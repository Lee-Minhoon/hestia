import { Endpoints, toUrl } from "./routes";

export type ResponseData<T> = {
  data: T;
  message: string;
};

async function fetcher<T>(
  ...props: Parameters<typeof fetch>
): Promise<ResponseData<T>> {
  try {
    const res = await fetch(...props);
    if (!res.ok) {
      const { message } = await res.json();
      throw new Error(message ?? "An unknown error occurred.");
    }
    return res.json();
  } catch (err) {
    throw new Error(
      err instanceof Error ? err.message : "An unknown error occurred."
    );
  }
}

export function upload(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  return fetcher<string>(toUrl(Endpoints.Upload), {
    method: "POST",
    body: formData,
  });
}
