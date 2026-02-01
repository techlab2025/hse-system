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
  <div class="inspection-start card w-full  flex justify-center">
    <button @click="GetData" class="w-full">
      <div class="last-inspection-info-container">
        <p class="last-inspection">{{ $t('last inspection') }}</p>
        <div class="last-inspection-info">
          <span class="by">{{ $t('by') }} : <span>{{ createdby }}</span></span>
          <span class="date-time">{{ $t('date & Time') }} : <span>{{ date }}-{{ time }}</span></span>
        </div>
        <LastInspectionIcon />
      </div>
    </button>

    <Dialog v-model:visible="visible" :header="title" modal :dismissable-mask="true" :style="{ width: '60vw' }">
      <TemplateDocument :isOverlay="status == InspectionStatus.FINISHED" :allData="AllDocument"
        @update:data="UpdateData" :task_results="TaskResults?.taskResults?.[TaskResults?.taskResults?.length - 1]" />
    </Dialog>
  </div>
</template>
