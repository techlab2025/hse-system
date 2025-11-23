<script setup lang="ts">
import Checkbox from 'primevue/checkbox'
import UploadImage from '@/shared/icons/UploadImage.vue'
import type ItemModel from '@/features/setting/TemplateItem/Data/models/ItemMode'
import UploadMultiImage from '@/shared/HelpersComponents/UploadMultiImage.vue'
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
      <UploadMultiImage
        class="image-upload"
        v-if="require_image"
        @update:images="$emit('update:images', $event)"
      />
    </div>
  </div>
</template>
