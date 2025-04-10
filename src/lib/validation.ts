import { isInteger } from "lodash-es";
import { z } from "zod";

const nullishString = z.string().nullish();

function strToInt(
  defaultValue: number,
  option?: {
    min?: number;
    max?: number;
  }
) {
  const min = option?.min ?? 1;
  const max = option?.max ?? Number.MAX_SAFE_INTEGER;
  return nullishString
    .transform((v) => {
      const num = Number(v);
      if (isNaN(num) || !isInteger(num) || num < min || num > max) return;
      return num;
    })
    .pipe(z.number().int().min(min).max(max).default(defaultValue));
}

export const paginationSchema = z.object({
  pageIndex: strToInt(1),
  pageSize: strToInt(10),
  search: nullishString.transform((v) => v ?? ""),
});

export const cursorSchema = z.object({
  cursor: strToInt(0, { min: 0 }),
  limit: strToInt(10),
  order: z
    .string()
    .optional()
    .nullable()
    .transform((v) => (v === "asc" ? v : "desc"))
    .default("desc"),
  search: nullishString.transform((v) => v ?? ""),
});

export const uploadSchema = z.object({
  file: z.instanceof(File).refine((v) => v.size > 0),
});
