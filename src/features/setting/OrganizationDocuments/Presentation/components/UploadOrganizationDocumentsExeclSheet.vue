<script setup lang="ts">
import { translate as localizeUi } from '@/localization/i18n'

import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import * as XLSX from 'xlsx'
import FileUpload from '@/shared/FormInputs/FileUpload.vue'
import ExcelSheetColumnsHandle from '@/features/Organization/OrganizationEmployee/Presentation/supcomponents/ExcelSheetHandle/ExcelSheetColumnsHandle.vue'
import IconDelete from '@/shared/icons/IconDelete.vue'
import { useI18n } from 'vue-i18n'
import AddOrganizationDocumentsController from '../controllers/addOrganizationDocumentsController'
import AddOrganizationDocumentsExcelParams from '../../Core/params/addOrganizationDocumentsExcelParams'
import type { OrganizationDocumentsFields } from '../../Core/params/addOrganizationDocumentsParams'

const props = defineProps<{ initialFile?: File | null }>()
const emit = defineEmits<{ uploaded: [] }>()
const router = useRouter()
const { t } = useI18n()
const sheetData = ref<string[][]>([])
const mappedRows = ref<Record<string, string>[] | null>(null)
const error = ref('')
const busy = ref(false)
const controller = AddOrganizationDocumentsController.getInstance()
const columns = [
  'document_title',
  'document_ref',
  'document_version',
  'issue_date',
  'nex_review_date',
  'document_category_id',
  'document_file',
  'notes',
] as const

const columnLabels = computed(() =>
  Object.fromEntries(columns.map((column) => [column, t(column)])),
)
const headers = computed(() => sheetData.value[0] ?? [])
const previewColumns = columns.filter((column) => column !== 'document_file')
const mappingFields = [...columns]

const applyMapping = (mapping: Record<string, string>) => {
  mappedRows.value = sheetData.value.slice(1).map((row) => {
    const document: Record<string, string> = {}
    for (const column of columns) {
      const index = headers.value.indexOf(mapping[column] ?? '')
      document[column] = index >= 0 ? (row[index] ?? '') : ''
    }
    return document
  })
  error.value = ''
}
const resetFile = () => {
  sheetData.value = []
  mappedRows.value = null
  error.value = ''
}
const onMappingClose = () => {
  if (!mappedRows.value) resetFile()
}
const deleteRow = (index: number) => {
  mappedRows.value = mappedRows.value?.filter((_, rowIndex) => rowIndex !== index) ?? null
  error.value = ''
}
const readFile = async (files: File | File[] | null) => {
  const file = Array.isArray(files) ? files[0] : files
  resetFile()
  if (!file) return
  busy.value = true
  try {
    const workbook = XLSX.read(await file.arrayBuffer(), { type: 'array' })
    const sheet = workbook.Sheets[workbook.SheetNames[0]]
    const parsed = XLSX.utils.sheet_to_json<string[]>(sheet, {
      header: 1,
      raw: false,
      defval: '',
      blankrows: false,
    })
    if (parsed.length < 2) throw new Error(localizeUi('The spreadsheet has no document rows.'))
    const normalizedHeaders = parsed[0].map((header) => String(header).trim())
    if (
      new Set(normalizedHeaders).size !== normalizedHeaders.length ||
      normalizedHeaders.some((header) => !header)
    ) {
      throw new Error(localizeUi('Spreadsheet columns must have unique, non-empty headers.'))
    }
    sheetData.value = [normalizedHeaders, ...parsed.slice(1)]
    const knownColumns = new Map(normalizedHeaders.map((header) => [header.toLowerCase(), header]))
    if (
      columns.filter((column) => column !== 'notes').every((column) => knownColumns.has(column))
    ) {
      applyMapping(
        Object.fromEntries(columns.map((column) => [column, knownColumns.get(column) ?? ''])),
      )
    }
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : 'Unable to read spreadsheet.'
    sheetData.value = []
    mappedRows.value = null
  } finally {
    busy.value = false
  }
}
const validateRows = (): OrganizationDocumentsFields[] => {
  return (mappedRows.value ?? []).map((row, index) => {
    const document: OrganizationDocumentsFields = {
      document_title: String(row.document_title ?? '').trim(),
      document_ref: String(row.document_ref ?? '').trim(),
      document_version: String(row.document_version ?? '').trim(),
      issue_date: String(row.issue_date ?? '').trim(),
      nex_review_date: String(row.nex_review_date ?? '').trim(),
      document_file: String(row.document_file ?? '').trim(),
      document_category_id: Number(row.document_category_id),
      notes: String(row.notes ?? ''),
    }
    for (const field of columns) {
      if (field !== 'notes' && !document[field])
        throw new Error(`Row ${index + 2}: ${field} is required.`)
    }
    if (!Number.isInteger(document.document_category_id) || document.document_category_id < 1) {
      throw new Error(`Row ${index + 2}: document_category_id must be a positive integer.`)
    }
    for (const field of ['issue_date', 'nex_review_date'] as const) {
      const date = document[field]
      const parsedDate = new Date(`${date}T00:00:00Z`)
      if (
        !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
        Number.isNaN(parsedDate.getTime()) ||
        parsedDate.toISOString().slice(0, 10) !== date
      ) {
        throw new Error(`Row ${index + 2}: ${field} must be a valid YYYY-MM-DD date.`)
      }
    }
    if (!/^data:[^,]*;base64,[A-Za-z0-9+/]+={0,2}$/.test(document.document_file)) {
      throw new Error(`Row ${index + 2}: document_file must be a base64 data URL.`)
    }
    return document
  })
}

