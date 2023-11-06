import { BadRequestException } from '@nestjs/common'
import {
  PAGINATION_DEFAULT_LIMIT,
  PAGINATION_DEFAULT_PAGE,
} from 'common/constants/pagination-params'
import { SORT_BY, FILTER_BY, FIELDS, LIMIT, PAGE } from 'common/constants/request-query-params'
import { IPaginationStrategy } from 'common/interfaces'
import { PaginatedResult } from 'common/types'
import { Request } from 'express'

export class PaginationService<T, D extends object> {
  private readonly paginationServiceStrategy: IPaginationStrategy<T>

  constructor(paginationServiceStrategy: IPaginationStrategy<T>) {
    this.paginationServiceStrategy = paginationServiceStrategy
  }

  private getFinalTerm(request: Request) {
    const sortByQuery = request.query[SORT_BY] as string
    const filterByQuery = request.query[FILTER_BY] as string
    const fieldsQuery = request.query[FIELDS] as string

    const sortByQueryTerm = sortByQuery ? `&${SORT_BY}=${sortByQuery.replace(/\s/, '+')}` : ''
    const filterByQueryTerm = filterByQuery ? `&${FILTER_BY}=${filterByQuery}` : ''
    const fieldsQueryTerm = fieldsQuery ? `&${FIELDS}=${fieldsQuery}` : ''
    const finalTerm = `${sortByQueryTerm}${filterByQueryTerm}${fieldsQueryTerm}`

    return finalTerm
  }

  private validatePageAndLimit(request: Request) {
    const page = Number(request.query[PAGE] as string) || PAGINATION_DEFAULT_PAGE
    const limit = Number(request.query[LIMIT] as string) || PAGINATION_DEFAULT_LIMIT

    if (page < 0 || limit < 0) {
      throw new BadRequestException('Invalid page or limit provided for pagination params')
    }

    if (limit > PAGINATION_DEFAULT_LIMIT) {
      throw new BadRequestException(
        `Invalid pagination params: Max limit is ${PAGINATION_DEFAULT_LIMIT}`,
      )
    }

    return { page, limit }
  }

  async processPagination(request: Request, queryArgs: D) {
    const { limit, page } = this.validatePageAndLimit(request)

    const queryArgsWithPagination = {
      ...queryArgs,
      take: limit,
      skip: (page - PAGINATION_DEFAULT_PAGE) * limit,
    } as D

    const nbrRecords = await this.paginationServiceStrategy.countRecords(queryArgs['where'])
    const data = await this.paginationServiceStrategy.getRecords(queryArgsWithPagination)

    const finalTerm = this.getFinalTerm(request)

    const totalPages = Math.max(Math.ceil(nbrRecords / limit), PAGINATION_DEFAULT_PAGE)
    const lastPage = totalPages - 1 >= 0 ? totalPages - 1 : PAGINATION_DEFAULT_PAGE
    const currentPage = Math.min(page, Math.max(lastPage, PAGINATION_DEFAULT_PAGE))
    const prevPage = currentPage - 1
    const nextPage = currentPage + 1

    const prevUrl =
      prevPage >= 0 ? `${request.path}?page=${prevPage}&limit=${limit}${finalTerm}` : null
    const nextUrl =
      nextPage <= lastPage ? `${request.path}?page=${nextPage}&limit=${limit}${finalTerm}` : null
    const currentUrl = `${request.path}?page=${currentPage}&limit=${limit}${finalTerm}`
    const lastUrl = `${request.path}?page=${lastPage}&limit=${limit}${finalTerm}`
    const firstUrl = `${request.path}?page=${PAGINATION_DEFAULT_PAGE}&limit=${limit}${finalTerm}`

    const result: PaginatedResult<T> = {
      data,
      meta: {
        total: nbrRecords,
        perPage: limit,
        totalPages: totalPages,
        currentPage: page,
        prevUrl,
        nextUrl,
        currentUrl,
        firstUrl,
        lastUrl,
      },
    }

    return result
  }
}
