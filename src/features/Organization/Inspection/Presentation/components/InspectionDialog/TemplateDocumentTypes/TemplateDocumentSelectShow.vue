<script setup lang="ts">
import type TitleInterface from '@/base/Data/Models/title_interface'
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue'
import UploadImage from '@/shared/icons/UploadImage.vue'
import { ref } from 'vue'
import UploadImages from '../uploadImages.vue'
import UploadMultiImage from '@/shared/HelpersComponents/UploadMultiImage.vue'
const props = defineProps<{
  title: string
  options: TitleInterface[]
  require_image: boolean
}>()
const Selected = ref()
</script>
<template>
  <div class="show-template-document-select not-disabled">
    <div class="options-container">
      <div class="input-wrapper">
        <label>{{ title }}</label>
        <div class="col-span-4 md:col-span-2 input-wrapper">
          <CustomSelectInput
            :static-options="options"
            :modelValue="Selected"
            :placeholder="options[0]?.title"
          />
        </div>
      </div>
      <UploadMultiImage
        class="image-upload"
        v-if="require_image"
        @update:images="console.log($event)"
      />
    </div>
  </div>
</template>
