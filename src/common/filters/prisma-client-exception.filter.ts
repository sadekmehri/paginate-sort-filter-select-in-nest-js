import { Catch, ArgumentsHost, ExceptionFilter, HttpStatus } from '@nestjs/common'
import {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
} from '@prisma/client/runtime/library'
import { DATABSE_ERROR_MESSAGE } from 'common/constants/error-message'
import { StatusCodes } from 'common/constants/status-codes'
import { toGmtTimestamp } from 'common/utils/date.util'
import { Response } from 'express'

@Catch(PrismaClientKnownRequestError, PrismaClientUnknownRequestError)
export class PrismaClientExceptionFilter implements ExceptionFilter {
  catch(_exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()

    const gmtTimestamp = toGmtTimestamp()
    const status = HttpStatus.INTERNAL_SERVER_ERROR

    response.status(status).json({
      status: StatusCodes[status],
      message: DATABSE_ERROR_MESSAGE,
      timestamp: gmtTimestamp,
      path: request.url,
    })
  }
}
