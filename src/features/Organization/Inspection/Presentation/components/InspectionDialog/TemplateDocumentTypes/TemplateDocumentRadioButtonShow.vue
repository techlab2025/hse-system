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
  <div class="show-template-document-radio flex flex-col gap-4">
    <p class="title font-bold">{{ title }}</p>

    <div class="options-container">
      <div class="options flex flex-wrap gap-4">
        <div class="options-box flex items-center gap-2" v-for="(option, index) in options" :key="option.id">
          <RadioButton class="input" :value="option.id" :modelValue="SelectedOption?.id"
            @update:modelValue="UpdateOptions(option)" :inputId="`radio-${item_id}-${option.id}`"
            :name="`radio-${item_id}`" />
          <label :for="`radio-${item_id}-${option.id}`" class="label cursor-pointer">
            {{ option.title }}
          </label>
        </div>
      </div>

      <div v-if="showTextArea()" class="input-wrapper w-full animate-fade-in mt-4">
        <label for="notes" class="block mb-1 text-sm font-medium">Notes</label>
        <textarea id="notes" class="input w-full border rounded-md p-2 min-h-[80px]" v-model="textArea"
          placeholder="Please enter details..."></textarea>
      </div>

      <div v-if="require_image" class="mt-4 border-t pt-4">
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
