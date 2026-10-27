import { translate } from '@/localization/i18n'
import { ref } from 'vue'

// composables/usePrint.ts
export function usePrint(options: { isolated?: boolean } = {}) {
  const printArea = ref<HTMLElement | null>(null)

  const print = async (): Promise<void> => {
    if (!printArea.value) return

    if (options.isolated) {
      const frame = document.createElement('iframe')
      frame.title = translate('Equipment identification label')
      frame.style.cssText =
        'position:fixed;width:1px;height:1px;inset:0;border:0;opacity:0;pointer-events:none'
      document.body.appendChild(frame)
      const printDocument = frame.contentDocument
      const printWindow = frame.contentWindow
      if (!printDocument || !printWindow) {
        frame.remove()
        return
      }
      printDocument.open()
      printDocument.write('<!doctype html><html><head></head><body></body></html>')
      printDocument.close()
      printDocument.body.style.margin = '0'
      printDocument.documentElement.lang = document.documentElement.lang
      printDocument.documentElement.dir = document.documentElement.dir
      const base = printDocument.createElement('base')
      base.href = document.baseURI
      printDocument.head.appendChild(base)
      const stylesReady = [...document.querySelectorAll('style, link[rel="stylesheet"]')].map(
        (node) => {
          const clone = node.cloneNode(true) as HTMLElement
          const ready =
            clone.tagName === 'LINK'
              ? new Promise<void>((resolve) => {
                  clone.onload = () => resolve()
                  clone.onerror = () => resolve()
                })
              : Promise.resolve()
          printDocument.head.appendChild(clone)
          return ready
        },
      )
      printDocument.body.appendChild(printArea.value.cloneNode(true))
      await Promise.all(stylesReady)
      await printDocument.fonts.ready
      await Promise.all(
        [...printDocument.images].map((image) =>
          image.complete
            ? Promise.resolve()
            : new Promise<void>((resolve) => {
                image.onload = () => resolve()
                image.onerror = () => resolve()
              }),
        ),
      )
      const cleanup = () => frame.remove()
      printWindow.addEventListener('afterprint', cleanup, { once: true })
      printWindow.focus()
      printWindow.print()
      return
    }

    const original = document.body.innerHTML
    document.body.innerHTML = printArea.value.outerHTML

    window.print()

    // Restore and force Vue to re-mount
    document.body.innerHTML = original
    window.location.reload() // or use a more graceful restore
  }

  return { printArea, print }
}
