import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { filters } from 'common/config/filters.config'
import { UserModule } from './user/user.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
  ],
  controllers: [],
  providers: [...filters],
})
export class AppModule {}
