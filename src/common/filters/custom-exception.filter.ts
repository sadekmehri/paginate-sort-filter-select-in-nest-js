import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common'
import { StatusCodes } from 'common/constants/status-codes'
import { toGmtTimestamp } from 'common/utils/date.util'
import { Response } from 'express'

@Catch(HttpException)
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()

    const status = exception.getStatus()
    const errorResponse = exception.getResponse()
    const gmtTimestamp = toGmtTimestamp()

    response.status(status).json({
      status: StatusCodes[status],
      // @ts-ignore
      message: errorResponse['message'] ?? errorResponse,
      timestamp: gmtTimestamp,
      path: request.url,
    })
  }
}
