<script setup lang="ts">
import { computed, markRaw, onMounted, onBeforeUnmount, ref, type Component } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import { useI18n } from 'vue-i18n'
import EmailIntegrationController from '../controllers/EmailIntegrationController'
import EmailField from './EmailField.vue'
import EmailIcon from './EmailIcon.vue'
import LangTitleInput from '@/shared/HelpersComponents/LangTitleInput.vue'
import IndexLangController from '@/features/setting/languages/Presentation/controllers/indexLangController'
import IndexLangParams from '@/features/setting/languages/Core/params/indexLangParams'
import { LangsMap } from '@/constant/langs'
import { useUserStore } from '@/stores/user'
import USA from '@/shared/icons/USA.vue'
import SA from '@/shared/icons/SA.vue'
import './email-integration.css'

const { t, locale } = useI18n()
const text = (key: string) => t(`emailSettings.${key}`)
const controller = new EmailIntegrationController()
const {
  saved,
  draft,
  enabled,
  busy,
  currentPassword,
  dirty,
  canManage,
  canCheck,
  error,
  errorKey,
  noticeKey,
  checkedFolder,
} = controller
type LanguageOption = { locale: string; title: string; icon?: Component | string }
const user = useUserStore()
const languages = ref<LanguageOption[]>([
  { locale: 'en', title: '', icon: markRaw(USA) },
  { locale: 'ar', title: '', icon: markRaw(SA) },
])
const ports = computed(() => (draft.value.security === 'tls' ? [465] : [587, 2525]))
const titles = computed(() =>
  languages.value.map((language) => ({
    locale: language.locale,
    title: draft.value.translations.from_name[language.locale] || '',
  })),
)
const setTitles = (value: { locale: string; title?: string }[]) => {
  if (
    value.every(
      (item) => (item.title || '') === (draft.value.translations.from_name[item.locale] || ''),
    )
  )
    return
  value.forEach((item) => {
    draft.value.translations.from_name[item.locale] = item.title || ''
  })
  const names = draft.value.translations.from_name
  draft.value.from_name =
    names.ar?.trim() ||
    names.en?.trim() ||
    Object.values(names)
      .find((name) => name.trim())
      ?.trim() ||
    ''
}
const fetchLanguages = async () => {
  try {
    const available = user.user?.languages?.length
      ? user.user.languages
      : (await IndexLangController.getInstance().getData(new IndexLangParams('', 1, 10, 0))).value
          .data
    if (available?.length) {
      languages.value = available.map((item: { code: string }) => {
        const icon = LangsMap[item.code as keyof typeof LangsMap]?.icon
        return { locale: item.code, title: '', icon: icon ? markRaw(icon) : undefined }
      })
    }
  } catch {
    // Keep Arabic/English available if the language service cannot be reached.
  }
}
const statusText = computed(() =>
  !saved.value?.updated_at
    ? text('notConfigured')
    : !saved.value.enabled
      ? text('disabled')
      : text('savedUntested'),
)
function guardUnload(event: BeforeUnloadEvent) {
  if (dirty.value || busy.value) {
    event.preventDefault()
    event.returnValue = ''
  }
}
onBeforeRouteLeave(() => {
  if (dirty.value || busy.value) {
    errorKey.value = 'leaveWarning'
    return false
  }
})
onMounted(() => {
  controller.load()
  fetchLanguages()
  window.addEventListener('beforeunload', guardUnload)
})
onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', guardUnload)
  controller.clearSecrets()
})
</script>

