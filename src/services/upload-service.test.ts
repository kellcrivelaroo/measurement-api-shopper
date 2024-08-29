import { prisma } from '../database/prisma'
import { AppErrors } from '../errors/app-errors'
import { uploadService } from './upload-service'
import { getMeasurementFromImage } from '../lib/google-gemini/google-gemini-utils'
import { saveBase64Image } from '../utils/image-utils'
import { getStartAndEndOfMonth } from '../utils/date-utils'

jest.mock('../database/prisma', () => ({
  prisma: {
    measure: {
      findFirst: jest.fn(),
      create: jest.fn(),
    },
  },
}))
jest.mock('../lib/google-gemini/google-gemini-utils')
jest.mock('../utils/image-utils')
jest.mock('../utils/date-utils')

describe('uploadService', () => {
  const mockUploadData = {
    image: 'base64_image_data',
    customer_code: 'CUST001',
    measure_datetime: new Date('2023-01-15T12:00:00Z'),
    measure_type: 'WATER' as const,
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(getStartAndEndOfMonth as jest.Mock).mockReturnValue({
      startOfMonth: new Date('2023-01-01T00:00:00Z'),
      endOfMonth: new Date('2023-02-01T00:00:00Z'),
    })
  })

  it('should create a new measure when no existing measure is found', async () => {
    prisma.measure.findFirst = jest.fn().mockResolvedValue(null)
    ;(saveBase64Image as jest.Mock).mockResolvedValue({
      imagePath: '/path/to/image.jpg',
    })
    ;(getMeasurementFromImage as jest.Mock).mockResolvedValue({
      measureValue: 100,
      imageUrl: 'http://example.com/image.jpg',
    })
    prisma.measure.create = jest.fn().mockResolvedValue({
      id: 'new_measure_uuid',
      customerCode: 'CUST001',
      measureType: 'WATER',
      measureValue: 100,
      measureDateTime: mockUploadData.measure_datetime,
      imageUrl: 'http://example.com/image.jpg',
    })

    const result = await uploadService(mockUploadData)

    expect(prisma.measure.findFirst).toHaveBeenCalledWith({
      where: {
        customerCode: 'CUST001',
        measureType: 'WATER',
        measureDateTime: {
          gte: new Date('2023-01-01T00:00:00Z'),
          lt: new Date('2023-02-01T00:00:00Z'),
        },
      },
    })
    expect(saveBase64Image).toHaveBeenCalledWith(
      'base64_image_data',
      expect.stringContaining('CUST001-2023-01-15')
    )
    expect(getMeasurementFromImage).toHaveBeenCalledWith({
      imagePath: '/path/to/image.jpg',
      type: 'WATER',
    })
    expect(prisma.measure.create).toHaveBeenCalledWith({
      data: {
        customerCode: 'CUST001',
        measureType: 'WATER',
        measureValue: 100,
        measureDateTime: mockUploadData.measure_datetime,
        imageUrl: 'http://example.com/image.jpg',
      },
    })
    expect(result).toEqual({
      status: 200,
      data: {
        measure_uuid: 'new_measure_uuid',
        image_url: 'http://example.com/image.jpg',
        measure_value: 100,
      },
    })
  })

  it('should throw DOUBLE_REPORT error when an existing measure is found', async () => {
    ;(prisma.measure.findFirst as jest.Mock).mockResolvedValue({
      id: 'existing_measure',
    })

    await expect(uploadService(mockUploadData)).rejects.toEqual(
      AppErrors.DOUBLE_REPORT
    )
  })
})
