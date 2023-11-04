import { DataManipulationHandler } from 'common/classes/data-manipulation-handler'
import { Request } from 'express'

export class SortPrismaHandler<T extends object, D> extends DataManipulationHandler<T> {
  private readonly sortableFields: D

  constructor(sortableFields: D, next: DataManipulationHandler<T>) {
    super(next)
    this.sortableFields = sortableFields
  }

  private getSortByCriterias(sortBy: string) {
    const defaultSortByCriterias = [{ id: 'desc' }]

    const sortByCriterias = decodeURIComponent(sortBy)
      .split(',')
      .map((sort) => {
        const isDescendingOrder = sort.startsWith('-')
        const sortOrder = isDescendingOrder ? 'desc' : 'asc'
        const isInvalidSortPrefix =
          !sort.startsWith('-') && !sort.startsWith('+') && !sort.startsWith(' ')
        const startSlice = isInvalidSortPrefix ? 0 : 1
        const field = sort.slice(startSlice, sort.length) as keyof D

        if (!this.sortableFields[field]) return null

        const sortObject = {
          [field]: sortOrder,
        }

        return sortObject
      })
      .filter((sort) => !!sort)

    return sortByCriterias.length ? sortByCriterias : defaultSortByCriterias
  }

  doHandle(request: Request, queryArgs: T): boolean {
    const sortBy = (request.query.orderBy as string) || ''

    const sortByCriterias = this.getSortByCriterias(sortBy)
    queryArgs['orderBy'] = sortByCriterias

    // I return false to indicate that the next handler should be called
    return false
  }
}
