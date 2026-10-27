import { useI18n } from 'vue-i18n'
import type en from '@/locales/en.json'
type Label = keyof typeof en.projectUi

export function useProjectLabels() {
  const { t } = useI18n()
  return (key: Label) => t(`projectUi.${key}`)
}
