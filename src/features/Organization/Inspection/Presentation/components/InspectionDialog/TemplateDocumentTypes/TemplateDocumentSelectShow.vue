<script setup lang="ts">
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue'
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
        <CustomSelectInput
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
}

.select-answer-card {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 12px;
  padding: 13px;
  border: 1px solid
    color-mix(in srgb, var(--brand-primary-500, #386cfe) 14%, var(--surface-2, #e5e7eb));
  border-radius: 17px;
  background: color-mix(in srgb, var(--surface-1, #fff) 96%, var(--brand-primary-50, #eff6ff));
  transition:
    border-color 180ms ease,
    box-shadow 180ms ease,
    background 180ms ease;
}

.select-answer-card--selected,
.select-answer-card:focus-within {
  border-color: color-mix(in srgb, var(--brand-primary-500, #386cfe) 52%, transparent);
  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--brand-primary-500, #386cfe) 8%, #fff),
    #fff
  );
  box-shadow: 0 10px 26px rgb(29 78 216 / 9%);
}

.select-answer-card__icon {
  display: grid;
  width: 42px;
  height: 42px;
  flex: 0 0 42px;
  place-items: center;
  border-radius: 13px;
  color: var(--brand-primary-600, #2563eb);
  background: color-mix(in srgb, var(--brand-primary-500, #386cfe) 10%, transparent);
}

.select-answer-card__icon svg {
  width: 19px;
  height: 19px;
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
  margin-bottom: 5px;
  color: var(--text-muted, #667085);
  font-size: 0.68rem;
  font-weight: 800;
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
  min-height: 44px;
  border-color: color-mix(
    in srgb,
    var(--brand-primary-500, #386cfe) 16%,
    var(--surface-2, #e5e7eb)
  ) !important;
  border-radius: 13px !important;
  background: var(--surface-1, #fff) !important;
  box-shadow: none !important;
}

@media (max-width: 640px) {
  .select-answer-card__icon {
    display: none;
  }
}
</style>
