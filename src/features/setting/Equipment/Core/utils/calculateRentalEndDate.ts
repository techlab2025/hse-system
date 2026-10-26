import { RentTypeEnum } from '../enum/RentTypeEnum'

/** Add the rental period to checkin_date without changing the supplied start date. */
export function calculateRentalEndDate(
  checkinDate: string | Date | null | undefined,
  period: string | number | null | undefined,
  periodType: string | number | null | undefined,
): Date | null {
  if (!checkinDate) return null
  const end = checkinDate instanceof Date ? new Date(checkinDate.getTime()) : new Date(checkinDate)
  const amount = Number(period)
  const type = Number(periodType)
  if (!Number.isFinite(end.getTime()) || !Number.isFinite(amount) || amount <= 0) return null
  if (type !== RentTypeEnum.HOUR && !Number.isInteger(amount)) return null

  switch (type) {
    case RentTypeEnum.HOUR:
      end.setTime(end.getTime() + amount * 60 * 60 * 1000)
      break
    case RentTypeEnum.DAY:
      end.setDate(end.getDate() + amount)
      break
    case RentTypeEnum.MONTH:
    case RentTypeEnum.YEAR: {
      // Preserve the day when possible; Jan 31 + one month ends on Feb 28/29.
      const day = end.getDate()
      end.setDate(1)
      if (type === RentTypeEnum.MONTH) end.setMonth(end.getMonth() + amount)
      else end.setFullYear(end.getFullYear() + amount)
      const lastDay = new Date(end.getTime())
      lastDay.setMonth(lastDay.getMonth() + 1, 0)
      end.setDate(Math.min(day, lastDay.getDate()))
      break
    }
    default:
      return null
  }
  return Number.isFinite(end.getTime()) ? end : null
}
