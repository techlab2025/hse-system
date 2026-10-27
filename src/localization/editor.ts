import { translate } from './i18n'

/** PrimeVue emits this after Quill constructs its own toolbar controls. */
export function localizeEditorChrome(event: {
  instance: { container: HTMLElement; root: HTMLElement }
}) {
  event.instance.root.setAttribute('dir', 'auto')
  const root = event.instance.container.closest('[data-localized-editor]')
  if (!root) return
  for (const picker of root.querySelectorAll('.ql-picker')) {
    const label = picker.querySelector('.ql-picker-label')
    const name = picker.getAttribute('aria-label')
    if (label && name) label.setAttribute('aria-label', name)
    for (const item of picker.querySelectorAll('.ql-picker-item')) {
      const text = item.getAttribute('data-label')
      if (text) item.setAttribute('aria-label', text)
      else if (picker.classList.contains('ql-align')) {
        const value = item.getAttribute('data-value') || 'left'
        item.setAttribute('aria-label', translate(`editor.align_${value}`))
      }
    }
  }
  const linkInput = root.querySelector<HTMLInputElement>('.ql-tooltip input[type="text"]')
  if (linkInput) {
    linkInput.dir = 'ltr'
    linkInput.setAttribute('aria-label', translate('editor.url'))
    linkInput.setAttribute('data-video', translate('editor.videoUrl'))
  }
}
