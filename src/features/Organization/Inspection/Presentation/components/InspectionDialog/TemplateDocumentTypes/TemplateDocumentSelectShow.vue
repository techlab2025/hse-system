<script setup lang="ts">
import TitleInterface from '@/base/Data/Models/title_interface'
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue'
import { ref, watch, nextTick } from 'vue'
import UploadMultiImage from '@/shared/HelpersComponents/UploadMultiImage.vue'
import type TaskResultItemModel from '@/features/Organization/Inspection/Data/models/FetchTaskResultModels/ItemTasksResultModel'
import { TextAreaStatusEnum } from '@/features/setting/TemplateItem/Core/Enum/TextAreaStatusEnum'

const emit = defineEmits(['update:data', 'update:images'])

const props = defineProps<{
  title: string
  item_id: number
  options: any[]
  require_image: boolean
  selected_data?: TaskResultItemModel
}>()

const Options = ref(props.options)
const Img = ref()
const textArea = ref('')

const SelectedOption = ref<any>(null)

const UpdateImg = (data: string) => {
  Img.value = data
  UpdateData()
}

const SetSelectedOption = (data: any) => {
  if (data) {
    SelectedOption.value = data

    // Use nextTick to ensure the ref has updated
    nextTick(() => {
      showTextArea()
      UpdateData()
    })
  }
}

const UpdateData = () => {
  const dataToEmit = {
    itemId: props.item_id,
    selected: SelectedOption.value?.id,
    img: Img.value,
    value: textArea.value,
  }

  // Debug log to verify correct data
  console.log('Select emitting data:', dataToEmit)

  emit('update:data', dataToEmit)
}

watch(() => props.options, (newValue) => {
  Options.value = newValue
}, { deep: true })

watch(textArea, () => {
  UpdateData()
})

watch(
  () => props.selected_data,
  (newValue) => {
    if (newValue?.answers?.[0]) {
      const answer = newValue.answers[0]
      const optionId = answer.templateItemOption?.id

      const matchedOption = props.options.find(opt => opt.id === optionId)
      if (matchedOption) {
        SelectedOption.value = matchedOption
      } else if (answer.templateItemOption) {
        SelectedOption.value = answer.templateItemOption
      }

      if (answer) {
        textArea.value = answer?.answer
      }
    }
  },
  { immediate: true, deep: true }
)


const showTextArea = () => {
  const status = Number(SelectedOption.value?.kpi)
  return (SelectedOption.value?.kpi != 0) && (String(status) === String(TextAreaStatusEnum.required) ||
    String(status) === String(TextAreaStatusEnum.optional))
}
</script>

<template>
  <div class="show-template-document-select not-disabled flex flex-col gap-4">

    <div class="options-container">
      <div class="input-wrapper">
        <label class="font-bold mb-2 block">{{ title }}</label>
        <div class="col-span-4 md:col-span-2">
          <CustomSelectInput :label="''" :static-options="Options" @update:modelValue="SetSelectedOption"
            :modelValue="SelectedOption" id="option" />
        </div>
      </div>
    </div>

    <div v-if="require_image" class="image-upload-section  pt-2" style="padding-top: 10px;">
      <UploadMultiImage class="image-upload" @update:images="UpdateImg"
        :initialImages="selected_data?.files?.map((el) => el.url) || []" />
    </div>

  </div>

  <div v-if="showTextArea()" class="input-wrapper w-full animate-fade-in">
    <label for="notes" class="block mb-1 text-sm font-medium">Notes</label>
    <textarea id="notes" class="input w-full border rounded-md p-2 min-h-[80px]" v-model="textArea"
      placeholder="Please enter details..."></textarea>
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
