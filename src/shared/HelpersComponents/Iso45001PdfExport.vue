<script setup lang="ts">
import { computed, ref } from 'vue'
import jsPDF from 'jspdf'

type IsoPdfColumn = {
  key: string
  label: string
  width?: number
}

type IsoPdfMeta = {
  label: string
  value: string | number
}

const props = withDefaults(
  defineProps<{
    title: string
    rows: Array<Record<string, unknown>>
    columns: IsoPdfColumn[]
    fileName: string
    reportCode: string
    subtitle?: string
    metadata?: IsoPdfMeta[]
    buttonLabel?: string
  }>(),
  {
    subtitle: 'Occupational health & safety performance register',
    metadata: () => [],
    buttonLabel: 'Export PDF',
  },
)

const isExporting = ref(false)
const canExport = computed(() => props.rows.length > 0 && props.columns.length > 0)

const COLORS = {
  navy: [13, 37, 53] as const,
  teal: [0, 137, 123] as const,
  mint: [224, 247, 243] as const,
  ink: [30, 48, 58] as const,
  muted: [100, 116, 126] as const,
  line: [215, 225, 228] as const,
  soft: [246, 249, 249] as const,
  white: [255, 255, 255] as const,
}

const valueAt = (row: Record<string, unknown>, path: string) =>
  path.split('.').reduce<unknown>((value, key) => {
    if (!value || typeof value !== 'object') return undefined
    return (value as Record<string, unknown>)[key]
  }, row)

const cleanText = (value: unknown) => {
  if (value === null || value === undefined || value === '') return '—'
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  if (Array.isArray(value)) return value.map(cleanText).join(', ')
  if (typeof value === 'object') return JSON.stringify(value)
  return (
    String(value)
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim() || '—'
  )
}

const safeFileName = (name: string) => {
  const normalized = name
    .replace(/\.pdf$/i, '')
    .replace(/[^a-zA-Z0-9-_]+/g, '-')
    .replace(/-+/g, '-')
  return `${normalized || 'hse-report'}.pdf`
}

