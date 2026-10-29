<script setup lang="ts">
import { translate as localizeUi } from '@/localization/i18n'

import LookupIndustryScope from '@/shared/HelpersComponents/LookupIndustryScope.vue'
import { useLookupIndustryScope } from '@/composables/useLookupIndustryScope'

import { readLookupRows } from '@/shared/utils/lookupExcel'
import { ref, watch } from 'vue'
import * as XLSX from 'xlsx'
import { useRouter } from 'vue-router'

const props = defineProps<{ initialFile?: File | null }>()
const emit = defineEmits<{ (e: 'uploaded'): void }>()

import ExcelSheetColumnsHandle from '@/features/Organization/OrganizationEmployee/Presentation/supcomponents/ExcelSheetHandle/ExcelSheetColumnsHandle.vue'
import FileUpload from '@/features/Organization/OrganizationEmployee/Presentation/supcomponents/ExcelSheetHandle/FileUpload.vue'
import PTWTypeModel from '../../Data/models/PTWTypeModel'
import AddPTWTypeController from '../controllers/addPTWTypeController'
import AddPTWTypeExcelParams from '../../Core/params/addPTWTypeExcelParams'

// ─── State ────────────────────────────────────────────────────────────────────
const sheetData = ref<PTWTypeModel[] | null>(null)
const Data = ref<string[][]>([])
const mappedData = ref<string[][] | null>(null)
const isLoading = ref(false)
const errorMsg = ref<string | null>(null)
const ptwColor = ref('#ff0000')

const router = useRouter()

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getBodyData = (data: string[][]) => PTWTypeModel.transformData(data.slice(1))

// ─── Image Extraction ─────────────────────────────────────────────────────────
// ─── File Reading ─────────────────────────────────────────────────────────────
const readExcelFile = (file: File): Promise<string[][]> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const arrayBuffer = e.target?.result
        const workbook = XLSX.read(arrayBuffer, { type: 'array' })
        const sheet = workbook.Sheets[workbook.SheetNames[0]]
        const data = readLookupRows<string[]>(sheet, {
          header: 1,
          raw: false,
          defval: '',
          blankrows: false,
        })
        Data.value = data
        resolve(data)
      } catch (err) {
        reject(err)
      }
    }
    reader.onerror = (err) => reject(err)
    reader.readAsArrayBuffer(file)
  })

// ─── Upload Handler ───────────────────────────────────────────────────────────
const fileUpload = async (file: File | null) => {
  errorMsg.value = null
  try {
    if (!file) {
      sheetData.value = null
      mappedData.value = null
      return
    }
    isLoading.value = true
    const data = await readExcelFile(file)
    sheetData.value = getBodyData(data)
    mappedData.value = null
  } catch (error) {
    console.error('Error processing file:', error)
    errorMsg.value = localizeUi('failed_to_process_file')
  } finally {
    isLoading.value = false
  }
}

watch(
  () => props.initialFile,
  async (file) => {
    if (!file) return
    await fileUpload(file)
    mappedData.value = Data.value
  },
  { immediate: true },
)

// ─── Column Mapping ───────────────────────────────────────────────────────────
const SendData = ref<string[]>(['title'])
const SendDataLabels: Record<string, string> = {
  get title() {
    return localizeUi('Permit To Work Type Title')
  },
}
const onColumnMapping = (mapping: Record<string, string>) => {
  if (!Data.value || Data.value.length === 0) return
  const reverseMapping: Record<string, string> = {}
  for (const [sentKey, excelCol] of Object.entries(mapping)) {
    if (excelCol) reverseMapping[excelCol] = sentKey
  }
  const cloned = Data.value.map((row) => [...row])
  cloned[0] = cloned[0].map((col: string) => reverseMapping[col] ?? col)

  mappedData.value = cloned
  sheetData.value = getBodyData(cloned)
}

// ─── Submit ───────────────────────────────────────────────────────────────────
const addPTWTypeController = AddPTWTypeController.getInstance()

const addPTWTypes = async () => {
  if (!validateIndustryScope()) return
  if (!mappedData.value) return
  const headers = mappedData.value[0] as string[]
  const rows = mappedData.value.slice(1)

  const dataAsObjects = rows.map((row) => {
    const obj: Record<string, string> = {}
    headers.forEach((key, i) => {
      if (key && key.trim() !== '') obj[key] = row[i]
    })
    return {
      title: String(obj.title ?? ''),
      color: ptwColor.value,
    }
  })

  const orgData = new AddPTWTypeExcelParams({ data: dataAsObjects }, getIndustryScope())
  await addPTWTypeController.addPTWType(orgData, router)
  if (addPTWTypeController.isDataSuccess()) {
    emit('uploaded')
  }
}

