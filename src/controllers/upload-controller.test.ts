import { FastifyRequest, FastifyReply } from 'fastify'
import { uploadController } from './upload-controller'
import { uploadSchema } from '../schemas/upload-schema'
import { uploadService } from '../services/upload-service'

jest.mock('../schemas/upload-schema')
jest.mock('../services/upload-service')

describe('uploadController', () => {
  let mockRequest: Partial<FastifyRequest>
  let mockReply: Partial<FastifyReply>
  const mockSend = jest.fn()

  beforeEach(() => {
    mockRequest = {
      body: {
        image: 'base64_image_data',
        customer_code: 'CUST001',
        measure_datetime: '2023-01-15T12:00:00Z',
        measure_type: 'WATER',
      },
    }
    mockReply = {
      status: jest.fn().mockReturnThis(),
      send: mockSend,
    }
    jest.clearAllMocks()
  })

  it('should call uploadService with parsed data and return the result', async () => {
    const mockParsedData = {
      image: 'base64_image_data',
      customer_code: 'CUST001',
      measure_datetime: new Date('2023-01-15T12:00:00Z'),
      measure_type: 'WATER',
    }
    const mockServiceResult = {
      status: 200,
      data: {
        measure_uuid: 'measure_uuid',
        image_url: 'http://example.com/image.jpg',
        measure_value: 100,
      },
    }

    ;(uploadSchema.parse as jest.Mock).mockReturnValue(mockParsedData)
    ;(uploadService as jest.Mock).mockResolvedValue(mockServiceResult)

    await uploadController(
      mockRequest as FastifyRequest,
      mockReply as FastifyReply
    )

    expect(uploadSchema.parse).toHaveBeenCalledWith(mockRequest.body)
    expect(uploadService).toHaveBeenCalledWith(mockParsedData)
    expect(mockReply.status).toHaveBeenCalledWith(200)
    expect(mockSend).toHaveBeenCalledWith(mockServiceResult.data)
  })

  it('should handle errors from uploadSchema', async () => {
    const mockError = new Error('VALIDATION_ERROR')
    ;(uploadSchema.parse as jest.Mock).mockImplementation(() => {
      throw mockError
    })

    await expect(
      uploadController(mockRequest as FastifyRequest, mockReply as FastifyReply)
    ).rejects.toThrow('VALIDATION_ERROR')
  })
})
