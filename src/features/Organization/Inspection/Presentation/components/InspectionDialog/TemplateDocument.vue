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
import TemplateDocumentSelectShowResult from '../ShowResultActions/TemplateDocumentSelectShowResult.vue'
import TemplateDocumentCheckboxShowResult from '../ShowResultActions/TemplateDocumentCheckboxShowResult.vue'
import TemplateDocumentRadioShowResult from '../ShowResultActions/TemplateDocumentRadioShowResult.vue'
import TemplateDocumentTextAreaShowResult from '../ShowResultActions/TemplateDocumentTextAreaShowResult.vue'

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

const { t } = useI18n()
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

      if (item.requiredImage && Number(item.requiredType) === 2 && !hasImages(entry?.questionImg)) {
        itemErrors.questionImage = t('validation_question_photo_required')
      }

      const answerImageErrors: Record<number, string> = {}
      selectedOptions.forEach((option: any) => {
        if (option.is_upload && !hasImages(entry?.answerImages?.[option.id])) {
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
</script>
<template>
  <!-- <pre>{{ task_results }}</pre> -->
  <div class="template-document-container w-full">
    <div class="template-document-header">
      <div class="template-header">
        <p class="header-title" v-if="allData?.titles && allData?.titles?.length > 0">
          {{
            allData?.titles
              ?.filter((item) => item.locale === 'en')
              .map((item) => item.title)
              .join('')
          }}
        </p>

        <p class="header-title" v-else>{{ allData?.title }}</p>

        <!-- <div class="template-details">
          <p>
            Id : <span>{{ allData?.id }}</span>
          </p>
          <p>location :<span>example</span></p>
          <p>Zone :<span>example</span></p>
        </div> -->
      </div>
      <img :src="DocumnetHeader" alt="header" />
    </div>
    <div class="template-document-content-container w-full">
      <div v-for="(tag, index) in visibleTemplateItemTags" :key="index">
        <div>
          <p class="tag-title" v-if="tag.titles?.length > 0">
            {{
              tag.titles
                ?.filter((item) => item.locale === 'en')
                .map((item) => item.title)
                .join('')
            }}
          </p>
          <p class="tag-title" v-else>{{ tag.title }}</p>
        </div>

        <div
          class="template-document-content w-full"
          v-for="(item, index) in tag.templateItems"
          :key="index"
        >
          <!-- <div class="overlay" v-if="isOverlay"></div> -->
          <div class="w-full" v-if="item?.action == ActionsEnum.CHECKBOX">
            <div class="w-full" v-if="task_results?.taskResultItems?.length > 0">
              <TemplateDocumentCheckboxShowResult
                :key="index"
                :title="item.name"
                :item_id="item.id"
                :options="item.options"
                :require_image="item.requiredImage"
                @update:data="UpdateCheckBoxs"
                :selected_data="getAnsweredResultForItem(item.id, ActionsEnum.CHECKBOX)"
              />
            </div>
            <TemplateDocumentCheckboxShow
              v-else
              :key="index"
              :title="item.name"
              :item_id="item.id"
              :options="item.options"
              :require_image="item.requiredImage"
              :required_type="item.requiredType"
              :validation_errors="validationErrors[item.id]"
              @update:data="UpdateCheckBoxs"
              :selected_data="getAnsweredResultForItem(item.id, ActionsEnum.CHECKBOX)"
            />
          </div>

          <div class="w-full" v-if="item?.action == ActionsEnum.RADIOBUTTON">
            <div class="w-full" v-if="task_results?.taskResultItems?.length > 0">
              <TemplateDocumentRadioShowResult
                :title="item.name"
                :item_id="item.id"
                :options="item.options"
                :require_image="item.requiredImage"
                @update:data="UpdateRadioButtons"
                :selected_data="getAnsweredResultForItem(item.id, ActionsEnum.RADIOBUTTON)"
              />
            </div>
            <TemplateDocumentRadioButtonShow
              v-else
              :title="item.name"
              :item_id="item.id"
              :options="item.options"
              :require_image="item.requiredImage"
              :required_type="item.requiredType"
              :validation_errors="validationErrors[item.id]"
              @update:data="UpdateRadioButtons"
              :selected_data="getAnsweredResultForItem(item.id, ActionsEnum.RADIOBUTTON)"
            />
          </div>

          <div class="w-full" v-if="item?.action == ActionsEnum.DROPDOWN">
            <div v-if="task_results?.taskResultItems?.length > 0" class="">
              <TemplateDocumentSelectShowResult
                :title="item.name"
                :key="index"
                :item_id="item.id"
                :options="item.options"
                :require_image="item.requiredImage"
                @update:data="UpdateSelects"
                :selected_data="getAnsweredResultForItem(item.id, ActionsEnum.DROPDOWN)"
              />
            </div>
            <TemplateDocumentSelectShow
              v-else
              :title="item.name"
              :key="index"
              :item_id="item.id"
              :options="item.options"
              :require_image="item.requiredImage"
              :required_type="item.requiredType"
              :validation_errors="validationErrors[item.id]"
              @update:data="UpdateSelects"
              :selected_data="getAnsweredResultForItem(item.id, ActionsEnum.DROPDOWN)"
            />
          </div>
          <div class="w-full" v-if="item?.action == ActionsEnum.TEXTAREA">
            <div class="w-full" v-if="task_results?.taskResultItems?.length > 0">
              <TemplateDocumentTextAreaShowResult
                :title="item.name"
                :item_id="item.id"
                :require_image="item.requiredImage"
                @update:data="UpdateTextAreas"
                :selected_data="getAnsweredResultForItem(item.id, ActionsEnum.TEXTAREA)"
              />
            </div>
            <TemplateDocumentTextAreaShow
              v-else
              :title="item.name"
              :item_id="item.id"
              :require_image="item.requiredImage"
              :required_type="item.requiredType"
              :validation_errors="validationErrors[item.id]"
              @update:data="UpdateTextAreas"
              :selected_data="getAnsweredResultForItem(item.id, ActionsEnum.TEXTAREA)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: 9999;
  background-color: var(--status-danger);
}

.tag-title {
  color: var(--brand-primary-800);
  font-size: 22px;
  font-weight: 700;
  font-family: 'Regular';
}
</style>
