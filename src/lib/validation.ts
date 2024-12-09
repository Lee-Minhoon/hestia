import { isInteger } from "lodash-es";
import { z } from "zod";

const strToPosInt = (defaultValue: number) => {
  return z
    .string()
    .optional()
    .nullable()
    .transform((v) => {
      const num = Number(v);
      if (isNaN(num) || !isInteger(num) || num < 1) return;
      return num;
    })
    .pipe(z.number().int().min(1).default(defaultValue));
};

const paginationSchema = z.object({
  pageIndex: strToPosInt(1),
  pageSize: strToPosInt(10),
});

export function parsePagination(
  data: Record<string, string | undefined | null>
) {
  return paginationSchema.parse(data);
}
