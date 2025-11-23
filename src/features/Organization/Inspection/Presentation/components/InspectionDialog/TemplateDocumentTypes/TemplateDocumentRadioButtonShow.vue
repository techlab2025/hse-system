<script setup lang="ts">
import type ItemModel from '@/features/setting/TemplateItem/Data/models/ItemMode'
import UploadMultiImage from '@/shared/HelpersComponents/UploadMultiImage.vue'
import UploadImage from '@/shared/icons/UploadImage.vue'
import RadioButton from 'primevue/radiobutton'
const props = defineProps<{
  title: string
  options: ItemModel[]
  require_image: boolean
}>()
</script>
<template>
  <div class="show-template-document-radio">
    <p class="title">{{ title }}</p>
    <div class="options-container">
      <div class="options">
        <div class="options-box" v-for="(option, index) in options" :key="index">
          <label :for="`radio-${index}-${title}`" class="label">{{ option.title }}</label>
          <RadioButton binary class="input" :inputId="`radio-${index}-${title}`" type="radio" name="radio" />
        </div>
      </div>
      <UploadMultiImage class="image-upload" v-if="require_image" @update:images="console.log($event)" />
    </div>
  </div>
</template>
