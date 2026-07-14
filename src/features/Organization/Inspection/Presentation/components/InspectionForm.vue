<script lang="ts" setup>
/* =========================
 * Imports
 * ========================= */
import { computed, nextTick, ref, watch } from 'vue'
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
import { useProjectAppStatusStore } from '@/stores/ProjectStatus'
import { OpenWarningDilaog } from '@/base/Presentation/utils/OpenWarningDialog'

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
    console.log(periodTasks, 'periodTasks')
    console.log(data, 'data')
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
        SerialNumber.value,
      )

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
  console.log(data, 'data')
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

const projtecStateus = useProjectAppStatusStore()
const UpdateSerial = (data) => {
  SerialNumber.value = data.target.value
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

type RequiredFieldRule = {
  key: string
  message: string
  isMissing: () => boolean
}

const requiredFieldErrors = ref<Record<string, string>>({})
const hasValue = (value: unknown) =>
  value !== null && value !== undefined && String(value).trim().length > 0
const hasSelectedId = (value?: TitleInterface | null) => Boolean(value?.id)
const isMachineAssignment = () => id || SelectedAssigned.value === AssignToTypeEnum.MACHINE
const isEmployeeAssignment = () => !id && SelectedAssigned.value === AssignToTypeEnum.EMPLOYEE
const isZoneAssignment = () => !id && SelectedAssigned.value === AssignToTypeEnum.ZONE
const selectedTemplateId = () => DataParams.value?.TempalteIds || TempalteIds.value
const selectedGeneralData = () => DataParams.value?.data ?? date.value
const isPeriodType = (periodType: unknown, type: PeriodTypeEnum) =>
  periodType === type || Number((periodType as TitleInterface)?.id) === type
const hasArrayItems = (value: unknown) => Array.isArray(value) && value.length > 0

const requiredFields = computed<RequiredFieldRule[]>(() => [
  {
    key: 'SelectedProject',
    message: 'Please select the Project where this inspection will be conducted before continuing.',
    isMissing: () => (isEmployeeAssignment() || isZoneAssignment()) && !DataParams.value?.ProjectId,
  },
  {
    key: 'SelectedEquipment',
    message:
      'Please select the Equipment for this inspection, or create a new one using the New button before continuing.',
    isMissing: () =>
      !id &&
      SelectedAssigned.value === AssignToTypeEnum.MACHINE &&
      !hasSelectedId(SelectedEquipment.value),
  },

  {
    key: 'ProjectZoneId',
    message:
      'Please select one of the Zones associated with the selected Project where this inspection will take place.',
    isMissing: () => isEmployeeAssignment() && !DataParams.value?.ProjectZoneId,
  },
  {
    key: 'SelectedEmployee',
    message:
      'Please select the employee from the selected Project who will be assigned to this inspection.',
    isMissing: () => isEmployeeAssignment() && !hasSelectedId(DataParams.value?.morph),
  },
  {
    key: 'SelectedZone',
    message:
      'Please select one of the Zones associated with the selected Project where this inspection will take place.',
    isMissing: () => isZoneAssignment() && !hasSelectedId(DataParams.value?.morph),
  },
  {
    key: 'InspectionGeneralForm',
    message: 'Inspection Schedule Is Required',
    isMissing: () => !selectedGeneralData(),
  },
  {
    key: 'InspectionTemplate',
    message: 'Please select the Inspection Template that will be used before continuing.',
    isMissing: () => !selectedTemplateId(),
  },
  {
    key: 'InspectionDate',
    message: 'Inspection Date Is Required',
    isMissing: () => {
      const data = selectedGeneralData()
      return data?.inspectionType === InspectionTypeEnum.DAY && !data?.onceday
    },
  },
  {
    key: 'InspectionPeriodType',
    message: 'Period Type Is Required',
    isMissing: () => {
      const data = selectedGeneralData()
      return data?.inspectionType === InspectionTypeEnum.PERIOD && !data?.periodType
    },
  },
  {
    key: 'InspectionPeriodValue',
    message: 'Period Value Is Required',
    isMissing: () => {
      const data = selectedGeneralData()
      if (!data || data.inspectionType !== InspectionTypeEnum.PERIOD) return false
      if (isPeriodType(data.periodType, PeriodTypeEnum.DAILY)) return false
      if (isPeriodType(data.periodType, PeriodTypeEnum.BYDAY))
        return !hasArrayItems(data.periodByday)
      if (isPeriodType(data.periodType, PeriodTypeEnum.WHITDATE))
        return !hasArrayItems(data.PeridWithDate)
      if (isPeriodType(data.periodType, PeriodTypeEnum.BYDATE)) return !hasArrayItems(data.bydates)
      if (isPeriodType(data.periodType, PeriodTypeEnum.WITHDAY)) {
        return (
          !hasValue(data.WithDays) || Number(data.WithDays) < 1 || !hasSelectedId(data.WithDaysType)
        )
      }
      return false
    },
  },
  {
    key: 'InspectionFromDate',
    message: 'From Date Is Required',
    isMissing: () => {
      const data = selectedGeneralData()
      return data?.inspectionType === InspectionTypeEnum.PERIOD && !data?.fromDate
    },
  },
])

const getFieldError = (key: string) => requiredFieldErrors.value[key] ?? ''

const clearResolvedRequiredErrors = () => {
  requiredFields.value.forEach((field) => {
    if (requiredFieldErrors.value[field.key] && !field.isMissing()) {
      const { [field.key]: _removed, ...rest } = requiredFieldErrors.value
      requiredFieldErrors.value = rest
    }
  })
}

const scrollToRequiredField = async (key: string) => {
  await nextTick()
  const target =
    document.querySelector<HTMLElement>(`[data-required-field="${key}"]`) ??
    document.querySelector<HTMLElement>('.inspection-form')
  target?.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
  })
}

