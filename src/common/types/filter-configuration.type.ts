import { StringOrNumberOrBoolean } from './string-or-number-or-boolean.type'

export type FilterConfiguration = {
  filterable: boolean
  exact: boolean
  type: StringOrNumberOrBoolean
}
