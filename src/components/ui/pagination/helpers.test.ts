import { generatePages } from "./helpers";

describe("generatePages", () => {
  const options = [
    {
      range: 3,
      truncate: false,
      distanceFrom: "edge",
      testCases: [
        { pageIndex: 1, totalPages: 0, expected: [] },
        { pageIndex: 1, totalPages: 1, expected: [1] },
        { pageIndex: 1, totalPages: 2, expected: [1, 2] },
        { pageIndex: 1, totalPages: 3, expected: [1, 2, 3] },
        { pageIndex: 3, totalPages: 3, expected: [1, 2, 3] },
        { pageIndex: 1, totalPages: 100, expected: [1, 2, 3, "right", 100] },
        { pageIndex: 2, totalPages: 100, expected: [1, 2, 3, "right", 100] },
        { pageIndex: 3, totalPages: 100, expected: [1, 2, 3, 4, "right", 100] },
        {
          pageIndex: 4,
          totalPages: 100,
          expected: [1, "left", 3, 4, 5, "right", 100],
        },
        {
          pageIndex: 97,
          totalPages: 100,
          expected: [1, "left", 96, 97, 98, "right", 100],
        },
        {
          pageIndex: 98,
          totalPages: 100,
          expected: [1, "left", 97, 98, 99, 100],
        },
        { pageIndex: 99, totalPages: 100, expected: [1, "left", 98, 99, 100] },
        { pageIndex: 100, totalPages: 100, expected: [1, "left", 98, 99, 100] },
      ],
    },
    {
      range: 5,
      truncate: false,
      distanceFrom: "edge",
      testCases: [
        {
          pageIndex: 1,
          totalPages: 100,
          expected: [1, 2, 3, 4, 5, "right", 100],
        },
        {
          pageIndex: 2,
          totalPages: 100,
          expected: [1, 2, 3, 4, 5, "right", 100],
        },
        {
          pageIndex: 3,
          totalPages: 100,
          expected: [1, 2, 3, 4, 5, "right", 100],
        },
        {
          pageIndex: 4,
          totalPages: 100,
          expected: [1, 2, 3, 4, 5, 6, "right", 100],
        },
        {
          pageIndex: 5,
          totalPages: 100,
          expected: [1, "left", 3, 4, 5, 6, 7, "right", 100],
        },
        {
          pageIndex: 96,
          totalPages: 100,
          expected: [1, "left", 94, 95, 96, 97, 98, "right", 100],
        },
        {
          pageIndex: 97,
          totalPages: 100,
          expected: [1, "left", 95, 96, 97, 98, 99, 100],
        },
        {
          pageIndex: 98,
          totalPages: 100,
          expected: [1, "left", 96, 97, 98, 99, 100],
        },
        {
          pageIndex: 99,
          totalPages: 100,
          expected: [1, "left", 96, 97, 98, 99, 100],
        },
        {
          pageIndex: 100,
          totalPages: 100,
          expected: [1, "left", 96, 97, 98, 99, 100],
        },
      ],
    },
    {
      range: 3,
      truncate: true,
      distanceFrom: "edge",
      testCases: [
        { pageIndex: 1, totalPages: 3, expected: [1, 2, 3] },
        { pageIndex: 3, totalPages: 3, expected: [1, 2, 3] },
        { pageIndex: 1, totalPages: 100, expected: [1, 2, "right", 100] },
        { pageIndex: 2, totalPages: 100, expected: [1, 2, 3, "right", 100] },
        { pageIndex: 3, totalPages: 100, expected: [1, 2, 3, 4, "right", 100] },
        {
          pageIndex: 4,
          totalPages: 100,
          expected: [1, "left", 3, 4, 5, "right", 100],
        },
        {
          pageIndex: 97,
          totalPages: 100,
          expected: [1, "left", 96, 97, 98, "right", 100],
        },
        {
          pageIndex: 98,
          totalPages: 100,
          expected: [1, "left", 97, 98, 99, 100],
        },
        { pageIndex: 99, totalPages: 100, expected: [1, "left", 98, 99, 100] },
        { pageIndex: 100, totalPages: 100, expected: [1, "left", 99, 100] },
      ],
    },
    {
      range: 5,
      truncate: true,
      distanceFrom: "edge",
      testCases: [
        {
          pageIndex: 1,
          totalPages: 100,
          expected: [1, 2, 3, "right", 100],
        },
        {
          pageIndex: 2,
          totalPages: 100,
          expected: [1, 2, 3, 4, "right", 100],
        },
        {
          pageIndex: 3,
          totalPages: 100,
          expected: [1, 2, 3, 4, 5, "right", 100],
        },
        {
          pageIndex: 4,
          totalPages: 100,
          expected: [1, 2, 3, 4, 5, 6, "right", 100],
        },
        {
          pageIndex: 5,
          totalPages: 100,
          expected: [1, "left", 3, 4, 5, 6, 7, "right", 100],
        },
        {
          pageIndex: 96,
          totalPages: 100,
          expected: [1, "left", 94, 95, 96, 97, 98, "right", 100],
        },
        {
          pageIndex: 97,
          totalPages: 100,
          expected: [1, "left", 95, 96, 97, 98, 99, 100],
        },
        {
          pageIndex: 98,
          totalPages: 100,
          expected: [1, "left", 96, 97, 98, 99, 100],
        },
        {
          pageIndex: 99,
          totalPages: 100,
          expected: [1, "left", 97, 98, 99, 100],
        },
        {
          pageIndex: 100,
          totalPages: 100,
          expected: [1, "left", 98, 99, 100],
        },
      ],
    },
    {
      range: 3,
      truncate: false,
      distanceFrom: "center",
      testCases: [
        { pageIndex: 1, totalPages: 3, expected: [1, 2, "right", 3] },
        { pageIndex: 3, totalPages: 3, expected: [1, "left", 2, 3] },
        { pageIndex: 1, totalPages: 100, expected: [1, 2, 3, "right", 100] },
        { pageIndex: 2, totalPages: 100, expected: [1, 2, 3, "right", 100] },
        {
          pageIndex: 3,
          totalPages: 100,
          expected: [1, "left", 2, 3, 4, "right", 100],
        },
        {
          pageIndex: 98,
          totalPages: 100,
          expected: [1, "left", 97, 98, 99, "right", 100],
        },
        {
          pageIndex: 99,
          totalPages: 100,
          expected: [1, "left", 98, 99, 100],
        },
        {
          pageIndex: 100,
          totalPages: 100,
          expected: [1, "left", 98, 99, 100],
        },
      ],
    },
    {
      range: 5,
      truncate: false,
      distanceFrom: "center",
      testCases: [
        {
          pageIndex: 1,
          totalPages: 100,
          expected: [1, 2, 3, 4, 5, "right", 100],
        },
        {
          pageIndex: 2,
          totalPages: 100,
          expected: [1, 2, 3, 4, 5, "right", 100],
        },
        {
          pageIndex: 3,
          totalPages: 100,
          expected: [1, 2, 3, 4, 5, "right", 100],
        },
        {
          pageIndex: 4,
          totalPages: 100,
          expected: [1, "left", 2, 3, 4, 5, 6, "right", 100],
        },
        {
          pageIndex: 97,
          totalPages: 100,
          expected: [1, "left", 95, 96, 97, 98, 99, "right", 100],
        },
        {
          pageIndex: 98,
          totalPages: 100,
          expected: [1, "left", 96, 97, 98, 99, 100],
        },
        {
          pageIndex: 99,
          totalPages: 100,
          expected: [1, "left", 96, 97, 98, 99, 100],
        },
        {
          pageIndex: 100,
          totalPages: 100,
          expected: [1, "left", 96, 97, 98, 99, 100],
        },
      ],
    },
    {
      range: 3,
      truncate: true,
      distanceFrom: "center",
      testCases: [
        { pageIndex: 1, totalPages: 3, expected: [1, 2, "right", 3] },
        { pageIndex: 3, totalPages: 3, expected: [1, "left", 2, 3] },
        { pageIndex: 1, totalPages: 100, expected: [1, 2, "right", 100] },
        { pageIndex: 2, totalPages: 100, expected: [1, 2, 3, "right", 100] },
        {
          pageIndex: 3,
          totalPages: 100,
          expected: [1, "left", 2, 3, 4, "right", 100],
        },
        {
          pageIndex: 98,
          totalPages: 100,
          expected: [1, "left", 97, 98, 99, "right", 100],
        },
        {
          pageIndex: 99,
          totalPages: 100,
          expected: [1, "left", 98, 99, 100],
        },
        {
          pageIndex: 100,
          totalPages: 100,
          expected: [1, "left", 99, 100],
        },
      ],
    },
    {
      range: 5,
      truncate: true,
      distanceFrom: "center",
      testCases: [
        {
          pageIndex: 1,
          totalPages: 100,
          expected: [1, 2, 3, "right", 100],
        },
        {
          pageIndex: 2,
          totalPages: 100,
          expected: [1, 2, 3, 4, "right", 100],
        },
        {
          pageIndex: 3,
          totalPages: 100,
          expected: [1, 2, 3, 4, 5, "right", 100],
        },
        {
          pageIndex: 4,
          totalPages: 100,
          expected: [1, "left", 2, 3, 4, 5, 6, "right", 100],
        },
        {
          pageIndex: 97,
          totalPages: 100,
          expected: [1, "left", 95, 96, 97, 98, 99, "right", 100],
        },
        {
          pageIndex: 98,
          totalPages: 100,
          expected: [1, "left", 96, 97, 98, 99, 100],
        },
        {
          pageIndex: 99,
          totalPages: 100,
          expected: [1, "left", 97, 98, 99, 100],
        },
        {
          pageIndex: 100,
          totalPages: 100,
          expected: [1, "left", 98, 99, 100],
        },
      ],
    },
  ] as const;

  options.forEach(({ range, truncate, distanceFrom, testCases }) => {
    describe(`if range is ${range}, truncate is ${truncate}, distanceFrom is ${distanceFrom}`, () => {
      const option = { range, truncate, distanceFrom } as const;

      testCases.forEach(({ pageIndex, totalPages, expected }) => {
        it(`if pageIndex is ${pageIndex} and totalPages is ${totalPages}, return ${JSON.stringify(expected)}.`, () => {
          const pages = generatePages(pageIndex, totalPages, option);
          expect(pages).toEqual(expected);
        });
      });
    });
  });
});
