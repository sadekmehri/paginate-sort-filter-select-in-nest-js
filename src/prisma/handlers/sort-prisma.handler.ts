import { SORT_BY } from 'common/constants/request-query-params'
import { FilterConstraintsRecord } from 'common/types'
import { Request } from 'express'
import { DataManipulationHandler } from './data-manipulation-handler'

export class SortPrismaHandler<T extends object, D> extends DataManipulationHandler<T> {
  private readonly constraintRecord: FilterConstraintsRecord<D>

  constructor(constraintRecord: FilterConstraintsRecord<D>, next: DataManipulationHandler<T>) {
    super(next)
    this.constraintRecord = constraintRecord
  }

  private getSortByCriterias(sortBy: string) {
    const defaultSortByCriterias = [{ id: 'desc' }]

    const sortByCriterias = decodeURIComponent(sortBy)
      .replace(/ /g, '+')
      .split(',')
      .map((sort) => {
        const isDescendingOrder = sort.startsWith('-')
        const sortOrder = isDescendingOrder ? 'desc' : 'asc'
        const isInvalidSortPrefix =
          !sort.startsWith('-') && !sort.startsWith('+') && !sort.startsWith(' ')
        const startSlice = isInvalidSortPrefix ? 0 : 1
        const field = sort.slice(startSlice, sort.length) as keyof D

        if (!this.constraintRecord[field]?.sortable) return null

        const sortObject = {
          [field]: sortOrder,
        }

        return sortObject
      })
      .filter((sort) => !!sort)

    return sortByCriterias.length ? sortByCriterias : defaultSortByCriterias
  }

  doHandle(request: Request, queryArgs: T): boolean {
    const sortByTerm = (request.query[SORT_BY] as string) || ''

    const sortByCriterias = this.getSortByCriterias(sortByTerm)
    queryArgs['orderBy'] = sortByCriterias

    // I return false to indicate that the next handler should be called
    return false
  }
}
