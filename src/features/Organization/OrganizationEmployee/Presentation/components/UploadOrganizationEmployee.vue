<script setup lang="ts">
import { filesToBase64 } from '@/base/Presentation/utils/file_to_base_64'
import { computed, ref, watch } from 'vue'
import * as XLSX from 'xlsx'
import JSZip from 'jszip'
import FileUpload from '../supcomponents/ExcelSheetHandle/FileUpload.vue'
import OrganizatoinEmployeeModel from '../../Data/models/OrganizatoinEmployeeModel'
import ExcelSheetColumnsHandle from '../supcomponents/ExcelSheetHandle/ExcelSheetColumnsHandle.vue'
import AddOrganizatoinEmployeeController from '../controllers/addOrganizatoinEmployeeController'
import AddOrganizationEmployeeExcelParams from '../../Core/params/AddOrganizationEmployeeExcelParams'
import { useRouter } from 'vue-router'
import AddTeamController from '@/features/setting/Teams/Presentation/controllers/addTeamController'
import UpdatedCustomInputSelect from '@/shared/FormInputs/UpdatedCustomInputSelect.vue'
import type TitleInterface from '@/base/Data/Models/title_interface'
import IndexHerikalyParams from '@/features/Organization/Herikaly/Core/params/indexHerikalyParams'
import IndexHerikalyController from '@/features/Organization/Herikaly/Presentation/controllers/indexHerikalyController'
import HirarachyEmployeeParams from '../../Core/params/HirarchyParams'
import ExcelSheetIcon from '@/shared/icons/ExcelSheetIcon.vue'
import ExcelSheetHeaderIcon from '@/shared/icons/ExcelSheetHeaderIcon.vue'
import { ValidationStatusEnum } from '../../Core/Enum/ValidationStatusEnum'
import { DataInitial } from '@/base/core/networkStructure/Resources/dataState/data_state'

const props = defineProps<{ initialFile?: File | null }>()
const emit = defineEmits<{ (e: 'uploaded'): void }>()

// ─── Types ────────────────────────────────────────────────────────────────────

interface ExtractedImage {
  name: string
  base64: string // full data-URI
  mimeType: string
}

// ─── State ────────────────────────────────────────────────────────────────────

const sheetData = ref<OrganizatoinEmployeeModel[] | null>(null)
const File = ref<string>('')
const Data = ref<any[]>([])
const mappedData = ref<any[] | null>(null)
const extractedImages = ref<ExtractedImage[]>([])
const isLoading = ref(false)
const errorMsg = ref<string | null>(null)

// ─── Helpers ──────────────────────────────────────────────────────────────────

const MIME_MAP: Record<string, string> = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  bmp: 'image/bmp',
  webp: 'image/webp',
}

const getBodyData = (data: any[]) => OrganizatoinEmployeeModel.transformData(data.slice(1))

// ─── Image Extraction ─────────────────────────────────────────────────────────

/**
 * Reads the xl/media/ folder of the xlsx (which is just a ZIP)
 * and returns every image found as a base64 data-URI.
 */
const extractImagesFromExcel = async (file: File): Promise<ExtractedImage[]> => {
  const arrayBuffer = await file.arrayBuffer()
  const zip = await JSZip.loadAsync(arrayBuffer)
  const images: ExtractedImage[] = []

  const mediaFolder = zip.folder('xl/media')
  if (!mediaFolder) return images

  const promises: Promise<void>[] = []

  mediaFolder.forEach((relativePath, zipEntry) => {
    if (zipEntry.dir) return

    const ext = relativePath.split('.').pop()?.toLowerCase() ?? ''
    const mimeType = MIME_MAP[ext] ?? 'image/png'

    promises.push(
      zipEntry.async('base64').then((b64) => {
        images.push({
          name: relativePath,
          base64: `data:${mimeType};base64,${b64}`,
          mimeType,
        })
      }),
    )
  })

  await Promise.all(promises)
  return images
}

// ─── base64 → Blob (for multipart/form-data backends) ────────────────────────

const base64ToBlob = (dataURI: string): Blob => {
  const [header, data] = dataURI.split(',')
  const mimeType = header.match(/:(.*?);/)?.[1] ?? 'image/png'
  const binary = atob(data)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return new Blob([bytes], { type: mimeType })
}

// ─── File Reading ─────────────────────────────────────────────────────────────

