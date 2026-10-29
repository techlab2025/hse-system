<script setup lang="ts">
import { computed } from 'vue'
import { setLocale } from '@/localization/i18n'
import { useI18n } from 'vue-i18n'

import IconIraq from '@/shared/icons/IQ.vue'
import IconEnglish from '@/shared/icons/IconEnglish.vue'

const { locale, t } = useI18n({ useScope: 'global' })

const targetLanguage = computed(() => (locale.value === 'ar' ? 'en' : 'ar'))
const targetLanguageIcon = computed(() =>
  targetLanguage.value === 'ar' ? IconIraq : IconEnglish,
)
const targetLanguageLabel = computed(() =>
  targetLanguage.value === 'ar' ? t('switch_to_arabic') : t('switch_to_english'),
)

const changeLang = (langCode: string) => setLocale(langCode)
</script>

<template>
  <div class="flex items-center justify-center">
    <button
      type="button"
      :aria-label="targetLanguageLabel"
      :title="targetLanguageLabel"
      @click="changeLang(targetLanguage)"
      class="w-[70%] h-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition"
    >
      <component :is="targetLanguageIcon" class="w-5 h-5" />
    </button>
  </div>
</template>
