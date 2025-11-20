<script lang="ts" setup>
import { ref, watch } from 'vue'
import TitleInterface from '@/base/Data/Models/title_interface'

import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue'
import TabsSelection from '@/shared/HelpersComponents/TabsSelection.vue'
import DatePicker from 'primevue/datepicker'
import InspectionImage from '@/assets/images/alert 2.png'

import IndexEquipmentController from '@/features/setting/Equipment/Presentation/controllers/indexEquipmentController'
import IndexEquipmentParams from '@/features/setting/Equipment/Core/params/indexEquipmentParams'
import FileUpload from '@/shared/FormInputs/FileUpload.vue'
import { filesToBase64 } from '@/base/Presentation/utils/file_to_base_64'

import HeaderPage from '@/features/Organization/Project/Presentation/components/Details/DetailsHeader/HeaderPage.vue'
import { title } from 'process'
import type InspectionDetailsModel from '../../Data/models/InspectionDetailsModel'
import EditInspectionParams from '../../Core/params/editInspectionParams'
import AddInspectionParams from '../../Core/params/addInspectionParams'
import IndexInspectionParams from '../../Core/params/indexInspectionParams'
import IndexInspectionController from '../controllers/indexInspectionController'
import PagesHeader from '@/shared/HelpersComponents/PagesHeader.vue'
import TaskAssignTo from './InspectionUtils/TaskAssignTo.vue'
import InspectionEmployeeForm from './InspectionForms/InspectionEmployeeForm.vue'
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

watch([() => props.data], ([newData]) => {}, { immediate: true })

const indexInspectionTypeParams = new IndexInspectionParams('', 1, 10, 1)
const indexInspectionTypeController = IndexInspectionController.getInstance()
const InspectionType = ref<TitleInterface[]>([])
const setInspectionType = (data: TitleInterface[]) => {
  InspectionType.value = data
  updateData()
}
const indexEquipmentParams = new IndexEquipmentParams('', 1, 10, 1)
const indexEquipmentController = IndexEquipmentController.getInstance()
const SelectedMachine = ref<TitleInterface[]>([])
const setMachine = (data: TitleInterface[]) => {
  SelectedMachine.value = data
  updateData()
}

const setImage = async (data: File) => {
  image.value = await filesToBase64(data)
  updateData()
}
const ZoneIds = ref<number[]>()
const GetZones = (data: number[]) => {
  ZoneIds.value = data
  updateData()
}

const AssignToOptions = ref<TitleInterface[]>([
  new TitleInterface({ id: 1, title: 'Employee' }),
  new TitleInterface({ id: 2, title: 'Zone' }),
])

const SelectedAssigned = ref()
const GetSelectedAssigned = (data) => {
  SelectedAssigned.value = data
}
</script>

<template>
  <div class="col-span-6 md:col-span-6">
    <PagesHeader
      :title="'Task Assignment Center'"
      :subtitle="'Distribute responsibilities across users and zones to streamline project workflows'"
    />
  </div>
  <div class="col-span-6 md:col-span-6">
    <TaskAssignTo
      :title="`Assign task to`"
      :options="AssignToOptions"
      @update:data="GetSelectedAssigned"
    />
  </div>
  <div class="inspection-form col-span-6 md:col-span-6 gap-4">
    <div class="inspection-details">
      <InspectionEmployeeForm />
    </div>
    <!--Employee Tasks-->
    <EmployeeTasksCard />
  </div>
</template>
