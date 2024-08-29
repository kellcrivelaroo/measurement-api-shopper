import { FastifyInstance } from 'fastify'
import { uploadController } from '../controllers/upload-controller'
import { confirmController } from '../controllers/confirm-controller'
import { listMeasuresController } from '../controllers/list-measures-controller'

export const routes = async (app: FastifyInstance) => {
  // Route for image upload
  app.post('/upload', uploadController)

  // Route for measure confirmation
  app.patch('/confirm', confirmController)

  // List measures by customer
  app.get('/:customer_code/list', listMeasuresController)
}
