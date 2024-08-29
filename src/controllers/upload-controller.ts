import { FastifyReply, FastifyRequest } from 'fastify'
import { uploadSchema } from '../schemas/upload-schema'
import { uploadService } from '../services/upload-service'
import { ZodError } from 'zod'

export const uploadController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const uploadBody = uploadSchema.parse(request.body)

    const response = await uploadService(uploadBody)

    return reply.status(response.status).send(response.data)
  } catch (error) {
    console.error('Error in upload controller:', error)
    if (error instanceof ZodError) {
      return reply.status(400).send({
        error_code: 'INVALID_DATA',
        error_description: 'Invalid request data',
        details: error.errors,
      })
    }
    return reply.status(500).send({
      error_code: 'INTERNAL_SERVER_ERROR',
      error_description: 'An unexpected error occurred.',
    })
  }
}
