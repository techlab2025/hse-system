<script setup lang="ts">
import type TaskResultItemModel from '@/features/Organization/Inspection/Data/models/FetchTaskResultModels/ItemTasksResultModel'
import UploadMultiImage from '@/shared/HelpersComponents/UploadMultiImage.vue'
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
  questionImages.value = data
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
  <div class="show-template-document-textarea flex flex-col gap-4">
    <div class="input-wrapper">
      <label class="font-bold mb-2 block">{{ title }}</label>
      <textarea
        v-model="TextValue"
        class="input w-full border rounded-md p-2 min-h-[80px]"
        :placeholder="$t(`Please enter details...`)"
        @change="UpdateData"
      />
    </div>

    <div
      v-if="require_image"
      class="image-field mt-2"
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
  </div>
</template>

<style scoped>
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
</style>
