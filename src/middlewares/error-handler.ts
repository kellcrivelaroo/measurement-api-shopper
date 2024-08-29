import { FastifyReply, FastifyRequest } from 'fastify'
import { ZodError } from 'zod'

export const errorHandler = (
  error: Error,
  request: FastifyRequest,
  reply: FastifyReply
) => {
  console.error(error)

  if (error instanceof ZodError) {
    const firstError =
      Object.values(error.flatten().fieldErrors).flat().find(Boolean) ||
      'Dados inválidos'

    reply.status(400).send({
      error_code: 'INVALID_DATA',
      error_description: firstError,
    })
  } else {
    reply.status(500).send({
      error_code: 'INTERNAL_SERVER_ERROR',
      error_description: 'Ocorreu um erro inesperado.',
    })
  }
}
