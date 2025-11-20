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
import EmployeeIconCard from '@/shared/icons/employeeIconCard.vue'
import EmployeeTasksCard from './employeeTasksCard/employeeTasksCard.vue'

const emit = defineEmits(['update:data'])
const props = defineProps<{
  data?: InspectionDetailsModel
}>()
const text = ref<string>('')
const date = ref<Date>()
const descripe = ref<string>('')
const image = ref<string>('')

const updateData = () => {
  console.log(DataParams, "DataParams");
  const params = props.data?.id
    ? new EditInspectionParams(
      props.data?.id! ?? 0,
      text.value,
      date.value,
      ZoneIds.value,
      InspectionType.value.map((h) => h.id),
      SelectedMachine.value.map((el) => el.id),
      image.value,
      descripe.value,
    )
    : new AddInspectionParams(
      text.value,
      date.value,
      ZoneIds.value,
      InspectionType.value.map((h) => h.id),
      SelectedMachine.value.map((el) => el.id),
      image.value,
      descripe.value,
    )

  emit('update:data', params)
}

watch([() => props.data], ([newData]) => { }, { immediate: true })

const AssignToOptions = ref<TitleInterface[]>([
  new TitleInterface({ id: 1, title: 'Employee' }),
  new TitleInterface({ id: 2, title: 'Zone' }),
])

const SelectedAssigned = ref<TitleInterface>()
const GetSelectedAssigned = (data: TitleInterface) => {
  SelectedAssigned.value = data
  updateData()
}
const DataParams = ref()
const UpdateFormData = (data) => {
  console.log(data, "data");
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
    <div class="inspection-details">
      <InspectionEmployeeForm v-if="SelectedAssigned == AssignToTypeEnum.EMPLOYEE" @update:data="UpdateFormData" />
      <InspectionZonesForm v-if="SelectedAssigned == AssignToTypeEnum.ZONE" @update:data="UpdateFormData" />
    </div>
    <!--Employee Tasks-->
    <EmployeeTasksCard />
  </div>
</template>
