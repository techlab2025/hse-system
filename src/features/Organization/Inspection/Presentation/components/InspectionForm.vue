<script lang="ts" setup>
/* =========================
 * Imports
 * ========================= */
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import TitleInterface from '@/base/Data/Models/title_interface'
import type InspectionDetailsModel from '../../Data/models/InspectionDetailsModel'

import EditInspectionParams from '../../Core/params/editInspectionParams'
import AddInspectionParams from '../../Core/params/addInspectionParams'
import TaskPeriodParams from '@/features/Organization/Inspection/Core/params/taskPeroidParams.ts'

import { AssignToTypeEnum } from '../../Core/Enum/AssignToTypesEnum'
import { InspectionTypeEnum } from '../../Core/Enum/InspectionTypeEnum'
import { PeriodTypeEnum } from '../../Core/Enum/PeriodTypeEnum'

import { formatJoinDate } from '@/base/Presentation/utils/date_format'

/* Components */
import PagesHeader from '@/shared/HelpersComponents/PagesHeader.vue'
import TaskAssignTo from './InspectionUtils/TaskAssignTo.vue'
import InspectionEmployeeForm from './InspectionForms/InspectionEmployeeForm.vue'
import InspectionZonesForm from './InspectionForms/InspectionZonesForm.vue'
import InspectionGeneralForm from './InspectionForms/InspectionGeneralForm.vue'
import InspectionTemplateDialog from './InspectionDialog/InspectionTemplateDialog.vue'
import EmployeeTasksCard from './employeeTasksCard/employeeTasksCard.vue'
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue'

/* Equipment */
import IndexEquipmentController from '@/features/_templateFeature/Presentation/controllers/indexEquipmentController'
import IndexEquipmentParams from '@/features/setting/Equipment/Core/params/indexEquipmentParams'
import UpdatedCustomInputSelect from '@/shared/FormInputs/UpdatedCustomInputSelect.vue'
// import AddInspection from './AddInspection.vue'
import AddEquipment from '@/features/_templateFeature/Presentation/components/AddEquipment.vue'
import AddFullEquipment from '@/features/setting/Equipment/Presentation/components/AddFullEquipment.vue'
import SwitchInput from '@/shared/FormInputs/SwitchInput.vue'

/* =========================
 * Route & Props
 * ========================= */
const route = useRoute()
const id = route.params?.equipment_id

const props = defineProps<{
  data?: InspectionDetailsModel
}>()

const emit = defineEmits(['update:data'])

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
  SelectedEquipment: number
}

// Assign To (Machine / Employee / Zone)
const AssignToOptions = ref<TitleInterface[]>([
  new TitleInterface({ id: AssignToTypeEnum.MACHINE, title: 'Machine' }),
  new TitleInterface({ id: AssignToTypeEnum.EMPLOYEE, title: 'Employee' }),
  new TitleInterface({ id: AssignToTypeEnum.ZONE, title: 'Zone' }),
])

const SelectedAssigned = ref<TitleInterface>(AssignToTypeEnum.MACHINE)

// Data coming from sub forms
const DataParams = ref<InspectionForm>()
const date = ref()
const TempalteIds = ref<number>()

// Equipment
const SelectedEquipment = ref<TitleInterface>()
const indexEquipmentController = IndexEquipmentController.getInstance()
const indexEquipmentParams = new IndexEquipmentParams('', 1, 10, 1, null, false)

/**
 * Build period tasks based on selected period type
 * then emit Add/Edit params to parent
 */
const updateData = () => {
  const data = DataParams.value?.data ?? date?.value
  if (!data) return

  /* ---- Clean conflicting period values ---- */
  if (data.periodType === PeriodTypeEnum.BYDAY) {
    data.PeridWithDate = []
  }

  if (data.periodType === PeriodTypeEnum.WHITDATE) {
    data.periodByday = []
  }

  /* ---- Build Period Tasks ---- */
  const periodTasks: TaskPeriodParams[] = []

  if (data.periodType !== PeriodTypeEnum.DAILY) {
    data.periodByday?.forEach((item) => {
      periodTasks.push(new TaskPeriodParams(null, item.id, null))
    })

    data.PeridWithDate?.forEach((item) => {
      periodTasks.push(new TaskPeriodParams(null, null, item.id))
    })

    data.bydates?.forEach((item) => {
      periodTasks.push(new TaskPeriodParams(null, null, formatJoinDate(item)))
    })
  }

  if (data.periodType === PeriodTypeEnum.WITHDAY) {
    periodTasks.push(new TaskPeriodParams(null, null, null, data.WithDays, data.WithDaysType?.id))
  }

  /* ---- Decide Add or Edit ---- */
  const params = props.data?.id
    ? new EditInspectionParams(
        props.data.id,
        SelectedAssigned.value,
        DataParams.value?.morph?.id,
        DataParams.value?.TempalteIds,
        data.inspectionType,
        data.periodType,
        37,
        periodTasks,
      )
    : new AddInspectionParams(
        id ? AssignToTypeEnum.MACHINE : SelectedAssigned.value,
        DataParams.value?.morph?.id || id || SelectedEquipment.value?.id,
        DataParams.value?.TempalteIds || TempalteIds.value,
        data.inspectionType || InspectionTypeEnum?.DAY,
        data.periodType || PeriodTypeEnum?.DAILY,
        DataParams.value?.ProjectId || null,
        periodTasks,
        data.onceday,
        data.fromDate,
        null,
        DataParams.value?.ProjectZoneId,
        IsInLibrary.value,
        DataParams.value?.SelectedEquipment,
        SerialNumber.value?.SerialNumber,
      )

  console.log(data.inspectionType, 'data.inspectionType')
  console.log(IsInLibrary.value, 'IsInLibrary.value')
  emit('update:data', params)
}

