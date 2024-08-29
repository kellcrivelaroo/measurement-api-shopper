import { z } from 'zod'

export const confirmSchema = z.object({
  measure_uuid: z
    .string({ message: 'ID inválido.' })
    .uuid({ message: 'ID inválido.' }),
  confirmed_value: z
    .number({ message: 'O valor deve ser um número.' })
    .int({ message: 'O valor deve ser um número inteiro.' })
    .positive({ message: 'O valor deve ser um número positivo.' })
    .optional(),
})

export type ConfirmSchema = z.infer<typeof confirmSchema>