<template>
  <div
    class="email-settings hse-identity"
    :dir="locale.startsWith('ar') ? 'rtl' : 'ltr'"
    :aria-busy="busy"
  >
    <RouterLink class="email-back" to="/organization/setting"
      ><EmailIcon name="arrow" :size="16" />{{ text('back') }}</RouterLink
    >
    <header class="email-heading">
      <div class="email-heading-content">
        <span class="email-hero-icon"><EmailIcon name="mail" :size="30" /></span>
        <div>
          <span class="email-eyebrow">{{ text('eyebrow') }}</span>
          <h1>{{ text('title') }}</h1>
          <p>{{ text('intro') }}</p>
        </div>
      </div>
      <div class="email-heading-meta">
        <span v-if="saved" class="email-status"><i aria-hidden="true"></i>{{ statusText }}</span>
        <div class="email-protocols" aria-hidden="true">
          <span>SMTP</span><span>TLS</span><span>IMAP</span>
        </div>
      </div>
    </header>
    <div v-if="error || errorKey" class="email-alert error" role="alert">
      {{ error || text(errorKey) }}
      <p v-if="saved && errorKey === 'saveFailed'">{{ text('conflictHelp') }}</p>
      <button v-if="!saved" type="button" :disabled="busy" @click="controller.load()">
        {{ text('reload') }}
      </button>
    </div>
    <p v-if="noticeKey" class="email-alert success" role="status">
      {{ text(noticeKey) }} <b v-if="checkedFolder" dir="ltr">{{ checkedFolder }}</b>
    </p>
    <p v-if="!saved && busy" role="status">{{ text('loading') }}</p>
    <template v-if="saved">
      <p v-if="!canManage" class="email-alert" role="status">{{ text('readOnly') }}</p>
      <form autocomplete="off" @submit.prevent="controller.save()">
        <fieldset :disabled="busy || !canManage">
          <section class="email-panel">
            <header>
              <span class="email-section-icon"
                ><EmailIcon name="server" /><small aria-hidden="true">01</small></span
              >
              <div>
                <h2>{{ text('serverTitle') }}</h2>
                <p>{{ text('serverIntro') }}</p>
              </div>
            </header>
            <div class="email-section-body">
              <div class="email-grid">
                <EmailField
                  id="smtp-host"
                  v-model="draft.host"
                  :label="text('smtpHost')"
                  required
                  :maxlength="253"
                  placeholder="smtp.example.com"
                />
                <div class="email-field">
                  <label for="smtp-security">{{ text('security') }} *</label>
                  <select
                    id="smtp-security"
                    v-model="draft.security"
                    @change="draft.port = draft.security === 'tls' ? 465 : 587"
                  >
                    <option value="starttls">STARTTLS</option>
                    <option value="tls">TLS</option>
                  </select>
                </div>
                <div class="email-field">
                  <label for="smtp-port">{{ text('port') }} *</label
                  ><select id="smtp-port" v-model.number="draft.port" dir="ltr">
                    <option v-for="port in ports" :key="port" :value="port">{{ port }}</option>
                  </select>
                </div>
                <EmailField
                  id="smtp-user"
                  v-model="draft.username"
                  :label="text('username')"
                  required
                  :maxlength="254"
                />
                <EmailField
                  id="smtp-password"
                  v-model="draft.password"
                  :label="text('smtpPassword')"
                  type="password"
                  :required="!saved.has_password"
                  :maxlength="2048"
                  autocomplete="new-password"
                  :placeholder="saved.has_password ? text('savedPassword') : ''"
                  :hint="text('passwordHint')"
                />
              </div>
            </div>
          </section>
          <section class="email-panel">
            <header>
              <span class="email-section-icon"
                ><EmailIcon name="sender" /><small aria-hidden="true">02</small></span
              >
              <div>
                <h2>{{ text('senderTitle') }}</h2>
                <p>{{ text('senderIntro') }}</p>
              </div>
            </header>
            <div class="email-section-body">
              <div class="email-grid">
                <div class="email-sender-name">
                  <LangTitleInput
                    :langs="languages"
                    :model-value="titles"
                    label="emailSettings.fromName"
                    :placeholder="text('fromName')"
                    :maxlength="160"
                    :required="!titles.some((item) => item.title.trim())"
                    :disabled="busy || !canManage"
                    :help-text="text('senderNameHint')"
                    @update:model-value="setTitles"
                  />
                </div>
                <EmailField
                  id="smtp-from-email"
                  v-model="draft.from_email"
                  :label="text('fromEmail')"
                  type="email"
                  required
                  :maxlength="254"
                />
                <EmailField
                  id="smtp-reply"
                  v-model="draft.reply_to"
                  :label="text('replyTo')"
                  type="email"
                  :maxlength="254"
                />
              </div>
            </div>
          </section>
          <section class="email-panel">
            <header>
              <span class="email-section-icon"
                ><EmailIcon name="folder" /><small aria-hidden="true">03</small></span
              >
              <div>
                <h2>{{ text('sentTitle') }}</h2>
                <p>{{ text('sentIntro') }}</p>
              </div>
            </header>
            <div class="email-section-body">
              <label class="email-toggle"
                ><input id="sent-enabled" v-model="draft.sent_copy.enabled" type="checkbox" />{{
                  text('sentEnabled')
                }}</label
              >
              <template v-if="draft.sent_copy.enabled">
                <div class="email-grid">
                  <EmailField
                    id="imap-host"
                    v-model="draft.sent_copy.host"
                    :label="text('imapHost')"
                    required
                    :maxlength="253"
                    placeholder="imap.example.com"
                  />
                  <div class="email-field">
                    <label for="imap-port">{{ text('portSecurity') }}</label
                    ><input id="imap-port" value="993 · TLS" readonly dir="ltr" />
                  </div>
                  <EmailField
                    id="imap-folder"
                    v-model="draft.sent_copy.folder"
                    :label="text('folder')"
                    :maxlength="255"
                    :hint="text('folderHint')"
                  />
                </div>
                <label class="email-toggle"
                  ><input
                    id="imap-reuse"
                    v-model="draft.sent_copy.use_smtp_credentials"
                    type="checkbox"
                  />{{ text('reuseCredentials') }}</label
                >
                <div v-if="!draft.sent_copy.use_smtp_credentials" class="email-grid">
                  <EmailField
                    id="imap-user"
                    v-model="draft.sent_copy.username"
                    :label="text('imapUsername')"
                    required
                    :maxlength="254"
                  />
                  <EmailField
                    id="imap-password"
                    v-model="draft.sent_copy.password"
                    :label="text('imapPassword')"
                    type="password"
                    :required="!saved.has_imap_password"
                    :maxlength="2048"
                    autocomplete="new-password"
                    :placeholder="saved.has_imap_password ? text('savedPassword') : ''"
                    :hint="text('passwordHint')"
                  />
                </div>
              </template>
              <p class="email-note">{{ text('sentSafety') }}</p>
              <dl class="email-counts">
                <div
                  v-for="count in ['saved', 'pending', 'failed'] as const"
                  :key="count"
                  :data-state="count"
                >
                  <dt>{{ text(count) }}</dt>
                  <dd>{{ saved.sent_copies[count] }}</dd>
                </div>
              </dl>
            </div>
          </section>
          <section class="email-panel">
            <header>
              <span class="email-section-icon"
                ><EmailIcon name="shield" /><small aria-hidden="true">04</small></span
              >
              <div>
                <h2>{{ text('protectTitle') }}</h2>
                <p>{{ text('protectIntro') }}</p>
              </div>
            </header>
            <div class="email-section-body">
              <label class="email-toggle"
                ><input id="email-enabled" v-model="enabled" type="checkbox" />{{
                  text('enabled')
                }}</label
              >
              <p class="email-note">{{ text('securityNote') }}</p>
              <EmailField
                id="smtp-confirm"
                v-model="currentPassword"
                :label="text('confirmPassword')"
                type="password"
                required
                autocomplete="current-password"
              />
              <div v-if="draft.sent_copy.enabled" class="email-secondary-actions">
                <button type="button" :disabled="!canCheck" @click="controller.sentAction('check')">
                  {{ text('checkSent') }}
                </button>
                <button
                  v-if="saved.sent_copies.failed"
                  type="button"
                  :disabled="!canCheck"
                  @click="controller.sentAction('retry')"
                >
                  {{ text('retrySent') }}
                </button>
                <small>{{ text('afterSave') }}</small>
              </div>
              <footer class="email-actions">
                <span role="status" :class="{ 'is-dirty': dirty }"
                  ><i aria-hidden="true"></i>{{ text(dirty ? 'unsaved' : 'noChanges') }}</span
                >
                <div>
                  <button type="button" :disabled="!dirty" @click="controller.reset()">
                    {{ text('discard') }}
                  </button>
                  <button class="email-primary" type="submit" :disabled="!dirty">
                    <EmailIcon name="save" :size="17" />{{ text(busy ? 'saving' : 'save') }}
                  </button>
                </div>
              </footer>
            </div>
          </section>
        </fieldset>
      </form>
      <button
        class="email-reload"
        type="button"
        :disabled="busy || dirty"
        @click="controller.load()"
      >
        <EmailIcon name="refresh" :size="16" />{{ text('reload') }}
      </button>
    </template>
  </div>
</template>
