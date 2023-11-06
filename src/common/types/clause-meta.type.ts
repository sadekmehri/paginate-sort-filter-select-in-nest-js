import { FilterConfiguration } from './filter-configuration.type'

export type ClauseMeta = {
  field: string
  operator: string
  value: string
  meta: FilterConfiguration
}
