import { clamp, range } from "lodash-es";

import { distance } from "@/lib/utils";

interface GeneratePagesOption {
  count?: number;
  bias?: "left" | "right";
}

function generatePages(
  pageIndex: number,
  totalPages: number,
  option: GeneratePagesOption = {}
) {
  const { count = 8, bias = "right" } = option;

  if (count < 5) {
    throw new Error("count must be at least 5");
  }

  if (count >= totalPages) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const isLeftEllipsis =
    bias === "right"
      ? distance(pageIndex, 1) >= Math.floor(count / 2)
      : distance(pageIndex, 1) >= Math.ceil((count + 1) / 2);
  const isRightEllipsis =
    bias === "right"
      ? distance(pageIndex, totalPages) >= Math.ceil((count + 1) / 2)
      : distance(pageIndex, totalPages) >= Math.floor(count / 2);

  const pages: (number | "left" | "right")[] = [1];

  const n = count - 2 - (isLeftEllipsis ? 1 : 0) - (isRightEllipsis ? 1 : 0);

  if (isLeftEllipsis && isRightEllipsis) {
    pages.push("left");
    const left = clamp(
      pageIndex - Math.floor((bias === "right" ? n - 1 : n) / 2),
      2,
      totalPages - n
    );
    const right = Math.min(left + n, totalPages);
    pages.push(...range(left, right));
    pages.push("right");
  } else if (isLeftEllipsis) {
    pages.push("left");
    pages.push(...range(totalPages - n, totalPages));
  } else if (isRightEllipsis) {
    pages.push(...range(2, n + 2));
    pages.push("right");
  }

  pages.push(totalPages);

  return pages;
}

export { generatePages };
