import { z } from 'zod'

export const listMeasuresSchema = z.object({
  params: z.object({
    customer_code: z
      .string()
      .min(1, 'O código do cliente não pode estar vazio'),
  }),
  query: z.object({
    measure_type: z
      .enum(['WATER', 'GAS'], { message: 'Tipo de medição não permitida' })
      .optional()
      .transform((val) => val?.toUpperCase() as 'WATER' | 'GAS' | undefined),
  }),
})

export type ListMeasuresSchema = z.infer<typeof listMeasuresSchema>
