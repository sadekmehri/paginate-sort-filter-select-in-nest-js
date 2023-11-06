import { DataManipulationHandler } from 'common/classes/data-manipulation-handler'
import { PrismaFilterRequestTransformer } from 'common/classes/prisma-filter-request-transformer'
import { Request } from 'express'

export class FilterPrismaHandler<
  T extends object,
  D extends object,
> extends DataManipulationHandler<T> {
  private readonly prismaFilterRequestTransformer: PrismaFilterRequestTransformer<D>

  constructor(filterConstraintsRecord: D, next: DataManipulationHandler<T>) {
    super(next)
    this.prismaFilterRequestTransformer = new PrismaFilterRequestTransformer<D>(
      filterConstraintsRecord,
    )
  }

  doHandle(request: Request, queryArgs: T): boolean {
    const filterByTerm = (request.query.filter_by as string) || ''
    const filterCriteriaObject = this.prismaFilterRequestTransformer.transform(filterByTerm)

    // Add filter criteria to query args
    queryArgs['where'] = {
      ...queryArgs['where'],
      ...filterCriteriaObject,
    }

    // I return false to indicate that the next handler should be called
    return false
  }
}
