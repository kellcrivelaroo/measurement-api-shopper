import { FastifyReply, FastifyRequest } from 'fastify'
import { ZodError } from 'zod'
import { confirmSchema } from '../schemas/confirm-schema'
import { confirmService } from '../services/confirm-service'

export const confirmController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const confirmBody = confirmSchema.parse(request.body)

    const result = await confirmService(confirmBody)

    return reply.status(result.status).send(result.data)
  } catch (error) {
    console.error('Error in confirm controller:', error)
    if (error instanceof ZodError) {
      return reply.status(400).send({
        error_code: 'INVALID_DATA',
        error_description: 'Dados inválidos',
        details: error.flatten().fieldErrors,
      })
    }
    return reply.status(500).send({
      error_code: 'INTERNAL_SERVER_ERROR',
      error_description: 'Ocorreu um erro inesperado.',
    })
  }
}
