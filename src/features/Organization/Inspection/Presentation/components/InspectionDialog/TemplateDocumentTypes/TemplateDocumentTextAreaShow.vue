<script setup lang="ts">
import type TaskResultItemModel from '@/features/Organization/Inspection/Data/models/FetchTaskResultModels/ItemTasksResultModel'
import AnswerTextField from './AnswerTextField.vue'
import EvidenceImageUpload from './EvidenceImageUpload.vue'
import QuestionHeader from './QuestionHeader.vue'
import { onMounted, ref, watch } from 'vue'

type ValidationErrors = {
  questionImage?: string
}

const emit = defineEmits(['update:data'])
const props = defineProps<{
  title: string
  item_id: number
  require_image: boolean
  required_type?: number
  validation_errors?: ValidationErrors
  selected_data?: TaskResultItemModel
}>()

const TextValue = ref('')
const questionImages = ref<string[]>([])

const UpdateQuestionImages = (data: string[]) => {
  questionImages.value = data ?? []
  UpdateData()
}

const UpdateData = () => {
  emit('update:data', {
    itemid: props.item_id,
    value: TextValue.value,
    img: [...questionImages.value],
    questionImg: [...questionImages.value],
  })
}

watch(TextValue, UpdateData)

watch(
  () => props.selected_data,
  (newValue) => {
    TextValue.value = newValue?.answers?.[0]?.answer || ''
    questionImages.value = newValue?.files?.map((file) => file.url) ?? []
    UpdateData()
  },
  { immediate: true },
)

onMounted(UpdateData)
</script>

<template>
  <div class="show-template-document-textarea question-response">
    <QuestionHeader type="text" :title="title" />

    <AnswerTextField
      v-model="TextValue"
      :label="$t('your_answer')"
      :placeholder="$t('Please enter details...')"
      min-height="150px"
    />

    <EvidenceImageUpload
      v-if="require_image"
      :label="$t('question_photo')"
      :required="Number(required_type) === 2"
      :error="validation_errors?.questionImage"
      :initial-images="
        questionImages.length ? questionImages : selected_data?.files?.map((file) => file.url) || []
      "
      @update:images="UpdateQuestionImages"
    />
  </div>
</template>

<style scoped>
.question-response {
  display: flex;
  width: 100%;
  min-width: 0;
  flex-direction: column;
}

:deep(.answer-text-field) {
  margin-top: 0;
}
</style>
