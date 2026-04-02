<script setup lang="ts">
import { filesToBase64 } from '@/base/Presentation/utils/file_to_base_64'
import { onMounted, ref } from 'vue'
import * as XLSX from 'xlsx'
import JSZip from 'jszip'
import { useRouter } from 'vue-router'
import ExcelSheetColumnsHandle from '@/features/Organization/OrganizationEmployee/Presentation/supcomponents/ExcelSheetHandle/ExcelSheetColumnsHandle.vue'
import FileUpload from '@/features/Organization/OrganizationEmployee/Presentation/supcomponents/ExcelSheetHandle/FileUpload.vue'
import { useI18n } from 'vue-i18n'
import ExcelSheetIcon from '@/shared/icons/ExcelSheetIcon.vue'
import ExcelSheetHeaderIcon from '@/shared/icons/ExcelSheetHeaderIcon.vue'
import AddCertificateExcelParams from '../../Core/params/addCertificateExcelParams'
import AddCertificateController from '../controllers/addCertificateController'
import CertificateDetailsModel from '../../Data/models/CertificateDetailsModel'

interface ExtractedImage {
  name: string
  base64: string
  mimeType: string
}

// ─── State ────────────────────────────────────────────────────────────────────
const sheetData = ref<EquipmentDetailsModel[] | null>(null)
const File = ref<string>('')
const Data = ref<any[]>([])
const mappedData = ref<any[] | null>(null)
const extractedImages = ref<ExtractedImage[]>([])
const isLoading = ref(false)
const errorMsg = ref<string | null>(null)

const { t } = useI18n()
const router = useRouter()

// ─── Helpers ──────────────────────────────────────────────────────────────────
const MIME_MAP: Record<string, string> = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  bmp: 'image/bmp',
  webp: 'image/webp',
}

const getBodyData = (data: any[]) => CertificateDetailsModel.transformData(data.slice(1))

// ─── Image Extraction ─────────────────────────────────────────────────────────
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

  // Sort images numerically (image1.png, image2.png...) to maintain row order
  return images.sort((a, b) => {
    const numA = parseInt(a.name.replace(/\D/g, '')) || 0
    const numB = parseInt(b.name.replace(/\D/g, '')) || 0
    return numA - numB
  })
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

// ─── Upload Handler ───────────────────────────────────────────────────────────
const fileUpload = async (file: File) => {
  errorMsg.value = null
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
    mappedData.value = null
    extractedImages.value = images
  } catch (error) {
    console.error('Error processing file:', error)
    errorMsg.value = 'Failed to process the file.'
  } finally {
    isLoading.value = false
  }
}

// ─── Column Mapping ───────────────────────────────────────────────────────────
const SendData = ref<string[]>(['title', 'require_expired_date', 'image'])
const SendDataLabels: Record<string, string> = {
  title: 'Title',
  image: 'Image',
  require_expired_date: 'Require Expired Date',
}
const onColumnMapping = (mapping: Record<string, string>) => {
  if (!Data.value || Data.value.length === 0) return
  const reverseMapping: Record<string, string> = {}
  for (const [sentKey, excelCol] of Object.entries(mapping)) {
    if (excelCol) reverseMapping[excelCol] = sentKey
  }
  const cloned: any[] = Data.value.map((row: any[]) => [...row])
  cloned[0] = cloned[0].map((col: string) => reverseMapping[col] ?? col)

  mappedData.value = cloned
  sheetData.value = getBodyData(cloned)
}

// ─── Submit ───────────────────────────────────────────────────────────────────
const addCertificateController = AddCertificateController.getInstance()

const AddOrgEmployee = async () => {
  // if (!mappedData.value) return;
  const headers = mappedData.value[0] as string[]
  const rows = mappedData.value.slice(1)

  const dataAsObjects = rows.map((row: any[], rowIndex: number) => {
    const obj: Record<string, any> = {}
    headers.forEach((key, i) => {
      if (key && key.trim() !== '') obj[key] = row[i]
    })
    console.log(obj.require_expired_date, 'obj.require_expired_date')
    obj.require_expired_date = obj.require_expired_date == 'Yes' ? 1 : 0

    return obj
  })

  const orgData = new AddCertificateExcelParams({ data: dataAsObjects })
  await addCertificateController.addCertificate(orgData, router)
}

