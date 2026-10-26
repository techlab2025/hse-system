import { useI18n } from 'vue-i18n'
import { ClassValidation } from '@/base/Presentation/utils/class_validation'
import { formValidation, requestValidation } from '@/shared/config/formValidation'
import { OpenWarningDilaog } from '@/base/Presentation/utils/OpenWarningDialog'
import { useValidationFieldHighlight } from './useValidationFieldHighlight'

/** Guard request-backed forms before loading, saving, resetting, or navigating. */
export function useSubmissionValidation(configurationKey: string) {
  const { t, te } = useI18n({ useScope: 'global' })
  const { highlightErrors, clear } = useValidationFieldHighlight()
  return async (params: object | null | undefined): Promise<boolean> => {
    clear()
    const settings = requestValidation[configurationKey]
    if (
      !formValidation.enabled ||
      settings?.enabled === false ||
      (settings?.form && formValidation.forms[settings.form]?.enabled === false)
    )
      return true

    const result = new ClassValidation(configurationKey).validate(params)
    if (!params || !result.isValid) {
      await highlightErrors(
        result.errors,
        Object.fromEntries(
          Object.entries(settings?.fields ?? {}).map(([key, rule]) => [key, rule.formField || key]),
        ),
      )
      const message = result.errors[0]?.message || formValidation.emptyFormMessage
      new OpenWarningDilaog(te(message) ? t(message) : message).openDialog()
      return false
    }
    return true
  }
}
