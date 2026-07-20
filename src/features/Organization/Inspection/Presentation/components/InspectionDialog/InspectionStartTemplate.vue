<script setup lang="ts">
import ShowTemplateParams from '@/features/setting/Template/Core/params/showTemplateParams'
import type TemplateDetailsModel from '@/features/setting/Template/Data/models/TemplateDetailsModel'
import ShowTemplateController from '@/features/setting/Template/Presentation/controllers/showTemplateController'
import Dialog from 'primevue/dialog'
import { watch, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import TemplateDocument from './TemplateDocument.vue'
import { useI18n } from 'vue-i18n'
import CreateTaskAnswerController from '../../controllers/CreateTaskAnswerController'
import CreateTaskResultParams from '../../../Core/params/CreateTaskResultParams'
import ItemResultParams from '../../../Core/params/ItemResultParams'
import FetchTaskResultParams from '../../../Core/params/FetchTaskResultParams'
import FetchTaskResultController from '../../controllers/FetchTaskResultController'
import type TaskFullResponseModel from '../../../Data/models/FetchTaskResultModels/FullTaskResultModel'
import { InspectionStatus } from '../../../Core/Enum/InspectionStatusEnum'
import ArrowDetails from '@/shared/icons/ArrowDetails.vue'
import { InspectionPageType } from '@/features/Organization/ObservationFactory/Core/Enums/InspectionTypeEnum'
import ShowResultIcon from '@/shared/icons/ShowResultIcon.vue'
import { OpenWarningDilaog } from '@/base/Presentation/utils/OpenWarningDialog'

const visible = ref(false)
const templateDocumentRef = ref<{
  validateAnswers: () => Promise<{ isValid: boolean; firstMessage: string }>
} | null>(null)

const { templateId, taskId, autoObservation } = defineProps<{
  templateId: number
  taskId: number
  status: number
  lastinspection?: boolean
  showResult?: boolean
  autoObservation?: boolean
}>()

const router = useRouter()
const route = useRoute()
const AllDocument = ref<TemplateDetailsModel>()
const showTemplateController = ShowTemplateController.getInstance()
const state = ref(showTemplateController.state.value)

const FetchTemplateDocument = async () => {
  const showTemplateParams = new ShowTemplateParams(templateId)
  const Response = await showTemplateController.showTemplate(showTemplateParams)
  if (Response.value.data) {
    console.log(Response.value.data, 'Response.value.data')
    AllDocument.value = Response.value.data
  }
}

// onMounted(() => FetchTemplateDocument())

watch(
  () => showTemplateController.state.value,
  (newState) => {
    if (newState) state.value = newState
  },
  { deep: true },
)

const { locale } = useI18n()
const title = ref('')
const getTitle = () => {
  title.value = state.value?.data?.titles?.find((item) => item?.locale === locale?.value)?.title
}

const TaskAnswer = ref({
  check: [],
  radio: [],
  select: [],
  textarea: [],
})

const UpdateData = (data) => {
  TaskAnswer.value = data
}

const formatTaskAnswer = () => {
  const answer = TaskAnswer.value

  const tempMap = new Map()

  const addToMap = (id, text, answers, imgs, answerValue?: string) => {
    const AswerValue = ref(answerValue)

    if (!tempMap.has(id)) {
      tempMap.set(id, {
        template_item_id: id,
        result: null,
        item_answers: [],
        files: [],
      })
    }
    const entry = tempMap.get(id)

    if (text) entry.result = text

    if (answers !== null && answers !== undefined) {
      const arr = Array.isArray(answers) ? answers : [answers]

      arr.forEach((val) => {
        if (typeof val === 'string') {
          const exists = entry.item_answers.some((a) => a.answer === val)

          if (!exists) {
            entry.item_answers.push({
              answer: val,
              template_item_option_id: null,
            })
          }
        } else {
          const exists = entry.item_answers.find((a) => a.template_item_option_id === val)
          // console.log(exists, "existsexistsexists")
          console.log(AswerValue.value, 'answerValueanswerValue')
          if (!exists) {
            entry.item_answers.push({
              answer: AswerValue.value,
              template_item_option_id: val,
            })
          } else {
            exists.answer = AswerValue.value
          }
        }
      })
    }

    if (imgs && imgs.length) {
      imgs.forEach((img) => {
        if (!entry.files.includes(img)) {
          entry.files.push(img)
        }
      })
    }
  }

  // textarea
  answer.textarea?.forEach((item) => {
    addToMap(item.itemid, null, item.value, item.img || [])
  })

  // select
  answer.select?.forEach((item) => {
    // console.log(item.value, "ittttttttttttttttttemmmmmmmmmm")
    addToMap(item.itemId, null, item.selected, item.img || [], item.value)
  })

  // check
  answer.check?.forEach((group) => {
    group.selected.forEach((val) => {
      addToMap(group.itemid, null, val, group.img || [], group?.notes)
    })
  })

  // radio
  answer.radio?.forEach((item) => {
    if (item.value && item.value !== 0) {
      console.log(item, 'iteeeeeeeem')
      addToMap(item.itemid, null, item.value, item.img || [], item?.notes)
    }
  })

  return Array.from(tempMap.values())
}

const CreateAnswer = async () => {
  const validation = await templateDocumentRef.value?.validateAnswers()
  if (validation && !validation.isValid) {
    new OpenWarningDilaog(validation.firstMessage).openDialog()
    return
  }

  const formatted = formatTaskAnswer()
  const UpdatedFormat = formatted.map((item) => {
    return new ItemResultParams(item.result, item.template_item_id, item.files, item.item_answers)
  })
  const createTaskResultParams = new CreateTaskResultParams(taskId, templateId, UpdatedFormat)
  const createTaskAnswerController = CreateTaskAnswerController.getInstance()
  const state = await createTaskAnswerController.CreateTaskAnswer(
    createTaskResultParams,
    router,
    true,
  )

  visible.value = false
}

const GetData = async () => {
  visible.value = true
  // await FetchTemplateDocument();
  await GetTaskDetails()
  getTitle()
}

const TaskResults = ref<TaskFullResponseModel>()
const fetchTaskResultController = FetchTaskResultController.getInstance()

const GetTaskDetails = async () => {
  const fetchTaskResultParams = new FetchTaskResultParams(taskId, templateId)
  const result = await fetchTaskResultController.getData(fetchTaskResultParams)
  if (result.value.data) {
    TaskResults.value = result.value.data
    AllDocument.value = result.value.data.template
  }
}

watch(
  () => fetchTaskResultController.state.value,
  (newState) => {
    if (newState) {
      TaskResults.value = newState
    }
  },
)

watch(
  () => showTemplateController.state.value,
  (newState) => {
    if (newState) {
      AllDocument.value = newState
    }
  },
)
</script>

<template>
  <div class="inspection-start card w-full flex justify-center">
    <button
      class="show-button"
      style="z-index: 999"
      @click="GetData"
      v-if="status == InspectionStatus.NOT_FINISHED && !lastinspection && !showResult"
    >
      <div class="button-text">
        <h5 class="">{{ $t('Add results') }}</h5>
      </div>
    </button>
    <button
      class="show-button"
      style="z-index: 999"
      @click="GetData"
      v-if="status == InspectionStatus.FINISHED && !lastinspection && !showResult"
    >
      <div class="button-text">
        <h5 class="">{{ $t('Show results') }}</h5>
      </div>
    </button>

    <button
      class="show-result-btn flex gap-1"
      v-if="lastinspection"
      style="z-index: 999"
      @click="GetData"
    >
      <span>{{ $t('show Log') }}</span>
      <!-- <ShowResultIcon /> -->
    </button>

    <button
      class="show-button"
      v-if="showResult && !autoObservation"
      style="z-index: 999"
      @click="GetData"
    >
      <div class="observation-inspection-card">
        <div class="observation-inspection-card-header">
          <p class="inspection-auto">{{ $t('View inspection logs') }}</p>
        </div>
      </div>
    </button>

    <!-- autoObservation -->

    <button class="show-button" v-if="autoObservation" style="z-index: 999" @click="GetData">
      <div class="button-text">
        <h5 class="">{{ $t('View inspection logs ') }}</h5>
      </div>
      <!-- <ShowResultIcon /> -->
    </button>

    <!-- <button v-if="showResult">show Result</button> -->
    <!-- <button class="show-details" @click="GetData" v-if="status == InspectionStatus.FINISHED">
      <span> show inspection details </span>
      <ArrowDetails />
    </button> -->
    <Dialog
      v-model:visible="visible"
      modal
      :dismissable-mask="true"
      :draggable="false"
      class="inspection-results-dialog"
      :breakpoints="{ '960px': '94vw', '640px': '100vw' }"
    >
      <template #header>
        <div class="inspection-results-dialog__header">
          <span class="inspection-results-dialog__header-icon">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M9 11.5 11 14l4-5m4-6H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Z"
              />
            </svg>
          </span>
          <div class="inspection-results-dialog__header-copy">
            <span class="inspection-results-dialog__eyebrow">
              {{
                $t(
                  status == InspectionStatus.NOT_FINISHED
                    ? 'inspection_in_progress'
                    : 'inspection_completed',
                )
              }}
            </span>
            <h2>{{ title || AllDocument?.title || $t('inspection_checklist') }}</h2>
          </div>
        </div>
      </template>

      <div class="inspection-results-dialog__body">
        <TemplateDocument
          ref="templateDocumentRef"
          :isOverlay="status == InspectionStatus.FINISHED"
          :allData="AllDocument"
          :task_results="TaskResults?.taskResults?.[TaskResults?.taskResults?.length - 1]"
          @update:data="UpdateData"
        />
      </div>

      <template #footer>
        <div
          v-if="
            status == InspectionStatus.NOT_FINISHED &&
            route?.query?.inspectionType != InspectionPageType.InspectionForm &&
            route?.query?.inspectionType != InspectionPageType.Result
          "
          class="inspection-results-dialog__actions"
        >
          <span class="inspection-results-dialog__helper">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M12 8v5m0 3h.01M10.3 3.7 2.4 18a2 2 0 0 0 1.8 3h15.6a2 2 0 0 0 1.8-3L13.7 3.7a2 2 0 0 0-3.4 0Z"
              />
            </svg>
            {{ $t('complete_required_fields') }}
          </span>
          <button class="inspection-results-dialog__confirm" type="button" @click="CreateAnswer">
            <span>{{ $t('save_results') }}</span>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>
      </template>
    </Dialog>
  </div>
</template>

<style scoped>
.show-button {
  display: flex;
  align-items: center;
  justify-content: center;
}

:global(.inspection-results-dialog) {
  width: min(1060px, calc(100vw - 32px)) !important;
  max-height: 92vh;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--brand-primary-500, #386cfe) 14%, transparent);
  border-radius: 28px !important;
  background: var(--surface-1, #fff);
  box-shadow: 0 32px 90px rgb(15 23 42 / 20%);
}

:global(.inspection-results-dialog .p-dialog-header) {
  padding: 18px 22px;
  border-bottom: 1px solid
    color-mix(in srgb, var(--brand-primary-500, #386cfe) 10%, var(--surface-2, #e5e7eb));
  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--brand-primary-50, #eff6ff) 80%, #fff),
    #fff
  );
}

:global(.inspection-results-dialog .p-dialog-title) {
  width: 100%;
}

.inspection-results-dialog__header {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 12px;
}

.inspection-results-dialog__header-icon {
  display: grid;
  width: 44px;
  height: 44px;
  flex: 0 0 44px;
  place-items: center;
  border-radius: 14px;
  color: #fff;
  background: linear-gradient(135deg, var(--brand-primary-600, #2563eb), #6d8eff);
  box-shadow: 0 10px 24px rgb(29 78 216 / 20%);
}

.inspection-results-dialog__header-icon svg {
  width: 22px;
  height: 22px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.9;
}

.inspection-results-dialog__header-copy {
  min-width: 0;
}

.inspection-results-dialog__eyebrow {
  display: block;
  margin-bottom: 3px;
  color: var(--brand-primary-600, #2563eb);
  font-size: 0.65rem;
  font-weight: 850;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.inspection-results-dialog__header-copy h2 {
  margin: 0;
  overflow: hidden;
  color: var(--text-strong, #172033);
  font-size: 1.05rem;
  font-weight: 850;
  text-overflow: ellipsis;
  white-space: nowrap;
}

:global(.inspection-results-dialog .p-dialog-header-actions) {
  gap: 6px;
}

:global(.inspection-results-dialog .p-dialog-close-button) {
  width: 38px;
  height: 38px;
  border-radius: 12px;
  color: var(--text-muted, #667085);
  background: var(--surface-2, #f2f4f7);
}

:global(.inspection-results-dialog .p-dialog-content) {
  padding: 0 !important;
  overflow: auto;
  background: color-mix(in srgb, var(--brand-primary-50, #eff6ff) 32%, var(--surface-1, #fff));
}

.inspection-results-dialog__body {
  padding: 20px;
}

:global(.inspection-results-dialog .p-dialog-footer) {
  padding: 0;
  border-top: 1px solid
    color-mix(in srgb, var(--brand-primary-500, #386cfe) 10%, var(--surface-2, #e5e7eb));
  background: rgb(255 255 255 / 94%);
  backdrop-filter: blur(14px);
}

.inspection-results-dialog__actions {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 20px;
}

.inspection-results-dialog__helper {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: var(--text-muted, #667085);
  font-size: 0.76rem;
  font-weight: 700;
}

.inspection-results-dialog__helper svg {
  width: 17px;
  height: 17px;
  fill: none;
  stroke: var(--status-warning, #f59e0b);
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.8;
}

.inspection-results-dialog__confirm {
  display: inline-flex;
  min-height: 44px;
  align-items: center;
  justify-content: center;
  gap: 9px;
  padding: 0 20px;
  border: 0;
  border-radius: 14px;
  color: #fff;
  background: linear-gradient(
    135deg,
    var(--brand-primary-600, #2563eb),
    var(--brand-primary-500, #386cfe)
  );
  box-shadow: 0 10px 24px rgb(29 78 216 / 22%);
  font-size: 0.86rem;
  font-weight: 850;
  cursor: pointer;
  transition:
    box-shadow 180ms ease,
    transform 180ms ease;
}

.inspection-results-dialog__confirm:hover {
  box-shadow: 0 14px 30px rgb(29 78 216 / 28%);
  transform: translateY(-1px);
}

.inspection-results-dialog__confirm svg {
  width: 17px;
  height: 17px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 2;
}

html[dir='rtl'] .inspection-results-dialog__confirm svg {
  transform: rotate(180deg);
}

@media (max-width: 640px) {
  :global(.inspection-results-dialog) {
    width: 100vw !important;
    max-height: 100dvh;
    height: 100dvh;
    border-radius: 0 !important;
  }

  :global(.inspection-results-dialog .p-dialog-header) {
    padding: 14px 16px;
  }

  .inspection-results-dialog__body {
    padding: 10px;
  }

  .inspection-results-dialog__helper {
    display: none;
  }

  .inspection-results-dialog__confirm {
    width: 100%;
  }
}
</style>
