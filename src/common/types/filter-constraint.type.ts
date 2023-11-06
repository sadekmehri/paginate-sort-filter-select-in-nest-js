import { FilterConfiguration } from './filter-configuration.type'

export type FilterConstraintsRecord<T> = Partial<Record<keyof T, FilterConfiguration>>
