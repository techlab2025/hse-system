<script setup lang="ts">
import Checkbox from 'primevue/checkbox'
import UploadImage from '@/shared/icons/UploadImage.vue'
import type ItemModel from '@/features/setting/TemplateItem/Data/models/ItemMode'
const { title, options } = defineProps<{
  title: string
  options: ItemModel[]
  require_image: boolean
}>()
</script>
<template>
  <div class="show-template-document-checkbox">
    <p class="title">{{ title }}</p>
    <div class="options-container">
      <div class="options">
        <div class="options-box" v-for="(option, index) in options" :key="index">
          <label :for="`checkbox-${index}-${title}`" class="label">{{ option.title }}</label>
          <Checkbox binary :inputId="`checkbox-${index}-${title}`" type="checkbox" class="input" />
        </div>
      </div>
      <UploadImage class="image-upload" v-if="require_image" />
    </div>
  </div>
</template>
