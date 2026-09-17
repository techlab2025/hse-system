<script setup lang="ts">
import type ItemModel from '@/features/setting/TemplateItem/Data/models/ItemMode'
import EvidenceImageUpload from './EvidenceImageUpload.vue'
import AnswerTextField from './AnswerTextField.vue'
import QuestionChoiceCard from './QuestionChoiceCard.vue'
import QuestionHeader from './QuestionHeader.vue'
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import type TaskResultItemModel from '@/features/Organization/Inspection/Data/models/FetchTaskResultModels/ItemTasksResultModel'

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
const SelectedValues = ref<number[]>([])

const selectedOptions = computed(() =>
  props.options.filter((option) => SelectedValues.value.includes(option.id)),
)

const selectedUploadOptions = computed(() =>
  selectedOptions.value.filter((option) => Boolean(option.is_upload)),
)

const showTextArea = computed(() =>
  selectedOptions.value.some((option) => ['1', '2'].includes(String(option.kpi))),
)

const isTextAreaRequired = computed(() =>
  selectedOptions.value.some((option) => String(option.kpi) === '2'),
)

const UpdateQuestionImages = (data: string[]) => {
  questionImages.value = data ?? []
  UpdateData()
}

const UpdateAnswerImages = (optionId: number, data: string[]) => {
  answerImages.value = { ...answerImages.value, [optionId]: data ?? [] }
  UpdateData()
}

const UpdateOptions = (value: number) => {
  SelectedValues.value = SelectedValues.value.includes(value)
    ? SelectedValues.value.filter((selected) => selected !== value)
    : [...SelectedValues.value, value]

  nextTick(UpdateData)
}

const UpdateData = () => {
  emit('update:data', {
    itemid: props.item_id,
    selected: [...SelectedValues.value],
    img: [...questionImages.value, ...Object.values(answerImages.value).flat()],
    questionImg: [...questionImages.value],
    answerImages: { ...answerImages.value },
    notes: showTextArea.value ? textArea.value : '',
  })
}

watch(showTextArea, (visible) => {
  if (!visible) {
    textArea.value = ''
    UpdateData()
  }
})

watch(selectedUploadOptions, (options) => {
  const visibleOptionIds = new Set(options.map((option) => option.id))
  const nextImages = Object.fromEntries(
    Object.entries(answerImages.value).filter(([optionId]) =>
      visibleOptionIds.has(Number(optionId)),
    ),
  )

  if (Object.keys(nextImages).length !== Object.keys(answerImages.value).length) {
    answerImages.value = nextImages
    UpdateData()
  }
})

watch(textArea, () => {
  if (showTextArea.value) UpdateData()
})

watch(
  () => props.selected_data,
  (newVal) => {
    if (!newVal) return

    SelectedValues.value =
      newVal.answers
        ?.map((answer: any) => answer.templateItemOption?.id)
        .filter((id: number | undefined): id is number => id !== undefined) || []

    textArea.value = newVal.answers?.find((answer: any) => answer.answer)?.answer || ''
    questionImages.value = newVal.files?.map((file) => file.url) ?? []
    UpdateData()
  },
  { immediate: true },
)

onMounted(UpdateData)
</script>

<template>
  <div class="show-template-document-checkbox question-response">
    <QuestionHeader
      type="multiple"
      :title="title"
      :status="SelectedValues.length ? `${SelectedValues.length} ${$t('selected')}` : undefined"
    />

    <div class="answer-options-grid">
      <QuestionChoiceCard
        v-for="option in options"
        :key="option.id"
        type="checkbox"
        :item-id="item_id"
        :option="option"
        :selected="SelectedValues.includes(option.id)"
        @select="UpdateOptions(option.id)"
      />
    </div>

    <EvidenceImageUpload
      v-if="require_image && selectedUploadOptions.length === 0"
      :label="$t('question_photo')"
      :required="Number(required_type) === 2"
      :error="validation_errors?.questionImage"
      :initial-images="
        questionImages.length ? questionImages : selected_data?.files?.map((file) => file.url) || []
      "
      @update:images="UpdateQuestionImages"
    />

    <EvidenceImageUpload
      v-for="option in selectedUploadOptions"
      :key="`answer-image-${option.id}`"
      :label="$t('answer_photo') + ': ' + option.title"
      :required="true"
      :error="validation_errors?.answerImages?.[option.id]"
      @update:images="UpdateAnswerImages(option.id, $event)"
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
