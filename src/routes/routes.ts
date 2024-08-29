import { FastifyInstance } from 'fastify'
import { uploadController } from '../controllers/upload-controller'

export const routes = async (app: FastifyInstance) => {
  app.post('/upload', uploadController)
}
