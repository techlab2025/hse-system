import html2canvas from 'html2canvas-pro'
import jsPDF from 'jspdf'

export interface PdfReportIdentity {
  name: string
  logo?: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
}

export interface PdfReportOptions {
  target: HTMLElement
  title: string
  filename: string
  identity: PdfReportIdentity
  organization?: string
  orientation?: 'portrait' | 'landscape'
  margin?: number
  exportedAt?: Date
}

export interface PdfBlock {
  start: number
  end: number
}

/** Remove UI actions from the capture clone, keeping table columns aligned. */
export function removePdfActions(target: HTMLElement) {
  const actionLabel = /^(actions?|الإجراءات|الاجراءات|إجراءات|اجراءات)$/i
  const actionMarker = '[data-pdf-actions], .action-column, .actions-column, .list-trigger'
  const tables = [...target.querySelectorAll<HTMLTableElement>('table')]
  if (target.matches('table')) tables.unshift(target as HTMLTableElement)

  for (const table of tables) {
    const removedColumns = new Set<number>()
    const cells: { cell: HTMLTableCellElement; start: number; span: number }[] = []
    // Track occupied columns for rowspans, including grouped table headers.
    for (const section of Array.from(table.children)) {
      if (!section.matches('thead, tbody, tfoot')) continue
      const occupied: number[] = []
      const rows = Array.from(section.children).filter((row) => row.matches('tr'))
      rows.forEach((row, rowIndex) => {
        let column = 0
        for (const cell of Array.from((row as HTMLTableRowElement).cells)) {
          while ((occupied[column] ?? 0) > rowIndex) column++
          const span = cell.colSpan
          const labels = [cell.dataset.label, cell.getAttribute('aria-label')]
          if (cell.tagName === 'TH') labels.push(cell.textContent)
          const hasAction =
            labels.some((label) => actionLabel.test(label?.trim() ?? '')) ||
            cell.matches(actionMarker) ||
            [...cell.querySelectorAll(actionMarker)].some((node) => node.closest('table') === table)
          cells.push({ cell, start: column, span })
          for (let offset = 0; offset < span; offset++) {
            occupied[column + offset] = cell.rowSpan === 0 ? rows.length : rowIndex + cell.rowSpan
            if (hasAction) removedColumns.add(column + offset)
          }
          column += span
        }
      })
    }
    const remainingSpan = (start: number, span: number) =>
      Array.from({ length: span }, (_, offset) => start + offset).filter(
        (column) => !removedColumns.has(column),
      ).length
    for (const { cell, start, span } of cells) {
      const remaining = remainingSpan(start, span)
      if (!remaining) cell.remove()
      else if (remaining !== span) cell.colSpan = remaining
    }
    let column = 0
    for (const group of Array.from(table.children).filter((node) => node.matches('colgroup'))) {
      const columns = group.children.length ? Array.from(group.children) : [group]
      for (const node of columns) {
        const col = node as HTMLTableColElement
        const span = col.span
        const remaining = remainingSpan(column, span)
        if (!remaining) col.remove()
        else if (remaining !== span) col.span = remaining
        column += span
      }
    }
  }

  target
    .querySelectorAll(
      'button, [role="button"], input[type="button"], input[type="submit"], ' +
        'input[type="reset"], input[type="image"], .btn, .p-button, .list-trigger, ' +
        '.form-actions, .header-actions, .report-page-actions, .actions-list-controls, ' +
        '.actions-wrapper, .actions-container, [data-pdf-actions], ' +
        '[data-pdf-exclude], [data-html2canvas-ignore]',
    )
    .forEach((node) => node.remove())
}

/** Keep ordinary rows/paragraphs intact; oversized blocks can span pages. */
export function paginateReport(height: number, pageHeight: number, blocks: PdfBlock[] = []) {
  if (height <= 0 || pageHeight < 1) throw new Error('Invalid PDF page dimensions.')
  const pages: PdfBlock[] = []
  let start = 0
  while (start < height) {
    // A fractional-pixel border must not create an otherwise empty final page.
    let end = height - start <= pageHeight + 2 ? height : start + Math.floor(pageHeight)
    if (end < height) {
      let adjusted = true
      while (adjusted) {
        const crossing = blocks.filter(
          (block) =>
            block.start > start + 1 &&
            block.start < end &&
            block.end > end + 1 &&
            block.end - block.start <= pageHeight,
        )
        const next = crossing.length
          ? Math.max(start + 1, Math.floor(Math.min(...crossing.map((block) => block.start))))
          : end
        adjusted = next < end
        end = next
      }
    }
    pages.push({ start, end })
    start = end
  }
  return pages
}

