/** Preserve unavailable values instead of presenting them as a measured zero. */
export const metricNumber = (value: unknown): number | null => {
  if (
    (typeof value !== 'number' && typeof value !== 'string') ||
    (typeof value === 'string' && !value.trim())
  )
    return null
  const number = Number(value)
  return Number.isFinite(number) && number >= 0 ? number : null
}

export const metricPercent = (value: unknown): number | null => {
  const number = metricNumber(value)
  return number == null ? null : Math.min(100, number)
}

export const formatMetric = (value: unknown, locale: string): string => {
  const number = metricNumber(value)
  return number == null
    ? '—'
    : new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(number)
}
