<script setup lang="ts">


import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue';
import { ref } from 'vue'

const title = ref('')
</script>

<template>


  <!-- <FileUpload />-->

  <CustomSelectInput
  :label="'Title'"
  :static-options="[{ id: 1, title: 'test' }, { id: 2, title: 'test2' }, { id: 3, title: 'test3' }]"
  :type="2"
  />
  <!-- <div class="input-wrapper">
    <label for="">Title</label>
    <input type="text" id="" v-model="title" placeholder="Enter Title" />
  </div> -->

</template>

<style scoped></style>
