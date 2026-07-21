<script setup lang="ts">
import type TemplateDetailsModel from '@/features/setting/Template/Data/models/TemplateDetailsModel'
import ShowTemplateController from '@/features/setting/Template/Presentation/controllers/showTemplateController'
import Dialog from 'primevue/dialog'
import { watch, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import FetchTaskResultController from '@/features/Organization/Inspection/Presentation/controllers/FetchTaskResultController'
import type TaskFullResponseModel from '@/features/Organization/Inspection/Data/models/FetchTaskResultModels/FullTaskResultModel'
import FetchTaskResultParams from '@/features/Organization/Inspection/Core/params/FetchTaskResultParams'
import { InspectionStatus } from '@/features/Organization/Inspection/Core/Enum/InspectionStatusEnum'
import TemplateDocument from '@/features/Organization/Inspection/Presentation/components/InspectionDialog/TemplateDocument.vue'
import LastInspectionIcon from '@/shared/icons/LastInspectionIcon.vue'

const { templateId, taskId, createdby, date, time } = defineProps<{
  templateId?: number
  taskId: number
  createdby?: string
  date?: string
  time?: string
}>()
const visible = ref(false)

const AllDocument = ref<TemplateDetailsModel>()
const showTemplateController = ShowTemplateController.getInstance()
const state = ref(showTemplateController.state.value)

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

const GetData = async () => {
  visible.value = true
  // await FetchTemplateDocument();
  await GetTaskDetails()
  getTitle()
}

const TaskResults = ref<TaskFullResponseModel>()
const fetchTaskResultController = FetchTaskResultController.getInstance()

const GetTaskDetails = async () => {
  const fetchTaskResultParams = new FetchTaskResultParams(taskId)
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
    <button @click="GetData" class="last-inspection-trigger w-full" type="button">
      <div class="last-inspection-info-container">
        <div class="inspection-label">
          <span>{{ $t('Inspection record') }}</span>
          <p class="last-inspection">{{ $t('last inspection') }}</p>
        </div>
        <div class="last-inspection-info">
          <span class="by"
            ><small>{{ $t('by') }}</small
            ><strong>{{ createdby || '—' }}</strong></span
          >
          <span class="date-time"
            ><small>{{ $t('date & Time') }}</small
            ><strong>{{ date || '—' }} · {{ time || '—' }}</strong></span
          >
        </div>
        <LastInspectionIcon />
      </div>
    </button>

    <Dialog
      v-model:visible="visible"
      :header="title"
      modal
      :dismissable-mask="true"
      class="last-inspection-dialog"
      :style="{ width: 'min(70rem, calc(100vw - 24px))' }"
    >
      <TemplateDocument
        :isOverlay="status == InspectionStatus.FINISHED"
        :allData="AllDocument"
        @update:data="UpdateData"
        :task_results="TaskResults?.taskResults?.[TaskResults?.taskResults?.length - 1]"
      />
    </Dialog>
  </div>
</template>

<style scoped lang="scss">
.inspection-start {
  margin: 0;
  padding: 0;
  border: 0;
  background: transparent;
}

.last-inspection-trigger {
  border: 0;
  background: transparent;
  cursor: pointer;
}

.last-inspection-info-container {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 9px 10px;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 14%, var(--main-border));
  border-radius: 12px;
  background: color-mix(in srgb, var(--PrimaryColor) 6%, var(--surface-2));
  text-align: start;
  transition:
    border-color 0.18s ease,
    background 0.18s ease;
}

.last-inspection-trigger:hover .last-inspection-info-container {
  border-color: color-mix(in srgb, var(--PrimaryColor) 32%, var(--main-border));
  background: color-mix(in srgb, var(--PrimaryColor) 9%, var(--surface-2));
}

.inspection-label span,
.last-inspection-info small {
  display: block;
  color: var(--text-soft);
  font-size: 0.55rem;
  font-weight: 800;
  text-transform: uppercase;
}

.inspection-label .last-inspection {
  width: auto;
  margin: 2px 0 0;
  color: var(--text-strong);
  font-family: 'Bold';
  font-size: 0.7rem;
  line-height: 1.3;
}

.last-inspection-info {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

.last-inspection-info > span {
  min-width: 0;
}

.last-inspection-info strong {
  display: block;
  overflow: hidden;
  margin-top: 2px;
  color: var(--PrimaryColor);
  font-size: 0.62rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.last-inspection-info-container :deep(.inspection-icon) {
  width: 34px;
  height: 34px;
}

@media (max-width: 520px) {
  .last-inspection-info-container {
    grid-template-columns: 1fr auto;
  }

  .last-inspection-info {
    grid-column: 1 / -1;
    grid-row: 2;
  }
}
</style>
