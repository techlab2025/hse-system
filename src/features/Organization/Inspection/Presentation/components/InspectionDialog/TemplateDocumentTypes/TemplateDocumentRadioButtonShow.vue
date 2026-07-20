<script setup lang="ts">
import type TaskResultItemModel from '@/features/Organization/Inspection/Data/models/FetchTaskResultModels/ItemTasksResultModel'
import type ItemModel from '@/features/setting/TemplateItem/Data/models/ItemMode'
import AnswerTextField from './AnswerTextField.vue'
import EvidenceImageUpload from './EvidenceImageUpload.vue'
import QuestionChoiceCard from './QuestionChoiceCard.vue'
import QuestionHeader from './QuestionHeader.vue'
import { computed, nextTick, onMounted, ref, watch } from 'vue'

type ValidationErrors = {
  questionImage?: string
  answerImages?: Record<number, string>
  notes?: string
}

const emit = defineEmits(['update:data'])

const props = defineProps<{
  title: string
  item_id: number
  options: ItemModel[]
  require_image: boolean
  required_type?: number
  validation_errors?: ValidationErrors
  selected_data?: TaskResultItemModel
}>()

const questionImages = ref<string[]>([])
const answerImages = ref<Record<number, string[]>>({})
const textArea = ref('')
const SelectedOption = ref<ItemModel | null>(null)

const showTextArea = computed(() => ['1', '2'].includes(String(SelectedOption.value?.kpi ?? '0')))
const isTextAreaRequired = computed(() => String(SelectedOption.value?.kpi) === '2')
const showAnswerImage = computed(() => Boolean(SelectedOption.value?.is_upload))

const UpdateQuestionImages = (data: string[]) => {
  questionImages.value = data ?? []
  UpdateData()
}

const UpdateAnswerImages = (data: string[]) => {
  const optionId = SelectedOption.value?.id
  if (!optionId) return
  answerImages.value = { [optionId]: data ?? [] }
  UpdateData()
}

const UpdateOptions = (option: ItemModel) => {
  SelectedOption.value = SelectedOption.value?.id === option.id ? null : option
  nextTick(UpdateData)
}

const UpdateData = () => {
  emit('update:data', {
    itemid: props.item_id,
    value: SelectedOption.value?.id || 0,
    img: [...questionImages.value, ...Object.values(answerImages.value).flat()],
    questionImg: [...questionImages.value],
    answerImages: { ...answerImages.value },
    notes: showTextArea.value ? textArea.value : '',
  })
}

watch(
  () => SelectedOption.value?.id,
  (optionId) => {
    answerImages.value =
      optionId && answerImages.value[optionId] ? { [optionId]: answerImages.value[optionId] } : {}
    if (!showTextArea.value) textArea.value = ''
    UpdateData()
  },
)

watch(textArea, UpdateData)

watch(
  () => props.selected_data,
  (newVal) => {
    if (!newVal?.answers?.[0]) return

    const answer = newVal.answers[0]
    const optionId = answer.templateItemOption?.id
    SelectedOption.value = props.options.find((option) => option.id === optionId) ?? null
    textArea.value = answer.answer || ''
    questionImages.value = newVal.files?.map((file) => file.url) ?? []
    UpdateData()
  },
  { immediate: true },
)

onMounted(UpdateData)
</script>

<template>
  <div class="show-template-document-radio question-response">
    <QuestionHeader type="single" :title="title" :status="SelectedOption?.title" />

    <div class="answer-options-grid">
      <QuestionChoiceCard
        v-for="option in options"
        :key="option.id"
        type="radio"
        :item-id="item_id"
        :option="option"
        :selected="SelectedOption?.id === option.id"
        @select="UpdateOptions(option)"
      />
    </div>

    <EvidenceImageUpload
      v-if="require_image && !showAnswerImage"
      :label="$t('question_photo')"
      :required="Number(required_type) === 2"
      :error="validation_errors?.questionImage"
      :initial-images="
        questionImages.length ? questionImages : selected_data?.files?.map((file) => file.url) || []
      "
      @update:images="UpdateQuestionImages"
    />

    <EvidenceImageUpload
      v-if="showAnswerImage && SelectedOption"
      :key="SelectedOption.id"
      :label="$t('answer_photo') + ': ' + SelectedOption.title"
      :required="true"
      :error="validation_errors?.answerImages?.[SelectedOption.id]"
      @update:images="UpdateAnswerImages"
    />

    <AnswerTextField
      v-if="showTextArea"
      v-model="textArea"
      :label="$t('Notes')"
      :required="isTextAreaRequired"
      :error="validation_errors?.notes"
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

.answer-options-grid {
  display: grid;
  width: 100%;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  gap: 9px;
}

@media (max-width: 640px) {
  .answer-options-grid {
    grid-template-columns: 1fr;
  }
}
</style>
