<script setup lang="ts">
import type TaskResultItemModel from '@/features/Organization/Inspection/Data/models/FetchTaskResultModels/ItemTasksResultModel'
import { ref, watch } from 'vue'

const emit = defineEmits(['update:data'])
const props = defineProps<{
  title: string
  item_id: number
  require_image: boolean
  selected_data?: TaskResultItemModel // Changed from array to single item
}>()

const TextValue = ref('')


const UpdateData = () => {
  emit('update:data', {
    itemid: props.item_id,
    value: TextValue.value,
  })
}

watch(
  () => props.selected_data,
  (newValue) => {
    if (newValue?.answers?.[0]?.answer) {
      TextValue.value = newValue.answers[0].answer
    }
  },
  { immediate: true }
)
</script>

<template>
  <div class="show-template-result-textarea">
    <div class="options-container">
      {{ selected_data?.answers?.[0]?.answer }}
    </div>
  </div>
</template>
