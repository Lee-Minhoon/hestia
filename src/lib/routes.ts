import { compile } from "path-to-regexp";

export enum Pages {
  Home = "/",
}

export enum Endpoints {
  Users = "/api/users{/:id}",
}

export const toUrl = (path: Pages | Endpoints, params?: object) => {
  return compile(path, { encode: encodeURIComponent })(
    Object.fromEntries(
      Object.entries(params || {}).map(([key, value]) => [
        key,
        value.toString(),
      ])
    )
  );
};
