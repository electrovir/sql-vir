export type DeepReadonly<T> = {readonly [P in keyof T]: Readonly<T[P]>};
