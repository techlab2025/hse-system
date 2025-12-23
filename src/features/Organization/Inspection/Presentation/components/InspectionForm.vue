<script lang="ts" setup>
import { ref, watch } from 'vue'
import TitleInterface from '@/base/Data/Models/title_interface'
import type InspectionDetailsModel from '../../Data/models/InspectionDetailsModel'
import EditInspectionParams from '../../Core/params/editInspectionParams'
import AddInspectionParams from '../../Core/params/addInspectionParams'
import PagesHeader from '@/shared/HelpersComponents/PagesHeader.vue'
import TaskAssignTo from './InspectionUtils/TaskAssignTo.vue'
import InspectionEmployeeForm from './InspectionForms/InspectionEmployeeForm.vue'
import { AssignToTypeEnum } from '../../Core/Enum/AssignToTypesEnum'
import InspectionZonesForm from './InspectionForms/InspectionZonesForm.vue'
import EmployeeTasksCard from './employeeTasksCard/employeeTasksCard.vue'
import TaskPeriodParams from '@/features/Organization/Inspection/Core/params/taskPeroidParams.ts'
import { InspectionTypeEnum } from '../../Core/Enum/InspectionTypeEnum'
import { PeriodTypeEnum } from '../../Core/Enum/PeriodTypeEnum'
import { formatJoinDate } from '@/base/Presentation/utils/date_format'
import { useRoute } from 'vue-router'
import InspectionGeneralForm from './InspectionForms/InspectionGeneralForm.vue'
import InspectionTemplateDialog from './InspectionDialog/InspectionTemplateDialog.vue'

const route = useRoute()
const id = route.params?.equipment_id
interface DataFormDetails {
  inspectionType: InspectionTypeEnum
  onceday: string
  periodType: TitleInterface
  periodByday: TitleInterface
  PeridWithDate: TitleInterface[]
  bydates: Date[]
  fromDate: string
  toDate: string
  WithDays: number
}
interface InspectionForm {
  morph: TitleInterface
  data: DataFormDetails
  TempalteIds: number[]
  ProjectZoneId: number
  ProjectId: number
}
const emit = defineEmits(['update:data'])
const props = defineProps<{
  data?: InspectionDetailsModel
}>()

const updateData = () => {
  if (
    DataParams.value?.data?.periodType === PeriodTypeEnum.BYDAY ||
    date?.value?.periodType === PeriodTypeEnum.BYDAY
  ) {
    DataParams.value.data.PeridWithDate = []
  }
  if (
    DataParams.value?.data?.periodType === PeriodTypeEnum.WHITDATE ||
    date?.value?.periodType === PeriodTypeEnum.WHITDATE
  ) {
    DataParams.value.data.periodByday = []
  }
  const PeriodTasks = ref<TaskPeriodParams[]>([])
  const Data = DataParams.value?.data || date?.value
  if (
    DataParams.value?.data?.periodType !== PeriodTypeEnum.DAILY ||
    date?.value?.periodType !== PeriodTypeEnum.DAILY
  ) {
    Data?.periodByday?.forEach((item) => {
      PeriodTasks.value.push(new TaskPeriodParams(null, item.id, null))
    })
    Data?.PeridWithDate?.forEach((item) => {
      PeriodTasks.value.push(new TaskPeriodParams(null, null, item.id))
    })
    Data?.bydates?.forEach((item) => {
      // console.log(, "item");
      PeriodTasks.value.push(new TaskPeriodParams(null, null, formatJoinDate(item)))
    })
  }
  // if (DataParams.value?.data?.inspectionType == InspectionTypeEnum.DAY) {
  //   PeriodTasks.value.push(new TaskPeriodParams(null, null, ))
  // }
  const params = props.data?.id
    ? new EditInspectionParams(
      props.data?.id ?? 0,
      SelectedAssigned.value,
      DataParams.value?.morph?.id,
      DataParams.value?.TempalteIds,
      DataParams.value?.data?.inspectionType,
      DataParams.value?.data?.periodType,
      37,
      PeriodTasks.value,
      // DataParams.value?.data?.WithDays || date?.value?.fromDate,

    )
    : new AddInspectionParams(
      id ? AssignToTypeEnum.MACHINE : SelectedAssigned.value,
      DataParams.value?.morph?.id || id,
      DataParams.value?.TempalteIds || TempalteIds.value,
      DataParams.value?.data?.inspectionType || date?.value?.inspectionType,
      DataParams.value?.data?.periodType || date?.value?.periodType,
      DataParams.value?.ProjectId || null,
      PeriodTasks.value || [],
      DataParams.value?.data?.onceday || date?.value?.onceday,
      DataParams.value?.data?.fromDate || date?.value?.fromDate,
      null,
      DataParams.value?.ProjectZoneId,
      // DataParams.value?.data?.WithDays || date?.value?.fromDate,
    )

  emit('update:data', params)
}

watch([() => props.data], ([newData]) => { }, { immediate: true })

const AssignToOptions = ref<TitleInterface[]>([
  new TitleInterface({ id: 1, title: 'Zone' }),
  new TitleInterface({ id: 3, title: 'Employee' }),
])

const SelectedAssigned = ref<TitleInterface>(3)
const GetSelectedAssigned = (data: TitleInterface) => {
  SelectedAssigned.value = data
  updateData()
}
const DataParams = ref<InspectionForm>()
const UpdateFormData = (data: InspectionForm) => {
  DataParams.value = data
  console.log(DataParams.value, "DataParams.value");
  updateData()
}

const date = ref()
const GetGeneralData = (data) => {
  date.value = data
  updateData()
}

const TempalteIds = ref<number>()
const GetTemplateId = (data: number) => {
  TempalteIds.value = data
  updateData()
}
</script>

<template>
  <div class="col-span-6 md:col-span-6">
    <PagesHeader :title="'Task Assignment Center'"
      :subtitle="'Distribute responsibilities across users and zones to streamline project workflows'" />
  </div>
  <div class="col-span-6 md:col-span-6" v-if="!id">
    <TaskAssignTo :title="`Assign task to`" :options="AssignToOptions" @update:data="GetSelectedAssigned" />
  </div>
  <div class="inspection-form col-span-6 md:col-span-6 gap-4">
    <div class="inspection-details" :class="SelectedAssigned == AssignToTypeEnum.ZONE || id ? 'full-width' : ''">
      <InspectionEmployeeForm v-if="SelectedAssigned == AssignToTypeEnum.EMPLOYEE && !id"
        @update:data="UpdateFormData" />
      <InspectionZonesForm v-if="SelectedAssigned == AssignToTypeEnum.ZONE && !id" @update:data="UpdateFormData" />
      <InspectionTemplateDialog v-if="id" @update:data="GetTemplateId" />
      <InspectionGeneralForm v-if="id" @update:data="GetGeneralData" />
    </div>
    <EmployeeTasksCard v-if="SelectedAssigned == AssignToTypeEnum.EMPLOYEE && !id" :employee_id="DataParams?.morph?.id"
      :employee_name="DataParams?.morph?.title" />
  </div>
</template>