const reportStyles = `
.hse-pdf-content {
  --PrimaryColor: var(--pdf-primary);
  --identity-primary: var(--pdf-primary);
  --identity-secondary: var(--pdf-secondary);
  --identity-accent: var(--pdf-accent);
  --main-border: #dce3ed;
  --surface-1: #ffffff; --surface-2: #f3f6fa; --surface-3: #eaf0f7;
  --surface-ground: #f3f6fa; --card-bg: #ffffff;
  --text-primary: #172334; --text-strong: #172334;
  --text-soft: #526176; --text-muted: #526176;
  background: #ffffff !important; color: #172334 !important;
  border: 0 !important; box-shadow: none !important;
  overflow: visible !important; max-height: none !important;
}
.hse-pdf-content *, .hse-pdf-content *::before, .hse-pdf-content *::after {
  animation: none !important; transition: none !important;
  caret-color: transparent !important;
}
.hse-pdf-content .report-plan, .hse-pdf-content .planned,
.hse-pdf-content input:disabled, .hse-pdf-content select:disabled {
  opacity: 1 !important; color: #172334 !important;
}
.hse-pdf-content table { border-collapse: collapse !important; width: 100% !important; }
.hse-pdf-content th {
  background: var(--pdf-secondary) !important; color: #ffffff !important;
  font-weight: 700 !important; padding: 12px !important;
  border: 1px solid var(--pdf-secondary) !important;
}
.hse-pdf-content td { padding: 11px 12px !important; border-bottom: 1px solid #dce3ed !important; }
.hse-pdf-content tbody tr:nth-child(even) td { background: #f3f6fa !important; }
.hse-pdf-content tbody tr:nth-child(odd) td { background: #ffffff !important; }
.hse-pdf-content h1, .hse-pdf-content h2, .hse-pdf-content h3 { color: var(--pdf-secondary) !important; }
.hse-pdf-content .report-section, .hse-pdf-content .audit-section,
.hse-pdf-content .report-preview, .hse-pdf-content [data-pdf-card] {
  background: #ffffff !important; border: 1px solid #dce3ed !important;
  box-shadow: none !important; border-radius: 12px !important;
}
.hse-pdf-content .report-board-header { grid-template-columns: 1fr !important; }
.hse-pdf-content .pdf-field-value { white-space: pre-wrap; overflow-wrap: anywhere; padding: 10px 12px; }
.hse-pdf-chrome { box-sizing: border-box; color: #172334; font-family: inherit; }
.hse-pdf-chrome * { box-sizing: border-box; margin: 0; }
.hse-pdf-chrome .pdf-header {
  height: 154px; padding: 24px 28px; display: flex; align-items: center; gap: 20px;
  background: linear-gradient(115deg, var(--pdf-secondary), var(--pdf-primary));
  border-bottom: 6px solid var(--pdf-accent); border-radius: 14px 14px 0 0; color: white;
}
.hse-pdf-chrome .pdf-logo {
  display: flex; align-items: center; justify-content: center; flex: 0 0 64px;
  height: 64px; padding: 8px; border-radius: 14px; background: #ffffff;
  color: var(--pdf-primary); font: 800 22px Arial, sans-serif;
}
.hse-pdf-chrome .pdf-logo img { max-width: 100%; max-height: 100%; object-fit: contain; }
.hse-pdf-chrome .pdf-heading { flex: 1; min-width: 0; }
.hse-pdf-chrome .pdf-brand { font-size: 12px; line-height: 18px; opacity: .88; }
.hse-pdf-chrome .pdf-title {
  font-size: 24px; line-height: 31px; font-weight: 700; color: #ffffff;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}
.hse-pdf-chrome .pdf-organization { font-size: 12px; line-height: 18px; opacity: .9; }
.hse-pdf-chrome .pdf-date { flex: 0 0 168px; border-left: 1px solid #ffffff55; padding-left: 20px; }
.hse-pdf-chrome .pdf-date-label { font: 600 10px/18px Arial, sans-serif; letter-spacing: 1.6px; }
.hse-pdf-chrome .pdf-date-value { font: 700 16px/24px Arial, sans-serif; }
.hse-pdf-chrome .pdf-time { font: 400 10px/18px Arial, sans-serif; opacity: .85; }
.hse-pdf-chrome .pdf-footer {
  height: 48px; border-top: 2px solid var(--pdf-primary); display: flex;
  align-items: center; justify-content: space-between; gap: 18px;
  color: #526176; font-size: 11px; background: white;
}
.hse-pdf-chrome .pdf-footer-brand { font-weight: 700; color: var(--pdf-secondary); }
`

