import { APP_FILTER } from '@nestjs/core'
import { CustomExceptionFilter, PrismaClientExceptionFilter } from 'common/filters'

export const filters = [
  {
    provide: APP_FILTER,
    useClass: PrismaClientExceptionFilter,
  },
  {
    provide: APP_FILTER,
    useClass: CustomExceptionFilter,
  },
]
