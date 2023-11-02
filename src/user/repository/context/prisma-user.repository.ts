import { Injectable } from '@nestjs/common'
import { IUserDataAccessor } from 'common/interfaces'
import { Request } from 'express'
import { PrismaService } from 'prisma/Prisma.service'
import { DataPipeline } from 'common/classes/data-pipeline'
import { Prisma } from '@prisma/client'
import { DataManipulationHandler } from 'common/classes/data-manipulation-handler'
import { PaginatePrismaHandler } from 'prisma/handler/paginate-prisma.handler'

@Injectable()
export class PrismaUserRepository implements IUserDataAccessor {
  private readonly prisma: PrismaService
  private readonly dataPipeline: DataPipeline<Request, Prisma.UserFindManyArgs>
  private readonly paginateUserHandler: DataManipulationHandler<Request, Prisma.UserFindManyArgs>

  constructor(prismaService: PrismaService) {
    this.prisma = prismaService
    this.paginateUserHandler = new PaginatePrismaHandler<Request, Prisma.UserFindManyArgs>(null)
    this.dataPipeline = new DataPipeline(this.paginateUserHandler)
  }

  getUsers(request: Request): any {
    this.dataPipeline.handle(request)
    const queryArgs = this.dataPipeline.getQueryArgs()
    return this.prisma.user.findMany(queryArgs)
  }
}
