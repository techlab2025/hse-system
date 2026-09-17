<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import * as XLSX from 'xlsx'
import ExcelSheetColumnsHandle from '@/features/Organization/OrganizationEmployee/Presentation/supcomponents/ExcelSheetHandle/ExcelSheetColumnsHandle.vue'
import FileUpload from '@/features/Organization/OrganizationEmployee/Presentation/supcomponents/ExcelSheetHandle/FileUpload.vue'
import AddTeamExcelParams from '../../Core/params/AddTeamExcelParams'
import AddTeamController from '../controllers/addTeamController'

const props = defineProps<{ initialFile?: File | null }>()
const emit = defineEmits<{ (event: 'uploaded'): void }>()

const router = useRouter()
const rows = ref<unknown[][]>([])
const mappedRows = ref<unknown[][] | null>(null)
const isLoading = ref(false)
const isSubmitting = ref(false)
const errorMessage = ref('')

const readExcelFile = async (file: File) => {
  errorMessage.value = ''
  isLoading.value = true

  try {
    const workbook = XLSX.read(await file.arrayBuffer(), { type: 'array' })
    const sheet = workbook.Sheets[workbook.SheetNames[0]]
    const data = XLSX.utils.sheet_to_json<unknown[]>(sheet, {
      header: 1,
      raw: false,
      defval: '',
      blankrows: false,
    })

    if (data.length < 2) {
      rows.value = []
      mappedRows.value = null
      errorMessage.value = 'No data available'
      return
    }

    rows.value = data
    mappedRows.value = data
  } catch (error) {
    console.error('Failed to read Team Excel file:', error)
    rows.value = []
    mappedRows.value = null
    errorMessage.value = 'Failed to process the file.'
  } finally {
    isLoading.value = false
  }
}

watch(
  () => props.initialFile,
  async (file) => {
    if (file) await readExcelFile(file)
  },
  { immediate: true },
)

const onColumnMapping = (mapping: Record<string, string>) => {
  if (!rows.value.length) return

  const selectedTitleColumn = mapping.title
  const clonedRows = rows.value.map((row) => [...row])
  clonedRows[0] = clonedRows[0].map((column) =>
    String(column).trim() === selectedTitleColumn ? 'title' : column,
  )
  mappedRows.value = clonedRows
}

const resetUnconfirmedMapping = () => {
  if (!mappedRows.value) rows.value = []
}

const deleteRow = (rowIndex: number) => {
  if (!mappedRows.value) return
  mappedRows.value = [
    mappedRows.value[0],
    ...mappedRows.value.slice(1).filter((_, index) => index !== rowIndex),
  ]
}

const submitTeams = async () => {
  if (!mappedRows.value?.length || isSubmitting.value) return

  const headers = mappedRows.value[0].map((header) => String(header).trim().toLowerCase())
  const titleIndex = headers.indexOf('title')

  if (titleIndex === -1) {
    errorMessage.value = 'Please map the Team Title column.'
    mappedRows.value = null
    return
  }

  const data = mappedRows.value
    .slice(1)
    .map((row) => ({ title: String(row[titleIndex] ?? '').trim() }))
    .filter((row) => row.title)

  if (!data.length) {
    errorMessage.value = 'No data available'
    return
  }

  isSubmitting.value = true
  const controller = AddTeamController.getInstance()
  await controller.addTeam(new AddTeamExcelParams({ data }), router, true)
  isSubmitting.value = false

  if (controller.isDataSuccess()) emit('uploaded')
}
</script>

<template>
  <div class="upload-team-sheet">
    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    <p v-if="isLoading" class="loading-message">Processing file…</p>

    <FileUpload
      v-if="!isLoading && rows.length === 0"
      accept=".xls,.xlsx"
      @update:fileData="readExcelFile"
    />

    <ExcelSheetColumnsHandle
      v-if="rows.length && !mappedRows"
      :visable="true"
      :columns="rows[0].map(String)"
      :sentData="['title']"
      :sentDataLabels="{ title: 'Team Title' }"
      @update:columnMapping="onColumnMapping"
      @close="resetUnconfirmedMapping"
    />

    <template v-if="mappedRows?.length">
      <div class="preview-header">
        <h3>Mapped Data Preview</h3>
        <span>{{ mappedRows.length - 1 }} rows</span>
      </div>

      <div class="table-responsive">
        <table class="main-table">
          <thead>
            <tr>
              <th>{{ mappedRows[0][0] }}</th>
              <th class="actions-column"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, rowIndex) in mappedRows.slice(1)" :key="rowIndex">
              <td>{{ row[0] }}</td>
              <td>
                <button type="button" class="delete-row" @click="deleteRow(rowIndex)">🗑</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <button type="button" class="confirm-button" :disabled="isSubmitting" @click="submitTeams">
        {{ isSubmitting ? 'Submitting…' : 'Confirm & Submit' }}
      </button>
    </template>
  </div>
</template>

<style scoped>
.upload-team-sheet {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.error-message {
  padding: 12px 16px;
  border-radius: 10px;
  color: var(--status-danger);
  background: var(--status-danger-soft);
}

.loading-message {
  padding: 12px 16px;
  border-radius: 10px;
  color: var(--brand-primary-600);
  background: var(--brand-primary-50);
}

.preview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 4px;
}

.preview-header h3 {
  font-size: 18px;
  font-weight: 600;
}

.preview-header span {
  color: var(--text-soft);
}

.actions-column {
  width: 64px;
}

.delete-row {
  padding: 6px 10px;
  border: 1px solid var(--status-danger-soft);
  border-radius: 8px;
  background: var(--status-danger-soft);
  cursor: pointer;
}

.confirm-button {
  width: 100%;
  padding: 14px;
  border: 0;
  border-radius: 12px;
  color: var(--text-on-brand);
  background: var(--brand-primary-500);
  font-weight: 600;
  cursor: pointer;
}

.confirm-button:disabled {
  cursor: wait;
  opacity: 0.65;
}
</style>
