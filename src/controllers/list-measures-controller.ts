import { FastifyReply, FastifyRequest } from 'fastify'
import { listMeasuresService } from '../services/list-measures-services'
import { listMeasuresSchema } from '../schemas/list-measures-schema'
import { ZodError } from 'zod'

export const listMeasuresController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const {
      params: { customer_code },
      query: { measure_type },
    } = listMeasuresSchema.parse({
      params: request.params,
      query: request.query,
    })

    const result = await listMeasuresService({
      customerCode: customer_code,
      measureType: measure_type,
    })

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
