import type { Thing, WithContext } from "schema-dts";

export function JsonLd<T extends Thing>(json: WithContext<T>) {
  return json;
}