const exportPdf = async () => {
  if (!canExport.value || isExporting.value) return

  isExporting.value = true

  try {
    await new Promise<void>((resolve) => window.setTimeout(resolve, 0))

    const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4', compress: true })
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const margin = 12
    const contentWidth = pageWidth - margin * 2
    const generatedAt = new Date()
    const dateLabel = generatedAt.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
    const timeLabel = generatedAt.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    })
    const documentReference = `${props.reportCode}-${generatedAt.toISOString().slice(0, 10).replace(/-/g, '')}`
    const totalWeight = props.columns.reduce((sum, column) => sum + (column.width || 1), 0)
    const columnWidths = props.columns.map(
      (column) => (contentWidth * (column.width || 1)) / totalWeight,
    )

    const drawBrandMark = (x: number, y: number) => {
      pdf.setFillColor(...COLORS.teal)
      pdf.roundedRect(x, y, 12, 12, 3, 3, 'F')
      pdf.setDrawColor(...COLORS.white)
      pdf.setLineWidth(0.8)
      pdf.line(x + 3.1, y + 6.2, x + 5.3, y + 8.4)
      pdf.line(x + 5.3, y + 8.4, x + 9.2, y + 3.8)
    }

    const drawPageHeader = (firstPage: boolean) => {
      pdf.setFillColor(...COLORS.navy)
      pdf.rect(0, 0, pageWidth, firstPage ? 30 : 21, 'F')
      pdf.setFillColor(...COLORS.teal)
      pdf.rect(0, 0, 5, firstPage ? 30 : 21, 'F')
      drawBrandMark(margin, firstPage ? 8 : 4.5)

      pdf.setTextColor(...COLORS.white)
      pdf.setFont('helvetica', 'bold')
      pdf.setFontSize(firstPage ? 16 : 11)
      pdf.text(props.title, margin + 16, firstPage ? 13 : 9.5)
      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(7.5)
      pdf.setTextColor(196, 216, 219)
      pdf.text(firstPage ? props.subtitle : documentReference, margin + 16, firstPage ? 19 : 14)

      const badgeWidth = 50
      pdf.setFillColor(22, 61, 75)
      pdf.roundedRect(
        pageWidth - margin - badgeWidth,
        firstPage ? 7 : 4.5,
        badgeWidth,
        12,
        3,
        3,
        'F',
      )
      pdf.setFont('helvetica', 'bold')
      pdf.setFontSize(7.3)
      pdf.setTextColor(120, 235, 211)
      pdf.text('ISO 45001', pageWidth - margin - badgeWidth + 5, firstPage ? 12 : 9.5)
      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(6.2)
      pdf.setTextColor(...COLORS.white)
      pdf.text(
        'OH&S ALIGNED REGISTER',
        pageWidth - margin - badgeWidth + 5,
        firstPage ? 16.3 : 13.8,
      )
    }

    const drawDocumentControl = () => {
      const cards: IsoPdfMeta[] = [
        { label: 'DOCUMENT REFERENCE', value: documentReference },
        { label: 'RECORDS IN EXPORT', value: props.rows.length },
        { label: 'GENERATED', value: `${dateLabel} · ${timeLabel}` },
        ...(props.metadata || []),
      ].slice(0, 4)
      const gap = 3
      const cardWidth = (contentWidth - gap * (cards.length - 1)) / cards.length

      cards.forEach((card, index) => {
        const x = margin + index * (cardWidth + gap)
        pdf.setFillColor(...COLORS.soft)
        pdf.setDrawColor(...COLORS.line)
        pdf.roundedRect(x, 34, cardWidth, 14, 2, 2, 'FD')
        pdf.setFont('helvetica', 'bold')
        pdf.setFontSize(5.8)
        pdf.setTextColor(...COLORS.teal)
        pdf.text(card.label.toUpperCase(), x + 4, 39)
        pdf.setFontSize(8)
        pdf.setTextColor(...COLORS.ink)
        const value = pdf.splitTextToSize(cleanText(card.value), cardWidth - 8)[0] || '—'
        pdf.text(value, x + 4, 44.3)
      })
    }

    const drawTableHeader = (y: number) => {
      pdf.setFillColor(...COLORS.teal)
      pdf.rect(margin, y, contentWidth, 10, 'F')
      pdf.setTextColor(...COLORS.white)
      pdf.setFont('helvetica', 'bold')
      pdf.setFontSize(6.6)

      let x = margin
      props.columns.forEach((column, index) => {
        const text = pdf.splitTextToSize(column.label.toUpperCase(), columnWidths[index] - 5)
        pdf.text(text.slice(0, 2), x + 2.5, y + 4.2)
        x += columnWidths[index]
      })

      return y + 10
    }

    const addContinuationPage = () => {
      pdf.addPage()
      drawPageHeader(false)
      return drawTableHeader(25)
    }

    drawPageHeader(true)
    drawDocumentControl()
    let y = drawTableHeader(53)

    props.rows.forEach((row, rowIndex) => {
      const cells = props.columns.map((column, columnIndex) => {
        const value = cleanText(valueAt(row, column.key))
        return pdf.splitTextToSize(value, columnWidths[columnIndex] - 5).slice(0, 5) as string[]
      })
      const lineCount = Math.max(1, ...cells.map((cell) => cell.length))
      const rowHeight = Math.max(9, lineCount * 3.5 + 4)

      if (y + rowHeight > pageHeight - 17) y = addContinuationPage()

      pdf.setFillColor(...(rowIndex % 2 === 0 ? COLORS.white : COLORS.soft))
      pdf.rect(margin, y, contentWidth, rowHeight, 'F')
      pdf.setDrawColor(...COLORS.line)
      pdf.setLineWidth(0.18)
      pdf.line(margin, y + rowHeight, pageWidth - margin, y + rowHeight)

      let x = margin
      cells.forEach((cell, columnIndex) => {
        if (columnIndex > 0) pdf.line(x, y, x, y + rowHeight)
        pdf.setFont('helvetica', columnIndex === 0 ? 'bold' : 'normal')
        pdf.setFontSize(6.8)
        pdf.setTextColor(...(columnIndex === 0 ? COLORS.teal : COLORS.ink))
        pdf.text(cell, x + 2.5, y + 5)
        x += columnWidths[columnIndex]
      })

      y += rowHeight
    })

    const pageCount = pdf.getNumberOfPages()
    for (let page = 1; page <= pageCount; page += 1) {
      pdf.setPage(page)
      pdf.setDrawColor(...COLORS.line)
      pdf.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12)
      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(6.2)
      pdf.setTextColor(...COLORS.muted)
      pdf.text(
        'CONTROLLED DOCUMENT · Verify current revision before operational use',
        margin,
        pageHeight - 7,
      )
      pdf.text(`Page ${page} of ${pageCount}`, pageWidth - margin, pageHeight - 7, {
        align: 'right',
      })
      pdf.setTextColor(...COLORS.teal)
      pdf.text(props.reportCode, pageWidth / 2, pageHeight - 7, { align: 'center' })
    }

    pdf.setProperties({
      title: props.title,
      subject: 'ISO 45001-aligned occupational health and safety report',
      author: 'HSE System',
      keywords: 'ISO 45001, OH&S, HSE, report',
      creator: 'HSE System',
    })
    pdf.save(safeFileName(props.fileName))
  } catch (error) {
    console.error('Unable to generate the PDF report:', error)
  } finally {
    isExporting.value = false
  }
}
</script>

