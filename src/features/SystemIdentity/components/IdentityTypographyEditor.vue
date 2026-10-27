<script setup lang="ts">
import { translate as localizeUi } from '@/localization/i18n'

import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSystemIdentity } from '@/composables/useSystemIdentity'
import {
  defaultTypography,
  fontStack,
  googleFonts,
  normalizeFontFamily,
  setGoogleFont,
  type Typography,
} from '../typography'

const { locale } = useI18n()
const model = defineModel<Typography>({ required: true })
const { identity } = useSystemIdentity()
const customFont = ref('')
const fontMessage = ref('')
const fontState = ref('')
const fonts = computed(() => [
  ...new Set<string>([...googleFonts, ...(model.value.fontFamily ? [model.value.fontFamily] : [])]),
])
const addFont = () => {
  const name = normalizeFontFamily(customFont.value)
  if (!name) {
    fontMessage.value = localizeUi('Enter a Google Fonts family name, such as Noto Sans or Cairo.')
    return
  }
  model.value.fontFamily = name
  customFont.value = ''
  fontMessage.value = ''
}
const setSize = (event: Event, key: 'fontSize' | 'headingSize', min: number, max: number) => {
  const input = event.target as HTMLInputElement
  const size = Number(input.value)
  model.value[key] =
    input.value && Number.isFinite(size) ? Math.min(max, Math.max(min, Math.round(size))) : null
  input.value = model.value[key]?.toString() ?? ''
}
watch(
  () => model.value.fontFamily,
  (family, _, onCleanup) => {
    const link = setGoogleFont(family, 'preview')
    fontState.value = link?.dataset.state ?? ''
    if (!link) return
    const update = () => {
      fontState.value = link.dataset.state ?? ''
    }
    link.addEventListener('load', update)
    link.addEventListener('error', update)
    onCleanup(() => {
      link.removeEventListener('load', update)
      link.removeEventListener('error', update)
    })
  },
  { immediate: true },
)
onBeforeUnmount(() => setGoogleFont('', 'preview'))
</script>

<template>
  <section class="identity-editor identity-typography-editor">
    <div class="identity-editor-heading">
      <div>
        <h2>{{ $t('Typography') }}</h2>
        <p>
          {{
            $t(
              'Choose a Google font and customize text sizes and colors. Save to apply your changes.',
            )
          }}
        </p>
      </div>
      <button type="button" @click="model = defaultTypography()">
        {{ $t('Restore default typography') }}
      </button>
    </div>
    <div class="identity-typography-grid">
      <div class="identity-typography-field">
        <label for="identity-font-family">{{ $t('Font family') }}</label>
        <select id="identity-font-family" v-model="model.fontFamily">
          <option value="">{{ $t('System default') }}</option>
          <option v-for="family in fonts" :key="family" :value="family">{{ family }}</option>
        </select>
        <small>{{
          $t(
            'Includes English and Arabic fonts. Google fonts load when selected; system fonts remain as a fallback.',
          )
        }}</small>
      </div>
      <div class="identity-typography-field">
        <label for="identity-custom-font">{{ $t('Add a Google Fonts family') }}</label>
        <div class="identity-typography-input-row">
          <input
            dir="auto"
            id="identity-custom-font"
            v-model="customFont"
            type="text"
            maxlength="80"
            :placeholder="$t('For example, Noto Sans')"
            @keydown.enter.prevent="addFont"
          />
          <button type="button" @click="addFont">{{ $t('Add font') }}</button>
        </div>
        <a href="https://fonts.google.com/" target="_blank" rel="noopener noreferrer">{{
          $t('Browse Google Fonts')
        }}</a>
        <small v-if="fontMessage" role="alert">{{ fontMessage }}</small>
      </div>
      <div
        v-for="field in [
          { key: 'fontSize' as const, label: 'Body font size', min: 12, max: 24 },
          { key: 'headingSize' as const, label: 'Page heading size', min: 18, max: 48 },
        ]"
        :key="field.key"
        class="identity-typography-field"
      >
        <label :for="`identity-${field.key}`">{{ $t(field.label) }} {{ $t('(px)') }}</label>
        <div class="identity-typography-input-row">
          <input
            dir="ltr"
            :id="`identity-${field.key}`"
            type="number"
            :min="field.min"
            :max="field.max"
            step="1"
            :value="model[field.key] ?? ''"
            :placeholder="$t('Default')"
            @change="setSize($event, field.key, field.min, field.max)"
          />
          <button
            type="button"
            :disabled="model[field.key] === null"
            @click="model[field.key] = null"
          >
            {{ $t('Default') }}
          </button>
        </div>
        <small
          >{{ field.min }}–{{ field.max }} {{ $t('px.') }}
          {{
            field.key === 'headingSize'
              ? $t('Section headings scale with the page heading.')
              : $t('Used for body text, labels, buttons, and fields.')
          }}
          {{ $t('Clear to use the default.') }}</small
        >
      </div>
      <div
        v-for="field in [
          { key: 'fontColor' as const, label: 'Body text color', fallback: '#10243f' },
          { key: 'headingColor' as const, label: 'Heading text color', fallback: '#10243f' },
        ]"
        :key="field.key"
        class="identity-color-field"
      >
        <label :for="`identity-${field.key}`">{{ $t(field.label) }}</label>
        <div class="identity-color-inputs">
          <input
            :id="`identity-${field.key}`"
            type="color"
            :value="model[field.key] || field.fallback"
            @input="model[field.key] = ($event.target as HTMLInputElement).value"
          />
          <span>{{ model[field.key] || $t('Default') }}</span>
          <button type="button" :disabled="!model[field.key]" @click="model[field.key] = ''">
            {{ $t('Default') }}
          </button>
        </div>
      </div>
    </div>
    <p class="identity-typography-note">
      {{
        $t(
          'Section, tag, button, header, sidebar, and input colors keep their individual settings.',
        )
      }}
    </p>
    <p v-if="fontState === 'error'" role="alert">
      {{
        $t(
          'This font could not be loaded from Google. Check its family name or your connection. The system fallback font is being used.',
        )
      }}
    </p>
    <div
      class="identity-typography-sample"
      :style="{
        fontFamily: fontStack(model.fontFamily) || 'var(--hse-control-font)',
        fontSize: model.fontSize ? `${model.fontSize}px` : '14px',
        color: model.fontColor || 'var(--hse-project-ink)',
      }"
    >
      <div
        class="identity-typography-sample-heading"
        :style="{
          fontSize: model.headingSize ? `${model.headingSize}px` : '28px',
          color: model.headingColor || 'var(--hse-project-ink)',
        }"
      >
        {{ identity.name }}
      </div>
      <p class="identity-typography-sample-body">{{ $t('Manage your workplace with clarity.') }}</p>
      <p v-if="locale === 'ar'" class="identity-typography-sample-arabic" lang="ar" dir="rtl">
        {{ $t('إدارة السلامة والصحة المهنية في مكان العمل') }}
      </p>
    </div>
  </section>
</template>
