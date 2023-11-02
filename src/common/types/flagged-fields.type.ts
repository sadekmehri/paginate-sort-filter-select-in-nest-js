export type FlaggedFields<T> = {
  [K in keyof T]: boolean
}