function element(tag: string, className: string, text?: string) {
  const node = document.createElement(tag)
  node.className = className
  if (text) node.textContent = text
  return node
}

function setColors(node: HTMLElement, identity: PdfReportIdentity) {
  node.style.setProperty('--pdf-primary', identity.primaryColor)
  node.style.setProperty('--pdf-secondary', identity.secondaryColor)
  node.style.setProperty('--pdf-accent', identity.accentColor)
}

async function createChrome(options: PdfReportOptions, width: number) {
  const host = element('div', 'hse-pdf-chrome')
  host.setAttribute('aria-hidden', 'true')
  host.style.cssText = `position:fixed;left:-20000px;top:0;width:${width}px;pointer-events:none;`
  host.style.fontFamily = getComputedStyle(document.body).fontFamily
  setColors(host, options.identity)
  const style = document.createElement('style')
  style.textContent = reportStyles
  host.append(style)

  const date = options.exportedAt ?? new Date()
  const dateText = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
  const timeText = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  }).format(date)
  const header = element('header', 'pdf-header')
  const logo = element('div', 'pdf-logo', 'HSE')
  const heading = element('div', 'pdf-heading')
  heading.append(element('p', 'pdf-brand', `${options.identity.name}  /  HSE REPORT`))
  const title = element('h1', 'pdf-title', options.title)
  title.dir = 'auto'
  heading.append(title)
  if (options.organization) {
    const organization = element('p', 'pdf-organization', options.organization)
    organization.dir = 'auto'
    heading.append(organization)
  }
  const stamp = element('div', 'pdf-date')
  stamp.append(element('p', 'pdf-date-label', 'EXPORTED ON'))
  stamp.append(element('p', 'pdf-date-value', dateText))
  stamp.append(element('p', 'pdf-time', timeText))
  header.append(logo, heading, stamp)
  const footer = element('footer', 'pdf-footer')
  footer.append(element('span', 'pdf-footer-brand', 'HSE  /  Health · Safety · Environment'))
  footer.append(element('span', '', dateText))
  host.append(header, footer)
  document.body.append(host)

  if (options.identity.logo) {
    const image = new Image()
    image.crossOrigin = 'anonymous'
    image.alt = ''
    const loaded = await new Promise<boolean>((resolve) => {
      const timeout = window.setTimeout(() => resolve(false), 4000)
      const finish = (value: boolean) => {
        window.clearTimeout(timeout)
        resolve(value)
      }
      image.onload = () => finish(true)
      image.onerror = () => finish(false)
      image.src = options.identity.logo!
    })
    if (loaded) logo.replaceChildren(image)
  }
  return { host, header, footer }
}

