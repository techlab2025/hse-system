<script setup lang="ts">
import { readLookupRows } from '@/shared/utils/lookupExcel'
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import * as XLSX from 'xlsx'
import { useRouter } from 'vue-router'
import ExcelSheetColumnsHandle from '@/features/Organization/OrganizationEmployee/Presentation/supcomponents/ExcelSheetHandle/ExcelSheetColumnsHandle.vue'
import FileUpload from '@/features/Organization/OrganizationEmployee/Presentation/supcomponents/ExcelSheetHandle/FileUpload.vue'
import { useUserStore } from '@/stores/user'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'
import { OpenWarningDilaog } from '@/base/Presentation/utils/OpenWarningDialog'
import AddMeetingTypeController from '../controllers/addMeetingTypeController'
import AddMeetingTypeExcelParams from '../../Core/params/addMeetingTypeExcelParams'
import {
  buildMeetingTypeExcelRows,
  meetingTypeExcelFields,
  normalizeMeetingTypeHeader,
  type ExcelSheet,
} from '../utils/meetingTypeExcel'

const props = defineProps<{ initialFile?: File | null }>()
const emit = defineEmits<{ (e: 'uploaded'): void }>()
const user = useUserStore()
const isAdmin = computed(() => user.user?.type === OrganizationTypeEnum.ADMIN)
const Data = ref<ExcelSheet>([])
const mappedData = ref<ExcelSheet | null>(null)
const isLoading = ref(false)
const isSubmitting = ref(false)
const errorMsg = ref('')
const router = useRouter()
let uploadRevision = 0
const SendData = computed(() => meetingTypeExcelFields(isAdmin.value))
const SendDataLabels: Record<string, string> = {
  title: 'Meeting Type Title',
  periodic_type: 'Periodic Type (1 Daily, 2 Weekly, 3 Monthly, 4 Yearly, 5 Dates)',
  number_of_days: 'Number Of Days',
  all_industries: 'All Industries (1 Yes, 0 No)',
  industry_ids: 'Industry IDs (comma-separated)',
}

const fileUpload = async (file: File | null) => {
  const revision = ++uploadRevision
  errorMsg.value = ''
  mappedData.value = null
  Data.value = []
  if (!file) {
    isLoading.value = false
    return
  }
  isLoading.value = true
  try {
    const workbook = XLSX.read(await file.arrayBuffer(), { type: 'array' })
    if (revision !== uploadRevision) return
    const sheet = workbook.Sheets[workbook.SheetNames[0]]
    if (!sheet) throw new Error('The workbook does not contain a worksheet.')
    const data = readLookupRows(sheet, {
      header: 1,
      raw: false,
      defval: '',
      blankrows: false,
    }) as ExcelSheet
    if (data.length < 2) throw new Error('At least one data row is required.')
    const headers = data[0].map(normalizeMeetingTypeHeader)
    const named = headers.filter(Boolean)
    if (new Set(named).size !== named.length) throw new Error('Excel column names must be unique.')
    Data.value = data
    if (headers.includes('title') && headers.includes('periodic_type')) {
      mappedData.value = [headers, ...data.slice(1)]
    }
  } catch (error) {
    if (revision !== uploadRevision) return
    Data.value = []
    errorMsg.value = error instanceof Error ? error.message : 'Failed to process the file.'
  } finally {
    if (revision === uploadRevision) isLoading.value = false
  }
}
watch(
  () => props.initialFile,
  (file) => {
    void fileUpload(file ?? null)
  },
  { immediate: true },
)
onBeforeUnmount(() => {
  uploadRevision++
})

