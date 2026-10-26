import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { documentationLabels, type GuideText } from './guides'

export function useDocumentation() {
  const { locale } = useI18n()
  const language = computed(() => (locale.value.startsWith('ar') ? 'ar' : 'en'))
  const labels = computed(() => documentationLabels[language.value])
  const text = (value: GuideText) => value[language.value]
  return { labels, text }
}