/** Shared by table exports and composed report exports; live page styles are never changed. */
export async function exportBrandedPdf(options: PdfReportOptions): Promise<void> {
  if (!options.target.isConnected)
    throw new Error('The report is no longer available. Please try again.')
  await document.fonts.ready
  const pdf = new jsPDF({
    orientation: options.orientation ?? 'landscape',
    unit: 'mm',
    format: 'a4',
    compress: true,
  })
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  const margin = Math.min(24, Math.max(8, options.margin ?? 12))
  const width = pageWidth - margin * 2
  const headerHeight = 38.5
  const footerHeight = 12
  const bodyTop = margin + headerHeight + 7
  const bodyHeight = pageHeight - bodyTop - margin - footerHeight - 6
  const marker = `pdf-${Date.now()}-${Math.random().toString(36).slice(2)}`
  const previousMarker = options.target.getAttribute('data-pdf-capture')
  options.target.setAttribute('data-pdf-capture', marker)
  let chrome: Awaited<ReturnType<typeof createChrome>> | undefined
  let blocks: PdfBlock[] = []
  let captureWidth = 0

  try {
    chrome = await createChrome(options, Math.round(width * 4))
    const capture = {
      scale: 2,
      useCORS: true,
      allowTaint: false,
      backgroundColor: '#ffffff',
      logging: false,
    }
    const headerCanvas = await html2canvas(chrome.header, capture)
    const footerCanvas = await html2canvas(chrome.footer, capture)
    const naturalWidth = Math.max(
      options.target.scrollWidth,
      options.target.getBoundingClientRect().width,
    )
    const naturalHeight = Math.max(
      options.target.scrollHeight,
      options.target.getBoundingClientRect().height,
    )
    const scale = Math.min(
      2,
      30000 / Math.max(naturalWidth, naturalHeight, 1),
      Math.sqrt(32000000 / Math.max(1, naturalWidth * naturalHeight)),
    )
    const canvas = await html2canvas(options.target, {
      ...capture,
      scale,
      windowWidth: Math.max(naturalWidth, document.documentElement.clientWidth),
      onclone: (doc) => {
        const target = doc.querySelector<HTMLElement>(`[data-pdf-capture="${marker}"]`)
        if (!target) throw new Error('Unable to prepare the report for export.')
        doc.documentElement.setAttribute('data-theme', 'light')
        doc.documentElement.classList.remove('dark')
        const styles = doc.createElement('style')
        styles.textContent = reportStyles
        doc.head.append(styles)
        target.classList.add('hse-pdf-content')
        setColors(target, options.identity)
        target.style.width = `${naturalWidth}px`
        target.style.height = 'auto'
        removePdfActions(target)
        target.querySelectorAll<HTMLTextAreaElement>('textarea').forEach((textarea) => {
          const value = doc.createElement('div')
          value.className = 'pdf-field-value'
          value.textContent = textarea.value
          textarea.replaceWith(value)
        })
        // Expand scroll containers so exports include every rendered row and column.
        for (const node of [target, ...target.querySelectorAll<HTMLElement>('*')]) {
          const style = doc.defaultView!.getComputedStyle(node)
          if (/(auto|scroll)/.test(`${style.overflowY} ${style.overflowX}`)) {
            node.style.setProperty('overflow', 'visible', 'important')
            node.style.setProperty('max-height', 'none', 'important')
            node.style.setProperty('height', 'auto', 'important')
          }
          if (style.position === 'sticky') node.style.position = 'static'
        }
        const rect = target.getBoundingClientRect()
        captureWidth = rect.width
        blocks = [
          ...target.querySelectorAll<HTMLElement>(
            'tr, p, li, .pdf-field-value, [data-pdf-keep-together], h1, h2, h3',
          ),
        ]
          .map((node) => {
            const bounds = node.getBoundingClientRect()
            const next = /^H[1-3]$/.test(node.tagName)
              ? node.nextElementSibling?.getBoundingClientRect()
              : null
            return {
              start: Math.max(0, bounds.top - rect.top),
              end: (next ? Math.min(next.bottom, bounds.bottom + 48) : bounds.bottom) - rect.top,
            }
          })
          .filter((block) => block.end > block.start)
      },
    })
    if (!canvas.width || !canvas.height)
      throw new Error('The report is empty and cannot be exported.')
    const ratio = canvas.width / (captureWidth || naturalWidth)
    const pagePixels = Math.floor((canvas.width * bodyHeight) / width)
    const pages = paginateReport(
      canvas.height,
      pagePixels,
      blocks.map((b) => ({ start: b.start * ratio, end: b.end * ratio })),
    )
    pdf.setProperties({
      title: options.title,
      subject: 'HSE report',
      creator: options.identity.name,
    })
    for (const [index, page] of pages.entries()) {
      if (index) pdf.addPage()
      const slice = document.createElement('canvas')
      slice.width = canvas.width
      slice.height = page.end - page.start
      const context = slice.getContext('2d')
      if (!context) throw new Error('Unable to render a PDF page.')
      context.fillStyle = '#ffffff'
      context.fillRect(0, 0, slice.width, slice.height)
      context.drawImage(
        canvas,
        0,
        page.start,
        canvas.width,
        slice.height,
        0,
        0,
        slice.width,
        slice.height,
      )
      pdf.addImage(headerCanvas, 'PNG', margin, margin, width, headerHeight, 'hse-header', 'FAST')
      pdf.addImage(
        slice,
        'PNG',
        margin,
        bodyTop,
        width,
        Math.min(bodyHeight, (slice.height * width) / canvas.width),
        undefined,
        'FAST',
      )
      pdf.addImage(
        footerCanvas,
        'PNG',
        margin,
        pageHeight - margin - footerHeight,
        width,
        footerHeight,
        'hse-footer',
        'FAST',
      )
      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(8)
      pdf.setTextColor('#526176')
      pdf.text(
        `${String(index + 1).padStart(2, '0')} / ${String(pages.length).padStart(2, '0')}`,
        pageWidth - margin,
        pageHeight - margin + 3,
        { align: 'right' },
      )
      slice.width = 0
      slice.height = 0
    }
    pdf.save(
      options.filename.toLowerCase().endsWith('.pdf')
        ? options.filename
        : `${options.filename}.pdf`,
    )
  } finally {
    chrome?.host.remove()
    if (previousMarker === null) options.target.removeAttribute('data-pdf-capture')
    else options.target.setAttribute('data-pdf-capture', previousMarker)
  }
}
