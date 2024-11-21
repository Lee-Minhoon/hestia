import { z } from "zod";

const strToPosInt = (defaultValue: number) => {
  return z
    .string()
    .optional()
    .transform((v) => {
      const num = Number(v);
      if (isNaN(num) || num < 0) return;
      return num;
    })
    .pipe(z.number().int().min(0).default(defaultValue));
};

const paginationSchema = z.object({
  pageIndex: strToPosInt(0),
  pageSize: strToPosInt(10),
});

export function parsePagination(data: Record<string, string>) {
  return paginationSchema.parse(data);
}
