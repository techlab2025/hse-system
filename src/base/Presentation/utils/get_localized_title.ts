import { getCurrentLocale } from '@/localization/i18n'

/** Only select fields supplied by the backend; keep the other translation as a fallback. */
export function getLocalizedTitle(titles: { title_ar?: string; title_en?: string }): string {
  return getCurrentLocale() === 'ar'
    ? titles?.title_ar || titles?.title_en || ''
    : titles?.title_en || titles?.title_ar || ''
}
