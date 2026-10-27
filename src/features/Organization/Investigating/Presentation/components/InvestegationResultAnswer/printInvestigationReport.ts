import { translate as localizeUi } from '@/localization/i18n'
import printStyles from './investigation-report-print.css?raw'

/** Print a snapshot of the report without the surrounding application. */
export async function printInvestigationReport(report: HTMLElement, title: string) {
  const frame = document.createElement('iframe')
  frame.title = 'Investigation report print preview'
  frame.tabIndex = -1
  frame.setAttribute('aria-hidden', 'true')
  frame.style.cssText = 'position:fixed;left:-10000px;top:0;width:900px;height:1px;border:0;'
  let loadTimeout: ReturnType<typeof setTimeout> | undefined

  try {
    const snapshot = report.cloneNode(true) as HTMLElement
    snapshot
      .querySelectorAll(
        '[data-report-no-print], button, .show-all-btn, .meeting-link, .p-dialog-mask, .p-image-preview-mask',
      )
      .forEach((node) => node.remove())
    snapshot.querySelectorAll('img').forEach((image) => {
      image.loading = 'eager'
    })
    const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
      .map((style) => style.outerHTML)
      .join('')
    const loaded = new Promise<void>((resolve, reject) => {
      frame.onload = () => resolve()
      frame.onerror = () => reject(new Error(localizeUi('Unable to load the print preview.')))
      loadTimeout = setTimeout(
        () => reject(new Error(localizeUi('Print preview timed out.'))),
        30_000,
      )
    })
    frame.srcdoc = `<!doctype html><html><head><meta charset="utf-8">${styles}
      <style>${printStyles}</style></head><body class="investigation-print">
      ${snapshot.outerHTML}</body></html>`
    document.body.appendChild(frame)
    await loaded
    clearTimeout(loadTimeout)
    const printWindow = frame.contentWindow
    if (!printWindow) throw new Error(localizeUi('Unable to open the print preview.'))
    printWindow.document.title = title
    printWindow.document.documentElement.lang = report.lang || document.documentElement.lang || 'en'
    printWindow.document.documentElement.dir = getComputedStyle(report).direction
    await printWindow.document.fonts.ready
    printWindow.addEventListener('afterprint', () => frame.remove(), { once: true })
    printWindow.focus()
    printWindow.print()
    // Clean up in browsers that do not dispatch afterprint for embedded documents.
    window.setTimeout(() => frame.remove(), 60_000)
  } catch (error) {
    frame.remove()
    throw error
  } finally {
    clearTimeout(loadTimeout)
  }
}
