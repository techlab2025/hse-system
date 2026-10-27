<script setup lang="ts">
import { translateMessage } from '@/localization/messages'
import { usePdfExport } from '@/composables/usePdfExport'
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
    title?: string
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
    orientation: 'landscape',
    buttonLabel: 'Export PDF',
    excelButtonLabel: 'Export Excel',
    margin: 8,
    data: () => [],
    columns: () => [],
  },
)

const { exportPdf, isExporting, exportError } = usePdfExport()

const normalizeFileName = (fileName: string, extension: 'pdf' | 'xlsx') =>
  fileName.toLowerCase().endsWith(`.${extension}`) ? fileName : `${fileName}.${extension}`

const formatCellValue = (value: unknown) => {
  if (value === null || value === undefined) return 'N/A'
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  if (value instanceof Date) return value.toLocaleDateString()
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}

const exportExcel = () => {
  if (!props.data.length) return

  const columns =
    props.columns.length > 0
      ? props.columns
      : Object.keys(props.data[0] ?? {}).map((key) => ({ key, label: key }))
  const rows = props.data.map((item) => {
    const row: Record<string, string> = {}

    columns.forEach((column) => {
      const value = column.key
        .split('.')
        .reduce<unknown>(
          (acc, key) =>
            acc && typeof acc === 'object' ? (acc as Record<string, unknown>)[key] : undefined,
          item,
        )
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

defineExpose({ exportExcel })

const exportPDF = () =>
  exportPdf({
    targetSelector: props.targetSelector,
    filename: props.fileName,
    title: props.title,
    orientation: props.orientation,
    margin: props.margin,
  })
</script>

<template>
  <div
    data-pdf-exclude
    :class="isDropList ? 'export-actions export-actions--drop-list' : 'export-actions'"
  >
    <button
      :class="isDropList ? 'export-pdf-btn ms-2' : 'btn btn-secondary'"
      type="button"
      :disabled="isExporting"
      :aria-busy="isExporting"
      @click="exportPDF"
    >
      <PdefActionIcon v-if="isDropList" />

      <span>
        {{ isExporting ? $t('Exporting…') : translateMessage(buttonLabel) }}
      </span>
    </button>

    <p v-if="exportError" class="pdf-export-error" role="alert">{{ exportError }}</p>

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
.pdf-export-error {
  color: var(--status-danger, #b42318);
  font-size: 0.8rem;
  margin: 6px 0;
}
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
  background-color: color-mix(in srgb, var(--main-border) 5.88%, transparent);
  color: var(--text-soft);
  cursor: pointer;
  font-family: 'Regular';
  font-size: 16px;
  font-weight: 500;
  transition: background-color 0.3s ease;

  &:hover:not(:disabled) {
    background-color: color-mix(in srgb, var(--status-danger) 5.88%, transparent);
  }

  &:disabled {
    cursor: wait;
    opacity: 0.65;
  }
}
</style>
