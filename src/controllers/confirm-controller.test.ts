import { FastifyRequest, FastifyReply } from 'fastify'
import { confirmController } from './confirm-controller'
import { confirmService } from '../services/confirm-service'
import { confirmSchema } from '../schemas/confirm-schema'

jest.mock('../services/confirm-service')
jest.mock('../schemas/confirm-schema')

describe('confirmController', () => {
  let mockRequest: Partial<FastifyRequest>
  let mockReply: Partial<FastifyReply>
  const mockSend = jest.fn()

  beforeEach(() => {
    mockRequest = {
      body: { measure_uuid: 'measure-uuid', confirmed_value: 150 },
    }
    mockReply = {
      status: jest.fn().mockReturnThis(),
      send: mockSend,
    }
    jest.clearAllMocks()
  })

  it('should call confirmService with correct parameters', async () => {
    const mockParse = jest
      .fn()
      .mockReturnValue({ measure_uuid: 'measure-uuid', confirmed_value: 150 })
    ;(confirmSchema.parse as jest.Mock).mockImplementation(mockParse)
    ;(confirmService as jest.Mock).mockResolvedValue({
      status: 200,
      data: { success: true },
    })

    await confirmController(
      mockRequest as FastifyRequest,
      mockReply as FastifyReply
    )

    expect(confirmService).toHaveBeenCalledWith({
      measure_uuid: 'measure-uuid',
      confirmed_value: 150,
    })
  })

  it('should return the correct status and data', async () => {
    const mockServiceResult = {
      status: 200,
      data: { success: true },
    }
    ;(confirmSchema.parse as jest.Mock).mockReturnValue({
      measure_uuid: 'measure-uuid',
      confirmed_value: 150,
    })
    ;(confirmService as jest.Mock).mockResolvedValue(mockServiceResult)

    await confirmController(
      mockRequest as FastifyRequest,
      mockReply as FastifyReply
    )

    expect(mockReply.status).toHaveBeenCalledWith(200)
    expect(mockSend).toHaveBeenCalledWith({ success: true })
  })

  it('should handle errors from confirmSchema', async () => {
    const mockError = new Error('VALIDATION_ERROR')
    ;(confirmSchema.parse as jest.Mock).mockImplementation(() => {
      throw mockError
    })

    await expect(
      confirmController(
        mockRequest as FastifyRequest,
        mockReply as FastifyReply
      )
    ).rejects.toThrow('VALIDATION_ERROR')
  })
})
