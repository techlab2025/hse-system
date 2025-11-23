<script setup lang="ts">
import type ItemModel from '@/features/setting/TemplateItem/Data/models/ItemMode'
import UploadMultiImage from '@/shared/HelpersComponents/UploadMultiImage.vue'
import UploadImage from '@/shared/icons/UploadImage.vue'
import RadioButton from 'primevue/radiobutton'
import { ref } from 'vue';
const props = defineProps<{
  title: string
  options: ItemModel[]
  require_image: boolean
}>()
const SelcetedInput = ref()
</script>
<template>
  <div class="show-template-document-radio">
    <p class="title">{{ title }}</p>
    <div class="options-container">
      <div class="options">
        <div class="options-box" v-for="(option, index) in options" :key="index">
          <label :for="`radio-${index}-${title}`" class="label">{{ option.title }}</label>
          <RadioButton class="input" :value="option.id" v-model="SelcetedInput" :inputId="`radio-${index}-${title}`"
            type="radio" :name="`radio-option`" />
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
