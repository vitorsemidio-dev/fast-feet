import { CPFAlreadyExistsError } from '@/domain/delivery/application/use-cases/errors/cpf-already-exists.error'
import { InvalidDeliveryUpdateError } from '@/domain/delivery/application/use-cases/errors/invalid-delivery-update.error'
import { ResourceNotFoundError } from '@/domain/delivery/application/use-cases/errors/resource-not-found.error'
import { WrongCredentialsError } from '@/domain/delivery/application/use-cases/errors/wrong-credentials-error'
import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { Request, Response } from 'express'

export class BaseResponseDto {
  statusCode!: number
  message!: string
}

export class ExceptionResponseDto extends BaseResponseDto {
  timestamp!: string
  path!: string
  method!: string
}

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  static logInConsole = true
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()
    let message: string
    let status: number

    switch (exception.constructor) {
      case WrongCredentialsError:
        status = HttpStatus.UNAUTHORIZED
        message = (exception as WrongCredentialsError).message
        break
      case InvalidDeliveryUpdateError:
        status = HttpStatus.FORBIDDEN
        message = (exception as InvalidDeliveryUpdateError).message
        break
      case CPFAlreadyExistsError:
        status = HttpStatus.CONFLICT
        message = (exception as CPFAlreadyExistsError).message
        break
      case ResourceNotFoundError:
        status = HttpStatus.NOT_FOUND
        message = (exception as ResourceNotFoundError).message
        break
      case HttpException:
        status = (exception as HttpException).getStatus()
        message = (exception as HttpException).message
        break
      case BadRequestException:
        status = HttpStatus.BAD_REQUEST
        message = (exception as BadRequestException).message
        break
      case NotFoundException:
        status = HttpStatus.NOT_FOUND
        message = (exception as NotFoundException).message
        break
      case UnauthorizedException:
        status = HttpStatus.UNAUTHORIZED
        message = (exception as UnauthorizedException).message
        break
      case ForbiddenException:
        status = HttpStatus.FORBIDDEN
        message = (exception as ForbiddenException).message
        break
      default:
        status = (exception as any).status ?? HttpStatus.INTERNAL_SERVER_ERROR
        message = (exception as any).message ?? 'Internal server error'
        break
    }

    if (AllExceptionFilter.logInConsole) {
      Logger.error(
        message,
        (exception as any).stack,
        `${request.method} ${request.url}`,
      )
    }

    response
      .status(status)
      .json(this.GlobalResponseError(status, message, request))
  }
  private GlobalResponseError: (
    statusCode: number,
    message: string,
    request: Request,
  ) => ExceptionResponseDto = (
    statusCode: number,
    message: string,
    request: Request,
  ): ExceptionResponseDto => {
    return {
      statusCode: statusCode,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
    }
  }
}
