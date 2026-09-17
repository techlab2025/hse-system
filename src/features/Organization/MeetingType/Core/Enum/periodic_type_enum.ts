import TitleInterface from "@/base/Data/Models/title_interface"

export enum PeriodicTypeEnum {
  DAILY = 1,
  WEEKLY = 2,
  MONTHLY = 3,
  YEARLY = 4,
  DATES = 5,
}

export const PeriodicTypeOptions :TitleInterface[]= [
  new TitleInterface({ title: 'daily', id: PeriodicTypeEnum.DAILY }),
  new TitleInterface({ title: 'weekly', id: PeriodicTypeEnum.WEEKLY }),
  new TitleInterface({ title: 'monthly', id: PeriodicTypeEnum.MONTHLY }),
  new TitleInterface({ title: 'yearly', id: PeriodicTypeEnum.YEARLY }),
  new TitleInterface({ title: 'dates', id: PeriodicTypeEnum.DATES }),
]

export const getPeriodicTypeMaxDays = (type: PeriodicTypeEnum): number | null => {
  switch (type) {
    case PeriodicTypeEnum.WEEKLY:
      return 6
    case PeriodicTypeEnum.MONTHLY:
      return 29
    case PeriodicTypeEnum.YEARLY:
      return 364
    default:
      return null
  }
}

export const getPeriodicTypeLabel = (type: PeriodicTypeEnum | number): string => {
  return PeriodicTypeOptions.find((item) => item.id === Number(type))?.title ?? ''
}

export const parsePeriodicType = (value: unknown): PeriodicTypeEnum | null => {
  const numericValue = Number(value)
  if (Object.values(PeriodicTypeEnum).includes(numericValue as PeriodicTypeEnum)) {
    return numericValue as PeriodicTypeEnum
  }

  const normalized = String(value ?? '').trim().toLowerCase()
  const aliases: Record<string, PeriodicTypeEnum> = {
    daily: PeriodicTypeEnum.DAILY,
    weekly: PeriodicTypeEnum.WEEKLY,
    monthly: PeriodicTypeEnum.MONTHLY,
    yearly: PeriodicTypeEnum.YEARLY,
    year: PeriodicTypeEnum.YEARLY,
    dates: PeriodicTypeEnum.DATES,
    date: PeriodicTypeEnum.DATES,
  }

  return aliases[normalized] ?? null
}

export const validatePeriodicNumberOfDays = (
  type: PeriodicTypeEnum,
  value: number | null | undefined,
): string | null => {
  if (type === PeriodicTypeEnum.DAILY) return null

  const numericValue = Number(value)
  if (!Number.isInteger(numericValue) || numericValue <= 0) {
    return 'Number of days must be a positive integer'
  }

  if (type === PeriodicTypeEnum.WEEKLY && numericValue >= 7) {
    return 'Weekly number of days must be less than 7'
  }
  if (type === PeriodicTypeEnum.MONTHLY && numericValue >= 30) {
    return 'Monthly number of days must be less than 30'
  }
  if (type === PeriodicTypeEnum.YEARLY && numericValue >= 365) {
    return 'Yearly number of days must be less than 365'
  }

  return null
}
