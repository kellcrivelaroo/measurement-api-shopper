import { prisma } from '../database/prisma'
import { ConfirmSchema } from '../schemas/confirm-schema'

export const confirmService = async ({
  measure_uuid,
  confirmed_value,
}: ConfirmSchema) => {
  const measure = await prisma.measure.findUnique({
    where: { id: measure_uuid },
  })

  if (!measure) {
    return {
      status: 404,
      data: {
        error_code: 'MEASURE_NOT_FOUND',
        error_description: 'Leitura não encontrada',
      },
    }
  }

  if (measure.hasConfirmed) {
    return {
      status: 409,
      data: {
        error_code: 'CONFIRMATION_DUPLICATE',
        error_description: 'Leitura do mês já confirmada',
      },
    }
  }

  await prisma.measure.update({
    where: { id: measure_uuid },
    data: {
      measureValue: confirmed_value ?? measure.measureValue,
      hasConfirmed: true,
    },
  })

  return {
    status: 200,
    data: {
      success: true,
    },
  }
}
