<script setup lang="ts">
import Checkbox from 'primevue/checkbox'
import type ItemModel from '@/features/setting/TemplateItem/Data/models/ItemMode'
import UploadMultiImage from '@/shared/HelpersComponents/UploadMultiImage.vue'
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
  questionImages.value = data
  UpdateData()
}

const UpdateAnswerImages = (optionId: number, data: string[]) => {
  answerImages.value = { ...answerImages.value, [optionId]: data }
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
  <div class="show-template-document-checkbox flex flex-col gap-4">
    <p class="title font-bold">{{ title }}</p>

    <div class="options-container">
      <div class="options flex flex-col gap-2">
        <div
          v-for="option in options"
          :key="option.id"
          class="options-box flex items-center justify-between pb-2"
        >
          <label :for="`checkbox-${item_id}-${option.id}`" class="label cursor-pointer flex-grow">
            {{ option.title }}
          </label>
          <Checkbox
            binary
            :modelValue="SelectedValues.includes(option.id)"
            @update:modelValue="UpdateOptions(option.id)"
            :inputId="`checkbox-${item_id}-${option.id}`"
          />
        </div>
      </div>

      <div
        v-if="require_image"
        class="image-field mt-4"
        :data-answer-validation-error="Boolean(validation_errors?.questionImage)"
      >
        <label class="evidence-label">
          {{ $t('question_photo') }}
          <span v-if="Number(required_type) === 2" class="required-mark">*</span>
        </label>
        <UploadMultiImage
          @update:images="UpdateQuestionImages"
          :initialImages="selected_data?.files?.map((file) => file.url) || []"
        />
        <p v-if="validation_errors?.questionImage" class="required-field-message">
          {{ validation_errors.questionImage }}
        </p>
      </div>

      <div
        v-for="option in selectedUploadOptions"
        :key="`answer-image-${option.id}`"
        class="image-field mt-4 animate-fade-in"
        :data-answer-validation-error="Boolean(validation_errors?.answerImages?.[option.id])"
      >
        <label class="evidence-label">
          {{ $t('answer_photo') }}: {{ option.title }} <span class="required-mark">*</span>
        </label>
        <UploadMultiImage @update:images="UpdateAnswerImages(option.id, $event)" />
        <p v-if="validation_errors?.answerImages?.[option.id]" class="required-field-message">
          {{ validation_errors.answerImages[option.id] }}
        </p>
      </div>
    </div>
  </div>

  <div
    v-if="showTextArea"
    class="input-wrapper w-full animate-fade-in mt-4"
    :data-answer-validation-error="Boolean(validation_errors?.notes)"
  >
    <label :for="`notes-${item_id}`" class="block mb-1 text-sm font-medium">
      {{ $t('Notes') }} <span v-if="isTextAreaRequired" class="required-mark">*</span>
    </label>
    <textarea
      :id="`notes-${item_id}`"
      v-model="textArea"
      class="input w-full border rounded-md p-2 min-h-[80px]"
      :placeholder="$t(`Please enter details...`)"
    />
    <p v-if="validation_errors?.notes" class="required-field-message">
      {{ validation_errors.notes }}
    </p>
  </div>
</template>

<style scoped>
.animate-fade-in {
  margin-top: 10px;
  animation: fadeIn 0.3s ease-in;
}

.evidence-label {
  display: block;
  margin-bottom: 0.45rem;
  font-size: 0.875rem;
  font-weight: 700;
}

.required-mark,
.required-field-message {
  color: var(--status-danger);
}

.required-field-message {
  margin-top: 0.35rem;
  font-size: 0.8rem;
  font-weight: 700;
}

[data-answer-validation-error='true'].image-field {
  padding: 0.65rem;
  border: 1px solid var(--status-danger);
  border-radius: 0.6rem;
}

[data-answer-validation-error='true'] textarea {
  border-color: var(--status-danger);
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