const readExcelFile = (file: File): Promise<any[]> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const arrayBuffer = e.target?.result
        const workbook = XLSX.read(arrayBuffer, { type: 'array' })
        const sheet = workbook.Sheets[workbook.SheetNames[0]]
        const data = XLSX.utils.sheet_to_json(sheet, {
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

// ─── Submit controller (declared early — fileUpload below resets its state) ──

const addOrganizatoinEmployeeController = AddOrganizatoinEmployeeController.getInstance()
const Datastate = computed(() => addOrganizatoinEmployeeController.state.value)

// ─── Upload Handler ───────────────────────────────────────────────────────────

const fileUpload = async (file: File) => {
  errorMsg.value = null
  // Clear previous validation results so a new file always starts from a clean preview
  addOrganizatoinEmployeeController.setState(new DataInitial<OrganizatoinEmployeeModel[]>(null))
  try {
    if (!file) {
      sheetData.value = null
      mappedData.value = null
      extractedImages.value = []
      return
    }

    isLoading.value = true

    const [data, images] = await Promise.all([readExcelFile(file), extractImagesFromExcel(file)])

    sheetData.value = getBodyData(data)
    File.value = await filesToBase64(file)
    mappedData.value = null // reset on new file
    extractedImages.value = images

    console.log(`✅ Extracted ${images.length} image(s) from Excel`, images)
  } catch (error) {
    console.error('Error processing file:', error)
    errorMsg.value = 'Failed to process the file. Please try again.'
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

// ─── Validation Status (returned after submitting the excel) ─────────────────

const VALIDATION_STATUS_LABELS: Record<number, string> = {
  [ValidationStatusEnum.VALID]: 'Valid',
  [ValidationStatusEnum.PHONE_INVALID]: 'Invalid Phone',
  [ValidationStatusEnum.EMAIL_INVALID]: 'Invalid Email',
}

const getValidationStatusLabel = (status: number) => VALIDATION_STATUS_LABELS[status] ?? 'Unknown'

const getValidationStatusClass = (status: number) =>
  status === ValidationStatusEnum.VALID ? 'status-valid' : 'status-invalid'

// ─── Column Mapping ───────────────────────────────────────────────────────────

// , 'image'
const SendData = ref<string[]>(['name', 'email', 'phone'])

const SendDataLabels: Record<string, string> = {
  name: 'Employee Name',
  email: 'Email',
  phone: 'Phone',
}

const filterToSentData = ref(false)

const onColumnMapping = (mapping: Record<string, string>) => {
  if (!Data.value || Data.value.length === 0) return

  const reverseMapping: Record<string, string> = {}
  for (const [sentKey, excelCol] of Object.entries(mapping)) {
    if (excelCol) reverseMapping[excelCol] = sentKey
  }

  const cloned: any[] = Data.value.map((row: any[]) => [...row])
  cloned[0] = cloned[0].map((col: string) => reverseMapping[col] ?? col)

  if (filterToSentData.value) {
    const allowedKeys = new Set(SendData.value)
    const headerRow = cloned[0] as string[]
    const allowedIndexes = headerRow
      .map((key, i) => (allowedKeys.has(key) ? i : -1))
      .filter((i) => i !== -1)

    const filteredData = cloned.map((row) => allowedIndexes.map((i) => row[i]))
    filteredData[0] = allowedIndexes.map((i) => headerRow[i])

    mappedData.value = filteredData
    sheetData.value = getBodyData(filteredData)
  } else {
    mappedData.value = cloned
    sheetData.value = getBodyData(cloned)
  }
}

// ─── Submit ───────────────────────────────────────────────────────────────────

const router = useRouter()

const isCurrentlyAllValid = computed(() => {
  return (
    Datastate.value.data &&
    Datastate.value.data.length > 0 &&
    Datastate.value.data.every((el) => el.status === ValidationStatusEnum.VALID)
  )
})

const counter = ref(0)
const AddOrgEmployee = async () => {
  counter.value += 1
  if (!mappedData.value) return

  const headers = mappedData.value[0] as string[]
  const rows = mappedData.value.slice(1)

  const dataAsObjects = rows.map((row: any[], rowIndex: number) => {
    const obj: Record<string, any> = {}

    headers.forEach((key, i) => {
      if (key && key.trim() !== '') obj[key] = row[i]
    })

    // Attach hierarchy
    obj['hierarchies'] = [new HirarachyEmployeeParams(Heirarchy.value?.id)]

    // Attach image for this row (by index — sequential order)
    const img = extractedImages.value[rowIndex]
    if (img) {
      // Option A: send as base64 string
      obj['image'] = img.base64

      // Option B: send as Blob (for multipart/form-data) — uncomment if needed:
      // obj['image'] = base64ToBlob(img.base64);
    }

    return obj
  })

  const wasAllValidBeforeRequest = !!isCurrentlyAllValid.value

  const orgData = new AddOrganizationEmployeeExcelParams({
    data: dataAsObjects,
    isValid: wasAllValidBeforeRequest,
  })
  console.log('📤 Sending orgData:', orgData)
  await addOrganizatoinEmployeeController.addOrganizatoinEmployee(orgData, router)

  if (wasAllValidBeforeRequest && addOrganizatoinEmployeeController.isDataSuccess()) {
    emit('uploaded')
  }
}

// ─── Hierarchy ────────────────────────────────────────────────────────────────

const indexHerikalyController = IndexHerikalyController.getInstance()
const HerikalyParams = new IndexHerikalyParams('', 1, 10, 0, false)
const Heirarchy = ref<TitleInterface>()

const setHeirarchy = (data: TitleInterface) => {
  Heirarchy.value = data
}

const deleteRow = (rowIndex: number) => {
  if (!mappedData.value) return

  // Remove the data row (rowIndex + 1 because row 0 is the header)
  mappedData.value = [
    mappedData.value[0],
    ...mappedData.value.slice(1).filter((_, i) => i !== rowIndex),
  ]

  // Also remove the row from the validation results in controller state so the table updates
  if (addOrganizatoinEmployeeController.state.value.data) {
    addOrganizatoinEmployeeController.state.value.data = addOrganizatoinEmployeeController.state.value.data.filter((_, i) => i !== rowIndex)
  }

  // Remove the two images belonging to this row
  const imgBase = rowIndex * 2
  extractedImages.value = extractedImages.value.filter((_, i) => i !== imgBase && i !== imgBase + 1)
}

const onMappingClose = () => {
  if (!mappedData.value) {
    // Closed without confirming, reset to allow re-upload
    Data.value = []
    sheetData.value = null
    extractedImages.value = []
  }
}
</script>

<template>
  <div class="page-wrapper">
    <!-- <div class="excel-warning">
      <div class="warning-header flex item-center gap-2 justify-between w-full">
        <div class="flex item-center gap-2">
          <ExcelSheetHeaderIcon />
          <div class="title-container flex flex-col">
            <span class="title">excel instuctions</span>
            <span class="sub-title">A Step-by-Step Guide to Using the Spreadsheet</span>
          </div>
        </div>

        <a href="/EmployeeFrom.xlsx" class="flex item-center gap-2 " download>
          <ExcelSheetIcon class="icon" />
          <span class="download-title">Download Excel Sheet</span>
        </a>
      </div>

      <div class="rule-group">
        <div class="field-tags">
          <span class="field-tag">Employee Name</span>
          <span class="field-tag">Email</span>
          <span class="field-tag">Phone</span>
          <span class="field-tag">Password</span>
        </div>
      </div>



    </div> -->

    <!-- ── Hierarchy Select ─────────────────────────────────── -->
    <div class="grid grid-cols-6 gap-4 w-full mb-4">
      <div class="col-span-2 input-wrapper">
        <UpdatedCustomInputSelect
          :modelValue="Heirarchy"
          @update:modelValue="setHeirarchy"
          :controller="indexHerikalyController"
          :params="HerikalyParams"
          :label="$t('Job Type')"
          :placeholder="$t('Select Job Type')"
        />
      </div>
    </div>

    <!-- ── Error Banner ─────────────────────────────────────── -->
    <div v-if="errorMsg" class="error-banner">
      {{ errorMsg }}
    </div>

    <!-- ── Loading ──────────────────────────────────────────── -->
    <div v-if="isLoading" class="loading-bar">
      <span class="loading-dot" />
      <span class="loading-dot" />
      <span class="loading-dot" />
      <span class="loading-label">Processing file…</span>
    </div>

    <!-- ── Step 1 : Upload ──────────────────────────────────── -->
    <FileUpload
      v-if="!Data || Data.length === 0"
      accept=".xls,.xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,.csv"
      @update:fileData="fileUpload"
    />

    <template v-else>
      <!-- ── Step 2 : Column Mapping ────────────────────────── -->
      <ExcelSheetColumnsHandle
        v-if="!mappedData"
        :visable="true"
        :columns="Data[0]"
        :sentData="SendData"
        @update:columnMapping="onColumnMapping"
        :sentDataLabels="SendDataLabels"
        @close="onMappingClose"
      />

      <!-- ── Step 3 : Preview & Submit ─────────────────────── -->
      <template v-if="mappedData && mappedData.length > 0">
        <!-- Extracted Images Preview -->
        <!-- <div v-if="extractedImages.length > 0" class="images-section">
          <div class="images-header">
            <span class="images-title">Extracted Images</span>
            <span class="images-badge">{{ extractedImages.length }} image{{ extractedImages.length !== 1 ? 's' : ''
              }}</span>
          </div>
          <div class="images-grid">
            <div v-for="(img, index) in extractedImages" :key="index" class="image-card">
              <img :src="img.base64" :alt="`Image ${index + 1}`" class="image-thumb" />
              <span class="image-label">Row {{ index + 1 }}</span>
            </div>
          </div>
        </div> -->

        <!-- No images notice -->
        <!-- <div v-else class="no-images-notice">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24"
            stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20A10 10 0 0012 2z" />
          </svg>
          No images found in this Excel file.
        </div> -->

        <!-- Data Table -->
        <div class="table-container">
          <div class="table-header">
            <h3 class="table-title">
              {{ Datastate.data ? 'Validation Results' : 'Mapped Data Preview' }}
            </h3>
            <span class="table-badge">{{ mappedData.length - 1 }} rows</span>
          </div>
          <div class="table-responsive">
            <!-- ── Validation results (returned after submitting) ──────── -->
            <table v-if="Datastate.data" class="main-table">
              <thead>
                <tr>
                  <th>Employee Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th class="last"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(employee, rowIndex) in Datastate.data" :key="rowIndex">
                  <td>{{ employee.name }}</td>
                  <td
                    :class="{
                      'cell-invalid': employee.status === ValidationStatusEnum.EMAIL_INVALID,
                    }"
                  >
                    {{ employee.email }}
                  </td>
                  <td
                    :class="{
                      'cell-invalid': employee.status === ValidationStatusEnum.PHONE_INVALID,
                    }"
                  >
                    {{ employee.phone }}
                  </td>
                  <td>
                    <span class="status-badge" :class="getValidationStatusClass(employee.status)">
                      {{ getValidationStatusLabel(employee.status) }}
                    </span>
                  </td>
                  <td>
                    <button class="btn-delete-row" @click="deleteRow(rowIndex)" title="Delete row">
                      🗑
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>

            <!-- ── Raw mapped-data preview (before submitting) ─────────── -->
            <table v-else class="main-table">
              <thead>
                <tr>
                  <th v-for="(item, i) in mappedData[0]" :key="i">{{ item }}</th>
                  <th v-if="extractedImages.length > 0">Image</th>
                  <th class="last"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, rowIndex) in mappedData.slice(1)" :key="rowIndex">
                  <td v-for="(value, colIndex) in row" :key="colIndex">{{ value }}</td>
                  <!-- Show thumbnail in table row if available -->
                  <td v-if="extractedImages.length > 0">
                    <img
                      v-if="extractedImages[rowIndex]"
                      :src="extractedImages[rowIndex].base64"
                      class="row-thumb"
                      :alt="`Row ${rowIndex + 1} image`"
                    />
                    <span v-else class="no-img-text">—</span>
                  </td>
                  <td>
                    <button class="btn-delete-row" @click="deleteRow(rowIndex)" title="Delete row">
                      🗑
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Confirm Button -->
        <button @click="AddOrgEmployee" class="btn-confirm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          {{ isCurrentlyAllValid ? 'Confirm & Create' : 'Validate Data' }}
        </button>
      </template>
    </template>
  </div>
</template>

<style scoped>
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

.rule-description {
  font-size: 0.8rem;
  color: var(--text-soft);
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

/* ── Layout ─────────────────────────────────────────────── */
.page-wrapper {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.mb-4 {
  margin-block: 5px;
}

/* ── Error banner ───────────────────────────────────────── */
.error-banner {
  background: var(--status-danger-soft);
  color: var(--status-danger);
  border: 1px solid var(--status-danger-soft);
  border-radius: 10px;
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 500;
}

/* ── Loading ────────────────────────────────────────────── */
.loading-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: var(--brand-primary-50);
  border-radius: 10px;
  border: 1px solid var(--brand-primary-100);
}

.loading-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--brand-primary-400);
  animation: bounce 1s infinite alternate;
}

