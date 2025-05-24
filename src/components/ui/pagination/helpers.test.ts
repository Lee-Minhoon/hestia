import { generatePages } from "./helpers";

const testCases = [
  {
    count: 5,
    bias: "right",
    cases: [
      { page: 1, total: 0, expected: [] },
      { page: 1, total: 1, expected: [1] },
      { page: 1, total: 2, expected: [1, 2] },
      { page: 1, total: 3, expected: [1, 2, 3] },
      { page: 1, total: 4, expected: [1, 2, 3, 4] },
      { page: 1, total: 5, expected: [1, 2, 3, 4, 5] },
      { page: 2, total: 5, expected: [1, 2, 3, 4, 5] },
      { page: 3, total: 5, expected: [1, 2, 3, 4, 5] },
      { page: 4, total: 5, expected: [1, 2, 3, 4, 5] },
      { page: 5, total: 5, expected: [1, 2, 3, 4, 5] },
    ],
  },
  {
    count: 5,
    bias: "right",
    cases: [
      { page: 1, total: 6, expected: [1, 2, 3, "right", 6] },
      { page: 2, total: 6, expected: [1, 2, 3, "right", 6] },
      { page: 3, total: 6, expected: [1, "left", 3, "right", 6] },
      { page: 4, total: 6, expected: [1, "left", 4, 5, 6] },
      { page: 5, total: 6, expected: [1, "left", 4, 5, 6] },
      { page: 6, total: 6, expected: [1, "left", 4, 5, 6] },

      { page: 1, total: 7, expected: [1, 2, 3, "right", 7] },
      { page: 2, total: 7, expected: [1, 2, 3, "right", 7] },
      { page: 3, total: 7, expected: [1, "left", 3, "right", 7] },
      { page: 4, total: 7, expected: [1, "left", 4, "right", 7] },
      { page: 5, total: 7, expected: [1, "left", 5, 6, 7] },
      { page: 6, total: 7, expected: [1, "left", 5, 6, 7] },
      { page: 7, total: 7, expected: [1, "left", 5, 6, 7] },
    ],
  },
  {
    count: 5,
    bias: "left",
    cases: [
      { page: 1, total: 6, expected: [1, 2, 3, "right", 6] },
      { page: 2, total: 6, expected: [1, 2, 3, "right", 6] },
      { page: 3, total: 6, expected: [1, 2, 3, "right", 6] },
      { page: 4, total: 6, expected: [1, "left", 4, "right", 6] },
      { page: 5, total: 6, expected: [1, "left", 4, 5, 6] },
      { page: 6, total: 6, expected: [1, "left", 4, 5, 6] },

      { page: 1, total: 7, expected: [1, 2, 3, "right", 7] },
      { page: 2, total: 7, expected: [1, 2, 3, "right", 7] },
      { page: 3, total: 7, expected: [1, 2, 3, "right", 7] },
      { page: 4, total: 7, expected: [1, "left", 4, "right", 7] },
      { page: 5, total: 7, expected: [1, "left", 5, "right", 7] },
      { page: 6, total: 7, expected: [1, "left", 5, 6, 7] },
      { page: 7, total: 7, expected: [1, "left", 5, 6, 7] },
    ],
  },
  {
    count: 8,
    bias: "right",
    cases: [
      { page: 1, total: 9, expected: [1, 2, 3, 4, 5, 6, "right", 9] },
      { page: 2, total: 9, expected: [1, 2, 3, 4, 5, 6, "right", 9] },
      { page: 3, total: 9, expected: [1, 2, 3, 4, 5, 6, "right", 9] },
      { page: 4, total: 9, expected: [1, 2, 3, 4, 5, 6, "right", 9] },
      { page: 5, total: 9, expected: [1, "left", 4, 5, 6, 7, 8, 9] },
      { page: 6, total: 9, expected: [1, "left", 4, 5, 6, 7, 8, 9] },
      { page: 7, total: 9, expected: [1, "left", 4, 5, 6, 7, 8, 9] },
      { page: 8, total: 9, expected: [1, "left", 4, 5, 6, 7, 8, 9] },
      { page: 9, total: 9, expected: [1, "left", 4, 5, 6, 7, 8, 9] },

      { page: 1, total: 10, expected: [1, 2, 3, 4, 5, 6, "right", 10] },
      { page: 2, total: 10, expected: [1, 2, 3, 4, 5, 6, "right", 10] },
      { page: 3, total: 10, expected: [1, 2, 3, 4, 5, 6, "right", 10] },
      { page: 4, total: 10, expected: [1, 2, 3, 4, 5, 6, "right", 10] },
      { page: 5, total: 10, expected: [1, "left", 4, 5, 6, 7, "right", 10] },
      { page: 6, total: 10, expected: [1, "left", 5, 6, 7, 8, 9, 10] },
      { page: 7, total: 10, expected: [1, "left", 5, 6, 7, 8, 9, 10] },
      { page: 8, total: 10, expected: [1, "left", 5, 6, 7, 8, 9, 10] },
      { page: 9, total: 10, expected: [1, "left", 5, 6, 7, 8, 9, 10] },
      { page: 10, total: 10, expected: [1, "left", 5, 6, 7, 8, 9, 10] },

      { page: 1, total: 100, expected: [1, 2, 3, 4, 5, 6, "right", 100] },
      { page: 50, total: 100, expected: [1, "left", 49, 50, 51, 52, "right", 100] },
      { page: 100, total: 100, expected: [1, "left", 95, 96, 97, 98, 99, 100] },
    ],
  },
  {
    count: 8,
    bias: "left",
    cases: [
      { page: 1, total: 9, expected: [1, 2, 3, 4, 5, 6, "right", 9] },
      { page: 2, total: 9, expected: [1, 2, 3, 4, 5, 6, "right", 9] },
      { page: 3, total: 9, expected: [1, 2, 3, 4, 5, 6, "right", 9] },
      { page: 4, total: 9, expected: [1, 2, 3, 4, 5, 6, "right", 9] },
      { page: 5, total: 9, expected: [1, 2, 3, 4, 5, 6, "right", 9] },
      { page: 6, total: 9, expected: [1, "left", 4, 5, 6, 7, 8, 9] },
      { page: 7, total: 9, expected: [1, "left", 4, 5, 6, 7, 8, 9] },
      { page: 8, total: 9, expected: [1, "left", 4, 5, 6, 7, 8, 9] },
      { page: 9, total: 9, expected: [1, "left", 4, 5, 6, 7, 8, 9] },

      { page: 1, total: 10, expected: [1, 2, 3, 4, 5, 6, "right", 10] },
      { page: 2, total: 10, expected: [1, 2, 3, 4, 5, 6, "right", 10] },
      { page: 3, total: 10, expected: [1, 2, 3, 4, 5, 6, "right", 10] },
      { page: 4, total: 10, expected: [1, 2, 3, 4, 5, 6, "right", 10] },
      { page: 5, total: 10, expected: [1, 2, 3, 4, 5, 6, "right", 10] },
      { page: 6, total: 10, expected: [1, "left", 4, 5, 6, 7, "right", 10] },
      { page: 7, total: 10, expected: [1, "left", 5, 6, 7, 8, 9, 10] },
      { page: 8, total: 10, expected: [1, "left", 5, 6, 7, 8, 9, 10] },
      { page: 9, total: 10, expected: [1, "left", 5, 6, 7, 8, 9, 10] },
      { page: 10, total: 10, expected: [1, "left", 5, 6, 7, 8, 9, 10] },

      { page: 1, total: 100, expected: [1, 2, 3, 4, 5, 6, "right", 100] },
      { page: 50, total: 100, expected: [1, "left", 48, 49, 50, 51, "right", 100] },
      { page: 100, total: 100, expected: [1, "left", 95, 96, 97, 98, 99, 100] },
    ],
  },
] as const;

describe("generatePages", () => {
  testCases.forEach(({ count, bias, cases }) => {
    cases.forEach(({ page, total, expected }) => {
      it(`page: ${page}, total: ${total}, count: ${count}, bias: ${bias}, expected: [${expected.join(", ")}]`, () => {
        const pages = generatePages(page, total, { count, bias });
        expect(pages).toEqual(expected);
      });
    });
  });
});
