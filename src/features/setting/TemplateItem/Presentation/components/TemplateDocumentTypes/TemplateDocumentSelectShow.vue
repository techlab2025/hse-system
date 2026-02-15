<script setup lang="ts">
import type { TitleLocale } from '@/base/core/params/translations_params';
import type TitleInterface from '@/base/Data/Models/title_interface'
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue'
import UploadImage from '@/shared/icons/UploadImage.vue'
import { ref } from 'vue'
const props = defineProps<{
  title: string
  options: TitleInterface[]
  require_image: boolean
  tag: TitleLocale

}>()
const Selected = ref()
</script>
<template>
  <div class="show-template-document-select">
    <div class="options-container">
      <div class="input-wrapper">
        <label>{{ title }}</label>
        <p class="tag">{{ tag?.titles?.[0]?.title }}</p>
        <div class="col-span-4 md:col-span-2 input-wrapper">
          <CustomSelectInput :static-options="options" :modelValue="Selected" :placeholder="options[0]?.title" />
        </div>
      </div>
      <UploadImage class="image-upload" v-if="require_image" />
    </div>
  </div>
</template>
<style scoped>
.tag {
  font-size: 12px;
  font-weight: 500;
  color: gray;
}
</style>
