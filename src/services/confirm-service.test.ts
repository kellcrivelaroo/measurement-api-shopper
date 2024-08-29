import { prisma } from '../database/prisma'
import { AppErrors } from '../errors/app-errors'
import { confirmService } from './confirm-service'

jest.mock('../database/prisma', () => ({
  prisma: {
    measure: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}))

describe('confirmService', () => {
  const mockMeasure = {
    id: 'measure-uuid',
    measureValue: 100,
    hasConfirmed: false,
    measureType: 'WATER',
    measureDateTime: new Date(),
    imageUrl: 'image-url',
    customerCode: 'customer-code',
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should confirm a measure successfully', async () => {
    prisma.measure.findUnique = jest.fn().mockResolvedValue(mockMeasure)
    prisma.measure.update = jest
      .fn()
      .mockResolvedValue({ ...mockMeasure, hasConfirmed: true })

    const result = await confirmService({ measure_uuid: 'measure-uuid' })

    expect(result).toEqual({ status: 200, data: { success: true } })
    expect(prisma.measure.findUnique).toHaveBeenCalledWith({
      where: { id: 'measure-uuid' },
    })
    expect(prisma.measure.update).toHaveBeenCalledWith({
      where: { id: 'measure-uuid' },
      data: { measureValue: 100, hasConfirmed: true },
    })
  })

  it('should update measure value when confirmed_value is provided', async () => {
    prisma.measure.findUnique = jest.fn().mockResolvedValue(mockMeasure)
    prisma.measure.update = jest.fn().mockResolvedValue({
      ...mockMeasure,
      measureValue: 150,
      hasConfirmed: true,
    })

    await confirmService({ measure_uuid: 'measure-uuid', confirmed_value: 150 })

    expect(prisma.measure.update).toHaveBeenCalledWith({
      where: { id: 'measure-uuid' },
      data: { measureValue: 150, hasConfirmed: true },
    })
  })

  it('should throw MEASURE_NOT_FOUND error when measure does not exist', async () => {
    prisma.measure.findUnique = jest.fn().mockResolvedValue(null)

    await expect(
      confirmService({ measure_uuid: 'non-existent-uuid' })
    ).rejects.toEqual(AppErrors.MEASURE_NOT_FOUND)
  })

  it('should throw CONFIRMATION_DUPLICATE error when measure is already confirmed', async () => {
    prisma.measure.findUnique = jest
      .fn()
      .mockResolvedValue({ ...mockMeasure, hasConfirmed: true })

    await expect(
      confirmService({ measure_uuid: 'measure-uuid' })
    ).rejects.toEqual(AppErrors.CONFIRMATION_DUPLICATE)
  })

  it('should throw an error when database update fails', async () => {
    prisma.measure.findUnique = jest.fn().mockResolvedValue(mockMeasure)
    prisma.measure.update = jest
      .fn()
      .mockRejectedValue(new Error('Database error'))

    await expect(
      confirmService({ measure_uuid: 'measure-uuid' })
    ).rejects.toThrow('Database error')
  })
})