.loading-dot:nth-child(2) {
  animation-delay: 0.2s;
}

.loading-dot:nth-child(3) {
  animation-delay: 0.4s;
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

.loading-label {
  font-size: 13px;
  color: var(--brand-primary-500);
  font-weight: 500;
  margin-left: 4px;
}

/* ── Images section ─────────────────────────────────────── */
.images-section {
  border-radius: 14px;
  overflow: hidden;
  box-shadow:
    0 1px 3px color-mix(in srgb, var(--shadow-color) 8%, transparent),
    0 4px 16px color-mix(in srgb, var(--shadow-color) 6%, transparent);
}

.images-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  background: var(--surface-1);
  border-bottom: 1px solid var(--brand-primary-100);
}

.images-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--brand-primary-900);
}

.images-badge {
  background: var(--status-success-soft);
  color: var(--status-success);
  font-size: 12px;
  font-weight: 600;
  padding: 2px 10px;
  border-radius: 20px;
}

.images-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding: 16px 20px;
  background: var(--surface-1);
}

.image-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.image-thumb {
  width: 72px;
  height: 72px;
  object-fit: cover;
  border-radius: 8px;
  border: 2px solid var(--brand-primary-100);
  box-shadow: 0 1px 4px color-mix(in srgb, var(--text-strong) 10%, transparent);
}

