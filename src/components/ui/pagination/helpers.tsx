import { clamp } from "lodash-es";

import { distance, quotient } from "@/lib/utils";

interface GeneratePagesOption {
  range?: number;
  truncate?: boolean;
  distanceFrom?: "edge" | "center";
}

function generatePages(
  pageIndex: number,
  totalPages: number,
  option: GeneratePagesOption = {}
) {
  const { range = 3, truncate = false, distanceFrom = "edge" } = option;

  if (range % 2 === 0) {
    throw new Error("Range must be an odd number");
  }

  const pages: (number | "left" | "right")[] = [];

  const half = quotient(range, 2);

  const start = truncate
    ? Math.max(1, pageIndex - half)
    : clamp(pageIndex - half, 1, totalPages - range + 1);
  const end = truncate
    ? Math.min(pageIndex + half, totalPages)
    : Math.min(start + range - 1, totalPages);

  if (totalPages > 0) {
    pages.push(1);
  }

  const isLeftEllipsisNeeded =
    distanceFrom === "edge"
      ? distance(start, 1) > 1
      : distance(pageIndex, 1) > half;

  if (isLeftEllipsisNeeded) {
    pages.push("left");
  }

  for (let i = start; i <= end; i++) {
    if (i > 1 && i < totalPages) {
      pages.push(i);
    }
  }

  const isRightEllipsisNeeded =
    distanceFrom === "edge"
      ? distance(end, totalPages) > 1
      : distance(pageIndex, totalPages) > half;

  if (isRightEllipsisNeeded) {
    pages.push("right");
  }

  if (totalPages > 1) {
    pages.push(totalPages);
  }

  return pages;
}

export { generatePages };
