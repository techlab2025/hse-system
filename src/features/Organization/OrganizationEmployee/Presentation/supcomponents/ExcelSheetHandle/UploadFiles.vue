<script setup lang="ts">
import { filesToBase64 } from '@/base/Presentation/utils/file_to_base_64';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import OrganizatoinEmployeeModel from '../../../Data/models/OrganizatoinEmployeeModel';
import FileUpload from './FileUpload.vue';
import * as XLSX from 'xlsx';

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

</template>
