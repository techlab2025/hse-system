<script setup lang="ts">
import type TaskResultItemModel from '@/features/Organization/Inspection/Data/models/FetchTaskResultModels/ItemTasksResultModel'
import UploadMultiImage from '@/shared/HelpersComponents/UploadMultiImage.vue'
import { ref, watch } from 'vue'

const emit = defineEmits(['update:data'])
const props = defineProps<{
  title: string
  item_id: number
  require_image: boolean
  selected_data?: TaskResultItemModel
}>()

const TextValue = ref('')
const Img = ref<string | null>(null)

const UpdateImg = (data: string) => {
  Img.value = data
  UpdateData()
}

const UpdateData = () => {
  emit('update:data', {
    itemid: props.item_id,
    value: TextValue.value,
    img: Img.value,
  })
}

watch(TextValue, () => UpdateData())

watch(
  () => props.selected_data,
  (newValue) => {
    if (newValue?.answers?.[0]?.answer) {
      TextValue.value = newValue.answers[0].answer
    }
    Img.value = newValue?.files?.length ? newValue.files[0].url : null
  },
  { immediate: true }
)
</script>

<template>
  <div class="show-template-document-textarea flex flex-col gap-4">
    <div class="input-wrapper">
      <label class="font-bold mb-2 block">{{ title }}</label>
      <textarea v-model="TextValue" class="input w-full border rounded-md p-2 min-h-[80px]"
        :placeholder="$t('Please enter details...')" @change="UpdateData"></textarea>
    </div>

    <div v-if="require_image" class="mt-2">
      <UploadMultiImage @update:images="UpdateImg" :initialImages="selected_data?.files?.map(el => el.url) || []" />
    </div>
  </div>
</template>
