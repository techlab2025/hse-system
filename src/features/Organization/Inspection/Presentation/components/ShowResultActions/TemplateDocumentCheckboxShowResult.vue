<script setup lang="ts">
import Checkbox from 'primevue/checkbox'
import type ItemModel from '@/features/setting/TemplateItem/Data/models/ItemMode'
import { TextAreaStatusEnum } from '@/features/setting/TemplateItem/Core/Enum/TextAreaStatusEnum'
import UploadMultiImage from '@/shared/HelpersComponents/UploadMultiImage.vue'
import { ref, watch, computed } from 'vue'
import type TaskResultItemModel from '@/features/Organization/Inspection/Data/models/FetchTaskResultModels/ItemTasksResultModel'

const emit = defineEmits(['update:data', 'update:images'])

const props = defineProps<{
  title: string
  item_id: number
  options: ItemModel[]
  require_image: boolean
  selected_data?: TaskResultItemModel
}>()

const Img = ref()
const textArea = ref('')
const SelectedValues = ref<number[]>([])

const UpdateImg = (data: string) => {
  Img.value = data
  UpdateData()
}

const UpdateOptions = (value: number) => {
  if (SelectedValues.value.includes(value)) {
    SelectedValues.value = SelectedValues.value.filter(v => v !== value)
    showTextArea()
  } else {
    SelectedValues.value.push(value)
    showTextArea()
  }
  UpdateData()
}

const UpdateData = () => {
  emit("update:data", {
    itemid: props.item_id,
    selected: SelectedValues.value,
    img: Img.value,
    notes: textArea.value, // Updated key to match the data structure
  })
}

// Watch for text changes
watch(textArea, () => {
  UpdateData()
})

// Sync incoming data (Edit Mode)
watch(
  () => props.selected_data,
  (newVal) => {
    if (newVal?.answers) {
      SelectedValues.value = newVal.answers
        .map((a: any) => a.templateItemOption?.id)
        .filter((id: number | undefined): id is number => id !== undefined)


      console.log(newVal.answers.find((a: any) => a.answer), "newVal.answers.find((a: any) => a.answer)")
      // Sync text area from the first available note in answers
      const note = newVal.answers.find((a: any) => a.answer)?.answer
      if (note) textArea.value = note
    }
  },
  { immediate: true }
)

// Logic: Show textarea if ANY of the selected checkboxes require it
const showTextArea = () => {
  return props.options.some(option => {
    if (!SelectedValues.value.includes(option.id)) return false
    console.log(props.options, "props.options")

    const status = option.TextAreaType || option.kpi
    return String(status) === String(TextAreaStatusEnum.required) ||
      String(status) === String(TextAreaStatusEnum.optional)
  })
}
</script>


<template>
  <div class="show-template-result-checkbox-conatiner" v-if="selected_data?.answers?.length > 0">

    <div class="show-template-result-checkbox flex flex-col gap-4">
      <div class="options-container">
        <span class="question">{{ title }}</span>
        <div class="asnwers-container flex gap-2">
          <span class="answer" v-for="(answer, index) in selected_data?.answers" :key="index">{{
            answer?.templateItemOption?.title }}</span>
        </div>
      </div>
    </div>
    <!-- v-for="(answer, index) in selected_data?.answers" :key="index" -->
    <div class="w-full flex  gap-2">
      <div class="textarea-conatneir" v-if="selected_data?.answers?.[0]?.answer">
        <p class="title">typing text</p>
        <span class="textarea-answer">
          {{ selected_data?.answers?.[0]?.answer }}
        </span>
      </div>
      <div v-if="selected_data?.files?.length > 0" class="mt-4">
        <UploadMultiImage @update:images="UpdateImg" class="image-upload"
          :initialImages="selected_data?.files?.map((el) => el.url) || []" />
      </div>


    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  margin-top: 10px;
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