const deleteRow = (rowIndex: number) => {
  if (!mappedData.value) return

  // Remove the data row (rowIndex + 1 because row 0 is the header)
  mappedData.value = [
    mappedData.value[0],
    ...mappedData.value.slice(1).filter((_, i) => i !== rowIndex),
  ]
}

const onMappingClose = () => {
  if (!mappedData.value) {
    // Closed without confirming, reset to allow re-upload
    Data.value = []
    sheetData.value = null
  }
}

const { industryScope, getIndustryScope, validateIndustryScope } = useLookupIndustryScope()
</script>

<template>
  <LookupIndustryScope v-model="industryScope" />
  <div class="page-wrapper">
    <div v-if="errorMsg" class="error-banner">{{ errorMsg }}</div>

    <div v-if="isLoading" class="loading-bar">
      <span class="loading-dot" />
      <span class="loading-dot" />
      <span class="loading-dot" />
      <span class="loading-label">{{ $t('processing_file') }}</span>
    </div>

    <FileUpload
      v-if="!Data || Data.length === 0"
      accept=".xls,.xlsx"
      @update:fileData="fileUpload"
    />

    <template v-else>
      <ExcelSheetColumnsHandle
        v-if="!mappedData"
        :visable="true"
        :columns="Data[0]"
        :sentData="SendData"
        @update:columnMapping="onColumnMapping"
        :sentDataLabels="SendDataLabels"
        @close="onMappingClose"
      />

      <template v-if="mappedData && mappedData.length > 0">
        <div class="ptw-color-field">
          <label class="ptw-color-field__label" for="ptw_excel_color">
            {{ $t('main_color') }}
          </label>
          <div class="ptw-color-field__control">
            <input
              id="ptw_excel_color"
              v-model="ptwColor"
              class="ptw-color-field__picker"
              name="ptw_excel_color"
              type="color"
              :aria-label="$t('main_color')"
            />
            <output class="ptw-color-field__value" for="ptw_excel_color">
              {{ ptwColor.toUpperCase() }}
            </output>
          </div>
        </div>

        <div class="table-container">
          <div class="table-header">
            <h3 class="table-title">{{ $t('Mapped Data Preview') }}</h3>
            <span class="table-badge">{{ mappedData.length - 1 }} {{ $t('rows') }}</span>
          </div>
          <div class="table-responsive hse-table-scroll">
            <table v-table-identity class="main-table hse-data-table">
              <thead>
                <tr>
                  <th v-for="(item, i) in mappedData[0]" :key="i">
                    <span>{{ item }}</span>
                  </th>

                  <th class="last"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, rowIndex) in mappedData.slice(1)" :key="rowIndex">
                  <!-- {{ row[7] }} -->
                  <td v-for="(value, colIndex) in row" :key="colIndex">
                    <span>{{ value }}</span>
                  </td>
                  <td>
                    <button
                      class="btn-delete-row"
                      @click="deleteRow(rowIndex)"
                      :title="$t('delete_row')"
                    >
                      🗑
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <button class="btn-confirm" @click="addPTWTypes">{{ $t('Confirm & Submit') }}</button>
      </template>
    </template>
  </div>
</template>

<style scoped>
.ptw-color-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.ptw-color-field__label {
  color: var(--GrayText-1);
  font-size: 0.875rem;
  font-weight: 600;
}

.ptw-color-field__control {
  display: flex;
  min-height: 48px;
  align-items: center;
  gap: 0.75rem;
  padding: 0.375rem 0.75rem;
  border: 1px solid var(--main-border);
  border-radius: 0.5rem;
  background: var(--BgWhite);
}

.ptw-color-field__picker {
  width: 42px;
  height: 34px;
  padding: 0;
  overflow: hidden;
  border: 0;
  border-radius: 0.375rem;
  background: transparent;
  cursor: pointer;
}

.ptw-color-field__picker::-webkit-color-swatch-wrapper {
  padding: 0;
}

