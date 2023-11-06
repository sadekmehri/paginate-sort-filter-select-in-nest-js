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
import { Request } from 'express'
import { filterUserConstraintsRecord, selectableUserFields, sortableUserFields } from '../config'
import { Prisma } from '@prisma/client'

@Injectable()
export class PrismaUserRepository implements IUserDataAccessor {
  private readonly prisma: PrismaService
  private readonly dataPipeline: DataPipeline<Prisma.UserFindManyArgs>

  // prettier-ignore
  constructor(prismaService: PrismaService) {
    this.prisma = prismaService
    const paginateUserHandler = new PaginatePrismaHandler<Prisma.UserFindManyArgs>(null)
    const sortUserHandler = new SortPrismaHandler<Prisma.UserFindManyArgs, BooleanMap<User>>(sortableUserFields, paginateUserHandler)
    const filterUserHandler = new FilterPrismaHandler<Prisma.UserFindManyArgs, FilterConstraintsRecord<User>>(filterUserConstraintsRecord, sortUserHandler)
    const selectUserHandler = new SelectPrismaHandler<Prisma.UserFindManyArgs, BooleanMap<User>>(selectableUserFields, filterUserHandler)
    this.dataPipeline = new DataPipeline(selectUserHandler)
  }

  getUsers(request: Request): any {
    this.dataPipeline.handle(request)
    const queryArgs = this.dataPipeline.getQueryArgs()
    console.log(queryArgs)
    return this.prisma.user.findMany(queryArgs)
  }
}
