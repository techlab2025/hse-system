<script setup lang="ts">
import type TaskResultItemModel from '@/features/Organization/Inspection/Data/models/FetchTaskResultModels/ItemTasksResultModel';
import { ref, watch } from 'vue';

const emit = defineEmits(['update:data'])
const props = defineProps<{
  title: string
  item_id: number
  require_image: boolean
  selected_data?: TaskResultItemModel[]
}>()
const TextValue = ref(props?.selected_data?.[0]?.answers[0]?.answer)

const UpdateData = () => {
  emit('update:data', {
    itemid: props.item_id,
    value: TextValue.value,
  })
}

watch(() => props.selected_data, (newValue) => {
  TextValue.value = newValue?.[0]?.answers[0]?.answer
})

</script>
<template>

  <div class="show-template-document-select">
    <div class="options-container">
      <div class="input-wrapper">
        <label for="">{{ title }}</label>
        <textarea id="selec" v-model="TextValue" :label="title" class="input" @change="UpdateData"></textarea>
      </div>
    </div>
    <!-- <UploadImage class="image-upload" v-if="require_image" /> -->
  </div>
</template>