/* =========================
 * Handlers (Child → Parent)
 * ========================= */
const GetSelectedAssigned = (data: TitleInterface) => {
  SelectedAssigned.value = data
  updateData()
}

const UpdateFormData = (data: InspectionForm) => {
  DataParams.value = data
  updateData()
}

const GetGeneralData = (data: any) => {
  date.value = data
  updateData()
}

const GetTemplateId = (data: number) => {
  TempalteIds.value = data
  updateData()
}

const setEquipment = (data: TitleInterface) => {
  SelectedEquipment.value = data
  updateData()
}

watch(
  () => props.data,
  () => {},
  { immediate: true },
)
const IsInLibrary = ref()
const inspectionDoalouge = ref(false)

const UpdateSerial = (data) => {
  SerialNumber.value = data
  updateData()
}

const SerialNumber = ref()

const fields = ref([
  {
    key: 'SerialNumber',
    label: 'serial_number',
    placeholder: 'You can leave it (auto-generated)',
    value: SerialNumber.value,
    enabled: props?.data?.id ? false : true,
  },
])
</script>

<template>
  <!-- Page Header -->
  <div class="col-span-6 md:col-span-6">
    <PagesHeader
      title="Task Assignment Center"
      subtitle="Distribute responsibilities across users and zones to streamline project workflows"
    />
  </div>

  <!-- Assign To Selector (only in create mode) -->
  <div class="col-span-6 md:col-span-6" v-if="!id">
    <TaskAssignTo
      title="Assign task to"
      :options="AssignToOptions"
      @update:data="GetSelectedAssigned"
    />
  </div>

  <div class="col-span-6 md:col-span-6" v-if="!data?.id">
    <SwitchInput
      :fields="fields"
      :switch_title="$t('auto')"
      :switch_reverse="true"
      :is-auto="true"
      @update:value="UpdateSerial"
    />
  </div>

  <div class="inspection-form col-span-6 md:col-span-6 gap-4">
    <!-- Main Inspection Details -->
    <div
      class="inspection-details grid grid-cols-6 gap-4"
      :class="
        SelectedAssigned === AssignToTypeEnum.ZONE ||
        id ||
        SelectedAssigned === AssignToTypeEnum.MACHINE
          ? 'full-width'
          : ''
      "
    >
      <!-- Machine Selection -->

      <!-- <CustomSelectInput
                 New Update => Custom input Select inspection Form
        /> -->

      <div class="input-wrapper col-span-6 pt-15 md:col-span-3" v-if="!id">
        <!-- <CustomSelectInput
        v-if="SelectedAssigned === AssignToTypeEnum.MACHINE"
        class="input"
          :modelValue="SelectedEquipment"
          :controller="indexEquipmentController"
           :params="indexEquipmentParams"
          :label="$t('Equipment')"
           placeholder="select your Machine"
            @update:modelValue="setEquipment" /> -->

        <UpdatedCustomInputSelect
          v-if="SelectedAssigned === AssignToTypeEnum.MACHINE"
          class="input"
          :modelValue="SelectedEquipment"
          :controller="indexEquipmentController"
          :params="indexEquipmentParams"
          :label="$t('Equipment')"
          placeholder="select your Machine"
          @update:modelValue="setEquipment"
          :isDialog="true"
          :dialogVisible="inspectionDoalouge"
          @close="inspectionDoalouge = false"
        >
          <template #LabelHeader>
            <span class="add-dialog" @click="inspectionDoalouge = true">New</span>
          </template>
          <template #Dialog>
            <AddFullEquipment @update:data="inspectionDoalouge = false" />
          </template>
        </UpdatedCustomInputSelect>
      </div>

      <!-- Employee Form -->
      <div
        class="input-wrapper col-span-6 md:col-span-12"
        v-if="SelectedAssigned === AssignToTypeEnum.EMPLOYEE && !id"
      >
        <InspectionEmployeeForm @update:data="UpdateFormData" />
      </div>

      <!-- Zones Form -->

      <div
        class="input-wrapper col-span-12"
        v-if="SelectedAssigned === AssignToTypeEnum.ZONE && !id"
      >
        <InspectionZonesForm @update:data="UpdateFormData" />
      </div>

      <!-- Templates -->
      <div
        class="input-wrapper col-span-6 md:col-span-3"
        v-if="id || SelectedAssigned === AssignToTypeEnum.MACHINE"
      >
        <InspectionTemplateDialog
          @update:isInLibrary="IsInLibrary = $event"
          @update:data="GetTemplateId"
        />
      </div>

      <!-- General Inspection Data -->
      <div
        class="input-wrapper col-span-6"
        v-if="id || SelectedAssigned === AssignToTypeEnum.MACHINE"
      >
        <InspectionGeneralForm @update:data="GetGeneralData" />
      </div>
    </div>

    <!-- Employee Tasks Preview -->
    <EmployeeTasksCard
      v-if="SelectedAssigned === AssignToTypeEnum.EMPLOYEE && !id"
      :employee_id="DataParams?.morph?.id"
      :employee_name="DataParams?.morph?.title"
    />
  </div>
</template>
<style scoped>
.add-dialog {
  width: 20px;
  height: 20px;
  margin-right: 6px;
  cursor: pointer;
  color: #1d4ed8;
  text-decoration: underline;
  font-family: 'Regular';
}

.add-dialog svg {
  width: 18px;
  height: 18px;
}
</style>
