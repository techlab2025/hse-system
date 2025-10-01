import './assets/styles/main.min.css'
import './assets/styles/main.min.css'
import './assets/styles/tailwind.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import App from './App.vue'
import router from './router'
import { createI18n } from 'vue-i18n'
import * as Sentry from '@sentry/vue'

import ar from './locales/ar.json'
import en from './locales/en.json'

const savedLanguage = localStorage.getItem('lang') || 'en'

const i18n = createI18n({
  legacy: false,
  locale: savedLanguage,
  fallbackLocale: 'ar',
  messages: {
    en: en,
    ar: ar,
  },
})

const app = createApp(App)

Sentry.init({
  app,
  dsn: 'https://cfe55d2f98b4608cd87f9adca3a5163a@o1353746.ingest.us.sentry.io/4509994332585984',
  sendDefaultPii: true,
  integrations: [
    Sentry.browserTracingIntegration({ router }),
    Sentry.consoleLoggingIntegration({ levels: ['log', 'warn', 'error'] }),
  ],
  enableLogs: true,
  tracesSampleRate: 1.0,
  _experiments: {
    enableLogger: true,
  },
})

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)
app.use(i18n)
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      prefix: 'p',
      darkModeSelector: false,
      cssLayer: false
    }
  },
})
app.mount('#app')
