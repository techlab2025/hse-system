<script setup lang="ts">
import { ref } from 'vue'
import html2canvas from 'html2canvas-pro'
import jsPDF from 'jspdf'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import PdefActionIcon from '@/shared/icons/PdefActionIcon.vue'

type PdfOrientation = 'portrait' | 'landscape'

type ExportColumn = {
  key: string
  label?: string
}

const props = withDefaults(
  defineProps<{
    isDropList?: boolean
    targetSelector?: string
    fileName?: string
    orientation?: PdfOrientation
    buttonLabel?: string
    excelButtonLabel?: string
    margin?: number
    data?: Array<Record<string, unknown>>
    columns?: ExportColumn[]
  }>(),
  {
    isDropList: false,
    targetSelector: '.table-responsive',
    fileName: 'report',
    orientation: 'portrait',
    buttonLabel: 'Export PDF',
    excelButtonLabel: 'Export Excel',
    margin: 8,
    data: () => [],
    columns: () => [],
  },
)

const isExporting = ref(false)

const normalizeFileName = (fileName: string, extension: 'pdf' | 'xlsx') =>
  fileName.toLowerCase().endsWith(`.${extension}`)
    ? fileName
    : `${fileName}.${extension}`

const formatCellValue = (value: unknown) => {
  if (value === null || value === undefined) return 'N/A'
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  if (value instanceof Date) return value.toLocaleDateString()
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}

const exportExcel = () => {
  if (!props.data.length) return

  const columns = props.columns.length > 0 ? props.columns : Object.keys(props.data[0] ?? {}).map((key) => ({ key, label: key }))
  const rows = props.data.map((item) => {
    const row: Record<string, string> = {}

    columns.forEach((column) => {
      const value = column.key.split('.').reduce<unknown>((acc, key) => (acc && typeof acc === 'object' ? (acc as Record<string, unknown>)[key] : undefined), item)
      row[column.label || column.key] = formatCellValue(value)
    })

    return row
  })

  const worksheet = XLSX.utils.json_to_sheet(rows)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Report')

  const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
  const blob = new Blob([wbout], { type: 'application/octet-stream' })
  saveAs(blob, normalizeFileName(props.fileName, 'xlsx'))
}

const exportPDF = async () => {
  if (isExporting.value) return

  const targetElement = document.querySelector<HTMLElement>(
    props.targetSelector,
  )

  if (!targetElement) {
    console.error(
      `PDF export target not found: ${props.targetSelector}`,
    )
    return
  }

  isExporting.value = true

  try {
    if ('fonts' in document) {
      await document.fonts.ready
    }

    const canvas = await html2canvas(targetElement, {
      scale: 2,
      useCORS: true,
      allowTaint: false,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: Math.max(
        targetElement.scrollWidth,
        document.documentElement.clientWidth,
      ),
      windowHeight: Math.max(
        targetElement.scrollHeight,
        document.documentElement.clientHeight,
      ),
      onclone: (clonedDocument) => {
        const clonedTarget =
          clonedDocument.querySelector<HTMLElement>(
            props.targetSelector,
          )

        if (!clonedTarget) return

        /*
         * The action area is ignored in the PDF.
         * Make the report header use the full available width.
         */
        const reportHeader =
          clonedTarget.querySelector<HTMLElement>(
            '.report-board-header',
          )

        if (reportHeader) {
          reportHeader.style.gridTemplateColumns = '1fr'
        }

        /*
         * Prevent animations and hover transformations
         * from affecting the captured PDF.
         */
        clonedTarget
          .querySelectorAll<HTMLElement>('*')
          .forEach((element) => {
            element.style.animation = 'none'
            element.style.transition = 'none'
          })
      },
    })

    if (!canvas.width || !canvas.height) {
      throw new Error('The generated PDF canvas is empty.')
    }

    const pdf = new jsPDF({
      orientation: props.orientation,
      unit: 'mm',
      format: 'a4',
      compress: true,
    })

    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()

    const printableWidth = pageWidth - props.margin * 2
    const printableHeight = pageHeight - props.margin * 2

    /*
     * Calculate how many canvas pixels fit on one PDF page.
     * The canvas is sliced to create a real multi-page PDF.
     */
    const pageHeightInPixels = Math.floor(
      (canvas.width * printableHeight) / printableWidth,
    )

    let currentPosition = 0
    let pageIndex = 0

    while (currentPosition < canvas.height) {
      const remainingHeight = canvas.height - currentPosition
      const sliceHeight = Math.min(
        pageHeightInPixels,
        remainingHeight,
      )

      const pageCanvas = document.createElement('canvas')
      pageCanvas.width = canvas.width
      pageCanvas.height = sliceHeight

      const context = pageCanvas.getContext('2d')

      if (!context) {
        throw new Error('Unable to create the PDF page canvas.')
      }

      context.fillStyle = '#ffffff'
      context.fillRect(
        0,
        0,
        pageCanvas.width,
        pageCanvas.height,
      )

      context.drawImage(
        canvas,
        0,
        currentPosition,
        canvas.width,
        sliceHeight,
        0,
        0,
        canvas.width,
        sliceHeight,
      )

      const imageData = pageCanvas.toDataURL('image/png')
      const renderedHeight =
        (sliceHeight * printableWidth) / canvas.width

      if (pageIndex > 0) {
        pdf.addPage()
      }

      pdf.addImage(
        imageData,
        'PNG',
        props.margin,
        props.margin,
        printableWidth,
        renderedHeight,
        undefined,
        'FAST',
      )

      currentPosition += sliceHeight
      pageIndex += 1
    }

    pdf.save(normalizeFileName(props.fileName, 'pdf'))
  } catch (error) {
    console.error('Error generating PDF:', error)
  } finally {
    isExporting.value = false
  }
}
</script>

<template>
  <div :class="isDropList ? 'export-actions export-actions--drop-list' : 'export-actions'">
    <button
      :class="isDropList ? 'export-pdf-btn ms-2' : 'btn btn-secondary'"
      type="button"
      :disabled="isExporting"
      @click="exportPDF"
    >
      <PdefActionIcon v-if="isDropList" />

      <span>
        {{ isExporting ? 'Exporting...' : buttonLabel }}
      </span>
    </button>

    <!-- <button
      :class="isDropList ? 'export-pdf-btn ms-2' : 'btn btn-secondary'"
      type="button"
      @click="exportExcel"
    >
      <PdefActionIcon v-if="isDropList" />

      <span>
        {{ excelButtonLabel }}
      </span>
    </button> -->
  </div>
</template>

<style scoped lang="scss">
.export-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}

.export-actions--drop-list {
  flex-direction: column;
  align-items: stretch;
}

.export-pdf-btn {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 5px 0;
  padding: 10px 12px;
  border: none;
  border-radius: 8px;
  background-color: color-mix(
    in srgb,
    var(--main-border) 5.88%,
    transparent
  );
  color: var(--text-soft);
  cursor: pointer;
  font-family: 'Regular';
  font-size: 16px;
  font-weight: 500;
  transition: background-color 0.3s ease;

  &:hover:not(:disabled) {
    background-color: color-mix(
      in srgb,
      var(--status-danger) 5.88%,
      transparent
    );
  }

  &:disabled {
    cursor: wait;
    opacity: 0.65;
  }
}
</style>
