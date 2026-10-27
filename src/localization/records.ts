import { i18n } from './i18n'

/** Select only translations supplied by the backend; never infer translations of records. */
export function localizedRecord<T extends object>(record: T, payload: unknown): T {
  if (!payload || typeof payload !== 'object') return record
  const data = payload as Record<string, unknown>
  for (const [field, translationsKey] of [
    ['title', 'titles'],
    ['description', 'descriptions'],
  ] as const) {
    const descriptor = Object.getOwnPropertyDescriptor(record, field)
    const translations = data[translationsKey]
    if (!descriptor || descriptor.get || !descriptor.writable || !Array.isArray(translations))
      continue
    const values = translations.filter(
      (entry): entry is Record<string, string> =>
        !!entry &&
        typeof entry === 'object' &&
        typeof entry.locale === 'string' &&
        typeof entry[field] === 'string',
    )
    if (!values.length) continue
    const fallback = descriptor.value
    let override: unknown
    let edited = false
    Object.defineProperty(record, field, {
      enumerable: descriptor.enumerable,
      configurable: true,
      get: () =>
        edited
          ? override
          : values.find((entry) => entry.locale === i18n.global.locale.value)?.[field] ||
            fallback ||
            values[0]?.[field] ||
            '',
      set: (value) => {
        edited = true
        override = value
      },
    })
  }
  return record
}
