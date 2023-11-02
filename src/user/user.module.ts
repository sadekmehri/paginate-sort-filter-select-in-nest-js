import { Module } from '@nestjs/common'
import { UserController } from './controller/user.controller'
import { UserService } from './service/user.service'
import { UserRepository } from './repository/user.repository'
import { PrismaUserRepository } from './repository/context/prisma-user.repository'
import { USER_DATA_ACCESSOR } from 'common/interfaces'
import { PrismaModule } from 'prisma/Prisma.module'

@Module({
  providers: [
    UserService,
    UserRepository,
    {
      useClass: PrismaUserRepository,
      provide: USER_DATA_ACCESSOR,
    },
  ],
  controllers: [UserController],
  imports: [PrismaModule],
})
export class UserModule {}
