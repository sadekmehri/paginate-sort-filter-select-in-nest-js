import { Injectable } from '@nestjs/common'
import { DataPipeline } from 'common/classes/data-pipeline'
import { IPaginationStrategy, IUserDataAccessor } from 'common/interfaces'
import { BooleanMap, FilterConstraintsRecord, User } from 'common/types'
import { PrismaService } from 'prisma/Prisma.service'
import { SortPrismaHandler, SelectPrismaHandler, FilterPrismaHandler } from 'prisma/handlers'
import { Request } from 'express'
import { filterUserConstraintsRecord, selectableUserFields, sortableUserFields } from '../config'
import { Prisma } from '@prisma/client'
import { PaginationService } from 'common/classes/pagination-service'

@Injectable()
export class PrismaUserRepository implements IUserDataAccessor, IPaginationStrategy<User> {
  private readonly prisma: PrismaService
  private readonly paginationServiceStrategy: PaginationService<User, Prisma.UserFindManyArgs>
  private readonly dataPipeline: DataPipeline<Prisma.UserFindManyArgs>

  // prettier-ignore
  constructor(prismaService: PrismaService) {
    this.prisma = prismaService
    this.paginationServiceStrategy = new PaginationService<User, Prisma.UserFindManyArgs>(this)
    const sortUserHandler = new SortPrismaHandler<Prisma.UserFindManyArgs, BooleanMap<User>>(sortableUserFields, null)
    const filterUserHandler = new FilterPrismaHandler<Prisma.UserFindManyArgs, FilterConstraintsRecord<User>>(filterUserConstraintsRecord, sortUserHandler)
    const selectUserHandler = new SelectPrismaHandler<Prisma.UserFindManyArgs, BooleanMap<User>>(selectableUserFields, filterUserHandler)
    this.dataPipeline = new DataPipeline(selectUserHandler)
  }

  countRecords(where: object): Promise<number> {
    return this.prisma.user.count({
      where: where,
    })
  }

  getRecords(args: object): Promise<User[]> {
    return this.prisma.user.findMany(args)
  }

  async getUsers(request: Request) {
    this.dataPipeline.handle(request)
    const queryArgs = this.dataPipeline.getQueryArgs()
    const paginationResult = await this.paginationServiceStrategy.processPagination(
      request,
      queryArgs,
    )

    return paginationResult
  }
}
