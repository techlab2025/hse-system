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

interface DataFormDetails {
  inspectionType: InspectionTypeEnum,
  onceday: string,
  periodType: TitleInterface,
  periodByday: TitleInterface,
  PeridWithDate: TitleInterface[],
}
interface InspectionForm {
  morph: TitleInterface,
  data: DataFormDetails,
  TempalteIds: number[]
}
const emit = defineEmits(['update:data'])
const props = defineProps<{
  data?: InspectionDetailsModel
}>()

const updateData = () => {
  if (DataParams.value?.data?.periodType === PeriodTypeEnum.BYDAY) {
    DataParams.value.data.PeridWithDate = []
  }
  if (DataParams.value?.data?.periodType === PeriodTypeEnum.WHITDATE) {
    DataParams.value.data.periodByday = []
  }
  const PeriodTasks = ref<TaskPeriodParams[]>([])
  if (DataParams.value?.data?.periodType !== PeriodTypeEnum.DAILY) {
    DataParams.value?.data?.periodByday?.forEach((item) => {
      PeriodTasks.value.push(
        new TaskPeriodParams(null, item.id, null)
      )
    })
    DataParams.value?.data?.PeridWithDate?.forEach((item) => {
      PeriodTasks.value.push(
        new TaskPeriodParams(null, null, item.id)
      )
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
      PeriodTasks.value
    )
    : new AddInspectionParams(
      SelectedAssigned.value,
      DataParams.value?.morph?.id,
      DataParams.value?.TempalteIds[0],
      DataParams.value?.data?.inspectionType,
      DataParams.value?.data?.periodType,
      37,
      PeriodTasks.value || [],
      DataParams.value?.data?.onceday
    )

  emit('update:data', params)
}

watch([() => props.data], ([newData]) => { }, { immediate: true })

const AssignToOptions = ref<TitleInterface[]>([
  new TitleInterface({ id: 1, title: 'Zone' }),
  new TitleInterface({ id: 3, title: 'Employee' }),
])

const SelectedAssigned = ref<TitleInterface>()
const GetSelectedAssigned = (data: TitleInterface) => {
  SelectedAssigned.value = data

  updateData()
}
const DataParams = ref<InspectionForm>()
const UpdateFormData = (data: InspectionForm) => {
  DataParams.value = data
  updateData()
}

</script>

<template>
  <div class="col-span-6 md:col-span-6">
    <PagesHeader :title="'Task Assignment Center'"
      :subtitle="'Distribute responsibilities across users and zones to streamline project workflows'" />
  </div>
  <div class="col-span-6 md:col-span-6">
    <TaskAssignTo :title="`Assign task to`" :options="AssignToOptions" @update:data="GetSelectedAssigned" />
  </div>
  <div class="inspection-form col-span-6 md:col-span-6 gap-4">
    <div class="inspection-details " :class="SelectedAssigned == AssignToTypeEnum.ZONE ? 'full-width' : ''">
      <InspectionEmployeeForm v-if="SelectedAssigned == AssignToTypeEnum.EMPLOYEE" @update:data="UpdateFormData" />
      <InspectionZonesForm v-if="SelectedAssigned == AssignToTypeEnum.ZONE" @update:data="UpdateFormData" />
    </div>
    <!--Employee Tasks-->
    <EmployeeTasksCard v-if="SelectedAssigned == AssignToTypeEnum.EMPLOYEE" />
  </div>
</template>
