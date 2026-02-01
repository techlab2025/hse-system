<script setup lang="ts">
import type TaskResultItemModel from '@/features/Organization/Inspection/Data/models/FetchTaskResultModels/ItemTasksResultModel'
import type ItemModel from '@/features/setting/TemplateItem/Data/models/ItemMode'
import { TextAreaStatusEnum } from '@/features/setting/TemplateItem/Core/Enum/TextAreaStatusEnum'
import UploadMultiImage from '@/shared/HelpersComponents/UploadMultiImage.vue'
import RadioButton from 'primevue/radiobutton'
import { ref, watch } from 'vue'

const emit = defineEmits(['update:data'])

const props = defineProps<{
  title: string
  item_id: number
  options: ItemModel[]
  require_image: boolean
  selected_data?: TaskResultItemModel
}>()

const Img = ref()
const textArea = ref('')
const SelectedOption = ref<ItemModel | null>(null)

const UpdateImg = (data: string) => {
  Img.value = data
  UpdateData()
}

const UpdateOptions = (option: ItemModel) => {
  // Toggle logic: if clicking same option, deselect it
  if (SelectedOption.value?.id === option.id) {
    SelectedOption.value = null
  } else {
    SelectedOption.value = option
  }
  UpdateData()
}

const UpdateData = () => {
  emit('update:data', {
    itemid: props.item_id,
    value: SelectedOption.value?.id || 0,
    img: Img.value,
    notes: textArea.value,
  })
}

// Watch for manual text changes to emit updates
watch(textArea, () => {
  UpdateData()
})

// Watch for incoming data to populate the form (Edit Mode)
watch(
  () => props.selected_data,
  (newVal) => {
    if (newVal?.answers?.[0]) {
      const answer = newVal.answers[0]
      const optId = answer.templateItemOption?.id

      // Sync Radio Selection
      const matched = props.options.find(o => o.id === optId)
      if (matched) SelectedOption.value = matched

      // Sync Text Area
      if (answer.answer) {
        textArea.value = answer.answer
      }
    }
  },
  { immediate: true }
)

const showTextArea = () => {
  if (!SelectedOption.value) return false

  // Checking both TextAreaType and kpi as per your second example
  const status = SelectedOption.value?.TextAreaType || SelectedOption.value?.kpi
  return String(status) === String(TextAreaStatusEnum.required) ||
    String(status) === String(TextAreaStatusEnum.optional)
}
</script>

<template>
  <!-- <pre>{{ selected_data?.answers }}</pre> -->
  <div class="show-template-result-radio-container" v-if="selected_data?.answers?.length > 0">
    <div class="show-template-result-radio flex flex-col gap-4">
      <div class="options-container">
        <span class="question">{{ title }}</span>
        <span class="answer">{{ selected_data?.answers?.[0]?.templateItemOption?.title }}</span>
      </div>
    </div>
    <div class="w-full flex  gap-2">
      <div class="textarea-conatneir" v-if="selected_data?.answers?.[0]?.answer">
        <p class="title">{{ $t('typing text') }}</p>
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