const validateRequiredFields = async () => {
  clearResolvedRequiredErrors()
  const missedFields = requiredFields.value.filter((field) => field.isMissing())
  requiredFieldErrors.value = missedFields.reduce<Record<string, string>>((errors, field) => {
    errors[field.key] = field.message
    return errors
  }, {})

  if (!missedFields.length) return true

  new OpenWarningDilaog(missedFields[0].message).openDialog()
  await scrollToRequiredField(missedFields[0].key)
  return false
}

defineExpose({
  validateRequiredFields,
})
</script>

<template>
  <!-- Page Header -->
  <div class="col-span-6 md:col-span-6">
    <PagesHeader
      :title="$t('Task Assignment Center')"
      :subtitle="
        $t('Distribute responsibilities across users and zones to streamline project workflows')
      "
    />
  </div>

  <!-- Assign To Selector (only in create mode) -->
  <div class="col-span-6 md:col-span-6" v-if="!id">
    <TaskAssignTo
      :title="$t('Assign task to')"
      :options="AssignToOptions"
      @update:data="GetSelectedAssigned"
    />
  </div>

  <div class="input-wrapper col-span-6 md:col-span-6" v-if="!data?.id">
    <label for="serialNumber">{{ $t('serial_number') }}</label>
    <input
      type="text"
      v-model="SerialNumber"
      @input="UpdateSerial"
      id="serialNumber"
      :disabled="projtecStateus.isSerialNumberAuto()"
      :placeholder="
        projtecStateus.isSerialNumberAuto()
          ? 'You can leave it (auto-generated)'
          : 'Enter Your Serial Number'
      "
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

      <div
        class="input-wrapper col-span-6 pt-15 md:col-span-3"
        data-required-field="SelectedEquipment"
        v-if="!id"
      >
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
          :placeholder="$t('select your Machine')"
          @update:modelValue="setEquipment"
          :isDialog="true"
          v-model:dialogVisible="inspectionDoalouge"
          @close="inspectionDoalouge = false"
        >
          <template #LabelHeader>
            <span class="add-dialog" @click="inspectionDoalouge = true">{{ $t('new') }}</span>
          </template>
          <template #Dialog>
            <AddFullEquipment @update:data="inspectionDoalouge = false" />
          </template>
        </UpdatedCustomInputSelect>
        <p v-if="getFieldError('SelectedEquipment')" class="required-field-message">
          {{ getFieldError('SelectedEquipment') }}
        </p>
      </div>

      <!-- Employee Form -->
      <div
        class="input-wrapper col-span-6 md:col-span-12"
        data-required-field="SelectedEmployee"
        v-if="SelectedAssigned === AssignToTypeEnum.EMPLOYEE && !id"
      >
        <InspectionEmployeeForm @update:data="UpdateFormData" />
        <p v-if="getFieldError('SelectedProject')" class="required-field-message">
          {{ getFieldError('SelectedProject') }}
        </p>
        <p v-if="getFieldError('ProjectZoneId')" class="required-field-message">
          {{ getFieldError('ProjectZoneId') }}
        </p>
        <p v-if="getFieldError('SelectedEmployee')" class="required-field-message">
          {{ getFieldError('SelectedEmployee') }}
        </p>
        <p v-if="getFieldError('InspectionTemplate')" class="required-field-message">
          {{ getFieldError('InspectionTemplate') }}
        </p>
        <p v-if="getFieldError('InspectionGeneralForm')" class="required-field-message">
          {{ getFieldError('InspectionGeneralForm') }}
        </p>
        <p v-if="getFieldError('InspectionDate')" class="required-field-message">
          {{ getFieldError('InspectionDate') }}
        </p>
        <p v-if="getFieldError('InspectionPeriodType')" class="required-field-message">
          {{ getFieldError('InspectionPeriodType') }}
        </p>
        <p v-if="getFieldError('InspectionPeriodValue')" class="required-field-message">
          {{ getFieldError('InspectionPeriodValue') }}
        </p>
        <p v-if="getFieldError('InspectionFromDate')" class="required-field-message">
          {{ getFieldError('InspectionFromDate') }}
        </p>
      </div>

      <!-- Zones Form -->

      <div
        class="input-wrapper col-span-12"
        data-required-field="SelectedZone"
        v-if="SelectedAssigned === AssignToTypeEnum.ZONE && !id"
      >
        <InspectionZonesForm @update:data="UpdateFormData" />
        <p v-if="getFieldError('SelectedProject')" class="required-field-message">
          {{ getFieldError('SelectedProject') }}
        </p>
        <p v-if="getFieldError('SelectedZone')" class="required-field-message">
          {{ getFieldError('SelectedZone') }}
        </p>
        <p v-if="getFieldError('InspectionTemplate')" class="required-field-message">
          {{ getFieldError('InspectionTemplate') }}
        </p>
        <p v-if="getFieldError('InspectionGeneralForm')" class="required-field-message">
          {{ getFieldError('InspectionGeneralForm') }}
        </p>
        <p v-if="getFieldError('InspectionDate')" class="required-field-message">
          {{ getFieldError('InspectionDate') }}
        </p>
        <p v-if="getFieldError('InspectionPeriodType')" class="required-field-message">
          {{ getFieldError('InspectionPeriodType') }}
        </p>
        <p v-if="getFieldError('InspectionPeriodValue')" class="required-field-message">
          {{ getFieldError('InspectionPeriodValue') }}
        </p>
        <p v-if="getFieldError('InspectionFromDate')" class="required-field-message">
          {{ getFieldError('InspectionFromDate') }}
        </p>
      </div>

      <!-- Templates -->
      <div
        class="input-wrapper col-span-6 md:col-span-3"
        data-required-field="InspectionTemplate"
        v-if="id || SelectedAssigned === AssignToTypeEnum.MACHINE"
      >
        <InspectionTemplateDialog
          @update:isInLibrary="IsInLibrary = $event"
          @update:data="GetTemplateId"
        />
        <p v-if="getFieldError('InspectionTemplate')" class="required-field-message">
          {{ getFieldError('InspectionTemplate') }}
        </p>
      </div>

      <!-- General Inspection Data -->
      <div
        class="input-wrapper col-span-6"
        data-required-field="InspectionGeneralForm"
        v-if="id || SelectedAssigned === AssignToTypeEnum.MACHINE"
      >
        <InspectionGeneralForm @update:data="GetGeneralData" />
        <p v-if="getFieldError('InspectionGeneralForm')" class="required-field-message">
          {{ getFieldError('InspectionGeneralForm') }}
        </p>
        <p v-if="getFieldError('InspectionDate')" class="required-field-message">
          {{ getFieldError('InspectionDate') }}
        </p>
        <p v-if="getFieldError('InspectionPeriodType')" class="required-field-message">
          {{ getFieldError('InspectionPeriodType') }}
        </p>
        <p v-if="getFieldError('InspectionPeriodValue')" class="required-field-message">
          {{ getFieldError('InspectionPeriodValue') }}
        </p>
        <p v-if="getFieldError('InspectionFromDate')" class="required-field-message">
          {{ getFieldError('InspectionFromDate') }}
        </p>
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
  color: var(--brand-primary-500);
  text-decoration: underline;
  font-family: 'Regular';
}

.add-dialog svg {
  width: 18px;
  height: 18px;
}

.required-field-message {
  margin-top: 0.35rem;
  color: var(--status-danger);
  font-size: 0.82rem;
  font-weight: 700;
}
</style>
