import { Endpoints, toUrl } from "./routes";
import { getBaseUrl } from "./utils";

export type ResponseData<T> = {
  data: T;
  message: string;
};

export async function fetcher<T>(
  ...props: Parameters<typeof fetch>
): Promise<ResponseData<T>> {
  const [url, ...rest] = props;
  try {
    const res = await fetch(`${getBaseUrl()}${url}`, ...rest);
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
