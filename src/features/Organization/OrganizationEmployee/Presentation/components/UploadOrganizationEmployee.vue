<script setup lang="ts">
import { filesToBase64 } from '@/base/Presentation/utils/file_to_base_64';
import { ref } from 'vue';
import * as XLSX from 'xlsx';
import JSZip from 'jszip';
import FileUpload from '../supcomponents/ExcelSheetHandle/FileUpload.vue';
import OrganizatoinEmployeeModel from '../../Data/models/OrganizatoinEmployeeModel';
import ExcelSheetColumnsHandle from '../supcomponents/ExcelSheetHandle/ExcelSheetColumnsHandle.vue';
import AddOrganizatoinEmployeeController from '../controllers/addOrganizatoinEmployeeController';
import AddOrganizationEmployeeExcelParams from '../../Core/params/AddOrganizationEmployeeExcelParams';
import { useRouter } from 'vue-router';
import AddTeamController from '@/features/setting/Teams/Presentation/controllers/addTeamController';
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue';
import type TitleInterface from '@/base/Data/Models/title_interface';
import IndexHerikalyParams from '@/features/Organization/Herikaly/Core/params/indexHerikalyParams';
import IndexHerikalyController from '@/features/Organization/Herikaly/Presentation/controllers/indexHerikalyController';
import HirarachyEmployeeParams from '../../Core/params/HirarchyParams';
import ExcelSheetIcon from '@/shared/icons/ExcelSheetIcon.vue';
import ExcelSheetHeaderIcon from '@/shared/icons/ExcelSheetHeaderIcon.vue';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ExtractedImage {
  name: string;
  base64: string; // full data-URI
  mimeType: string;
}

// ─── State ────────────────────────────────────────────────────────────────────

const sheetData = ref<OrganizatoinEmployeeModel[] | null>(null);
const File = ref<string>('');
const Data = ref<any[]>([]);
const mappedData = ref<any[] | null>(null);
const extractedImages = ref<ExtractedImage[]>([]);
const isLoading = ref(false);
const errorMsg = ref<string | null>(null);

// ─── Helpers ──────────────────────────────────────────────────────────────────

const MIME_MAP: Record<string, string> = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  bmp: 'image/bmp',
  webp: 'image/webp',
};

const getBodyData = (data: any[]) =>
  OrganizatoinEmployeeModel.transformData(data.slice(1));

// ─── Image Extraction ─────────────────────────────────────────────────────────

/**
 * Reads the xl/media/ folder of the xlsx (which is just a ZIP)
 * and returns every image found as a base64 data-URI.
 */
const extractImagesFromExcel = async (file: File): Promise<ExtractedImage[]> => {
  const arrayBuffer = await file.arrayBuffer();
  const zip = await JSZip.loadAsync(arrayBuffer);
  const images: ExtractedImage[] = [];

  const mediaFolder = zip.folder('xl/media');
  if (!mediaFolder) return images;

  const promises: Promise<void>[] = [];

  mediaFolder.forEach((relativePath, zipEntry) => {
    if (zipEntry.dir) return;

    const ext = relativePath.split('.').pop()?.toLowerCase() ?? '';
    const mimeType = MIME_MAP[ext] ?? 'image/png';

    promises.push(
      zipEntry.async('base64').then((b64) => {
        images.push({
          name: relativePath,
          base64: `data:${mimeType};base64,${b64}`,
          mimeType,
        });
      })
    );
  });

  await Promise.all(promises);
  return images;
};

// ─── base64 → Blob (for multipart/form-data backends) ────────────────────────

const base64ToBlob = (dataURI: string): Blob => {
  const [header, data] = dataURI.split(',');
  const mimeType = header.match(/:(.*?);/)?.[1] ?? 'image/png';
  const binary = atob(data);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: mimeType });
};

// ─── File Reading ─────────────────────────────────────────────────────────────

