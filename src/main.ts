import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import * as Sentry from "@sentry/vue";

const app = createApp(App)



Sentry.init({
  app,
  dsn: "https://cfe55d2f98b4608cd87f9adca3a5163a@o1353746.ingest.us.sentry.io/4509994332585984",
  sendDefaultPii: true,
  integrations: [
    Sentry.browserTracingIntegration({ router }),
    Sentry.consoleLoggingIntegration({ levels: ["log", "warn", "error"] }),
  ],
  enableLogs: true,
  tracesSampleRate: 1.0,
  _experiments: {
    enableLogger: true,
  },
});
app.use(createPinia())
app.use(router)

app.mount('#app')
