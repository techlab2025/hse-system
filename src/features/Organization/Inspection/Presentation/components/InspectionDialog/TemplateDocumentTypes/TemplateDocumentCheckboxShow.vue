<script setup lang="ts">
import Checkbox from 'primevue/checkbox'
import UploadImage from '@/shared/icons/UploadImage.vue'
import type ItemModel from '@/features/setting/TemplateItem/Data/models/ItemMode'
import UploadMultiImage from '@/shared/HelpersComponents/UploadMultiImage.vue'
import { ref } from 'vue'
const emit = defineEmits(['update:data', 'update:images'])

const { title, options, require_image } = defineProps<{
  title: string
  options: ItemModel[]
  require_image: boolean
}>()

// list of selected IDs
const SelectedOptions = ref<number[]>([])

const UpdateData = () => {
  emit('update:data', {
    title,
    selected: SelectedOptions.value
  })
}
</script>
<template>
  <div class="show-template-document-checkbox">
    <p class="title">{{ title }}</p>

    <div class="options-container">
      <div class="options">
        <div class="options-box" v-for="(option, index) in options" :key="index">
          <label :for="`checkbox-${index}-${title}`" class="label">{{ option.title }}</label>

          <Checkbox binary :value="option.id" v-model="SelectedOptions" @change="UpdateData"
            :inputId="`checkbox-${index}-${title}`" :name="`${title}-${option.id}`" />
        </div>
      </div>

      <UploadMultiImage v-if="require_image" @update:images="emit('update:images', $event)" />
    </div>
  </div>
</template>
