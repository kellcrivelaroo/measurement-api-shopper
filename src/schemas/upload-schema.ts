import { z } from 'zod'

const BASE64_IMAGE_REGEX = /data:image\/(?:png|jpg|jpeg);base64,/

const validateBase64Image = (value: string) => BASE64_IMAGE_REGEX.test(value)

const transformDate = (value: string) => {
  const date = new Date(value)
  if (isNaN(date.getTime())) {
    throw new Error('Invalid date format')
  }
  return date
}

export const uploadSchema = z.object({
  image: z.string().refine(validateBase64Image, {
    message: 'Imágem inválida. O formato da imagem deve ser base64.',
  }),
  customer_code: z.string({
    message: 'Código do cliente inválido.',
  }),
  measure_datetime: z
    .string({
      message: 'Data inválida.',
    })
    .transform(transformDate),
  measure_type: z.enum(['WATER', 'GAS'], {
    message: 'Tipo de medição não permitida.',
  }),
})

export type UploadSchema = z.infer<typeof uploadSchema>
