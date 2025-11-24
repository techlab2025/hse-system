<script setup lang="ts">
import Checkbox from 'primevue/checkbox'
import UploadImage from '@/shared/icons/UploadImage.vue'
import type ItemModel from '@/features/setting/TemplateItem/Data/models/ItemMode'
import UploadMultiImage from '@/shared/HelpersComponents/UploadMultiImage.vue'
import { ref } from 'vue'

const emit = defineEmits(['update:data', 'update:images'])

const { title, item_id, options, require_image } = defineProps<{
  title: string
  item_id: number
  options: ItemModel[]
  require_image: boolean
}>()

const Img = ref()
const UpdateImg = (data: string) => {
  Img.value = data
}

const SelectedValues = ref<number[]>([])

const UpdateOptions = (itemId: number, value: number) => {
  if (SelectedValues.value.includes(value)) {
    SelectedValues.value = SelectedValues.value.filter(v => v !== value)
  } else {
    SelectedValues.value.push(value)
  }

  UpdateData()
}

const UpdateData = () => {
  emit("update:data", {
    itemid: item_id,
    selected: SelectedValues.value,
    img: Img.value
  })
}

</script>

<template>
  <div class="show-template-document-checkbox">
    <p class="title">{{ title }}</p>
    <div class="options-container">
      <div class="options">
        <div class="options-box" v-for="(option, index) in options" :key="index">
          <label :for="`checkbox-${index}-${title}-${option.id}`" class="label">{{ option.title }}</label>
          <Checkbox binary :value="option.id" @change="UpdateOptions(item_id, option.id)"
            :inputId="`checkbox-${index}-${title}-${option.id}`" :name="`${title}-${option.id}`" />
        </div>
      </div>
      <UploadMultiImage v-if="require_image" @update:images="UpdateImg" />
    </div>
  </div>
</template>
