import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { AppModule } from 'app.module'
import { corsOptions } from 'common/config/cors.config'
import { validationPipeOptions } from 'common/config/validation-form-class.config'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  const config: ConfigService = app.get(ConfigService)
  const port = config.get<number>('BACK_END_PORT') || 9000

  app.disable('x-powered-by')
  app.enableCors(corsOptions)
  app.useGlobalPipes(new ValidationPipe(validationPipeOptions))

  await app.listen(port)
}

bootstrap()