<template>
  <button
    type="button"
    class="iso-pdf-button"
    :disabled="!canExport || isExporting"
    :aria-busy="isExporting"
    @click="exportPdf"
  >
    <span class="iso-pdf-button__icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M7 3h7l4 4v14H7V3Z" stroke="currentColor" stroke-width="1.7" />
        <path
          d="M14 3v5h5M9.5 15.5h5M12 12.5v6m-2-2 2 2 2-2"
          stroke="currentColor"
          stroke-width="1.7"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </span>
    <span class="iso-pdf-button__copy">
      <!-- <small>{{ isExporting ? 'BUILDING REPORT' : 'ISO 45001' }}</small> -->
      <strong>{{ isExporting ? 'Preparing PDF…' : buttonLabel }}</strong>
    </span>
  </button>
</template>

<style scoped>
.iso-pdf-button {
  display: inline-flex;
  min-height: 44px;
  align-items: center;
  gap: 10px;
  padding: 6px 14px 6px 7px;
  border: 1px solid color-mix(in srgb, #00897b 48%, transparent);
  border-radius: 12px;
  background: linear-gradient(135deg, #0d2535 0%, #123f49 100%);
  box-shadow: 0 8px 18px rgb(13 37 53 / 14%);
  color: #fff;
  cursor: pointer;
  text-align: start;
  transition:
    transform 160ms ease,
    box-shadow 160ms ease,
    border-color 160ms ease;
}

.iso-pdf-button:hover:not(:disabled) {
  transform: translateY(-1px);
  border-color: #38d5c1;
  box-shadow: 0 11px 24px rgb(13 37 53 / 22%);
}

.iso-pdf-button:focus-visible {
  outline: 3px solid rgb(0 137 123 / 25%);
  outline-offset: 3px;
}

.iso-pdf-button:disabled {
  cursor: not-allowed;
  opacity: 0.58;
}

.iso-pdf-button__icon {
  display: grid;
  width: 32px;
  height: 32px;
  flex: 0 0 32px;
  place-items: center;
  border-radius: 9px;
  background: linear-gradient(145deg, #16a394, #00796b);
  color: #fff;
}

.iso-pdf-button__icon svg {
  width: 19px;
  height: 19px;
}

.iso-pdf-button__copy {
  display: flex;
  flex-direction: column;
  line-height: 1.05;
}

.iso-pdf-button__copy small {
  margin-bottom: 3px;
  color: #7ce7d9;
  font-size: 0.58rem;
  font-weight: 800;
  letter-spacing: 0.12em;
}

.iso-pdf-button__copy strong {
  font-size: 0.78rem;
  font-weight: 750;
  white-space: nowrap;
}
</style>