watch(
  () => props.initialFile,
  (file) => {
    if (file) void readFile(file)
  },
  { immediate: true },
)
const submit = async () => {
  if (busy.value || !mappedRows.value?.length) return
  busy.value = true
  try {
    await controller.addOrganizationDocuments(
      new AddOrganizationDocumentsExcelParams(validateRows()),
      router,
    )
    if (controller.isDataSuccess()) emit('uploaded')
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : 'Unable to import spreadsheet.'
  } finally {
    busy.value = false
  }
}
</script>
<template>
  <form class="page-wrapper" @submit.prevent="submit">
    <p>{{ $t('organization_documents_import_help') }}</p>
    <p v-if="busy" role="status">{{ $t('Processing…') }}</p>
    <p v-if="error" class="text-red-500" role="alert">{{ error }}</p>
    <FileUpload
      v-if="!sheetData.length && !busy"
      :index="2"
      accept=".xlsx,.xls"
      @update:file-data="readFile"
    />
    <ExcelSheetColumnsHandle
      v-if="sheetData.length && !mappedRows"
      :visable="true"
      :columns="headers"
      :sent-data="mappingFields"
      :sent-data-labels="columnLabels"
      @update:column-mapping="applyMapping"
      @close="onMappingClose"
    />
    <template v-if="mappedRows">
      <div class="table-container">
        <div class="table-header">
          <h3 class="table-title">{{ $t('Mapped Data Preview') }}</h3>
          <span class="table-badge">{{ mappedRows.length }} {{ $t('rows') }}</span>
        </div>
        <div class="table-responsive hse-table-scroll">
          <table v-table-identity class="main-table hse-data-table">
            <thead>
              <tr>
                <th v-for="column in previewColumns" :key="column">{{ $t(column) }}</th>
                <th class="last"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, index) in mappedRows" :key="index">
                <td v-for="column in previewColumns" :key="column">{{ row[column] }}</td>
                <td class="last">
                  <button
                    type="button"
                    class="btn-delete-row"
                    :title="$t('delete')"
                    :aria-label="$t('delete')"
                    :disabled="busy"
                    @click="deleteRow(index)"
                  >
                    <IconDelete />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <button type="button" class="btn btn-secondary" :disabled="busy" @click="resetFile">
        {{ $t('upload_excel') }}
      </button>
      <button type="submit" class="btn-confirm" :disabled="busy || !mappedRows.length">
        {{ $t('Confirm & Submit') }}
      </button>
    </template>
  </form>
</template>

<style scoped>
.page-wrapper {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.table-container {
  border-radius: 16px;
  overflow: hidden;
  background: var(--surface-1);
}

.table-header {
  padding: 10px;
}

.last {
  display: table-cell !important;
}

.btn-delete-row {
  background: var(--status-danger-soft);
  color: var(--status-danger);
  border-radius: 8px;
  padding: 6px 10px;
  cursor: pointer;
}

.btn-confirm {
  width: 100%;
  padding: 14px;
  background: var(--brand-primary-500);
  color: var(--text-on-brand);
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
}

.btn-confirm:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
