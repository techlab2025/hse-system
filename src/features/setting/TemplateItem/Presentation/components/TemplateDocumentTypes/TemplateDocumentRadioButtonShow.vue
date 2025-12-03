<script setup lang="ts">
import UploadImage from '@/shared/icons/UploadImage.vue';
import RadioButton from 'primevue/radiobutton';
import type ItemModel from '../../../Data/models/ItemMode';
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
          <RadioButton :readonly="true" binary class="input" :inputId="`radio-${index}-${title}`" type="radio" />
        </div>
      </div>
      <UploadImage class="image-upload" v-if="require_image" />
    </div>
  </div>
</template>
