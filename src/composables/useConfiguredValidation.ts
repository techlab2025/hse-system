import { getCurrentInstance, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { formValidation } from '@/shared/config/formValidation'
import { OpenWarningDilaog } from '@/base/Presentation/utils/OpenWarningDialog'

export interface RequiredFormField {
  key: string
  message: string
  isMissing: () => boolean
}

/** Used by both create/edit forms and Save & New. Settings live in formValidation.ts. */
export function useConfiguredValidation(form: string) {
  const { t, te } = useI18n({ useScope: 'global' })
  const instance = getCurrentInstance()
  const configureRules = <T extends RequiredFormField>(rules: T[]): T[] => {
    const settings = formValidation.forms[form]
    if (!formValidation.enabled || settings?.enabled === false) return []
    return rules
      .filter((rule) => settings?.fields[rule.key]?.enabled !== false)
      .map((rule) => {
        const message = settings?.fields[rule.key]?.message
        return { ...rule, message: message ? (te(message) ? t(message) : message) : rule.message }
      })
  }

  const showErrors = async (errors: Record<string, string>) => {
    const firstKey = Object.keys(errors)[0]
    if (!firstKey) return true
    new OpenWarningDilaog(errors[firstKey]!).openDialog()
    await nextTick()
    // Search this component's DOM first, including fragment roots inside nested dialogs.
    const vnode = instance?.subTree
    const start = vnode?.el as Node | undefined
    const end = vnode?.anchor as Node | undefined
    const roots: Element[] = []
    let node: Node | null | undefined = start
    while (node) {
      if (node instanceof Element) roots.push(node)
      if (!end || node === end) break
      node = node.nextSibling
    }
    const fields = roots.flatMap((root) => [
      root,
      ...root.querySelectorAll('[data-required-field]'),
    ])
    const field = fields.find((element) => element.getAttribute('data-required-field') === firstKey)
    field?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    const input = field?.querySelector<HTMLElement>(
      'input:not([disabled]), select, textarea, [tabindex="0"]',
    )
    input?.focus({ preventScroll: true })
    return false
  }

  return { configureRules, showErrors }
}
