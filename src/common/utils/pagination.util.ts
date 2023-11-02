import { PAGINATION_DEFAULT_LIMIT, PAGINATION_DEFAULT_PAGE } from '../constants/pagination-params'
import { BadRequestException } from '@nestjs/common'
import { PaginationRequestParams } from '../types'
import { Request } from 'express'

function extractAndValidatePaginationParams(req: Request): PaginationRequestParams {
  const page = Number(req.query.page as string) || PAGINATION_DEFAULT_PAGE
  const limit = Number(req.query.limit as string) || PAGINATION_DEFAULT_LIMIT

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

const PaginationUtil = {
  extractAndValidatePaginationParams,
}

export default PaginationUtil
