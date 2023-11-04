import { Injectable } from '@nestjs/common'
import { DataPipeline } from 'common/classes/data-pipeline'
import { IUserDataAccessor } from 'common/interfaces'
import { BooleanMap, User } from 'common/types'
import { PrismaService } from 'prisma/Prisma.service'
import { PaginatePrismaHandler, SortPrismaHandler, SelectPrismaHandler } from 'prisma/handler'
import { UserFindManyArgs } from 'prisma/types'
import { Request } from 'express'
import { selectableUserFields, sortableUserFields } from '../config'

@Injectable()
export class PrismaUserRepository implements IUserDataAccessor {
  private readonly prisma: PrismaService
  private readonly dataPipeline: DataPipeline<UserFindManyArgs>

  // prettier-ignore
  constructor(prismaService: PrismaService) {
    this.prisma = prismaService
    const paginateUserHandler = new PaginatePrismaHandler<UserFindManyArgs>(null)
    const sortUserHandler = new SortPrismaHandler<UserFindManyArgs, BooleanMap<User>>(sortableUserFields,paginateUserHandler)
    const selectUserHandler = new SelectPrismaHandler<UserFindManyArgs, BooleanMap<User>>(selectableUserFields, sortUserHandler)
    this.dataPipeline = new DataPipeline(selectUserHandler)
  }

  getUsers(request: Request): any {
    this.dataPipeline.handle(request)
    const queryArgs = this.dataPipeline.getQueryArgs()
    return this.prisma.user.findMany(queryArgs)
  }
}
