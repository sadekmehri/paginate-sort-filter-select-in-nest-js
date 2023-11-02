import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { Prisma, PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService
  extends PrismaClient<Prisma.PrismaClientOptions, Prisma.LogLevel>
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name)

  constructor() {
    super({ log: ['warn', 'error'], errorFormat: 'minimal' })
  }

  async onModuleInit() {
    this.$on('error', ({ message }) => {
      this.logger.log(`Error: ${message}`)
    })

    this.$on('warn', ({ message }) => {
      this.logger.log(`Error: ${message}`)
    })

    await this.$connect()
  }

  async onModuleDestroy() {
    await this.$disconnect()
  }
}
