import { AppErrors } from '../errors/app-errors'

export const validateDate = (value: string) => {
  const date = new Date(value)
  return (
    !isNaN(date.getTime()) &&
    date.toISOString() === new Date(date.getTime()).toISOString()
  )
}

export const transformDate = (value: string) => {
  const date = new Date(value)
  if (isNaN(date.getTime())) {
    throw AppErrors.INVALID_DATA
  }
  return date
}

export const getStartAndEndOfMonth = (date: Date) => {
  const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1)
  const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1)
  return { startOfMonth, endOfMonth }
}
