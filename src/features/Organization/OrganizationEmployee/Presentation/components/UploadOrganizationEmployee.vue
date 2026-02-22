<script setup lang="ts">

import { filesToBase64 } from '@/base/Presentation/utils/file_to_base_64';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import * as XLSX from 'xlsx';
import FileUpload from '../supcomponents/ExcelSheetHandle/FileUpload.vue';
import OrganizatoinEmployeeModel from '../../Data/models/OrganizatoinEmployeeModel';

const sheetData = ref<OrganizatoinEmployeeModel[] | null>(null);
const File = ref<string>("");
const router = useRouter();

const getBodyData = (data: any[]) => {
  // نشيل أول صف (الهيدر)
  return OrganizatoinEmployeeModel.transformData(data.slice(1));
};

const fileUpload = async (file: File) => {
  try {
    if (!file) {
      sheetData.value = null;
    } else {
      const data = await readExcelFile(file);
      sheetData.value = getBodyData(data);
      File.value = await filesToBase64(file);
      // console.log(File.value , "file");

    }
    // console.log(sheetData.value, "sheetData");
  } catch (error) {
    console.error("Error processing file:", error);
  }
};
const Data = ref<any[]>([]);
const readExcelFile = (file: File): Promise<any[]> => {

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const arrayBuffer = e.target?.result;
        const workbook = XLSX.read(arrayBuffer, { type: "array" });

        // Get first worksheet
        const worksheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[worksheetName];

        // Convert to JSON
        const data = XLSX.utils.sheet_to_json(worksheet, {
          header: 1, // كل صف يرجع كـ Array
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
</script>
<template>
  <FileUpload
    accept=".xls,.xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel,.csv"
    @update:fileData="fileUpload" />
  <!-- <divclass="mt-4 table-container"> -->
  <!-- <h3 class="text-lg font-semibold mb-2">Uploaded Data Preview:</h3> -->
  <div v-if="Data && Data.length > 0" class="table-responsive table-container">
    <table class="main-table">
      <thead>
        <tr>
          <th v-for="item in Data[0]">{{ item }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in Data" :key="index">
          <td class="px-4 py-2" v-for="value in item">{{ value }}</td>
        </tr>
      </tbody>
    </table>
  </div>


</template>

<style scoped>
.table-container {
  margin-block: 20px;
  border-radius: 20px;

  .table {
    padding: 10px;
    border-radius: 20px;

    thead {
      padding: 10px;
      border-radius: 20px;
    }

  }
}
</style>
