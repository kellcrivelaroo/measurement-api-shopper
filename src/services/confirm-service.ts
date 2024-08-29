import { prisma } from '../database/prisma'
import { AppErrors } from '../errors/app-errors'
import { ConfirmSchema } from '../schemas/confirm-schema'

export const confirmService = async ({
  measure_uuid,
  confirmed_value,
}: ConfirmSchema) => {
  const measure = await prisma.measure.findUnique({
    where: { id: measure_uuid },
  })

  if (!measure) {
    throw AppErrors.MEASURE_NOT_FOUND
  }

  if (measure.hasConfirmed) {
    throw AppErrors.CONFIRMATION_DUPLICATE
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
