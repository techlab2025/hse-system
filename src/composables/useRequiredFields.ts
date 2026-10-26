import { computed, ref, watch } from 'vue'
import { useConfiguredValidation, type RequiredFormField } from './useConfiguredValidation'

/** Field conditions stay with the form; switches and messages live in formValidation.ts. */
export function useRequiredFields(form: string, getRules: () => RequiredFormField[]) {
  const { configureRules, showErrors } = useConfiguredValidation(form)
  const requiredFieldErrors = ref<Record<string, string>>({})
  const failures = computed(() => configureRules(getRules()).filter((rule) => rule.isMissing()))
  watch(failures, (rules) => {
    const remaining = new Map(rules.map((rule) => [rule.key, rule.message]))
    requiredFieldErrors.value = Object.fromEntries(
      Object.keys(requiredFieldErrors.value)
        .filter((key) => remaining.has(key))
        .map((key) => [key, remaining.get(key)!]),
    )
  })
  const validateRequiredFields = async () => {
    requiredFieldErrors.value = Object.fromEntries(
      failures.value.map((rule) => [rule.key, rule.message]),
    )
    return showErrors(requiredFieldErrors.value)
  }
  return {
    requiredFieldErrors,
    getFieldError: (key: string) => requiredFieldErrors.value[key] ?? '',
    validateRequiredFields,
  }
}

/** Selects may hold one object or an array; an unselected placeholder has no usable id. */
export function hasSelectedValue(value: unknown): boolean {
  if (Array.isArray(value)) return value.some(hasSelectedValue)
  if (value && typeof value === 'object' && 'id' in value) return Number(value.id) > 0
  return typeof value === 'number' && value > 0
}
