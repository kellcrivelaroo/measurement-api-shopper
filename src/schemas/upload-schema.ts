import { z } from 'zod'
import { validateBase64Image } from '../utils/image-utils'
import { transformDate, validateDate } from '../utils/date-utils'

export const uploadSchema = z.object({
  image: z.string().refine(validateBase64Image, {
    message: 'Imágem inválida. O formato da imagem deve ser base64.',
  }),
  customer_code: z.string({
    message: 'Código do cliente inválido.',
  }),
  measure_datetime: z
    .string()
    .refine(validateDate, {
      message: 'Data ou horário inválidos.',
    })
    .transform(transformDate),
  measure_type: z.enum(['WATER', 'GAS'], {
    message: 'Tipo de medição não permitida.',
  }),
})

export type UploadSchema = z.infer<typeof uploadSchema>
