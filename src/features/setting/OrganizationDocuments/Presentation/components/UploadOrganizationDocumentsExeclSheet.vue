<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import * as XLSX from 'xlsx'
import FileUpload from '@/shared/FormInputs/FileUpload.vue'
import AddOrganizationDocumentsController from '../controllers/addOrganizationDocumentsController'
import AddOrganizationDocumentsExcelParams from '../../Core/params/addOrganizationDocumentsExcelParams'
import type { OrganizationDocumentsFields } from '../../Core/params/addOrganizationDocumentsParams'

const props = defineProps<{ initialFile?: File | null }>()
const emit = defineEmits<{ uploaded: [] }>()
const router = useRouter()
const rows = ref<OrganizationDocumentsFields[]>([])
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

const readFile = async (files: File | File[] | null) => {
  const file = Array.isArray(files) ? files[0] : files
  rows.value = []
  error.value = ''
  if (!file) return
  busy.value = true
  try {
    const workbook = XLSX.read(await file.arrayBuffer(), { type: 'array' })
    const sheet = workbook.Sheets[workbook.SheetNames[0]]
    const parsed = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
      raw: false,
      defval: '',
    })
    if (!parsed.length) throw new Error('The spreadsheet has no document rows.')
    rows.value = parsed.map((row, index) => {
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
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : 'Unable to read spreadsheet.'
    rows.value = []
  } finally {
    busy.value = false
  }
}
watch(
  () => props.initialFile,
  (file) => {
    if (file) void readFile(file)
  },
  { immediate: true },
)
const submit = async () => {
  if (busy.value || !rows.value.length) return
  busy.value = true
  try {
    await controller.addOrganizationDocuments(
      new AddOrganizationDocumentsExcelParams(rows.value),
      router,
    )
    if (controller.isDataSuccess()) emit('uploaded')
  } finally {
    busy.value = false
  }
}
</script>
<template>
  <form @submit.prevent="submit">
    <p class="mb-4">{{ $t('organization_documents_import_help') }}</p>
    <FileUpload :index="2" accept=".xlsx,.xls" @update:file-data="readFile" />
    <p v-if="error" class="text-red-500 mt-4">{{ error }}</p>
    <div v-if="rows.length" class="table-responsive mt-4">
      <table class="main-table">
        <thead>
          <tr>
            <th v-for="column in columns.filter((key) => key !== 'document_file')" :key="column">
              {{ $t(column) }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in rows" :key="index">
            <td v-for="column in columns.filter((key) => key !== 'document_file')" :key="column">
              {{ row[column] }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <button type="submit" class="btn btn-primary mt-4" :disabled="busy || !rows.length">
      {{ $t('save') }}
    </button>
  </form>
</template>
