import { z } from 'zod'

export const listMeasuresSchema = z.object({
  params: z.object({
    customer_code: z
      .string({
        message: 'Código do cliente inválido.',
      })
      .min(1, 'O código do cliente não pode estar vazio.'),
  }),
  query: z.object({
    measure_type: z
      .string()
      .optional()
      .refine((val) => !val || ['WATER', 'GAS'].includes(val.toUpperCase()), {
        message: 'Tipo de medição não permitida.',
      })
      .transform((val) => val?.toUpperCase() as 'WATER' | 'GAS' | undefined),
  }),
})

export type ListMeasuresSchema = z.infer<typeof listMeasuresSchema>
