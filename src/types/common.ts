export type Optional<T> = T | undefined;
export type Nullable<T> = T | null;
export type Nullish<T> = Optional<Nullable<T>>;
