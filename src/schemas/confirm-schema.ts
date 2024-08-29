import { z } from 'zod'

export const confirmSchema = z.object({
  measure_uuid: z.string().uuid(),
  confirmed_value: z.number().int().positive().optional(),
})

export type ConfirmSchema = z.infer<typeof confirmSchema>
