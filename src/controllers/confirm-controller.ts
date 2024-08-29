import { FastifyReply, FastifyRequest } from 'fastify'
import { confirmSchema } from '../schemas/confirm-schema'
import { confirmService } from '../services/confirm-service'

export const confirmController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const confirmBody = confirmSchema.parse(request.body)

  const result = await confirmService(confirmBody)

  return reply.status(result.status).send(result.data)
}