const deleteRow = (rowIndex: number) => {
  if (!mappedData.value) return

  // Remove the data row (rowIndex + 1 because row 0 is the header)
  mappedData.value = [
    mappedData.value[0],
    ...mappedData.value.slice(1).filter((_, i) => i !== rowIndex),
  ]

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
    <div class="excel-warning">
      <div class="warning-header flex item-center gap-2 justify-between w-full">
        <!-- <span class="icon">📝</span> -->
        <div class="flex item-center gap-2">
          <ExcelSheetHeaderIcon />
          <div class="title-container flex flex-col">
            <span class="title">excel instuctions</span>
            <span class="sub-title">A Step-by-Step Guide to Using the Spreadsheet</span>
          </div>
        </div>

        <a href="/ExcelForm.xlsx" class="flex item-center gap-2" download>
          <ExcelSheetIcon class="icon" />
          <span class="download-title">Download Excel Sheet</span>
        </a>
      </div>

      <div class="rule-group">
        <!-- <p class="rule-label">Required Excel Columns (Exact Names):</p> -->
        <div class="field-tags">
          <span class="field-tag">Certificate title</span>
          <span class="field-tag">has Expiry date</span>
          <span class="field-tag">Certificate image</span>
        </div>
      </div>

      <hr class="separator" />
    </div>

    <div v-if="errorMsg" class="error-banner">{{ errorMsg }}</div>

    <div v-if="isLoading" class="loading-bar">
      <span class="loading-dot" />
      <span class="loading-dot" />
      <span class="loading-dot" />
      <span class="loading-label">Processing file and images…</span>
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
        <div class="table-container">
          <div class="table-header">
            <h3 class="table-title">Mapped Data Preview</h3>
            <span class="table-badge">{{ mappedData.length - 1 }} rows</span>
          </div>
          <div class="table-responsive">
            <table class="main-table">
              <thead>
                <tr>
                  <th v-for="(item, i) in mappedData[0]" :key="i">
                    <span>
                      {{ item }}
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, rowIndex) in mappedData.slice(1)" :key="rowIndex">
                  <td v-for="(value, colIndex) in row" :key="colIndex">
                    <span>
                      {{ value }}
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
          </div>
        </div>

        <button @click="AddOrgEmployee" class="btn-confirm">Confirm & Submit</button>
      </template>
    </template>
  </div>
</template>

<style scoped>
.title-container {
  .title {
    color: #1f41bb;
    font-size: 20px;
    font-weight: 600;
  }

  .sub-title {
    color: #1e293b;
    font-size: 16px;
    font-weight: 500;
  }
}

.icon {
  width: 30px;
  height: 30px;
}

a {
  background-color: white;
  display: flex;
  align-items: center;
  padding: 12px;
  border-radius: 6px;
  width: fit-content;
  border: 1px solid #e5e7eb;
  cursor: pointer;
  transition: 0.3s all linear;
}

a:hover {
  background-color: #e5e7eb;
}

.download-title {
  font-family: 'Regular';
  font-size: 14px;
  font-weight: 500;
}

.excel-warning {
  /* background-color: #fffaf0; */
  /* Light cream/amber */
  /* border: 1px solid #fbd38d; */
  /* Amber border */
  border-radius: 12px;
  padding: 20px;
  max-width: 100%;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.warning-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
  /* border-bottom: 1px ridge #fbd38d; */
  padding-bottom: 10px;
}

.warning-header .title {
  color: #1f41bb;
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
  color: #00057f;
  font-family: 'Regular';
  /* margin-bottom: 8px; */
}

.rule-description {
  font-size: 0.8rem;
  color: #6b7280;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

.chip {
  background: #f4f6f9;
  border: 1px solid #e2e8f0;
  padding: 10px 38px;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 600;
  color: #4a5568;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: transform 0.2s ease;
}

.chip:hover {
  transform: translateY(-2px);
  border-color: #cbd5e0;
}

/* The "Key" look for numbers */
kbd {
  background-color: #1d4ed81a;
  border-radius: 6px;
  /* border: 1px solid #cbd5e0; */
  /* box-shadow: 0 1px 1px rgba(0, 0, 0, .2), 0 2px 0 0 rgba(255, 255, 255, .7) inset; */
  color: #1f41bb;
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
  background: rgba(255, 255, 255, 0.5);
  padding: 10px;
  border-radius: 8px;
  /* border: 1px dashed #fbd38d; */
}

.field-tag {
  background: #f4f6f9;
  color: #000000;
  font-family: 'Light';
  /* Makes it look like code/field names */
  font-size: 18px;
  font-weight: 600;
  padding: 10px 24px;
  border-radius: 12px;
  /* border: 1px solid #e2e8f0; */
}

/* A subtle line to separate headers from values */
.separator {
  border: 0;
  border-top: 1px solid #f1f3f5;
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
  background: #fef2f2;
  color: #b91c1c;
  border: 1px solid #fecaca;
  border-radius: 8px;
  padding: 6px 10px;
  cursor: pointer;
  font-size: 14px;
  transition:
    background 0.2s,
    transform 0.15s;
}

.btn-delete-row:hover {
  background: #fee2e2;
  transform: scale(1.1);
}

.page-wrapper {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.error-banner {
  background: #fef2f2;
  color: #b91c1c;
  border: 1px solid #fecaca;
  border-radius: 10px;
  padding: 12px 16px;
}

.loading-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #eff6ff;
  border-radius: 10px;
}

.loading-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #3b82f6;
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
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  background: #fff;
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
  text-align: left;
  color: #1d4ed8;
  border-bottom: 2px solid #e5e7eb;
}

.main-table td {
  padding: 12px 16px;
  border-bottom: 1px solid #f3f4f6;
}

.row-thumb {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
}

.btn-confirm {
  width: 100%;
  padding: 14px;
  background: #1d4ed8;
  color: #fff;
  border-radius: 12px;
  cursor: pointer;
  border: none;
  font-weight: 600;
}

.no-img-text {
  color: #9ca3af;
}
</style>