const readExcelFile = (file: File): Promise<any[]> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const arrayBuffer = e.target?.result;
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(sheet, {
          header: 1,
          raw: false,
          defval: '',
          blankrows: false,
        });
        Data.value = data;
        resolve(data);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });

// ─── Upload Handler ───────────────────────────────────────────────────────────

const fileUpload = async (file: File) => {
  errorMsg.value = null;
  try {
    if (!file) {
      sheetData.value = null;
      mappedData.value = null;
      extractedImages.value = [];
      return;
    }

    isLoading.value = true;

    const [data, images] = await Promise.all([
      readExcelFile(file),
      extractImagesFromExcel(file),
    ]);

    sheetData.value = getBodyData(data);
    File.value = await filesToBase64(file);
    mappedData.value = null; // reset on new file
    extractedImages.value = images;

    console.log(`✅ Extracted ${images.length} image(s) from Excel`, images);
  } catch (error) {
    console.error('Error processing file:', error);
    errorMsg.value = 'Failed to process the file. Please try again.';
  } finally {
    isLoading.value = false;
  }
};

// ─── Column Mapping ───────────────────────────────────────────────────────────

// , 'image'
const SendData = ref<string[]>(['name', 'email', 'phone', 'password', 'password_confirmation']);

const SendDataLabels: Record<string, string> = {
  name: "Employee Name",
  email: "Email",
  phone: "Phone",
  password: "Password",
  password_confirmation: "Password Confirmation",

};


const filterToSentData = ref(false);

const onColumnMapping = (mapping: Record<string, string>) => {
  if (!Data.value || Data.value.length === 0) return;

  const reverseMapping: Record<string, string> = {};
  for (const [sentKey, excelCol] of Object.entries(mapping)) {
    if (excelCol) reverseMapping[excelCol] = sentKey;
  }

  const cloned: any[] = Data.value.map((row: any[]) => [...row]);
  cloned[0] = cloned[0].map((col: string) => reverseMapping[col] ?? col);

  if (filterToSentData.value) {
    const allowedKeys = new Set(SendData.value);
    const headerRow = cloned[0] as string[];
    const allowedIndexes = headerRow
      .map((key, i) => (allowedKeys.has(key) ? i : -1))
      .filter((i) => i !== -1);

    const filteredData = cloned.map((row) => allowedIndexes.map((i) => row[i]));
    filteredData[0] = allowedIndexes.map((i) => headerRow[i]);

    mappedData.value = filteredData;
    sheetData.value = getBodyData(filteredData);
  } else {
    mappedData.value = cloned;
    sheetData.value = getBodyData(cloned);
  }
};

// ─── Submit ───────────────────────────────────────────────────────────────────

const router = useRouter();
const addOrganizatoinEmployeeController = AddOrganizatoinEmployeeController.getInstance();

const AddOrgEmployee = async () => {
  if (!mappedData.value) return;

  const headers = mappedData.value[0] as string[];
  const rows = mappedData.value.slice(1);

  const dataAsObjects = rows.map((row: any[], rowIndex: number) => {
    const obj: Record<string, any> = {};

    headers.forEach((key, i) => {
      if (key && key.trim() !== '') obj[key] = row[i];
    });

    // Attach hierarchy
    obj['hierarchies'] = [new HirarachyEmployeeParams(Heirarchy.value?.id)];

    // Attach image for this row (by index — sequential order)
    const img = extractedImages.value[rowIndex];
    if (img) {
      // Option A: send as base64 string
      obj['image'] = img.base64;

      // Option B: send as Blob (for multipart/form-data) — uncomment if needed:
      // obj['image'] = base64ToBlob(img.base64);
    }

    return obj;
  });

  const orgData = new AddOrganizationEmployeeExcelParams({ data: dataAsObjects });
  console.log('📤 Sending orgData:', orgData);
  await addOrganizatoinEmployeeController.addOrganizatoinEmployee(orgData, router);
};

// ─── Hierarchy ────────────────────────────────────────────────────────────────

