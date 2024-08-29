import { prisma } from '../database/prisma'
import { AppErrors } from '../errors/app-errors'

type MeasureType = 'WATER' | 'GAS'

export const listMeasuresService = async ({
  customerCode,
  measureType,
}: {
  customerCode: string
  measureType?: MeasureType
}) => {
  const measures = await prisma.measure.findMany({
    where: {
      customerCode,
      measureType,
    },
  })

  if (!measures.length) {
    throw AppErrors.MEASURES_NOT_FOUND
  }

  return {
    status: 200,
    data: {
      customer_code: customerCode,
      measures: measures.map((measure) => ({
        measure_uuid: measure.id,
        measure_datetime: measure.measureDateTime.toISOString(),
        measure_type: measure.measureType,
        has_confirmed: measure.hasConfirmed,
        image_url: measure.imageUrl,
      })),
    },
  }
}
