<script setup lang="ts">
import UpdatedCustomInputSelect from '@/shared/FormInputs/UpdatedCustomInputSelect.vue'
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import AnswerTextField from './AnswerTextField.vue'
import EvidenceImageUpload from './EvidenceImageUpload.vue'
import QuestionHeader from './QuestionHeader.vue'
import type TaskResultItemModel from '@/features/Organization/Inspection/Data/models/FetchTaskResultModels/ItemTasksResultModel'
import type ItemModel from '@/features/setting/TemplateItem/Data/models/ItemMode'

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

const Options = ref<ItemModel[]>(props.options)
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

const SetSelectedOption = (data: any) => {
  SelectedOption.value = data as ItemModel | null
  nextTick(UpdateData)
}

const UpdateData = () => {
  emit('update:data', {
    itemId: props.item_id,
    selected: SelectedOption.value?.id,
    img: [...questionImages.value, ...Object.values(answerImages.value).flat()],
    questionImg: [...questionImages.value],
    answerImages: { ...answerImages.value },
    value: showTextArea.value ? textArea.value : '',
  })
}

watch(
  () => props.options,
  (newValue) => {
    Options.value = newValue
  },
  { deep: true },
)

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
  (newValue) => {
    if (!newValue?.answers?.[0]) return

    const answer = newValue.answers[0]
    const optionId = answer.templateItemOption?.id
    SelectedOption.value = props.options.find((option) => option.id === optionId) ?? null
    textArea.value = answer.answer || ''
    questionImages.value = newValue.files?.map((file) => file.url) ?? []
    UpdateData()
  },
  { immediate: true, deep: true },
)

onMounted(UpdateData)
</script>

<template>
  <div class="show-template-document-select question-response">
    <QuestionHeader type="dropdown" :title="title" :status="SelectedOption?.title" />

    <div class="select-answer-card" :class="{ 'select-answer-card--selected': SelectedOption }">
      <span class="select-answer-card__icon">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M8 10h8m-8 4h5M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"
          />
        </svg>
      </span>
      <div class="select-answer-card__field">
        <span class="select-answer-card__label">{{ $t('choose_answer') }}</span>
        <UpdatedCustomInputSelect
          :id="`option-${item_id}`"
          label=""
          :placeholder="$t('select')"
          :static-options="Options"
          :model-value="SelectedOption"
          @update:model-value="SetSelectedOption"
        />
      </div>
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
  gap: 16px;
}

.select-answer-card {
  display: flex;
  min-width: 0;
  align-items: flex-start;
  gap: 16px;
  width: 100%;
  padding: 18px 18px 18px 16px;
  border: 1px solid var(--surface-2, #e5e7eb);
  border-radius: 20px;
  background: var(--surface-1, #fff);
  transition:
    border-color 200ms ease,
    box-shadow 200ms ease,
    background 200ms ease,
    transform 200ms ease;
}

.select-answer-card:hover {
  box-shadow: 0 14px 40px rgb(15 23 42 / 8%);
}

.select-answer-card--selected,
.select-answer-card:focus-within {
  border-color: var(--brand-primary-500, #386cfe);
  background: color-mix(in srgb, var(--brand-primary-500, #386cfe) 5%, var(--surface-1, #ffffff));
  box-shadow: 0 16px 36px rgb(56 108 254 / 12%);
  transform: translateY(-1px);
}

.select-answer-card__icon {
  display: grid;
  width: 46px;
  height: 46px;
  flex: 0 0 46px;
  place-items: center;
  border-radius: 16px;
  color: var(--brand-primary-600, #2563eb);
  background: color-mix(in srgb, var(--brand-primary-500, #386cfe) 12%, transparent);
}

.select-answer-card__icon svg {
  width: 20px;
  height: 20px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.8;
}

.select-answer-card__field {
  min-width: 0;
  flex: 1;
}

.select-answer-card__label {
  display: block;
  margin-bottom: 8px;
  color: var(--text-muted, #667085);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.02em;
  text-transform: uppercase;
}

:deep(.select-answer-card .updated-custom-input-select),
:deep(.select-answer-card .input-wrapper) {
  width: 100%;
  padding: 0 !important;
}

:deep(.select-answer-card .input-label) {
  display: none !important;
}

:deep(.select-answer-card .p-select),
:deep(.select-answer-card .p-multiselect),
:deep(.select-answer-card .input-select) {
  width: 100% !important;
  min-height: 50px;
  border-color: color-mix(
    in srgb,
    var(--brand-primary-500, #386cfe) 16%,
    var(--surface-2, #e5e7eb)
  ) !important;
  border-radius: 16px !important;
  background: var(--surface-1, #fff) !important;
  box-shadow: none !important;
}

:deep(.select-answer-card .p-select:focus-within),
:deep(.select-answer-card .p-multiselect:focus-within),
:deep(.select-answer-card .input-select:focus-within) {
  border-color: var(--brand-primary-500, #386cfe) !important;
}

@media (max-width: 640px) {
  .select-answer-card {
    flex-direction: column;
    padding: 16px;
  }

  .select-answer-card__icon {
    width: 38px;
    height: 38px;
  }
}
</style>
