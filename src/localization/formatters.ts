import { i18n } from './i18n'
const current = () => (i18n.global.locale.value === 'ar' ? 'ar-EG' : 'en-GB')
// Display-only formatters. Never use these to serialize API dates, identifiers or measurements.
export const formatDisplayNumber = (value: number, options?: Intl.NumberFormatOptions) =>
  new Intl.NumberFormat(current(), options).format(value)
export const formatDisplayDate = (value: Date | string, options?: Intl.DateTimeFormatOptions) => {
  const date = value instanceof Date ? value : new Date(value)
  return Number.isNaN(date.getTime())
    ? '—'
    : new Intl.DateTimeFormat(current(), { calendar: 'gregory', ...options }).format(date)
}
export const formatRelativeTime = (value: number, unit: Intl.RelativeTimeFormatUnit) =>
  new Intl.RelativeTimeFormat(current(), { numeric: 'auto' }).format(value, unit)
