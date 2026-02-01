<script setup lang="ts">
import TitleInterface from '@/base/Data/Models/title_interface'
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue'
import { ref, watch } from 'vue'
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
    showTextArea()
    UpdateData()
  }
}

const UpdateData = () => {
  emit('update:data', {
    itemId: props.item_id,
    selected: SelectedOption.value?.id,
    img: Img.value,
    value: textArea.value,
  })
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
  <!-- <pre>{{ selected_data }}</pre> -->

  <div class="show-template-result-select-container" v-if="selected_data?.answers?.length > 0">

    <div class="show-template-result-select not-disabled flex gap-4">
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
      <div v-if="selected_data?.files?.length > 0" class="ml-auto mt-4">
        <UploadMultiImage @update:images="UpdateImg" class="image-upload"
          :initialImages="selected_data?.files?.map((el) => el.url) || []" />
      </div>


    </div>
  </div>
</template>

<style scoped>
.ml-auto {
  margin-left: auto;
}

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
