import { prisma } from '../database/prisma'
import { getMeasurementFromImage } from '../lib/google-gemini/google-gemini-utils'
import { UploadSchema } from '../schemas/upload-schema'
import { getStartAndEndOfMonth } from '../utils/date-utils'
import { convertImageToBase64, saveBase64Image } from '../utils/image-utils'

export const uploadService = async ({
  image,
  customer_code,
  measure_datetime,
  measure_type,
}: UploadSchema) => {
  const { startOfMonth, endOfMonth } = getStartAndEndOfMonth(measure_datetime)

  const existingMeasure = await prisma.measure.findFirst({
    where: {
      customerCode: customer_code,
      measureType: measure_type,
      measureDateTime: {
        gte: startOfMonth,
        lt: endOfMonth,
      },
    },
  })

  if (existingMeasure) {
    return {
      status: 409,
      data: {
        error_code: 'DOUBLE_REPORT',
        error_description: 'Leitura do mês já realizada',
      },
    }
  }

  const { imagePath } = await saveBase64Image(
    image,
    `${customer_code}-${measure_datetime.toISOString()}`
  )

  const { measureValue, imageUrl } = await getMeasurementFromImage({
    imagePath,
    type: measure_type,
  })

  const newMeasure = await prisma.measure.create({
    data: {
      customerCode: customer_code,
      measureType: measure_type,
      measureValue,
      measureDateTime: new Date(measure_datetime),
      imageUrl,
    },
  })

  return {
    status: 200,
    data: {
      measure_uuid: newMeasure.id,
      image_url: imageUrl,
      measure_value: measureValue,
    },
  }
}
