<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

import IconSaudiArabia from '@/shared/icons/SA.vue'
import IconEnglish from '@/shared/icons/IconEnglish.vue'

const { locale, t } = useI18n({ useScope: 'global' })

const applyLangToDOM = (langCode: string) => {
  const direction = langCode === 'ar' ? 'rtl' : 'ltr'

  document.documentElement.lang = langCode
  document.documentElement.dir = direction

  // Language direction must never transform the application canvas.
  const applicationRoots = [document.documentElement, document.body, document.getElementById('app')]
  applicationRoots.forEach((element) => {
    element?.style.removeProperty('rotate')
    element?.style.removeProperty('transform')
  })
}

const targetLanguage = computed(() => (locale.value === 'ar' ? 'en' : 'ar'))
const targetLanguageIcon = computed(() =>
  targetLanguage.value === 'ar' ? IconSaudiArabia : IconEnglish,
)
const targetLanguageLabel = computed(() =>
  targetLanguage.value === 'ar' ? t('switch_to_arabic') : t('switch_to_english'),
)

const changeLang = (langCode: string) => {
  if (locale.value === langCode) return

  locale.value = langCode
  localStorage.setItem('lang', langCode)
  applyLangToDOM(langCode)
  window.location.reload()
}

const initializeLang = () => {
  const savedLang = localStorage.getItem('lang') || 'en'

  locale.value = savedLang
  applyLangToDOM(savedLang)
}

onMounted(() => {
  initializeLang()
})
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
