<script setup lang="ts">
import type TaskResultItemModel from '@/features/Organization/Inspection/Data/models/FetchTaskResultModels/ItemTasksResultModel'
import type ItemModel from '@/features/setting/TemplateItem/Data/models/ItemMode'
import UploadMultiImage from '@/shared/HelpersComponents/UploadMultiImage.vue'
import RadioButton from 'primevue/radiobutton'
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
  questionImages.value = data
  UpdateData()
}

const UpdateAnswerImages = (data: string[]) => {
  const optionId = SelectedOption.value?.id
  if (!optionId) return
  answerImages.value = { [optionId]: data }
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
  <div class="show-template-document-radio flex flex-col gap-4">
    <p class="title font-bold">{{ title }}</p>

    <div class="options-container">
      <div class="options flex flex-wrap gap-4">
        <div v-for="option in options" :key="option.id" class="options-box flex items-center gap-2">
          <RadioButton
            class="input"
            :value="option.id"
            :modelValue="SelectedOption?.id"
            @update:modelValue="UpdateOptions(option)"
            :inputId="`radio-${item_id}-${option.id}`"
            :name="`radio-${item_id}`"
          />
          <label :for="`radio-${item_id}-${option.id}`" class="label cursor-pointer">
            {{ option.title }}
          </label>
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
        v-if="showAnswerImage && SelectedOption"
        class="image-field mt-4 animate-fade-in"
        :data-answer-validation-error="
          Boolean(validation_errors?.answerImages?.[SelectedOption.id])
        "
      >
        <label class="evidence-label">
          {{ $t('answer_photo') }}: {{ SelectedOption.title }} <span class="required-mark">*</span>
        </label>
        <UploadMultiImage :key="SelectedOption.id" @update:images="UpdateAnswerImages" />
        <p
          v-if="validation_errors?.answerImages?.[SelectedOption.id]"
          class="required-field-message"
        >
          {{ validation_errors.answerImages[SelectedOption.id] }}
        </p>
      </div>
    </div>
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
