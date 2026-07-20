<script setup lang="ts">
import DocumnetHeader from '@/assets/images/DocumnetHeader.png'
import { computed, nextTick, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import type TemplateDetailsModel from '@/features/setting/Template/Data/models/TemplateDetailsModel'
import TemplateDocumentCheckboxShow from './TemplateDocumentTypes/TemplateDocumentCheckboxShow.vue'
import TemplateDocumentRadioButtonShow from './TemplateDocumentTypes/TemplateDocumentRadioButtonShow.vue'
import TemplateDocumentSelectShow from './TemplateDocumentTypes/TemplateDocumentSelectShow.vue'
import TemplateDocumentTextAreaShow from './TemplateDocumentTypes/TemplateDocumentTextAreaShow.vue'
import { ActionsEnum } from '@/features/setting/TemplateItem/Core/Enum/ActionsEnum'
import type TaskResultModel from '../../../Data/models/FetchTaskResultModels/TasksResultModel'
import type TaskResultItemModel from '../../../Data/models/FetchTaskResultModels/ItemTasksResultModel'
import ModernAnswerResult from '../ShowResultActions/ModernAnswerResult.vue'

const emit = defineEmits(['update:data'])
const props = defineProps<{
  allData: TemplateDetailsModel
  task_results: TaskResultModel
  isOverlay?: boolean
}>()

watch(
  () => props.allData,
  (newState) => {
    if (newState) {
      console.log(newState)
    }
  },
  {
    deep: true,
  },
)

const SelectedCheckBoxs = ref<
  {
    itemid: number
    selected: number[]
    img: string
    notes: string
  }[]
>([])

const UpdateCheckBoxs = (data) => {
  // Find existing item index
  const existingIndex = SelectedCheckBoxs.value.findIndex((item) => item.itemid === data.itemid)

  if (existingIndex !== -1) {
    // Update existing item
    SelectedCheckBoxs.value[existingIndex] = data
  } else {
    // Add new item
    SelectedCheckBoxs.value.push(data)
  }

  UpdateData()
}

const SelectedRadioButtons = ref<
  {
    itemid: number
    value: number
    img: string
    notes: string
  }[]
>([])

const UpdateRadioButtons = (data) => {
  // Find existing item index
  const existingIndex = SelectedRadioButtons.value.findIndex((item) => item.itemid === data.itemid)

  if (existingIndex !== -1) {
    // Update existing item
    SelectedRadioButtons.value[existingIndex] = data
  } else {
    // Add new item
    SelectedRadioButtons.value.push(data)
  }

  UpdateData()
}

const SelectedSelects = ref<
  {
    itemId: number
    selected: any
  }[]
>([])

const UpdateSelects = (data) => {
  // Find existing item index
  const existingIndex = SelectedSelects.value.findIndex((item) => item.itemId === data.itemId)

  if (existingIndex !== -1) {
    // Update existing item
    SelectedSelects.value[existingIndex] = data
  } else {
    // Add new item
    SelectedSelects.value.push(data)
  }

  UpdateData()
}

const SelectedTextAreas = ref<
  {
    itemid: number
    value: string
  }[]
>([])

const UpdateTextAreas = (data) => {
  // Find existing item index
  const existingIndex = SelectedTextAreas.value.findIndex((item) => item.itemid === data.itemid)

  if (existingIndex !== -1) {
    // Update existing item
    SelectedTextAreas.value[existingIndex] = data
  } else {
    // Add new item
    SelectedTextAreas.value.push(data)
  }

  UpdateData()
}

type AnswerValidationErrors = {
  questionImage?: string
  answerImages?: Record<number, string>
  notes?: string
}

const { t, locale } = useI18n()
const validationErrors = ref<Record<number, AnswerValidationErrors>>({})
const validationAttempted = ref(false)

const hasImages = (value: unknown) =>
  Array.isArray(value) ? value.length > 0 : Boolean(String(value ?? '').trim())

const getAnswerEntry = (itemId: number, action: number): any => {
  if (action === ActionsEnum.CHECKBOX) {
    return SelectedCheckBoxs.value.find((entry) => entry.itemid === itemId)
  }
  if (action === ActionsEnum.RADIOBUTTON) {
    return SelectedRadioButtons.value.find((entry) => entry.itemid === itemId)
  }
  if (action === ActionsEnum.DROPDOWN) {
    return SelectedSelects.value.find((entry) => entry.itemId === itemId)
  }
  return SelectedTextAreas.value.find((entry) => entry.itemid === itemId)
}

const getSelectedOptionIds = (entry: any, action: number): number[] => {
  if (!entry) return []
  if (action === ActionsEnum.CHECKBOX) return entry.selected ?? []
  if (action === ActionsEnum.RADIOBUTTON) return entry.value ? [entry.value] : []
  if (action === ActionsEnum.DROPDOWN) return entry.selected ? [entry.selected] : []
  return []
}

const buildValidationErrors = () => {
  const errors: Record<number, AnswerValidationErrors> = {}
  const tags = props.allData?.templateItemTags ?? []

  tags.forEach((tag: any) => {
    ;(tag.templateItems ?? []).forEach((item: any) => {
      const entry = getAnswerEntry(item.id, item.action)
      const itemErrors: AnswerValidationErrors = {}
      const selectedOptionIds = getSelectedOptionIds(entry, item.action)
      const selectedOptions = (item.options ?? []).filter((option: any) =>
        selectedOptionIds.includes(option.id),
      )
      const selectedUploadOptions = selectedOptions.filter((option: any) =>
        Boolean(option.is_upload),
      )

      if (
        item.requiredImage &&
        Number(item.requiredType) === 2 &&
        selectedUploadOptions.length === 0 &&
        !hasImages(entry?.questionImg)
      ) {
        itemErrors.questionImage = t('validation_question_photo_required')
      }

      const answerImageErrors: Record<number, string> = {}
      selectedUploadOptions.forEach((option: any) => {
        if (!hasImages(entry?.answerImages?.[option.id])) {
          answerImageErrors[option.id] = t('validation_answer_photo_required')
        }
      })
      if (Object.keys(answerImageErrors).length) itemErrors.answerImages = answerImageErrors

      const requiresNotes = selectedOptions.some((option: any) => Number(option.kpi) === 2)
      const notes = item.action === ActionsEnum.DROPDOWN ? entry?.value : entry?.notes
      if (requiresNotes && !String(notes ?? '').trim()) {
        itemErrors.notes = t('validation_answer_details_required')
      }

      if (Object.keys(itemErrors).length) errors[item.id] = itemErrors
    })
  })

  validationErrors.value = errors
  return errors
}

const validateAnswers = async () => {
  validationAttempted.value = true
  const errors = buildValidationErrors()
  await nextTick()

  document
    .querySelector<HTMLElement>('[data-answer-validation-error=true]')
    ?.scrollIntoView({ behavior: 'smooth', block: 'center' })

  const firstItemError = Object.values(errors)[0]
  const firstMessage =
    firstItemError?.questionImage ??
    Object.values(firstItemError?.answerImages ?? {})[0] ??
    firstItemError?.notes ??
    ''

  return {
    isValid: Object.keys(errors).length === 0,
    firstMessage,
  }
}

defineExpose({ validateAnswers })

const UpdateData = () => {
  if (validationAttempted.value) buildValidationErrors()

  emit('update:data', {
    check: SelectedCheckBoxs.value,
    radio: SelectedRadioButtons.value,
    select: SelectedSelects.value,
    textarea: SelectedTextAreas.value,
  })
}

const hasTaskResults = computed(() => (props.task_results?.taskResultItems?.length ?? 0) > 0)

const hasAnsweredResult = (resultItem?: TaskResultItemModel) => {
  if (!resultItem) return false

  const hasAnswer = resultItem.answers?.some((answer) => {
    const textAnswer = String(answer?.answer ?? '').trim()
    const option = answer?.templateItemOption

    return Boolean(textAnswer || option?.id || option?.title)
  })

  return Boolean(
    hasAnswer || resultItem.files?.length > 0 || String(resultItem.result ?? '').trim(),
  )
}

const getAnsweredResultForItem = (templateItemId: number, action: number) => {
  const resultItem = props.task_results?.taskResultItems?.find(
    (item) => item.templateItemId === templateItemId && item.templateItemAction === action,
  )

  return hasAnsweredResult(resultItem) ? resultItem : undefined
}

const visibleTemplateItemTags = computed(() => {
  const tags = props.allData?.templateItemTags ?? []
  if (!hasTaskResults.value) return tags

  return tags
    .map((tag) => ({
      ...tag,
      templateItems: tag.templateItems.filter((item) =>
        getAnsweredResultForItem(item.id, item.action),
      ),
    }))
    .filter((tag) => tag.templateItems.length > 0)
})

const getLocalizedTitle = (
  titles: { locale?: string; title?: string }[] | undefined,
  fallback = '',
) =>
  titles?.find((item) => item.locale === locale.value)?.title ||
  titles?.find((item) => item.locale === 'en')?.title ||
  titles?.find((item) => item.title)?.title ||
  fallback ||
  ''

const totalVisibleQuestions = computed(() =>
  visibleTemplateItemTags.value.reduce((total, tag) => total + tag.templateItems.length, 0),
)
</script>
<template>
  <div class="template-document-container">
    <header class="template-document-header">
      <div class="template-hero__content">
        <span class="template-hero__eyebrow">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M9 11.5 11 14l4-5m4-6H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Z"
            />
          </svg>
          {{ $t('inspection_checklist') }}
        </span>
        <h2 class="template-hero__title">
          {{ getLocalizedTitle(allData?.titles, allData?.title) }}
        </h2>
        <div class="template-hero__meta">
          <span>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M8 6h11M8 12h11M8 18h11M3.5 6h.01M3.5 12h.01M3.5 18h.01" />
            </svg>
            {{ totalVisibleQuestions }} {{ $t('questions') }}
          </span>
          <span v-if="hasTaskResults" class="template-hero__result-badge">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m5 12 4 4L19 6" />
            </svg>
            {{ $t('completed') }}
          </span>
        </div>
      </div>

      <div class="template-hero__visual" aria-hidden="true">
        <span class="template-hero__glow"></span>
        <img :src="DocumnetHeader" alt="" />
      </div>
    </header>

    <main class="template-document-content-container">
      <section
        v-for="(tag, tagIndex) in visibleTemplateItemTags"
        :key="tag.id || tagIndex"
        class="template-section"
      >
        <header class="template-section__header">
          <span class="template-section__index">{{ String(tagIndex + 1).padStart(2, '0') }}</span>
          <div class="template-section__copy">
            <span class="template-section__eyebrow">{{ $t('section') }}</span>
            <h3 class="tag-title">{{ getLocalizedTitle(tag.titles, tag.title) }}</h3>
          </div>
          <span class="template-section__count">
            {{ tag.templateItems.length }} {{ $t('questions') }}
          </span>
        </header>

        <div class="template-section__questions">
          <article
            v-for="(item, questionIndex) in tag.templateItems"
            :key="item.id"
            class="template-document-content"
            :class="{ 'template-document-content--error': Boolean(validationErrors[item.id]) }"
          >
            <span class="question-number">{{ questionIndex + 1 }}</span>

            <div v-if="item?.action == ActionsEnum.CHECKBOX" class="question-content">
              <ModernAnswerResult
                v-if="hasTaskResults"
                type="checkbox"
                :title="item.name"
                :selected-data="getAnsweredResultForItem(item.id, ActionsEnum.CHECKBOX)"
              />
              <TemplateDocumentCheckboxShow
                v-else
                :title="item.name"
                :item_id="item.id"
                :options="item.options"
                :require_image="item.requiredImage"
                :required_type="item.requiredType"
                :validation_errors="validationErrors[item.id]"
                :selected_data="getAnsweredResultForItem(item.id, ActionsEnum.CHECKBOX)"
                @update:data="UpdateCheckBoxs"
              />
            </div>

            <div v-else-if="item?.action == ActionsEnum.RADIOBUTTON" class="question-content">
              <ModernAnswerResult
                v-if="hasTaskResults"
                type="radio"
                :title="item.name"
                :selected-data="getAnsweredResultForItem(item.id, ActionsEnum.RADIOBUTTON)"
              />
              <TemplateDocumentRadioButtonShow
                v-else
                :title="item.name"
                :item_id="item.id"
                :options="item.options"
                :require_image="item.requiredImage"
                :required_type="item.requiredType"
                :validation_errors="validationErrors[item.id]"
                :selected_data="getAnsweredResultForItem(item.id, ActionsEnum.RADIOBUTTON)"
                @update:data="UpdateRadioButtons"
              />
            </div>

            <div v-else-if="item?.action == ActionsEnum.DROPDOWN" class="question-content">
              <ModernAnswerResult
                v-if="hasTaskResults"
                type="select"
                :title="item.name"
                :selected-data="getAnsweredResultForItem(item.id, ActionsEnum.DROPDOWN)"
              />
              <TemplateDocumentSelectShow
                v-else
                :title="item.name"
                :item_id="item.id"
                :options="item.options"
                :require_image="item.requiredImage"
                :required_type="item.requiredType"
                :validation_errors="validationErrors[item.id]"
                :selected_data="getAnsweredResultForItem(item.id, ActionsEnum.DROPDOWN)"
                @update:data="UpdateSelects"
              />
            </div>

            <div v-else-if="item?.action == ActionsEnum.TEXTAREA" class="question-content">
              <ModernAnswerResult
                v-if="hasTaskResults"
                type="textarea"
                :title="item.name"
                :selected-data="getAnsweredResultForItem(item.id, ActionsEnum.TEXTAREA)"
              />
              <TemplateDocumentTextAreaShow
                v-else
                :title="item.name"
                :item_id="item.id"
                :require_image="item.requiredImage"
                :required_type="item.requiredType"
                :validation_errors="validationErrors[item.id]"
                :selected_data="getAnsweredResultForItem(item.id, ActionsEnum.TEXTAREA)"
                @update:data="UpdateTextAreas"
              />
            </div>
          </article>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.template-document-container {
  width: 100%;
  min-width: 0;
  overflow: hidden;
  border: 1px solid
    color-mix(in srgb, var(--brand-primary-500, #386cfe) 12%, var(--surface-2, #e5e7eb));
  border-radius: 26px;
  background: color-mix(in srgb, var(--surface-1, #fff) 97%, var(--brand-primary-50, #eff6ff));
  box-shadow: 0 24px 70px rgb(15 23 42 / 8%);
}

.template-document-header {
  position: relative;
  z-index: 1;
  display: flex;
  min-height: 170px;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 28px 30px;
  overflow: hidden;
  border-radius: 25px 25px 0 0;
  background:
    radial-gradient(circle at 88% 0%, rgb(255 255 255 / 20%), transparent 30%),
    linear-gradient(
      125deg,
      var(--brand-primary-700, #1d4ed8),
      var(--brand-primary-500, #386cfe) 58%,
      #6d8eff
    );
}

.template-document-header::after {
  position: absolute;
  inset: 0;
  z-index: -1;
  content: '';
  opacity: 0.2;
  background-image: radial-gradient(circle, #fff 1px, transparent 1px);
  background-size: 18px 18px;
  mask-image: linear-gradient(90deg, #000, transparent 70%);
}

.template-hero__content {
  min-width: 0;
  color: #fff;
}

.template-hero__eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 6px 10px;
  border: 1px solid rgb(255 255 255 / 24%);
  border-radius: 999px;
  background: rgb(255 255 255 / 12%);
  font-size: 0.68rem;
  font-weight: 850;
  letter-spacing: 0.09em;
  text-transform: uppercase;
}

.template-hero__eyebrow svg,
.template-hero__meta svg {
  width: 15px;
  height: 15px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 2;
}

.template-hero__title {
  max-width: 680px;
  margin: 12px 0 10px;
  color: #fff;
  font-size: clamp(1.25rem, 2vw, 1.75rem);
  font-weight: 850;
  line-height: 1.25;
}

.template-hero__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 9px;
}

.template-hero__meta > span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: rgb(255 255 255 / 82%);
  font-size: 0.78rem;
  font-weight: 700;
}

.template-hero__result-badge {
  padding: 5px 9px;
  border-radius: 999px;
  color: #fff !important;
  background: rgb(255 255 255 / 15%);
}

.template-hero__visual {
  position: relative;
  display: grid;
  width: 120px;
  height: 110px;
  flex: 0 0 120px;
  place-items: center;
}

.template-hero__visual img {
  position: relative;
  z-index: 1;
  width: 96px;
  max-width: 96px;
  height: 96px;
  object-fit: contain;
  filter: drop-shadow(0 16px 22px rgb(8 28 80 / 30%));
}

.template-hero__glow {
  position: absolute;
  width: 100px;
  height: 100px;
  border: 1px solid rgb(255 255 255 / 22%);
  border-radius: 30px;
  background: rgb(255 255 255 / 10%);
  transform: rotate(9deg);
}

.template-document-content-container {
  display: flex;
  width: 100%;
  min-width: 0;
  flex-direction: column;
  gap: 18px;
  padding: 22px;
}

.template-section {
  min-width: 0;
  padding: 16px;
  border: 1px solid
    color-mix(in srgb, var(--brand-primary-500, #386cfe) 9%, var(--surface-2, #e5e7eb));
  border-radius: 22px;
  background: color-mix(in srgb, var(--surface-1, #fff) 98%, var(--brand-primary-50, #eff6ff));
}

.template-section__header {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 11px;
  margin-bottom: 13px;
  padding: 0 2px;
}

.template-section__index {
  display: grid;
  width: 38px;
  height: 38px;
  flex: 0 0 38px;
  place-items: center;
  border-radius: 13px;
  color: #fff;
  background: linear-gradient(135deg, var(--brand-primary-600, #2563eb), #6d8eff);
  box-shadow: 0 8px 18px rgb(29 78 216 / 18%);
  font-size: 0.72rem;
  font-weight: 850;
}

.template-section__copy {
  min-width: 0;
  flex: 1;
}

.template-section__eyebrow {
  display: block;
  color: var(--text-muted, #667085);
  font-size: 0.62rem;
  font-weight: 850;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.tag-title {
  margin: 2px 0 0;
  color: var(--brand-primary-900, #172554);
  font-size: 1rem;
  font-weight: 850;
  line-height: 1.35;
}

.template-section__count {
  flex: 0 0 auto;
  padding: 6px 9px;
  border-radius: 999px;
  color: var(--text-muted, #667085);
  background: var(--surface-2, #f2f4f7);
  font-size: 0.68rem;
  font-weight: 800;
}

.template-section__questions {
  display: grid;
  gap: 11px;
}

.template-document-content {
  position: relative;
  min-width: 0;
  padding: 18px;
  overflow: hidden;
  border: 1px solid
    color-mix(in srgb, var(--brand-primary-500, #386cfe) 10%, var(--surface-2, #e5e7eb));
  border-radius: 19px;
  background: var(--surface-1, #fff);
  box-shadow: 0 10px 28px rgb(15 23 42 / 4%);
  transition:
    border-color 180ms ease,
    box-shadow 180ms ease;
}

/* .template-document-content::before {
  position: absolute;
  inset-block: 15px;
  inset-inline-start: 0;
  width: 3px;
  border-radius: 999px;
  content: '';
  background: linear-gradient(
    180deg,
    var(--brand-primary-500, #386cfe),
    var(--status-success, #22c55e)
  );
} */

.template-document-content--error {
  border-color: color-mix(in srgb, var(--status-danger, #dc2626) 55%, transparent);
  box-shadow: 0 10px 28px color-mix(in srgb, var(--status-danger, #dc2626) 8%, transparent);
}

.template-document-content--error::before {
  background: var(--status-danger, #dc2626);
}

.question-number {
  position: absolute;
  top: 10px;
  inset-inline-end: 11px;
  display: grid;
  width: 25px;
  height: 25px;
  place-items: center;
  border-radius: 9px;
  color: var(--text-muted, #667085);
  background: var(--surface-2, #f2f4f7);
  font-size: 0.68rem;
  font-weight: 850;
}

.question-content {
  width: 100%;
  min-width: 0;
}

@media (max-width: 700px) {
  .template-document-header {
    min-height: 145px;
    padding: 22px 20px;
  }

  .template-hero__visual {
    display: none;
  }

  .template-document-content-container {
    padding: 12px;
  }

  .template-section {
    padding: 11px;
    border-radius: 18px;
  }

  .template-document-content {
    padding: 15px 12px;
  }

  .template-section__count {
    display: none;
  }
}
</style>
