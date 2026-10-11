import { InvestegationStatusEnum } from '@/features/Organization/Investigating/Core/Enums/InvestegationStatusEnum'

// Preserve the NCR import path while sharing the investigation status values.
export { InvestegationStatusEnum as StatusEnum }

const labels: Record<InvestegationStatusEnum, string> = {
  [InvestegationStatusEnum.OPEN]: 'Open',
  [InvestegationStatusEnum.NEW]: 'New',
  [InvestegationStatusEnum.IN_PROGRESS]: 'In progress',
  [InvestegationStatusEnum.HOLD]: 'Hold',
  [InvestegationStatusEnum.CLOSED]: 'Closed',
  [InvestegationStatusEnum.COMPLETED]: 'Completed',
}

export function parseNcrStatus(value: unknown): InvestegationStatusEnum | undefined {
  if (typeof value !== 'number' && typeof value !== 'string') return undefined
  if (typeof value === 'string' && !value.trim()) return undefined
  const numeric = Number(value)
  if (Number.isInteger(numeric) && Object.hasOwn(labels, numeric)) {
    return numeric as InvestegationStatusEnum
  }
  if (typeof value === 'string') {
    const key = value
      .trim()
      .toUpperCase()
      .replace(/[\s-]+/g, '_')
    const status = InvestegationStatusEnum[key as keyof typeof InvestegationStatusEnum]
    if (typeof status === 'number') return status
  }
  return undefined
}

export function ncrStatusLabel(value: unknown): string {
  const status = parseNcrStatus(value)
  return status === undefined ? 'Unknown' : labels[status]
}
