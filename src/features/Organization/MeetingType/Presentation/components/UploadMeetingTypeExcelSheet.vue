<script setup lang="ts">
import { ref, watch } from 'vue'
import * as XLSX from 'xlsx'
import { useRouter } from 'vue-router'
import ExcelSheetColumnsHandle from '@/features/Organization/OrganizationEmployee/Presentation/supcomponents/ExcelSheetHandle/ExcelSheetColumnsHandle.vue'
import FileUpload from '@/features/Organization/OrganizationEmployee/Presentation/supcomponents/ExcelSheetHandle/FileUpload.vue'
import AddMeetingTypeController from '../controllers/addMeetingTypeController'
import AddMeetingTypeExcelParams from '../../Core/params/addMeetingTypeExcelParams'
import {
  PeriodicTypeEnum,
  parsePeriodicType,
  validatePeriodicNumberOfDays,
} from '../../Core/Enum/periodic_type_enum'
import { OpenWarningDilaog } from '@/base/Presentation/utils/OpenWarningDialog'

const props = defineProps<{ initialFile?: File | null }>()
const emit = defineEmits<{ (e: 'uploaded'): void }>()

const Data = ref<any[]>([])
const mappedData = ref<any[] | null>(null)
const isLoading = ref(false)
const errorMsg = ref<string | null>(null)
const router = useRouter()

const readExcelFile = (file: File): Promise<any[]> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const arrayBuffer = event.target?.result
        const workbook = XLSX.read(arrayBuffer, { type: 'array' })
        const sheet = workbook.Sheets[workbook.SheetNames[0]]
        const data = XLSX.utils.sheet_to_json(sheet, {
          header: 1,
          raw: false,
          defval: '',
          blankrows: false,
        }) as any[]
        Data.value = data
        resolve(data)
      } catch (error) {
        reject(error)
      }
    }
    reader.onerror = (error) => reject(error)
    reader.readAsArrayBuffer(file)
  })

const fileUpload = async (file: File | null) => {
  errorMsg.value = null
  mappedData.value = null

  if (!file) {
    Data.value = []
    return
  }

  try {
    isLoading.value = true
    await readExcelFile(file)
  } catch (error) {
    console.error('Error processing meeting type Excel file:', error)
    errorMsg.value = 'Failed to process the file.'
    Data.value = []
  } finally {
    isLoading.value = false
  }
}

watch(
  () => props.initialFile,
  async (file) => {
    if (file) await fileUpload(file)
  },
  { immediate: true },
)

const SendData = ref<string[]>(['title', 'description', 'periodic_type', 'number_of_days'])
const SendDataLabels: Record<string, string> = {
  title: 'Meeting Type Title',
  description: 'Meeting Type Description',
  periodic_type: 'Periodic Type (1 Daily, 2 Weekly, 3 Monthly, 4 Yearly, 5 Dates)',
  number_of_days: 'Number Of Days',
}

const onColumnMapping = (mapping: Record<string, string>) => {
  if (!Data.value.length) return

  const reverseMapping: Record<string, string> = {}
  for (const [sentKey, excelColumn] of Object.entries(mapping)) {
    if (excelColumn) reverseMapping[excelColumn] = sentKey
  }

  const cloned: any[] = Data.value.map((row: any[]) => [...row])
  cloned[0] = cloned[0].map((column: string) => reverseMapping[column] ?? column)
  mappedData.value = cloned
}

const normalizeNumberOfDays = (value: unknown): number | null => {
  if (value === '' || value === null || value === undefined) return null
  const number = Number(value)
  return Number.isFinite(number) ? number : null
}

const buildRows = () => {
  if (!mappedData.value?.length) return []

  const headers = mappedData.value[0] as string[]
  return mappedData.value.slice(1).map((row: any[]) => {
    const obj: Record<string, any> = {}
    headers.forEach((key, index) => {
      if (key && key.trim() !== '') obj[key] = row[index]
    })

    const periodicType = parsePeriodicType(obj.periodic_type)
    return {
      title: String(obj.title ?? '').trim(),
      description: String(obj.description ?? '').trim(),
      periodic_type: periodicType ?? (Number(obj.periodic_type) as PeriodicTypeEnum),
      number_of_days:
        periodicType === PeriodicTypeEnum.DAILY ? null : normalizeNumberOfDays(obj.number_of_days),
    }
  })
}

