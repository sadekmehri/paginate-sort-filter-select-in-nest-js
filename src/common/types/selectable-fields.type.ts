export type SelectableFields<T> = {
  [K in keyof T]: boolean
}
