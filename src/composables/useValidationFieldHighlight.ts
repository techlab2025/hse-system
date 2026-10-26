import { getCurrentInstance, nextTick, onBeforeUnmount } from 'vue'
import type { ValidationFieldError } from '@/base/Presentation/utils/class_validation'

const controlsSelector =
  'input:not([type="hidden"]):not([type="button"]):not([type="submit"]),' +
  'textarea, select, .p-select, .p-multiselect, .p-autocomplete'
const normalizeKey = (key: string) => key.replace(/[^a-z0-9]/gi, '').toLowerCase()

/** Highlight request errors when a form does not render its own inline error messages. */
export function useValidationFieldHighlight() {
  const instance = getCurrentInstance()
  const cleanups = new Map<HTMLElement, () => void>()
  const clear = () => {
    for (const cleanup of cleanups.values()) cleanup()
    cleanups.clear()
  }
  onBeforeUnmount(clear)

  const highlightErrors = async (
    errors: ValidationFieldError[],
    aliases: Record<string, string> = {},
  ) => {
    clear()
    await nextTick()
    let vnode = instance?.subTree
    while (vnode?.component) vnode = vnode.component.subTree
    const roots: HTMLElement[] = []
    let node: Node | null | undefined = vnode?.el
    const end = vnode?.anchor as Node | undefined
    while (node) {
      if (node instanceof HTMLElement) roots.push(node)
      if (!end || node === end) break
      node = node.nextSibling
    }
    const controls = roots.flatMap((root) => [
      ...(root.matches(controlsSelector) ? [root] : []),
      ...root.querySelectorAll<HTMLElement>(controlsSelector),
    ])
    const fields = roots.flatMap((root) => [
      root,
      ...root.querySelectorAll<HTMLElement>('[data-required-field]'),
    ])
    for (const { field } of errors) {
      const key = normalizeKey(aliases[field] || field)
      const wrappers = fields.filter(
        (element) => normalizeKey(element.dataset.requiredField || '') === key,
      )
      const matches = new Set(
        wrappers.flatMap((wrapper) => [...wrapper.querySelectorAll<HTMLElement>(controlsSelector)]),
      )
      for (const control of controls) {
        if (
          [control.id, control.getAttribute('name') || ''].some(
            (name) => normalizeKey(name) === key,
          ) ||
          (['translation', 'translations', 'langs', 'title'].includes(key) &&
            control.classList.contains('lang-input'))
        )
          matches.add(control)
      }
      for (const control of matches) {
        if (control.matches(':disabled, .p-disabled') || cleanups.has(control)) continue
        const previousInvalid = control.getAttribute('aria-invalid')
        control.classList.add('form-validation-invalid')
        control.setAttribute('aria-invalid', 'true')
        const cleanup = () => {
          control.classList.remove('form-validation-invalid')
          if (previousInvalid === null) control.removeAttribute('aria-invalid')
          else control.setAttribute('aria-invalid', previousInvalid)
          control.removeEventListener('input', edited)
          control.removeEventListener('change', edited)
        }
        const edited = () => {
          cleanup()
          cleanups.delete(control)
        }
        cleanups.set(control, cleanup)
        control.addEventListener('input', edited)
        control.addEventListener('change', edited)
      }
    }
  }
  return { highlightErrors, clear }
}
