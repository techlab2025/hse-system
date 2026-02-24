<script setup lang="ts">
import { filesToBase64 } from '@/base/Presentation/utils/file_to_base_64';
import { ref } from 'vue';
import * as XLSX from 'xlsx';
import JSZip from 'jszip';
import { useRouter } from 'vue-router';
import EquipmentDetailsModel from '../../Data/models/equipmentDetailsModel';
import AddEquipmentController from '../controllers/addEquipmentController';
import AddEquipmentExcelParams from '../../Core/params/AddEquipmentExcelParams';
import ExcelSheetColumnsHandle from '@/features/Organization/OrganizationEmployee/Presentation/supcomponents/ExcelSheetHandle/ExcelSheetColumnsHandle.vue';
import FileUpload from '@/features/Organization/OrganizationEmployee/Presentation/supcomponents/ExcelSheetHandle/FileUpload.vue';
import TitleInterface from '@/base/Data/Models/title_interface';
import { EquipmentStatus } from '../../Core/enum/equipmentStatus';
import { useI18n } from 'vue-i18n';
import IndexEquipmentTypeParams from '@/features/setting/EquipmentType/Core/params/indexEquipmentTypeParams';
import { EquipmentTypesEnum } from '@/features/setting/Template/Core/Enum/EquipmentsTypeEnum';
import IndexEquipmentTypeController from '@/features/setting/EquipmentType/Presentation/controllers/indexEquipmentTypeController';
import type EquipmentTypeModel from '@/features/setting/EquipmentType/Data/models/equipmentTypeModel';
import UpdatedCustomInputSelect from '@/shared/FormInputs/UpdatedCustomInputSelect.vue';
import Tabs from './tabs.vue';
import { RentTypeEnum } from '../../Core/enum/RentTypeEnum';
import IndexContractorController from '@/features/setting/contractor/Presentation/controllers/indexContractorController';
import IndexContractorParams from '@/features/setting/contractor/Core/params/indexContractorParams';
import IndexWhereHouseController from '@/features/Organization/WhereHouse/Presentation/controllers/indexWhereHouseController';
import IndexWhereHouseParams from '@/features/Organization/WhereHouse/Core/params/indexWhereHouseParams';

interface ExtractedImage {
  name: string;
  base64: string;
  mimeType: string;
}

// ─── State ────────────────────────────────────────────────────────────────────
const sheetData = ref<EquipmentDetailsModel[] | null>(null);
const File = ref<string>('');
const Data = ref<any[]>([]);
const mappedData = ref<any[] | null>(null);
const extractedImages = ref<ExtractedImage[]>([]);
const isLoading = ref(false);
const errorMsg = ref<string | null>(null);

const { t } = useI18n();
const router = useRouter();

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
  EquipmentDetailsModel.transformData(data.slice(1));

// ─── Image Extraction ─────────────────────────────────────────────────────────
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

  // Sort images numerically (image1.png, image2.png...) to maintain row order
  return images.sort((a, b) => {
    const numA = parseInt(a.name.replace(/\D/g, '')) || 0;
    const numB = parseInt(b.name.replace(/\D/g, '')) || 0;
    return numA - numB;
  });
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
    mappedData.value = null;
    extractedImages.value = images;
  } catch (error) {
    console.error('Error processing file:', error);
    errorMsg.value = 'Failed to process the file.';
  } finally {
    isLoading.value = false;
  }
};

// ─── Column Mapping ───────────────────────────────────────────────────────────
const SendData = ref<string[]>([
  "name",
  "date",
  "license_plate_number",
  "image",
  "certificate_image",
  "checkin_date",
  "checkout_date",
  "period",
  "period_type",
  "status"
]);

const onColumnMapping = (mapping: Record<string, string>) => {
  if (!Data.value || Data.value.length === 0) return;
  const reverseMapping: Record<string, string> = {};
  for (const [sentKey, excelCol] of Object.entries(mapping)) {
    if (excelCol) reverseMapping[excelCol] = sentKey;
  }
  const cloned: any[] = Data.value.map((row: any[]) => [...row]);
  cloned[0] = cloned[0].map((col: string) => reverseMapping[col] ?? col);

  mappedData.value = cloned;
  sheetData.value = getBodyData(cloned);
};

// ─── Machine State & Dropdowns ────────────────────────────────────────────────
const activeTab = ref<EquipmentTypesEnum>(EquipmentTypesEnum.EQUIPMENT);
const UpdateActiveTap = (data: EquipmentTypesEnum) => {
  activeTab.value = data;
  GetEquipmentType();
};