.image-label {
  font-size: 11px;
  color: var(--text-soft);
  font-weight: 500;
}

/* ── No images notice ───────────────────────────────────── */
.no-images-notice {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: var(--surface-1);
  border: 1px dashed var(--main-border);
  border-radius: 10px;
  font-size: 13px;
  color: var(--text-soft);
}

/* ── Table ──────────────────────────────────────────────── */
.table-container {
  border-radius: 16px;
  overflow: hidden;
  box-shadow:
    0 1px 3px color-mix(in srgb, var(--shadow-color) 8%, transparent),
    0 4px 16px color-mix(in srgb, var(--shadow-color) 6%, transparent);
}

.table-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  background: var(--surface-1);
  border-bottom: 1px solid var(--brand-primary-100);
}

.table-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--brand-primary-900);
  margin: 0;
}

.table-badge {
  background: color-mix(in srgb, var(--brand-primary-500) 5.1%, transparent);
  color: var(--brand-primary-500);
  font-size: 12px;
  font-weight: 600;
  padding: 2px 10px;
  border-radius: 20px;
}

.table-responsive {
  overflow-x: auto;
  background: var(--surface-1);
}

.main-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.main-table thead tr {
  background: var(--brand-primary-50);
}

.main-table th {
  padding: 12px 16px;
  text-align: left;
  font-weight: 700;
  font-size: 13px;
  color: var(--brand-primary-500);
  border-bottom: 2px solid var(--brand-primary-100);
  white-space: nowrap;
}

