import { FastifyReply, FastifyRequest } from 'fastify'
import { ZodError } from 'zod'
import { AppErrors, AppErrorType } from '../errors/app-errors'

export const errorHandler = (
  error: Error | AppErrorType | string,
  request: FastifyRequest,
  reply: FastifyReply
) => {
  console.error('Error:', error)

  const sendErrorResponse = (
    status: number,
    code: string,
    description: string
  ) => {
    reply.status(status).send({
      error_code: code,
      error_description: description,
    })
  }

  if (error instanceof ZodError) {
    const firstError =
      error.errors[0]?.message || AppErrors.INVALID_DATA.message
    sendErrorResponse(
      AppErrors.INVALID_DATA.status,
      AppErrors.INVALID_DATA.code,
      firstError
    )
  } else if (
    typeof error === 'object' &&
    'code' in error &&
    'status' in error &&
    'message' in error
  ) {
    sendErrorResponse(
      Number(error.status),
      error.code as string,
      error.message as string
    )
  } else if (typeof error === 'string' && error in AppErrors) {
    const appError = AppErrors[error as keyof typeof AppErrors]
    sendErrorResponse(appError.status, appError.code, appError.message)
  } else {
    sendErrorResponse(
      AppErrors.INTERNAL_SERVER_ERROR.status,
      AppErrors.INTERNAL_SERVER_ERROR.code,
      AppErrors.INTERNAL_SERVER_ERROR.message
    )
  }
}
