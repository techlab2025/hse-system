import './assets/styles/main.scss'
import './assets/styles/tailwind.css'
import './assets/styles/theme/_dark_mode.scss'
import './shared/styles/hse-identity-tokens.css'
import './shared/styles/hse-controls.css'
import './features/SystemIdentity/identity-application.css'
import './assets/styles/design-system/index.css'
import HseCloudPreset from './config/hseCloudPreset'
import { hseDatePickerPt } from './shared/styles/hsePrimeVue'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import ToastService from 'primevue/toastservice'
import PrimeVue from 'primevue/config'
import App from './App.vue'
import router from './router'
import { i18n } from './localization/i18n'
import { syncLocale } from './localization/syncLocale'
import { installIdentityFormStyling } from './plugins/identityForm'
import './localization/direction.css'
// import * as Sentry from '@sentry/vue'
document.documentElement.classList.add('hse-cloud-identity')

const app = createApp(App)
installIdentityFormStyling(app)
// if (process.env.NODE_ENV !== 'development') {
//   Sentry.init({
//     app,
//     dsn: 'https://cfe55d2f98b4608cd87f9adca3a5163a@o1353746.ingest.us.sentry.io/4509994332585984',
//     sendDefaultPii: true,
//     integrations: [
//       Sentry.browserTracingIntegration({ router }),
//       Sentry.consoleLoggingIntegration({ levels: ['log', 'warn', 'error'] }),
//     ],
//     enableLogs: true,
//     tracesSampleRate: 1.0,
//     _experiments: {
//       enableLogger: true,
//     },
//   })
// } else {
//   console.log('🔕 Sentry disabled in local environment')
// }

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)
app.use(i18n)
app.use(ToastService)
app.use(PrimeVue, {
  pt: { datepicker: hseDatePickerPt },
  ptOptions: { mergeSections: true, mergeProps: true },
  theme: {
    preset: HseCloudPreset,
    options: {
      prefix: 'p',
      darkModeSelector: '[data-theme="dark"]',
      cssLayer: false,
    },
  },
})
syncLocale(app)
app.mount('#app')
