import { DataManipulationHandler } from 'common/classes/data-manipulation-handler'
import { Request } from 'express'
import PaginationUtil from 'common/utils/pagination.util'
import { PAGINATION_DEFAULT_PAGE } from 'common/constants/pagination-params'

export class PaginatePrismaHandler<
  T extends Request,
  D extends object,
> extends DataManipulationHandler<T, D> {
  constructor(next: DataManipulationHandler<T, D>) {
    super(next)
  }

  doHandle(request: T, queryArgs: D): boolean {
    const { page, limit } = PaginationUtil.extractAndValidatePaginationParams(request)

    const paginationParams = {
      take: limit,
      skip: (page - PAGINATION_DEFAULT_PAGE) * limit,
    }

    Object.assign(queryArgs, paginationParams)

    // I return false to indicate that the next handler should be called
    return false
  }
}