.main-table td {
  padding: 12px 16px;
  color: var(--brand-primary-700);
  border-bottom: 1px solid var(--brand-primary-50);
  white-space: nowrap;
  vertical-align: middle;
}

.main-table tbody tr:hover {
  background: var(--brand-primary-50);
}

.main-table tbody tr:last-child td {
  border-bottom: none;
}

.row-thumb {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid var(--brand-primary-100);
}

.no-img-text {
  color: var(--text-soft);
  font-size: 18px;
}

/* ── Validation status ──────────────────────────────────── */
.cell-invalid {
  color: var(--status-danger);
  background: var(--status-danger-soft);
  font-weight: 600;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
}

.status-badge.status-valid {
  background: var(--status-success-soft);
  color: var(--status-success);
}

.status-badge.status-invalid {
  background: var(--status-danger-soft);
  color: var(--status-danger);
}

/* ── Confirm button ─────────────────────────────────────── */
.btn-confirm {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 14px;
  background: var(--brand-primary-500);
  color: var(--text-on-brand);
  font-size: 15px;
  font-weight: 600;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition:
    background 0.2s,
    transform 0.1s;
}

.btn-confirm:hover {
  background: var(--brand-primary-600);
}

.btn-confirm:active {
  transform: scale(0.98);
}
</style>