const onColumnMapping = (mapping: Record<string, string>) => {
  const reverseMapping = Object.fromEntries(
    Object.entries(mapping)
      .filter(([, column]) => column)
      .map(([key, column]) => [column, key]),
  )
  mappedData.value = [
    Data.value[0].map(
      (column) => reverseMapping[String(column)] ?? normalizeMeetingTypeHeader(column),
    ),
    ...Data.value.slice(1).map((row) => [...row]),
  ]
}
const deleteRow = (rowIndex: number) => {
  if (!mappedData.value || isSubmitting.value) return
  mappedData.value = [
    mappedData.value[0],
    ...mappedData.value.slice(1).filter((_, index) => index !== rowIndex),
  ]
  errorMsg.value = ''
}
const onMappingClose = () => {
  if (!mappedData.value) Data.value = []
}
const addMeetingTypeController = AddMeetingTypeController.getInstance()
const addMeetingTypes = async () => {
  if (isSubmitting.value || !mappedData.value) return
  errorMsg.value = ''
  let params: AddMeetingTypeExcelParams
  try {
    params = new AddMeetingTypeExcelParams({
      data: buildMeetingTypeExcelRows(mappedData.value, isAdmin.value),
    })
  } catch (error) {
    errorMsg.value = error instanceof Error ? error.message : 'Check the imported rows.'
    new OpenWarningDilaog(errorMsg.value).openDialog()
    return
  }
  isSubmitting.value = true
  try {
    addMeetingTypeController.setLoading()
    await addMeetingTypeController.addMeetingType(params, router)
    if (addMeetingTypeController.isDataSuccess()) emit('uploaded')
  } catch {
    errorMsg.value = 'The meeting types could not be imported. Your preview is still available.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="page-wrapper meeting-type-excel-import">
    <div class="excel-warning">
      <div class="warning-header"><span class="title">Meeting Type Excel Rules</span></div>
      <div class="rule-description">
        Fields: title, periodic_type, number_of_days. Periodic type: 1 = Daily, 2 = Weekly, 3 =
        Monthly, 4 = Yearly, 5 = Dates. Leave number_of_days empty for Daily. Other types require a
        positive whole number: Weekly up to 6, Monthly up to 29, Yearly up to 364.
      </div>
      <p v-if="isAdmin" class="rule-description">
        all_industries: 1 = all industries, 0 = selected industries. For selected industries, enter
        their actual IDs separated by commas in industry_ids. Industry IDs are ignored when
        all_industries is 1.
      </p>
    </div>
    <div v-if="errorMsg" class="error-banner" role="alert">{{ errorMsg }}</div>
    <div v-if="isLoading" class="loading-bar" role="status">
      <span class="loading-dot" /><span class="loading-dot" /><span class="loading-dot" />
      <span class="loading-label">Processing file…</span>
    </div>
    <FileUpload
      v-if="!Data.length && !isLoading"
      accept=".xls,.xlsx"
      @update:fileData="fileUpload"
    />
    <template v-if="Data.length">
      <ExcelSheetColumnsHandle
        v-if="!mappedData"
        :visable="true"
        :columns="Data[0].map((value) => String(value ?? ''))"
        :sentData="SendData"
        :sentDataLabels="SendDataLabels"
        @update:columnMapping="onColumnMapping"
        @close="onMappingClose"
      />
      <template v-if="mappedData">
        <div class="table-container">
          <div class="table-header">
            <h3 class="table-title">Mapped Data Preview</h3>
            <span class="table-badge">{{ mappedData.length - 1 }} rows</span>
          </div>
          <div class="table-responsive">
            <table class="main-table">
              <thead>
                <tr>
                  <th v-for="(field, index) in mappedData[0]" :key="index">
                    {{ SendDataLabels[String(field)] ?? field }}
                  </th>
                  <th class="last"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, rowIndex) in mappedData.slice(1)" :key="rowIndex">
                  <td v-for="(value, colIndex) in row" :key="colIndex">
                    <span>{{ value }}</span>
                  </td>
                  <td>
                    <button
                      class="btn-delete-row"
                      type="button"
                      title="Delete row"
                      :aria-label="`Delete row ${rowIndex + 1}`"
                      :disabled="isSubmitting"
                      @click="deleteRow(rowIndex)"
                    >
                      🗑
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <button
          class="btn-confirm"
          type="button"
          :disabled="isSubmitting || mappedData.length < 2"
          @click="addMeetingTypes"
        >
          {{ isSubmitting ? 'Importing…' : 'Confirm & Submit' }}
        </button>
      </template>
    </template>
  </div>
</template>

<style scoped>
.page-wrapper {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.excel-warning {
  padding: 20px;
  border: 1px solid var(--brand-primary-100);
  border-radius: 12px;
  background: var(--brand-primary-50);
}
.warning-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}
.warning-header .title {
  color: var(--brand-primary-600);
  font-weight: 700;
  font-size: 1.1rem;
}
.rule-description {
  color: var(--text-soft);
  font-size: 0.8rem;
  line-height: 1.7;
}
.error-banner {
  background: var(--status-danger-soft);
  color: var(--status-danger);
  border: 1px solid var(--status-danger-soft);
  border-radius: 10px;
  padding: 12px 16px;
}
.loading-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: var(--brand-primary-50);
  border-radius: 10px;
}
.loading-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--brand-primary-400);
  animation: bounce 1s infinite alternate;
}
@keyframes bounce {
  from {
    transform: translateY(0);
    opacity: 0.6;
  }
  to {
    transform: translateY(-6px);
    opacity: 1;
  }
}
.table-container {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 16px color-mix(in srgb, var(--text-strong) 6%, transparent);
  background: var(--surface-1);
}
.table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px;
}
.table-title {
  font-size: 18px;
  font-weight: 700;
}
.table-badge {
  font-size: 13px;
  color: var(--text-soft);
}
.table-responsive {
  overflow-x: auto;
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
  background: var(--status-danger-soft);
  color: var(--status-danger);
  border: 1px solid var(--status-danger-soft);
  border-radius: 8px;
  padding: 6px 10px;
  cursor: pointer;
  font-size: 14px;
  transition:
    background 0.2s,
    transform 0.15s;
}
.btn-delete-row:hover {
  transform: scale(1.1);
}
.btn-confirm {
  width: 100%;
  padding: 14px;
  background: var(--brand-primary-500);
  color: var(--text-on-brand);
  border-radius: 12px;
  cursor: pointer;
  border: none;
  font-weight: 600;
}
:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
@media (prefers-reduced-motion: reduce) {
  .loading-dot {
    animation: none;
  }
}
</style>
