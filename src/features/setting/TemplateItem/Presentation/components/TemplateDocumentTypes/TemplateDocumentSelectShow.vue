<script setup lang="ts">
import type TitleInterface from '@/base/Data/Models/title_interface';
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue';
import UploadImage from '@/shared/icons/UploadImage.vue';
import RadioButton from 'primevue/radiobutton';
const props = defineProps<{
  title: string
  options: TitleInterface[]

}>()

</script>
<template>
  <div class="show-template-document-select">
    <div class="options-container">
      <div class="input-wrapper">
        <CustomSelectInput id="selec" :label="title"  :disabled="true" class="input" />
      </div>
      <UploadImage class="image-upload" />
    </div>
  </div>
</template>
