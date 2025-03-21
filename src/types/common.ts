import { ConditionalKeys } from "type-fest";

export type Optional<T> = T | undefined;
export type Nullable<T> = T | null;
export type Nullish<T> = Optional<Nullable<T>>;
export type FunctionKeys<T> = ConditionalKeys<T, (...args: any[]) => any>;
