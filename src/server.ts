import Fastify from 'fastify'
import cors from '@fastify/cors'
import { routes } from './routes/routes'

const app = Fastify({ logger: false })

app.register(cors)

app.register(routes)

app.listen({ port: 3000 }, (err, address) => {
  if (err) {
    app.log.error(err)
    process.exit(1)
  }
  app.log.info(`Server running at ${address}`)
})
