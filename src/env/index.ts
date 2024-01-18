import { z } from 'zod'
import 'dotenv/config'

const envSchema = z.object({
    REACT_APP_API_URL: z.string(),
})

const _env = envSchema.safeParse(process.env)

if (_env.success !== true) {
  console.error('Error converting environment variables', _env.error.format())

  throw new Error('Invalid environment variables')
}

export const env = _env.data
