import { createI18n } from 'vue-i18n'
import en from '@/locales/en.json'
import ar from '@/locales/ar.json'

export const normalizeLocale = (value: unknown): 'ar' | 'en' =>
  typeof value === 'string' && value.toLowerCase().split('-')[0] === 'ar' ? 'ar' : 'en'
const savedLocale = () => {
  try {
    return normalizeLocale(localStorage.getItem('lang'))
  } catch {
    return 'en'
  }
}
export const i18n = createI18n({
  legacy: false,
  locale: savedLocale(),
  fallbackLocale: 'en',
  messages: { en, ar },
})

type MessageOrigin = { key: string; values: Record<string, string | number> }
const feedbackOrigins = new Map<string, MessageOrigin>()
/** UI keys only. Keep bounded interpolation metadata so open feedback can change language. */
export const translate = (key: string, values: Record<string, string | number> = {}) => {
  const text = i18n.global.t(key, values)
  if (Object.keys(values).length) {
    if (feedbackOrigins.size >= 1000) feedbackOrigins.delete(feedbackOrigins.keys().next().value!)
    feedbackOrigins.set(text, { key, values: { ...values } })
  }
  return text
}
/** Used only at explicit system feedback boundaries, never on record values. */
export const translatedFeedbackOrigin = (message: string): string | undefined => {
  const origin = feedbackOrigins.get(message)
  return origin ? i18n.global.t(origin.key, origin.values) : undefined
}
export const setLocale = (value: unknown) => {
  i18n.global.locale.value = normalizeLocale(value)
}

/** Explicit UI label/key boundary; never call this on user-entered record values. */
export const translateKeyOrLiteral = (value?: string | null) => {
  if (!value) return ''
  return i18n.global.te(value) ? translate(value) : value
}

export const getCurrentLocale = () => i18n.global.locale.value
