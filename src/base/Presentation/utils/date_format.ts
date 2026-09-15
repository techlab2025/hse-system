export const formatJoinDate = (date: string | Date, isMonthly?: boolean): string => {
  const parsedDate = date instanceof Date ? date : new Date(date)

  // Extract day, month, and lesson
  const day = String(parsedDate.getDate()).padStart(2, '0')
  const month = String(parsedDate.getMonth() + 1).padStart(2, '0') // Months are 0-based
  const year = String(parsedDate.getFullYear()) // Full lesson

  return isMonthly ? `${month}-${day}` : `${year}-${month}-${day}`
}