const indexHerikalyController = IndexHerikalyController.getInstance();
const HerikalyParams = new IndexHerikalyParams('', 1, 10, 0, false);
const Heirarchy = ref<TitleInterface>();

const setHeirarchy = (data: TitleInterface) => {
  Heirarchy.value = data;
};

const deleteRow = (rowIndex: number) => {
  if (!mappedData.value) return;

  // Remove the data row (rowIndex + 1 because row 0 is the header)
  mappedData.value = [
    mappedData.value[0],
    ...mappedData.value.slice(1).filter((_, i) => i !== rowIndex),
  ];

  // Remove the two images belonging to this row
  const imgBase = rowIndex * 2;
  extractedImages.value = extractedImages.value.filter(
    (_, i) => i !== imgBase && i !== imgBase + 1
  );
};

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

        <a href="/public/EmployeeFrom.xlsx" class="flex item-center gap-2 " download>
          <ExcelSheetIcon class="icon" />
          <span class="download-title">Download Excel Sheet</span>
        </a>
      </div>

      <div class="rule-group">
        <!-- <p class="rule-label">Required Excel Columns (Exact Names):</p> -->
        <div class="field-tags">
          <span class="field-tag">Employee Name</span>
          <span class="field-tag">Email</span>
          <span class="field-tag">Phone</span>
          <span class="field-tag">Password</span>
          <span class="field-tag">Password Confirmation</span>
        </div>
      </div>



    </div>








    <!-- ── Hierarchy Select ─────────────────────────────────── -->
    <div class="grid grid-cols-6 gap-4 w-full mb-4">
      <div class="col-span-2 input-wrapper">
        <CustomSelectInput :modelValue="Heirarchy" @update:modelValue="setHeirarchy"
          :controller="indexHerikalyController" :params="HerikalyParams" :label="$t('Job Type')"
          :placeholder="$t('Select Job Type')" />
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
    <FileUpload v-if="!Data || Data.length === 0"
      accept=".xls,.xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,.csv"
      @update:fileData="fileUpload" />

    <template v-else>

      <!-- ── Step 2 : Column Mapping ────────────────────────── -->
      <ExcelSheetColumnsHandle v-if="!mappedData" :visable="true" :columns="Data[0]" :sentData="SendData"
        @update:columnMapping="onColumnMapping" :sentDataLabels="SendDataLabels" @close="onMappingClose" />

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
            <h3 class="table-title">Mapped Data Preview</h3>
            <span class="table-badge">{{ mappedData.length - 1 }} rows</span>
          </div>
          <div class="table-responsive">
            <table class="main-table">
              <thead>
                <tr>
                  <th v-for="(item, i) in mappedData[0]" :key="i">{{ item }}</th>
                  <!-- <th v-if="extractedImages.length > 0">Image</th> -->
                  <th>Actions</th>

                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, rowIndex) in mappedData.slice(1)" :key="rowIndex">
                  <td v-for="(value, colIndex) in row" :key="colIndex">{{ value }}</td>
                  <!-- Show thumbnail in table row if available -->
                  <td v-if="extractedImages.length > 0">
                    <img v-if="extractedImages[rowIndex]" :src="extractedImages[rowIndex].base64" class="row-thumb"
                      :alt="`Row ${rowIndex + 1} image`" />
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
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24"
            stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Confirm & Submit
        </button>

      </template>
    </template>
  </div>
</template>

