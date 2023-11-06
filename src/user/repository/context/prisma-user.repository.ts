import { Injectable } from '@nestjs/common'
import { IPaginationStrategy, IUserDataAccessor } from 'common/interfaces'
import { User } from 'common/types'
import { PrismaService } from 'prisma/Prisma.service'
import {
  SortPrismaHandler,
  SelectPrismaHandler,
  FilterPrismaHandler,
  DataPipeline,
} from 'prisma/handlers'
import { Request } from 'express'
import { Prisma } from '@prisma/client'
import { userConstraintRecord } from '../config/filter-user-fields'
import { PaginationService } from 'prisma/classes/pagination-service'

@Injectable()
export class PrismaUserRepository implements IUserDataAccessor, IPaginationStrategy<User> {
  private readonly prisma: PrismaService
  private readonly paginationServiceStrategy: PaginationService<Prisma.UserFindManyArgs, User>
  private readonly dataPipeline: DataPipeline<Prisma.UserFindManyArgs>

  // prettier-ignore
  constructor(prismaService: PrismaService) {
    this.prisma = prismaService
    this.paginationServiceStrategy = new PaginationService<Prisma.UserFindManyArgs, User>(this)
    const sortUserHandler = new SortPrismaHandler<Prisma.UserFindManyArgs, User>(userConstraintRecord, null)
    const filterUserHandler = new FilterPrismaHandler<Prisma.UserFindManyArgs, User>(userConstraintRecord, sortUserHandler)
    const selectUserHandler = new SelectPrismaHandler<Prisma.UserFindManyArgs, User>(userConstraintRecord, filterUserHandler)
    this.dataPipeline = new DataPipeline<Prisma.UserFindManyArgs>(selectUserHandler)
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
