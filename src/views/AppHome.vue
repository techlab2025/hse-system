<script setup lang="ts">
import DataTable from '@/components/Tables/DataTable.vue';
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue'
import { ref } from 'vue'

const title = ref('')
</script>

<template>
  <div></div>
  <DataTable />
  <!-- <FileUpload />-->
  <!-- <div class="input-wrapper">
    <label for="">Title</label>
    <input type="text" id="" v-model="title" placeholder="Enter Title" />
  </div> -->
</template>

<style scoped></style>
