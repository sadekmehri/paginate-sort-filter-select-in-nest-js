export type BooleanMap<T> = {
  [K in keyof T]: boolean
}