const deviceStatusOptions = ref<TitleInterface[]>([
  new TitleInterface({ id: EquipmentStatus.RENT, title: t('Rent') }),
  new TitleInterface({ id: EquipmentStatus.OWN, title: t('Owned') }),
]);

const indexEquipmentTypeController = IndexEquipmentTypeController.getInstance();
const AllEquipmentTypes = ref<EquipmentTypeModel[]>([]);
const indexEquipmentTypeParams = ref(new IndexEquipmentTypeParams('', null, null, null, null, Number(activeTab.value)));

const GetEquipmentType = async () => {
  const params = new IndexEquipmentTypeParams('', null, null, null, null, Number(activeTab.value));
  const response = await indexEquipmentTypeController.getData(params);
  if (response.value.data && response.value.data?.length > 0) {
    AllEquipmentTypes.value = response.value.data;
  } else {
    AllEquipmentTypes.value = [];
  }
};

const GetEquipmentTitle = (type: EquipmentTypesEnum) => {
  switch (type) {
    case EquipmentTypesEnum.EQUIPMENT: return t('Equipment');
    case EquipmentTypesEnum.DEVICE: return t('Device');
    case EquipmentTypesEnum.TOOL: return t('Tool');
    default: return '';
  }
};

const equipmentType = ref<TitleInterface | null>(null);
const setEquipmentType = (data: TitleInterface) => { equipmentType.value = data; };

const equipmentStatus = ref<TitleInterface>();
const setEquipmentStataus = (data: TitleInterface) => { equipmentStatus.value = data; };

const RentTypes = ref<TitleInterface[]>([
  new TitleInterface({ id: RentTypeEnum.HOUR, title: 'Hour' }),
  new TitleInterface({ id: RentTypeEnum.DAY, title: 'Day' }),
  new TitleInterface({ id: RentTypeEnum.MONTH, title: 'Month' }),
  new TitleInterface({ id: RentTypeEnum.YEAR, title: 'Year' }),
]);
const SelectedRentType = ref<TitleInterface>(RentTypes.value[0]);
const setRentType = (data: TitleInterface) => { SelectedRentType.value = data; };

const indexContractorController = IndexContractorController.getInstance();
const indexContractorTypeParams = new IndexContractorParams('', 1, 10, 0, false);
const SelectedContractor = ref<TitleInterface>();
const setContructor = (data: TitleInterface) => { SelectedContractor.value = data; };

const indexWhereHouseController = IndexWhereHouseController.getInstance();
const indexWhereHouseParams = new IndexWhereHouseParams('', 1, 10, 1, false);
const SelectedWhereHosue = ref<TitleInterface>();
const setSelectedWhereHouse = (data: TitleInterface) => { SelectedWhereHosue.value = data; };

// ─── Submit ───────────────────────────────────────────────────────────────────
const addEquipmentController = AddEquipmentController.getInstance();

const AddOrgEmployee = async () => {
  if (!mappedData.value) return;
  const headers = mappedData.value[0] as string[];
  const rows = mappedData.value.slice(1);

  const dataAsObjects = rows.map((row: any[], rowIndex: number) => {
    const obj: Record<string, any> = {};
    headers.forEach((key, i) => {
      if (key && key.trim() !== '') obj[key] = row[i];
    });

    obj['equipment_type_id'] = equipmentType.value?.id;
    // obj['status'] = equipmentStatus.value?.id;
    // obj['period_type'] = SelectedRentType.value?.id;
    obj['contractor_id'] = SelectedContractor.value?.id;
    obj['warehouse_id'] = SelectedWhereHosue.value?.id;

    // Mapping images: row 0 uses index 0 & 1, row 1 uses index 2 & 3, etc.
    const baseImgIdx = rowIndex * 2;
    if (extractedImages.value[baseImgIdx]) {
      obj['image'] = extractedImages.value[baseImgIdx].base64;
    }
    if (extractedImages.value[baseImgIdx + 1]) {
      obj['certificate_image'] = extractedImages.value[baseImgIdx + 1].base64;
    }

    return obj;
  });

  const orgData = new AddEquipmentExcelParams({ data: dataAsObjects });
  await addEquipmentController.addEquipment(orgData, router);
};
</script>

