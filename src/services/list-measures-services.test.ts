import { prisma } from '../database/prisma'
import { AppErrors } from '../errors/app-errors'
import { listMeasuresService } from './list-measures-services'

jest.mock('../database/prisma', () => ({
  prisma: {
    measure: {
      findMany: jest.fn(),
    },
  },
}))

describe('listMeasuresService', () => {
  const mockMeasures = [
    {
      id: '1',
      customerCode: 'CUST001',
      measureType: 'WATER',
      measureValue: 100,
      measureDateTime: new Date(),
      hasConfirmed: false,
      imageUrl: 'http://example.com/image.jpg',
    },
  ]

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should return measures for a customer', async () => {
    prisma.measure.findMany = jest.fn().mockResolvedValue(mockMeasures)

    const result = await listMeasuresService({ customerCode: 'CUST001' })

    expect(result.status).toBe(200)
    expect(result.data.customer_code).toBe('CUST001')
    expect(result.data.measures).toHaveLength(1)
    expect(result.data.measures[0]).toHaveProperty('measure_uuid')
    expect(result.data.measures[0]).toHaveProperty('measure_datetime')
    expect(result.data.measures[0]).toHaveProperty('measure_type')
    expect(result.data.measures[0]).toHaveProperty('has_confirmed')
    expect(result.data.measures[0]).toHaveProperty('image_url')
  })

  it('should call findMany with correct where clause', async () => {
    prisma.measure.findMany = jest.fn().mockResolvedValue(mockMeasures)

    await listMeasuresService({ customerCode: 'CUST001', measureType: 'WATER' })

    expect(prisma.measure.findMany).toHaveBeenCalledWith({
      where: {
        customerCode: 'CUST001',
        measureType: 'WATER',
      },
    })
  })

  it('should call findMany with only customerCode when measureType is not provided', async () => {
    prisma.measure.findMany = jest.fn().mockResolvedValue(mockMeasures)

    await listMeasuresService({ customerCode: 'CUST001' })

    expect(prisma.measure.findMany).toHaveBeenCalledWith({
      where: {
        customerCode: 'CUST001',
        measureType: undefined,
      },
    })
  })

  it('should throw MEASURES_NOT_FOUND error when no measures are found', async () => {
    prisma.measure.findMany = jest.fn().mockResolvedValue([])

    await expect(
      listMeasuresService({ customerCode: 'CUST001' })
    ).rejects.toEqual(AppErrors.MEASURES_NOT_FOUND)
  })
})
