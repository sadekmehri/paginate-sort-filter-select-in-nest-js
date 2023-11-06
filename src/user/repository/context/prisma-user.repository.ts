import { Injectable } from '@nestjs/common'
import { DataPipeline } from 'common/classes/data-pipeline'
import { IUserDataAccessor } from 'common/interfaces'
import { BooleanMap, FilterConstraintsRecord, User } from 'common/types'
import { PrismaService } from 'prisma/Prisma.service'
import {
  PaginatePrismaHandler,
  SortPrismaHandler,
  SelectPrismaHandler,
  FilterPrismaHandler,
} from 'prisma/handlers'
import { UserFindManyArgs } from 'prisma/types'
import { Request } from 'express'
import { filterUserConstraintsRecord, selectableUserFields, sortableUserFields } from '../config'

@Injectable()
export class PrismaUserRepository implements IUserDataAccessor {
  private readonly prisma: PrismaService
  private readonly dataPipeline: DataPipeline<UserFindManyArgs>

  // prettier-ignore
  constructor(prismaService: PrismaService) {
    this.prisma = prismaService
    const paginateUserHandler = new PaginatePrismaHandler<UserFindManyArgs>(null)
    const sortUserHandler = new SortPrismaHandler<UserFindManyArgs, BooleanMap<User>>(sortableUserFields, paginateUserHandler)
    const filterUserHandler = new FilterPrismaHandler<UserFindManyArgs, FilterConstraintsRecord<User>>(filterUserConstraintsRecord, sortUserHandler)
    const selectUserHandler = new SelectPrismaHandler<UserFindManyArgs, BooleanMap<User>>(selectableUserFields, filterUserHandler)
    this.dataPipeline = new DataPipeline(selectUserHandler)
  }

  getUsers(request: Request): any {
    this.dataPipeline.handle(request)
    const queryArgs = this.dataPipeline.getQueryArgs()
    console.log(queryArgs)
    return this.prisma.user.findMany(queryArgs)
  }
}
