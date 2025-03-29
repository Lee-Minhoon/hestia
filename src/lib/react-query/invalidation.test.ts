import {
  getQueuedQueryInvalidation,
  requestQueryInvalidation,
  resolveQueryInvalidation,
} from "./invalidation";

function makeStore() {
  const map = new Map<string, string>();

  return {
    get: (key: string) => {
      return { value: map.get(key) };
    },
    set: (key: string, value: string) => {
      map.set(key, value);
    },
    clear: () => {
      map.clear();
    },
  };
}

const store = makeStore();

vi.mock("next/headers", () => ({
  cookies: vi.fn(() => {
    return new Promise((resolve) => {
      resolve(store);
    });
  }),
}));

describe("react-query/invalidation", () => {
  beforeEach(() => {
    store.clear();
  });

  it("should create a new array with the new query key", async () => {
    await requestQueryInvalidation(["test1"]);
    const value = await getQueuedQueryInvalidation();
    expect(value).toEqual([["test1"]]);
  });

  it("should append the new query key to the existing array", async () => {
    await requestQueryInvalidation(["test1"]);
    await requestQueryInvalidation(["test2"]);
    const value = await getQueuedQueryInvalidation();
    expect(value).toEqual([["test1"], ["test2"]]);
  });

  it("should append the new query key to the existing array with an object", async () => {
    await requestQueryInvalidation(["test1"]);
    await requestQueryInvalidation(["test2"]);
    await requestQueryInvalidation(["test3", { id: 1 }]);
    const value = await getQueuedQueryInvalidation();
    expect(value).toEqual([["test1"], ["test2"], ["test3", { id: 1 }]]);
  });

  it("should remove the query key from the array", async () => {
    await requestQueryInvalidation(["test1"]);
    await requestQueryInvalidation(["test2"]);
    await requestQueryInvalidation(["test3", { id: 1 }]);
    await resolveQueryInvalidation(["test1"]);
    const value = await getQueuedQueryInvalidation();
    expect(value).toEqual([["test2"], ["test3", { id: 1 }]]);
  });

  it("should remove all query keys from the array", async () => {
    await requestQueryInvalidation(["test1"]);
    await requestQueryInvalidation(["test2"]);
    await requestQueryInvalidation(["test3", { id: 1 }]);
    for (const key of await getQueuedQueryInvalidation()) {
      await resolveQueryInvalidation(key);
    }
    const value = await getQueuedQueryInvalidation();
    expect(value).toEqual([]);
  });
});
