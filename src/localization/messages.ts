import en from '@/locales/en.json'
import ar from '@/locales/ar.json'
import { translate, i18n, translatedFeedbackOrigin } from './i18n'
const flatten = (
  input: Record<string, unknown>,
  prefix = '',
  result: Record<string, string> = {},
) => {
  for (const [key, value] of Object.entries(input)) {
    const path = prefix ? `${prefix}.${key}` : key
    if (typeof value === 'string') result[path] = value
    else if (value && typeof value === 'object' && !Array.isArray(value))
      flatten(value as Record<string, unknown>, path, result)
  }
  return result
}
const english = flatten(en),
  arabic = flatten(ar)
const lookup = new Map<string, string | null>()
for (const [key, value] of Object.entries(english)) {
  for (const text of [value, arabic[key]]) {
    if (!text) continue
    const previous = lookup.get(text.trim())
    if (previous && arabic[previous] !== arabic[key]) lookup.set(text.trim(), null)
    else if (!lookup.has(text.trim())) lookup.set(text.trim(), key)
  }
}
/** Only for system feedback owned by the UI, never for names, records or input values. */
export const translateMessage = (value?: string | null) => {
  if (!value) return ''
  const source = value.trim()
  if (i18n.global.te(source)) return translate(source)
  const interpolated = translatedFeedbackOrigin(value)
  if (interpolated !== undefined) return interpolated
  const key = lookup.get(source)
  return key ? translate(key) : value
}
