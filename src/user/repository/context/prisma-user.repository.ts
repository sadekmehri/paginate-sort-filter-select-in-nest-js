import { Injectable } from '@nestjs/common'
import { IUserDataAccessor } from 'common/interfaces'
import { Request } from 'express'
import { PrismaService } from 'prisma/Prisma.service'
import { DataPipeline } from 'common/classes/data-pipeline'
import { Prisma } from '@prisma/client'
import { PaginatePrismaHandler } from 'prisma/handler/paginate-prisma.handler'
import { SelectFieldPrismaHandler } from 'prisma/handler/select-fileds-prisma.handler'
import { SelectableFields, User } from 'common/types'

@Injectable()
export class PrismaUserRepository implements IUserDataAccessor {
  private readonly prisma: PrismaService
  private readonly dataPipeline: DataPipeline<Prisma.UserFindManyArgs>
  private readonly selectableUserFields: SelectableFields<User> = {
    id: true,
    name: true,
    age: true,
    isActive: true,
  }

  constructor(prismaService: PrismaService) {
    this.prisma = prismaService
    const paginateUserHandler = new PaginatePrismaHandler<Prisma.UserFindManyArgs>(null)
    const selectFieldUserHandler = new SelectFieldPrismaHandler<Prisma.UserFindManyArgs, SelectableFields<User>>(this.selectableUserFields, paginateUserHandler)
    this.dataPipeline = new DataPipeline(selectFieldUserHandler)
  }

  getUsers(request: Request): any {
    this.dataPipeline.handle(request)
    const queryArgs = this.dataPipeline.getQueryArgs()
    return this.prisma.user.findMany(queryArgs)
  }
}