const validateRows = (rows: ReturnType<typeof buildRows>) => {
  if (!rows.length) return 'At least one data row is required'

  for (let index = 0; index < rows.length; index++) {
    const row = rows[index]
    const excelRow = index + 2

    if (!row.title || !row.description) {
      return `Title and description are required in Excel row ${excelRow}`
    }

    if (![1, 2, 3, 4, 5].includes(Number(row.periodic_type))) {
      return `Periodic type must be 1, 2, 3, 4 or 5 in Excel row ${excelRow}`
    }

    const error = validatePeriodicNumberOfDays(
      Number(row.periodic_type) as PeriodicTypeEnum,
      row.number_of_days,
    )
    if (error) return `${error} in Excel row ${excelRow}`
  }

  return null
}

const addMeetingTypeController = AddMeetingTypeController.getInstance()
const addMeetingTypes = async () => {
  const rows = buildRows()
  const validationError = validateRows(rows)
  if (validationError) {
    new OpenWarningDilaog(validationError).openDialog()
    return
  }

  const params = new AddMeetingTypeExcelParams({ data: rows })
  await addMeetingTypeController.addMeetingType(params, router)
  if (addMeetingTypeController.isDataSuccess()) emit('uploaded')
}

const deleteRow = (rowIndex: number) => {
  if (!mappedData.value) return
  mappedData.value = [
    mappedData.value[0],
    ...mappedData.value.slice(1).filter((_, index) => index !== rowIndex),
  ]
}

const onMappingClose = () => {
  if (!mappedData.value) Data.value = []
}
</script>

<template>
  <div class="page-wrapper">
    <div class="excel-warning">
      <div class="warning-header">
        <span class="title">Meeting Type Excel Rules</span>
      </div>
      <div class="rule-description">
        periodic_type: 1 = Daily, 2 = Weekly, 3 = Monthly, 4 = Yearly, 5 = Dates.
        number_of_days is empty for Daily, required for all other types. Weekly must be less
        than 7, Monthly less than 30, and Yearly less than 365.
      </div>
    </div>

    <div v-if="errorMsg" class="error-banner">{{ errorMsg }}</div>

    <div v-if="isLoading" class="loading-bar">
      <span class="loading-label">Processing file…</span>
    </div>

    <FileUpload
      v-if="!Data.length"
      accept=".xls,.xlsx"
      @update:fileData="fileUpload"
    />

    <template v-else>
      <ExcelSheetColumnsHandle
        v-if="!mappedData"
        :visable="true"
        :columns="Data[0]"
        :sentData="SendData"
        :sentDataLabels="SendDataLabels"
        @update:columnMapping="onColumnMapping"
        @close="onMappingClose"
      />

      <template v-if="mappedData && mappedData.length > 0">
        <div class="table-container">
          <div class="table-header">
            <h3 class="table-title">Mapped Data Preview</h3>
            <span class="table-badge">{{ mappedData.length - 1 }} rows</span>
          </div>
          <div class="table-responsive">
            <table class="main-table">
              <thead>
                <tr>
                  <th v-for="(item, index) in mappedData[0]" :key="index">
                    <span v-if="item === 'periodic_type'">Periodic Type</span>
                    <span v-else-if="item === 'number_of_days'">Number Of Days</span>
                    <span v-else>{{ item }}</span>
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
                    <button class="btn-delete-row" type="button" @click="deleteRow(rowIndex)">
                      🗑
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <button class="btn-confirm" type="button" @click="addMeetingTypes">
          Confirm & Submit
        </button>
      </template>
    </template>
  </div>
</template>

<style scoped>
.excel-warning {
  margin-bottom: 16px;
  padding: 16px;
  border: 1px solid var(--brand-primary-100);
  border-radius: 12px;
  background: var(--brand-primary-50);
}
.warning-header {
  margin-bottom: 8px;
}
.warning-header .title {
  color: var(--brand-primary-700);
  font-size: 16px;
  font-weight: 700;
}
.rule-description {
  color: var(--text-soft);
  font-size: 13px;
  line-height: 1.7;
}
.error-banner {
  margin-bottom: 12px;
  color: var(--status-danger);
  font-weight: 600;
}
.loading-bar {
  margin-bottom: 12px;
}
.table-container {
  margin-top: 16px;
}
.table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}
.table-title {
  font-size: 18px;
  font-weight: 700;
}
.table-badge {
  font-size: 13px;
  color: var(--text-soft);
}
.last {
  display: table-cell !important;
}
.btn-delete-row {
  cursor: pointer;
  border: 0;
  background: transparent;
}
.btn-confirm {
  width: 100%;
  margin-top: 16px;
  padding: 14px;
  background: var(--brand-primary-500);
  color: var(--text-on-brand);
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
}
</style>
