import type { App } from 'vue'
import { watch } from 'vue'
import { i18n, normalizeLocale, translate } from './i18n'
import { primeVueLocale } from './primeVueLocale'

/** One owner for locale, direction, persistence and teleported PrimeVue controls. */
export function syncLocale(app: App) {
  return watch(
    i18n.global.locale,
    (value) => {
      const locale = normalizeLocale(value)
      document.documentElement.lang = locale
      document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr'
      try {
        localStorage.setItem('lang', locale)
      } catch {
        /* Language changes still work without storage. */
      }
      app.config.globalProperties.$primevue.config.locale = primeVueLocale(locale)
      for (const key of ['visit', 'edit', 'remove', 'save', 'enterLink', 'formula', 'video'])
        document.documentElement.style.setProperty(
          `--editor-${key}-label`,
          JSON.stringify(translate(`editor.${key}`)),
        )
    },
    { immediate: true, flush: 'sync' },
  )
}
