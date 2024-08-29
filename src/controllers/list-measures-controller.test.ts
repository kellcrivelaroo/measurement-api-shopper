import { FastifyRequest, FastifyReply } from 'fastify'
import { listMeasuresController } from './list-measures-controller'
import { listMeasuresService } from '../services/list-measures-services'
import { listMeasuresSchema } from '../schemas/list-measures-schema'

jest.mock('../services/list-measures-services')
jest.mock('../schemas/list-measures-schema')

describe('listMeasuresController', () => {
  let mockRequest: Partial<FastifyRequest>
  let mockReply: Partial<FastifyReply>
  const mockSend = jest.fn()

  beforeEach(() => {
    mockRequest = {
      params: { customer_code: 'CUST001' },
      query: { measure_type: 'WATER' },
    }
    mockReply = {
      status: jest.fn().mockReturnThis(),
      send: mockSend,
    }
    jest.clearAllMocks()
  })

  it('should call listMeasuresService with correct parameters', async () => {
    const mockParse = jest.fn().mockReturnValue({
      params: { customer_code: 'CUST001' },
      query: { measure_type: 'WATER' },
    })
    ;(listMeasuresSchema.parse as jest.Mock).mockImplementation(mockParse)
    listMeasuresSchema.parse = mockParse
    ;(listMeasuresService as jest.Mock).mockResolvedValue({
      status: 200,
      data: { customer_code: 'CUST001', measures: [] },
    })

    await listMeasuresController(
      mockRequest as FastifyRequest,
      mockReply as FastifyReply
    )

    expect(listMeasuresService).toHaveBeenCalledWith({
      customerCode: 'CUST001',
      measureType: 'WATER',
    })
  })

  it('should return the correct status and data', async () => {
    const mockServiceResult = {
      status: 200,
      data: { customer_code: 'CUST001', measures: [{ id: '1' }] },
    }
    ;(listMeasuresSchema.parse as jest.Mock).mockReturnValue({
      params: { customer_code: 'CUST001' },
      query: { measure_type: 'WATER' },
    })
    ;(listMeasuresService as jest.Mock).mockResolvedValue(mockServiceResult)

    await listMeasuresController(
      mockRequest as FastifyRequest,
      mockReply as FastifyReply
    )

    expect(mockReply.status).toHaveBeenCalledWith(200)
    expect(mockSend).toHaveBeenCalledWith(mockServiceResult.data)
  })

  it('should handle errors from listMeasuresSchema', async () => {
    const mockError = new Error('VALIDATION_ERROR')
    ;(listMeasuresSchema.parse as jest.Mock).mockImplementation(() => {
      throw mockError
    })

    await expect(
      listMeasuresController(
        mockRequest as FastifyRequest,
        mockReply as FastifyReply
      )
    ).rejects.toThrow('VALIDATION_ERROR')
  })

  it('should handle errors from listMeasuresService', async () => {
    const mockError = new Error('SERVICE_ERROR')
    ;(listMeasuresSchema.parse as jest.Mock).mockReturnValue({
      params: { customer_code: 'CUST001' },
      query: { measure_type: 'WATER' },
    })
    ;(listMeasuresService as jest.Mock).mockRejectedValue(mockError)

    await expect(
      listMeasuresController(
        mockRequest as FastifyRequest,
        mockReply as FastifyReply
      )
    ).rejects.toThrow('SERVICE_ERROR')
  })
})
