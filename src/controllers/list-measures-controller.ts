import { FastifyReply, FastifyRequest } from 'fastify'
import { listMeasuresService } from '../services/list-measures-services'
import { listMeasuresSchema } from '../schemas/list-measures-schema'

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
    throw error
  }
}