<style scoped>
.title-container {

  .title {
    color: #1F41BB;
    font-size: 20px;
    font-weight: 600;
  }

  .sub-title {
    color: #1E293B;
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
  border: 1px solid #E5E7EB;
  cursor: pointer;
  transition: 0.3s all linear;
}

a:hover {
  background-color: #E5E7EB;
}

.download-title {
  font-family: "Regular";
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
  color: #1F41BB;
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
  color: #00057F;
  font-family: "Regular";
  /* margin-bottom: 8px; */
}

.rule-description {
  font-size: 0.8rem;
  color: #6B7280;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

.chip {
  background: #F4F6F9;
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
  background-color: #1D4ED81A;
  border-radius: 6px;
  /* border: 1px solid #cbd5e0; */
  /* box-shadow: 0 1px 1px rgba(0, 0, 0, .2), 0 2px 0 0 rgba(255, 255, 255, .7) inset; */
  color: #1F41BB;
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
  background: #F4F6F9;
  color: #000000;
  font-family: "Light";
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
  border-top: 1px solid #F1F3F5;
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
  background: #FEF2F2;
  color: #B91C1C;
  border: 1px solid #FECACA;
  border-radius: 8px;
  padding: 6px 10px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s, transform 0.15s;
}

.btn-delete-row:hover {
  background: #FEE2E2;
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
  background: #FEF2F2;
  color: #B91C1C;
  border: 1px solid #FECACA;
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
  background: #EFF6FF;
  border-radius: 10px;
  border: 1px solid #BFDBFE;
}

.loading-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #3B82F6;
  animation: bounce 1s infinite alternate;
}

.loading-dot:nth-child(2) {
  animation-delay: .2s;
}

.loading-dot:nth-child(3) {
  animation-delay: .4s;
}

@keyframes bounce {
  from {
    transform: translateY(0);
    opacity: .6;
  }

  to {
    transform: translateY(-6px);
    opacity: 1;
  }
}

.loading-label {
  font-size: 13px;
  color: #1D4ED8;
  font-weight: 500;
  margin-left: 4px;
}

/* ── Images section ─────────────────────────────────────── */
.images-section {
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, .08), 0 4px 16px rgba(0, 0, 0, .06);
}

.images-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  background: #fff;
  border-bottom: 1px solid #E5E7EB;
}

.images-title {
  font-size: 15px;
  font-weight: 700;
  color: #111827;
}

.images-badge {
  background: #F0FDF4;
  color: #15803D;
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
  background: #fff;
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
  border: 2px solid #E5E7EB;
  box-shadow: 0 1px 4px rgba(0, 0, 0, .1);
}

.image-label {
  font-size: 11px;
  color: #6B7280;
  font-weight: 500;
}

/* ── No images notice ───────────────────────────────────── */
.no-images-notice {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: #FAFAFA;
  border: 1px dashed #D1D5DB;
  border-radius: 10px;
  font-size: 13px;
  color: #6B7280;
}

/* ── Table ──────────────────────────────────────────────── */
.table-container {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, .08), 0 4px 16px rgba(0, 0, 0, .06);
}

.table-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  background: #fff;
  border-bottom: 1px solid #E5E7EB;
}

.table-title {
  font-size: 16px;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.table-badge {
  background: #1D4ED80D;
  color: #1D4ED8;
  font-size: 12px;
  font-weight: 600;
  padding: 2px 10px;
  border-radius: 20px;
}

.table-responsive {
  overflow-x: auto;
  background: #fff;
}

.main-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.main-table thead tr {
  background: #F9FAFB;
}

.main-table th {
  padding: 12px 16px;
  text-align: left;
  font-weight: 700;
  font-size: 13px;
  color: #1D4ED8;
  border-bottom: 2px solid #E5E7EB;
  white-space: nowrap;
}

.main-table td {
  padding: 12px 16px;
  color: #374151;
  border-bottom: 1px solid #F3F4F6;
  white-space: nowrap;
  vertical-align: middle;
}

.main-table tbody tr:hover {
  background: #F9FAFB;
}

.main-table tbody tr:last-child td {
  border-bottom: none;
}

.row-thumb {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #E5E7EB;
}

.no-img-text {
  color: #9CA3AF;
  font-size: 18px;
}

/* ── Confirm button ─────────────────────────────────────── */
.btn-confirm {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 14px;
  background: #1D4ED8;
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: background .2s, transform .1s;
}

.btn-confirm:hover {
  background: #1E40AF;
}

.btn-confirm:active {
  transform: scale(.98);
}
</style>
