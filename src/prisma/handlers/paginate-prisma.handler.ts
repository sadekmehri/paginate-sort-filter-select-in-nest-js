import { DataManipulationHandler } from 'common/classes/data-manipulation-handler'
import { Request } from 'express'
import {
  PAGINATION_DEFAULT_LIMIT,
  PAGINATION_DEFAULT_PAGE,
} from 'common/constants/pagination-params'
import { BadRequestException } from '@nestjs/common'

export class PaginatePrismaHandler<T extends object> extends DataManipulationHandler<T> {
  constructor(next: DataManipulationHandler<T>) {
    super(next)
  }

  // I extract and validate the pagination params from the request
  // and throw an error if the params are invalid
  private extractAndValidatePaginationParams(request: Request) {
    const page = Number(request.query.page as string) || PAGINATION_DEFAULT_PAGE
    const limit = Number(request.query.limit as string) || PAGINATION_DEFAULT_LIMIT

    if (page < 0) {
      throw new BadRequestException('Invalid page provided for pagination params')
    }

    if (limit < 0) {
      throw new BadRequestException('Invalid limit provided for pagination params')
    }

    // do not allow to fetch large slices of the dataset
    const isLimitTooLarge = limit > PAGINATION_DEFAULT_LIMIT
    if (isLimitTooLarge) {
      throw new BadRequestException(
        `Invalid pagination params: Max limit is ${PAGINATION_DEFAULT_LIMIT}`,
      )
    }

    return { page, limit }
  }

  doHandle(request: Request, queryArgs: T): boolean {
    const { page, limit } = this.extractAndValidatePaginationParams(request)

    const paginationParams = {
      take: limit,
      skip: (page - PAGINATION_DEFAULT_PAGE) * limit,
    }

    Object.assign(queryArgs, paginationParams)

    // I return false to indicate that the next handler should be called
    return false
  }
}
