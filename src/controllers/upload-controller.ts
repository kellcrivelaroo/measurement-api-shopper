import { FastifyReply, FastifyRequest } from 'fastify'
import { uploadSchema } from '../schemas/upload-schema'
import { uploadService } from '../services/upload-service'

export const uploadController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const uploadBody = uploadSchema.parse(request.body)

  const response = await uploadService(uploadBody)

  return reply.status(response.status).send(response.data)
}
