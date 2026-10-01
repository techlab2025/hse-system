import en from '@/locales/en.json'
import ar from '@/locales/ar.json'

export const featureTranslation = (key: string): string => {
  const messages: Record<string, unknown> = localStorage.getItem('lang') === 'ar' ? ar : en
  const value = messages[key]
  return typeof value === 'string' ? value : key
}
