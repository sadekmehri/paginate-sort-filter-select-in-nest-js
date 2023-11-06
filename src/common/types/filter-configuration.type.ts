import { StringOrNumberOrBoolean } from './string-or-number-or-boolean.type'

export type FilterConfiguration = {
  filterable: boolean
  sortable: boolean
  selectable: boolean
  exact: boolean
  type: StringOrNumberOrBoolean
}
