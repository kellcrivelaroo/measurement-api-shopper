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
    throw new Error('Invalid date format')
  }
  return date
}

export const getStartAndEndOfMonth = (date: Date) => {
  const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1)
  const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1)
  return { startOfMonth, endOfMonth }
}
