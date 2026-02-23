<script setup lang="ts">
import { filesToBase64 } from '@/base/Presentation/utils/file_to_base_64';
import { ref } from 'vue';
import * as XLSX from 'xlsx';
import FileUpload from '../supcomponents/ExcelSheetHandle/FileUpload.vue';
import OrganizatoinEmployeeModel from '../../Data/models/OrganizatoinEmployeeModel';
import ExcelSheetColumnsHandle from '../supcomponents/ExcelSheetHandle/ExcelSheetColumnsHandle.vue';
import AddOrganizatoinEmployeeController from '../controllers/addOrganizatoinEmployeeController';
import AddOrganizatoinEmployeeParams from '../../Core/params/addOrganizatoinEmployeeParams';
import { useRouter } from 'vue-router';
import AddOrganizationEmployeeExcelParams from '../../Core/params/AddOrganizationEmployeeExcelParams';
import AddTeamController from '@/features/setting/Teams/Presentation/controllers/addTeamController';
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue';
import type TitleInterface from '@/base/Data/Models/title_interface';
import IndexHerikalyParams from '@/features/Organization/Herikaly/Core/params/indexHerikalyParams';
import IndexHerikalyController from '@/features/Organization/Herikaly/Presentation/controllers/indexHerikalyController';
import HirarachyEmployeeParams from '../../Core/params/HirarchyParams';

const sheetData = ref<OrganizatoinEmployeeModel[] | null>(null);
const File = ref<string>("");
const Data = ref<any[]>([]);
const mappedData = ref<any[] | null>(null); // holds renamed data after confirm

const getBodyData = (data: any[]) => {
  return OrganizatoinEmployeeModel.transformData(data.slice(1));
};

const fileUpload = async (file: File) => {
  try {
    if (!file) {
      sheetData.value = null;
      mappedData.value = null;
    } else {
      const data = await readExcelFile(file);
      sheetData.value = getBodyData(data);
      File.value = await filesToBase64(file);
      mappedData.value = null; // reset on new file
    }
  } catch (error) {
    console.error("Error processing file:", error);
  }
};

const readExcelFile = (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const arrayBuffer = e.target?.result;
        const workbook = XLSX.read(arrayBuffer, { type: "array" });
        const worksheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[worksheetName];
        const data = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
          raw: false,
          defval: "",
          blankrows: false,
        });
        Data.value = data;
        resolve(data);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
};

const SendData = ref<string[]>(['name', 'email', 'phone', 'password', 'passwordConfirmation']);



const filterToSentData = ref(true) // true = only SendData keys | false = all columns

const onColumnMapping = (mapping: Record<string, string>) => {
  if (!Data.value || Data.value.length === 0) return;

  const reverseMapping: Record<string, string> = {};
  for (const [sentKey, excelCol] of Object.entries(mapping)) {
    if (excelCol) reverseMapping[excelCol] = sentKey;
  }

  const cloned: any[] = Data.value.map((row: any[]) => [...row]);
  cloned[0] = cloned[0].map((col: string) => reverseMapping[col] ?? col);

  if (filterToSentData.value) {
    const allowedKeys = new Set(SendData.value)
    const headerRow = cloned[0] as string[]
    const allowedIndexes = headerRow
      .map((key, i) => allowedKeys.has(key) ? i : -1)
      .filter(i => i !== -1)

    const filteredData = cloned.map(row => allowedIndexes.map(i => row[i]))
    filteredData[0] = allowedIndexes.map(i => headerRow[i])

    mappedData.value = filteredData
    sheetData.value = getBodyData(filteredData)
  } else {
    mappedData.value = cloned
    sheetData.value = getBodyData(cloned)
  }
}
const router = useRouter()
const addOrganizatoinEmployeeController = AddOrganizatoinEmployeeController.getInstance()

const AddOrgEmployee = async () => {
  const headers = mappedData.value?.[0] as string[]
  const rows = mappedData.value?.slice(1)

  const dataAsObjects = rows?.map((row: any[]) => {
    const obj: Record<string, any> = {}
    headers.forEach((key, i) => {
      if (key && key.trim() !== '') {
        obj[key] = row[i]
      }
    })
    // ← attach Heirarchy to every row
    obj['hierarchies'] = [new HirarachyEmployeeParams(Heirarchy.value?.id)]
    return obj
  })

  // const orgData = new AddOrganizationEmployeeExcelParams(dataAsObjects)
  const orgData = new AddOrganizationEmployeeExcelParams({ data: dataAsObjects })
  console.log(orgData, 'orgData')
  await addOrganizatoinEmployeeController.addOrganizatoinEmployee(orgData, router)
}

const indexHerikalyController = IndexHerikalyController.getInstance()
const HerikalyParams = new IndexHerikalyParams('', 1, 10, 0, false)
const Heirarchy = ref<TitleInterface>()
const setHeirarchy = (data: TitleInterface) => {
  Heirarchy.value = data
  // updateData()
}

</script>

<template>
  <div class="grid grid-cols-6 gap-4 w-full mb-4">
    <div class="col-span-2 input-wrapper">
      <CustomSelectInput :modelValue="Heirarchy" @update:modelValue="setHeirarchy" :controller="indexHerikalyController"
        :params="HerikalyParams" :label="$t('Job Type')" :placeholder="$t('Select Job Type')" />
    </div>
  </div>
  <!-- Step 1: Upload -->
  <FileUpload v-if="!Data || Data.length === 0"
    accept=".xls,.xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel,.csv"
    @update:fileData="fileUpload" />

  <template v-else>
    <!-- Step 2: Mapping dialog (shown until mapping is confirmed) -->
    <ExcelSheetColumnsHandle v-if="!mappedData" :visable="true" :columns="Data[0]" :sentData="SendData"
      @update:columnMapping="onColumnMapping" />

    <!-- Step 3: Show mapped table after confirm -->
    <div v-if="mappedData && mappedData.length > 0" class="table-container">
      <div class="table-header">
        <h3 class="table-title">Mapped Data Preview</h3>
        <span class="table-badge">{{ mappedData.length - 1 }} rows</span>
      </div>
      <div class="table-responsive">
        <table class="main-table">
          <thead>
            <tr>
              <th v-for="(item, i) in mappedData[0]" :key="i">{{ item }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, rowIndex) in mappedData.slice(1)" :key="rowIndex">
              <td v-for="(value, colIndex) in row" :key="colIndex">{{ value }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <button @click="AddOrgEmployee" class="btn btn-primary w-full">confirm</button>
  </template>
</template>

<style scoped>
.mb-4 {
  margin-block: 5px;
}

.table-container {
  margin-block: 24px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08), 0 4px 16px rgba(0, 0, 0, 0.06);
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
}

.main-table tbody tr:hover {
  background: #F9FAFB;
}

.main-table tbody tr:last-child td {
  border-bottom: none;
}
</style>
