import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  PORT: z.coerce.number().optional().default(80),
  GEMINI_API_KEY: z.string(),
})

const _env = {
  PORT: process.env.PORT,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
}

const parsedEnv = envSchema.safeParse(_env)

if (!parsedEnv.success) {
  const msg = 'Invalid public enviroment variables'
  console.error(msg, parsedEnv.error.flatten().fieldErrors)

  throw new Error(msg)
}

export const env = parsedEnv.data
