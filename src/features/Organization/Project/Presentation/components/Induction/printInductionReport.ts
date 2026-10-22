import reportStyles from './induction-report-print.css?raw'

/** Print a standalone report; application styles and navigation are excluded. */
export async function printInductionReport(report: HTMLElement, title: string) {
  const frame = document.createElement('iframe')
  frame.title = title
  frame.tabIndex = -1
  frame.setAttribute('aria-hidden', 'true')
  frame.style.cssText = 'position:fixed;left:-10000px;top:0;width:900px;height:1px;border:0;'
  let timeout: ReturnType<typeof setTimeout> | undefined
  try {
    const loaded = new Promise<void>((resolve, reject) => {
      frame.onload = () => resolve()
      frame.onerror = () => reject(new Error('Unable to load report'))
      timeout = setTimeout(() => reject(new Error('Print preview timed out')), 30_000)
    })
    frame.srcdoc = `<!doctype html><html><head><meta charset="utf-8">
      <style>${reportStyles}</style></head><body>${report.outerHTML}</body></html>`
    document.body.appendChild(frame)
    await loaded
    clearTimeout(timeout)
    const printWindow = frame.contentWindow
    if (!printWindow) throw new Error('Unable to open print preview')
    printWindow.document.title = title
    printWindow.document.documentElement.lang = report.lang || 'en'
    printWindow.document.documentElement.dir = report.dir || 'ltr'
    await printWindow.document.fonts.ready
    printWindow.addEventListener('afterprint', () => frame.remove(), { once: true })
    printWindow.focus()
    printWindow.print()
    // Fallback for browsers that do not emit afterprint for embedded documents.
    window.setTimeout(() => frame.remove(), 60_000)
  } catch (error) {
    frame.remove()
    throw error
  } finally {
    clearTimeout(timeout)
  }
}