.ptw-color-field__picker::-webkit-color-swatch,
.ptw-color-field__picker::-moz-color-swatch {
  border: 0;
  border-radius: 0.375rem;
}

.ptw-color-field__picker:focus-visible {
  outline: 2px solid var(--PrimaryColor);
  outline-offset: 2px;
}

.ptw-color-field__value {
  color: var(--GrayText-1);
  font-family: monospace;
  font-size: 0.875rem;
  font-weight: 700;
  letter-spacing: 0.04em;
}

.last {
  display: table-cell !important;
}
.title-container {
  .title {
    color: var(--brand-primary-600);
    font-size: 20px;
    font-weight: 600;
  }

  .sub-title {
    color: var(--brand-primary-800);
    font-size: 16px;
    font-weight: 500;
  }
}

.icon {
  width: 30px;
  height: 30px;
}

a {
  background-color: var(--text-on-brand);
  display: flex;
  align-items: center;
  padding: 12px;
  border-radius: 6px;
  width: fit-content;
  border: 1px solid var(--brand-primary-100);
  cursor: pointer;
  transition: 0.3s all linear;
}

a:hover {
  background-color: var(--brand-primary-100);
}

.download-title {
  font-family: 'Regular';
  font-size: 14px;
  font-weight: 500;
}

.excel-warning {
  /* background-color: var(--brand-accent-50); */
  /* Light cream/amber */
  /* border: 1px solid var(--brand-accent-200); */
  /* Amber border */
  border-radius: 12px;
  padding: 20px;
  max-width: 100%;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  box-shadow: 0 4px 6px -1px color-mix(in srgb, var(--text-strong) 5%, transparent);
}

.warning-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
  /* border-bottom: 1px ridge var(--brand-accent-200); */
  padding-bottom: 10px;
}

.warning-header .title {
  color: var(--brand-primary-600);
  /* Deep amber/brown */
  font-weight: 700;
  font-size: 1.1rem;
}

.rule-group {
  margin-bottom: 15px;
}

.rule-group:last-child {
  margin-bottom: 0;
}

.rule-label {
  font-size: 22px;
  font-weight: 700;
  color: var(--brand-primary-800);
  font-family: 'Regular';
  /* margin-bottom: 8px; */
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

.chip {
  background: var(--brand-primary-50);
  border: 1px solid var(--brand-primary-100);
  padding: 10px 38px;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 600;
  color: var(--brand-primary-600);
  display: flex;
  align-items: center;
  gap: 8px;
  transition: transform 0.2s ease;
}

.chip:hover {
  transform: translateY(-2px);
  border-color: var(--brand-primary-200);
}

/* The "Key" look for numbers */
kbd {
  background-color: color-mix(in srgb, var(--brand-primary-500) 10.2%, transparent);
  border-radius: 6px;
  /* border: 1px solid var(--brand-primary-200); */
  /* box-shadow: 0 1px 1px color-mix(in srgb, var(--text-strong) 20%, transparent), 0 2px 0 0 color-mix(in srgb, var(--surface-1) 70%, transparent) inset; */
  color: var(--brand-primary-600);
  display: inline-block;
  font-size: 1rem;
  font-weight: 700;
  line-height: 1;
  padding: 2px 6px;
  white-space: nowrap;
}

.field-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  background: color-mix(in srgb, var(--surface-1) 50%, transparent);
  padding: 10px;
  border-radius: 8px;
  /* border: 1px dashed var(--brand-accent-200); */
}

.field-tag {
  background: var(--brand-primary-50);
  color: var(--text-strong);
  font-family: 'Light';
  /* Makes it look like code/field names */
  font-size: 18px;
  font-weight: 600;
  padding: 10px 24px;
  border-radius: 12px;
  /* border: 1px solid var(--brand-primary-100); */
}

/* A subtle line to separate headers from values */
.separator {
  border: 0;
  border-top: 1px solid var(--brand-primary-50);
  margin: 15px 0;
}

/* Ensure the rules container wraps nicely on small screens */
@media (max-width: 600px) {
  .rules {
    flex-direction: column;
    align-items: flex-start;
  }
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
  background: var(--status-danger-soft);
  transform: scale(1.1);
}

.page-wrapper {
  display: flex;
  flex-direction: column;
  gap: 16px;
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
  padding: 10px;
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

.row-thumb {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid var(--brand-primary-100);
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

.no-img-text {
  color: var(--text-soft);
}
</style>