<template>
  <div class="page-wrapper">
    <div class="grid grid-cols-6 gap-4 w-full mb-4 equipment-form">
      <Tabs class="col-span-6 w-full" @update:activeTab="UpdateActiveTap" :activeTabData="activeTab" />

      <div class="col-span-2 input-wrapper">
        <UpdatedCustomInputSelect @update:reload="GetEquipmentType" :modelValue="equipmentType"
          :controller="indexEquipmentTypeController" :params="indexEquipmentTypeParams"
          :label="`${GetEquipmentTitle(activeTab)} Type`" :id="`${GetEquipmentTitle(activeTab)} Type`"
          :placeholder="`Select ${GetEquipmentTitle(activeTab)} Type`" @update:modelValue="setEquipmentType" />
      </div>

      <!-- <div class="col-span-2 input-wrapper">
        <UpdatedCustomInputSelect :modelValue="equipmentStatus" :staticOptions="deviceStatusOptions"
          :label="`Equipment Status`" :id="`equipment_status`" :placeholder="`Select Equipment Status`"
          @update:modelValue="setEquipmentStataus" :reload="false" />
      </div> -->

      <!-- <div class="col-span-2 input-wrapper">
        <UpdatedCustomInputSelect :staticOptions="RentTypes" :modelValue="SelectedRentType" label="Rent Type"
          id="Rent Type" placeholder="Selected Rent Type.." @update:modelValue="setRentType" />
      </div> -->

      <div class="col-span-2 input-wrapper">
        <UpdatedCustomInputSelect :modelValue="SelectedContractor" :controller="indexContractorController"
          :params="indexContractorTypeParams" :label="`Contractor`" id="Contractor" :placeholder="`Select Contractor`"
          @update:modelValue="setContructor" />
      </div>

      <div class="col-span-2 input-wrapper">
        <UpdatedCustomInputSelect :controller="indexWhereHouseController" :params="indexWhereHouseParams"
          :modelValue="SelectedWhereHosue" label="Warehouse" id="Warehouse" placeholder="Select Warehouse.."
          @update:modelValue="setSelectedWhereHouse" />
      </div>
    </div>

    <div v-if="errorMsg" class="error-banner">{{ errorMsg }}</div>

    <div v-if="isLoading" class="loading-bar">
      <span class="loading-dot" />
      <span class="loading-dot" />
      <span class="loading-dot" />
      <span class="loading-label">Processing file and images…</span>
    </div>

    <FileUpload v-if="!Data || Data.length === 0" accept=".xls,.xlsx" @update:fileData="fileUpload" />

    <template v-else>
      <ExcelSheetColumnsHandle v-if="!mappedData" :visable="true" :columns="Data[0]" :sentData="SendData"
        @update:columnMapping="onColumnMapping" />

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
                    <span v-if="item !== 'image' && item !== 'certificate_image'">

                      {{ item }}
                    </span>
                  </th>
                  <th>Image</th>
                  <th>Certificate Image</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, rowIndex) in mappedData.slice(1)" :key="rowIndex">
                  <td v-for="(value, colIndex) in row" :key="colIndex">{{ value }}</td>
                  <td>
                    <img v-if="extractedImages[rowIndex * 2]" :src="extractedImages[rowIndex * 2].base64"
                      class="row-thumb" />
                    <span v-else class="no-img-text">—</span>
                  </td>
                  <td>
                    <img v-if="extractedImages[(rowIndex * 2) + 1]" :src="extractedImages[(rowIndex * 2) + 1].base64"
                      class="row-thumb" />
                    <span v-else class="no-img-text">—</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <button @click="AddOrgEmployee" class="btn-confirm">
          Confirm & Submit
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

.error-banner {
  background: #FEF2F2;
  color: #B91C1C;
  border: 1px solid #FECACA;
  border-radius: 10px;
  padding: 12px 16px;
}

.loading-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #EFF6FF;
  border-radius: 10px;
}

.loading-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #3B82F6;
  animation: bounce 1s infinite alternate;
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

.table-container {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, .06);
  background: #fff;
}

.main-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.main-table th {
  padding: 12px 16px;
  text-align: left;
  color: #1D4ED8;
  border-bottom: 2px solid #E5E7EB;
}

.main-table td {
  padding: 12px 16px;
  border-bottom: 1px solid #F3F4F6;
}

.row-thumb {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #E5E7EB;
}

.btn-confirm {
  width: 100%;
  padding: 14px;
  background: #1D4ED8;
  color: #fff;
  border-radius: 12px;
  cursor: pointer;
  border: none;
  font-weight: 600;
}

.no-img-text {
  color: #9CA3AF;
}
</style>
