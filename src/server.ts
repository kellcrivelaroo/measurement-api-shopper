import Fastify from 'fastify'
import cors from '@fastify/cors'
import { routes } from './routes/routes'
import { errorHandler } from './middlewares/error-handler'
import { env } from './utils/env'

const PORT = env.PORT || 80

const app = Fastify({ logger: false })

app.register(cors)
app.register(routes)
app.setErrorHandler(errorHandler)

app.listen({ port: PORT, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    app.log.error(err)
    process.exit(1)
  }
  app.log.info(`Server running at ${address}`)
})
