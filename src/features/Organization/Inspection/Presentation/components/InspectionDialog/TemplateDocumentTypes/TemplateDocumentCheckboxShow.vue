<script setup lang="ts">
import Checkbox from 'primevue/checkbox'
import UploadImage from '@/shared/icons/UploadImage.vue'
import type ItemModel from '@/features/setting/TemplateItem/Data/models/ItemMode'
import UploadMultiImage from '@/shared/HelpersComponents/UploadMultiImage.vue'
import { ref } from 'vue'
const emit = defineEmits(['update:data'])
const { title, options } = defineProps<{
  title: string
  options: ItemModel[]
  require_image: boolean
}>()

const SelectedOptions = ref<{ optionTitle: string, isSelected: boolean[] }[]>([])
const UpdateData = (title: string, id: number) => {
  SelectedOptions.value.push({ optionTitle: title, isSelected: [id] })
  console.log(SelectedOptions.value, 'SelectedOptions.value')
  emit('update:data')
}
</script>
<template>
  <div class="show-template-document-checkbox">
    <p class="title">{{ title }}</p>
    <div class="options-container">
      <div class="options">
        <div class="options-box" v-for="(option, index) in options" :key="index">
          <label :for="`checkbox-${index}-${title}`" class="label">{{ option.title }}</label>
          <Checkbox binary :inputId="`checkbox-${index}-${title}`" type="checkbox" class="input"
            @change="UpdateData(title, option.id)" name="checkbox-option" />
        </div>
      </div>
      <UploadMultiImage class="image-upload" v-if="require_image" @update:images="console.log($event)" />
    </div>
  </div>
</template>
