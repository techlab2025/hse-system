<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import * as XLSX from 'xlsx'
import ExcelSheetColumnsHandle from '@/features/Organization/OrganizationEmployee/Presentation/supcomponents/ExcelSheetHandle/ExcelSheetColumnsHandle.vue'
import FileUpload from '@/features/Organization/OrganizationEmployee/Presentation/supcomponents/ExcelSheetHandle/FileUpload.vue'
import IconDelete from '@/shared/icons/IconDelete.vue'

export interface ExcelImportColumn {
  key: string
  label: string
  required?: boolean
}
export type ExcelImportRow = Record<string, string>
const props = withDefaults(
  defineProps<{
    initialFile?: File | null
    columns: ExcelImportColumn[]
    busy?: boolean
    error?: string
  }>(),
  { busy: false, error: '' },
)
const emit = defineEmits<{ submit: [rows: ExcelImportRow[]] }>()
const { t } = useI18n()
const loading = ref(false)
const errorMessage = ref('')
const source = ref<string[][]>([])
const rows = ref<ExcelImportRow[] | null>(null)
const columnKeys = computed(() => props.columns.map((column) => column.key))
const columnLabels = computed(() =>
  Object.fromEntries(props.columns.map((column) => [column.key, column.label])),
)

const applyMapping = (mapping: Record<string, string>) => {
  const indexes = Object.fromEntries(
    props.columns.map((column) => [
      column.key,
      source.value[0]?.indexOf(mapping[column.key]) ?? -1,
    ]),
  )
  rows.value = source.value
    .slice(1)
    .map((row) =>
      Object.fromEntries(
        props.columns.map((column) => [column.key, row[indexes[column.key]]?.trim() ?? '']),
      ),
    )
}
const parseFile = async (file?: File | null) => {
  if (props.busy) return
  source.value = []
  rows.value = null
  errorMessage.value = ''
  if (!file) return
  loading.value = true
  try {
    const workbook = XLSX.read(await file.arrayBuffer(), { type: 'array' })
    const sheet = workbook.Sheets[workbook.SheetNames[0]]
    if (!sheet) throw new Error('Missing worksheet')
    source.value = XLSX.utils
      .sheet_to_json<unknown[]>(sheet, { header: 1, raw: false, defval: '', blankrows: false })
      .map((row) => row.map((value) => String(value ?? '').trim()))
      .filter((row) => row.some(Boolean))
    if (source.value.length < 2) {
      errorMessage.value = t('excel_row_required')
      source.value = []
      return
    }
    const headers = source.value[0]
    const mapping = Object.fromEntries(
      props.columns.map((column) => [
        column.key,
        headers.find((header) => header.toLowerCase() === column.key) ?? '',
      ]),
    )
    if (props.columns.filter((column) => column.required).every((column) => mapping[column.key]))
      applyMapping(mapping)
  } catch {
    errorMessage.value = t('failed_to_process_file')
  } finally {
    loading.value = false
  }
}
watch(() => props.initialFile, parseFile, { immediate: true })
const closeMapping = () => {
  if (!rows.value) source.value = []
}
const submit = () => {
  if (props.busy || !rows.value?.length) return
  errorMessage.value = ''
  for (let index = 0; index < rows.value.length; index++) {
    for (const column of props.columns) {
      if (column.required && !rows.value[index][column.key]?.trim()) {
        errorMessage.value = t('excel_required_cell', { row: index + 1, field: column.label })
        return
      }
    }
  }
  emit(
    'submit',
    rows.value.map((row) => ({ ...row })),
  )
}
</script>

<template>
  <div class="excel-rows-import" :aria-busy="busy || loading">
    <p v-if="error || errorMessage" class="error-banner" role="alert">
      {{ error || errorMessage }}
    </p>
    <p v-if="loading" class="loading-bar" role="status">{{ t('processing_file') }}</p>
    <FileUpload
      v-if="!loading && !source.length"
      accept=".xls,.xlsx"
      @update:file-data="parseFile"
    />
    <ExcelSheetColumnsHandle
      v-if="source.length && !rows"
      :visable="true"
      :columns="source[0]"
      :sent-data="columnKeys"
      :sent-data-labels="columnLabels"
      @update:column-mapping="applyMapping"
      @close="closeMapping"
    />
    <template v-if="rows">
      <slot name="before-preview" />
      <div class="table-container">
        <div class="table-header">
          <h3 class="table-title">{{ t('mapped_data_preview') }}</h3>
          <span class="table-badge">{{ t('row_count', { count: rows.length }) }}</span>
        </div>
        <div class="table-responsive">
          <table class="main-table">
            <thead>
              <tr>
                <th v-for="column in columns" :key="column.key">{{ column.label }}</th>
                <th class="last"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, index) in rows" :key="index">
                <td v-for="column in columns" :key="column.key">{{ row[column.key] }}</td>
                <td>
                  <button
                    type="button"
                    class="btn-delete-row"
                    :disabled="busy"
                    :title="t('delete_row')"
                    @click="rows.splice(index, 1)"
                  >
                    <IconDelete />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <button type="button" class="btn-confirm" :disabled="busy || !rows.length" @click="submit">
        {{ busy ? t('processing_file') : t('confirm_and_submit') }}
      </button>
    </template>
  </div>
</template>

<style scoped>
.excel-rows-import {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.error-banner {
  padding: 12px 16px;
  background: var(--status-danger-soft);
  color: var(--status-danger);
  border-radius: 10px;
}
.loading-bar {
  padding: 12px 16px;
  background: var(--brand-primary-50);
  border-radius: 10px;
}
.table-container {
  border-radius: 16px;
  overflow: hidden;
  background: var(--surface-1);
  box-shadow: 0 4px 16px color-mix(in srgb, var(--text-strong) 6%, transparent);
}
.table-header {
  padding: 10px;
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
}
.table-title {
  margin: 0;
  font-weight: 600;
}
.main-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}
.main-table th {
  padding: 12px 16px;
  text-align: start;
  color: var(--brand-primary-500);
  border-bottom: 2px solid var(--brand-primary-100);
}
.main-table td {
  padding: 12px 16px;
  border-bottom: 1px solid var(--brand-primary-50);
}
.last {
  display: table-cell !important;
}
.btn-delete-row {
  padding: 6px 10px;
  color: var(--status-danger);
  background: var(--status-danger-soft);
  border-radius: 8px;
  cursor: pointer;
}
.btn-confirm {
  width: 100%;
  padding: 14px;
  color: var(--text-on-brand);
  background: var(--brand-primary-500);
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
}
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
