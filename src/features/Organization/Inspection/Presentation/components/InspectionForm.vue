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
  <div class="inspection-form-shell col-span-full">
    <!-- Page Header -->
    <div class="inspection-page-header">
      <PagesHeader
        :title="$t('Task Assignment Center')"
        :subtitle="
          $t('Distribute responsibilities across users and zones to streamline project workflows')
        "
      />
    </div>

    <!-- Assignment setup (only in create mode) -->
    <section v-if="!id" class="form-stage assignment-stage">
      <div class="stage-heading">
        <span class="stage-number">01</span>
        <div>
          <h2>{{ $t('Choose assignment target') }}</h2>
          <p>{{ $t('Select who or what will receive this inspection task') }}</p>
        </div>
      </div>

      <TaskAssignTo
        class="modern-assign-selector"
        :title="$t('Assign task to')"
        :options="AssignToOptions"
        :showHeader="false"
        @update:data="GetSelectedAssigned"
      />
    </section>

    <section v-if="!data?.id" class="form-stage serial-stage">
      <div class="serial-stage-copy">
        <span class="field-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M7 7h10M7 12h6M7 17h8" />
            <rect x="3" y="3" width="18" height="18" rx="5" />
          </svg>
        </span>
        <div>
          <h2>{{ $t('Inspection reference') }}</h2>
          <p>
            {{
              $t(
                projtecStateus.isSerialNumberAuto()
                  ? 'A serial number will be generated automatically'
                  : 'Add a unique serial number for easier tracking',
              )
            }}
          </p>
        </div>
      </div>
      <div class="input-wrapper serial-input">
        <label for="serialNumber">{{ $t('serial_number') }}</label>
        <input
          id="serialNumber"
          v-model="SerialNumber"
          type="text"
          @input="UpdateSerial"
          :disabled="projtecStateus.isSerialNumberAuto()"
          :placeholder="
            projtecStateus.isSerialNumberAuto()
              ? 'You can leave it (auto-generated)'
              : 'Enter Your Serial Number'
          "
        />
      </div>
    </section>

    <section class="form-stage details-stage">
      <div class="stage-heading">
        <span class="stage-number">{{ id ? '01' : '02' }}</span>
        <div>
          <h2>{{ $t('Configure inspection') }}</h2>
          <p>{{ $t('Complete the target, checklist and schedule details') }}</p>
        </div>
        <span class="stage-status">
          <span></span>
          {{ $t(data?.id ? 'Editing' : 'In progress') }}
        </span>
      </div>

      <div class="inspection-form gap-4">
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
            class="input-wrapper field-panel col-span-6 pt-15 md:col-span-3"
            data-required-field="SelectedEquipment"
            v-if="!id && SelectedAssigned === AssignToTypeEnum.MACHINE"
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
            class="input-wrapper embedded-form-panel col-span-6 md:col-span-12"
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
            class="input-wrapper embedded-form-panel col-span-12"
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
            class="input-wrapper field-panel col-span-6 md:col-span-3"
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
            class="input-wrapper schedule-panel col-span-6"
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
    </section>
  </div>
</template>
<style scoped>
.inspection-form-shell {
  position: relative;
  grid-column: span 12;
  display: flex;
  width: 100%;
  min-width: 0;
  flex-direction: column;
  gap: 1.25rem;
  font-family: 'Regular', sans-serif;
}

.inspection-page-header {
  position: relative;
  overflow: hidden;
  border-radius: 1.5rem;
  box-shadow: 0 12px 32px color-mix(in srgb, var(--brand-primary-900) 7%, transparent);
}

.inspection-page-header::after {
  position: absolute;
  z-index: 1;
  top: -4rem;
  inset-inline-end: 7%;
  width: 10rem;
  height: 10rem;
  border: 1px solid color-mix(in srgb, var(--brand-primary-500) 18%, transparent);
  border-radius: 50%;
  content: '';
  pointer-events: none;
}

.inspection-page-header :deep(.employee-header) {
  min-height: 8.75rem;
  margin: 0;
  border: 1px solid color-mix(in srgb, var(--brand-primary-500) 14%, var(--main-border));
  border-radius: inherit;
  background:
    radial-gradient(
      circle at 88% 22%,
      color-mix(in srgb, var(--status-success) 12%, transparent),
      transparent 25%
    ),
    linear-gradient(135deg, var(--surface-1), var(--brand-primary-50));
}

.form-stage {
  position: relative;
  min-width: 0;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--brand-primary-500) 12%, var(--main-border));
  border-radius: 1.5rem;
  background: linear-gradient(
    145deg,
    color-mix(in srgb, var(--surface-1) 96%, transparent),
    var(--surface-1)
  );
  box-shadow: 0 14px 38px color-mix(in srgb, var(--brand-primary-900) 6%, transparent);
  padding: 1.35rem;
}

.form-stage::before {
  position: absolute;
  top: 0;
  inset-inline-start: 0;
  width: 5.5rem;
  height: 3px;
  border-radius: 0 0 999px 0;
  background: linear-gradient(90deg, var(--brand-primary-500), var(--status-success));
  content: '';
}

.stage-heading,
.serial-stage-copy {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 0.85rem;
}

.stage-heading {
  margin-bottom: 1.25rem;
}

.stage-heading > div,
.serial-stage-copy > div {
  min-width: 0;
}

.stage-heading h2,
.serial-stage-copy h2 {
  margin: 0 0 0.2rem;
  color: var(--text-strong);
  font-family: 'Bold', sans-serif;
  font-size: clamp(1rem, 1.6vw, 1.2rem);
  line-height: 1.25;
}

.stage-heading p,
.serial-stage-copy p {
  margin: 0;
  color: var(--text-muted);
  font-size: 0.84rem;
  line-height: 1.45;
}

.stage-number,
.field-icon {
  display: inline-flex;
  width: 2.8rem;
  height: 2.8rem;
  flex: 0 0 2.8rem;
  align-items: center;
  justify-content: center;
  border: 1px solid color-mix(in srgb, var(--brand-primary-500) 18%, transparent);
  border-radius: 0.9rem;
  background: linear-gradient(145deg, var(--brand-primary-50), var(--surface-1));
  color: var(--brand-primary-600);
  box-shadow: 0 8px 18px color-mix(in srgb, var(--brand-primary-500) 9%, transparent);
  font-family: 'Bold', sans-serif;
  font-size: 0.8rem;
}

.field-icon svg {
  width: 1.3rem;
  height: 1.3rem;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.8;
}

.stage-status {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  margin-inline-start: auto;
  border: 1px solid color-mix(in srgb, var(--status-success) 20%, transparent);
  border-radius: 999px;
  background: var(--status-success-soft);
  color: var(--status-success);
  padding: 0.45rem 0.75rem;
  font-size: 0.76rem;
  font-weight: 700;
  white-space: nowrap;
}

.stage-status > span {
  width: 0.45rem;
  height: 0.45rem;
  border-radius: 50%;
  background: currentColor;
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--status-success) 12%, transparent);
}

.assignment-stage {
  background:
    radial-gradient(
      circle at 100% 0,
      color-mix(in srgb, var(--brand-primary-500) 8%, transparent),
      transparent 34%
    ),
    var(--surface-1);
}

.modern-assign-selector :deep(.assign-to-container) {
  gap: 0;
  border: 0;
  border-radius: 0;
  background: transparent;
  padding: 0;
}

.modern-assign-selector :deep(.assign-to-contect) {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.65rem;
}

.modern-assign-selector :deep(.option) {
  position: relative;
  overflow: hidden;
  border: 1px solid var(--main-border);
  border-radius: 1rem;
  background: var(--surface-2);
  padding: 0.9rem 1rem;
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.modern-assign-selector :deep(.option:hover) {
  transform: translateY(-2px);
  border-color: color-mix(in srgb, var(--brand-primary-500) 35%, var(--main-border));
  box-shadow: 0 9px 20px color-mix(in srgb, var(--brand-primary-900) 7%, transparent);
}

.modern-assign-selector :deep(.option.active) {
  border-color: color-mix(in srgb, var(--brand-primary-500) 45%, transparent);
  background: linear-gradient(135deg, var(--brand-primary-50), var(--surface-1));
  box-shadow:
    inset 0 0 0 1px color-mix(in srgb, var(--brand-primary-500) 8%, transparent),
    0 10px 22px color-mix(in srgb, var(--brand-primary-500) 10%, transparent);
}

.modern-assign-selector :deep(.option.active::after) {
  position: absolute;
  top: 0.55rem;
  inset-inline-end: 0.55rem;
  width: 0.45rem;
  height: 0.45rem;
  border-radius: 50%;
  background: var(--status-success);
  box-shadow: 0 0 0 4px var(--status-success-soft);
  content: '';
}

.modern-assign-selector :deep(.option label) {
  color: var(--text-soft);
  font-size: 0.9rem;
}

.serial-stage {
  display: grid;
  grid-template-columns: 1fr;
  align-items: center;
  gap: 1.5rem;
  background: linear-gradient(120deg, var(--surface-1) 50%, var(--brand-primary-50));
}

.serial-input {
  border-inline-start: 1px solid var(--main-border);
  padding-inline-start: 1.5rem;
}

.serial-input input {
  min-height: 3.15rem;
  border-color: color-mix(in srgb, var(--brand-primary-500) 20%, var(--main-border));
  background: var(--surface-1);
}

.serial-input input:focus {
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--brand-primary-500) 9%, transparent);
}

.details-stage {
  padding: 1.5rem;
}

.inspection-form,
.inspection-details {
  min-width: 0;
}

.inspection-details {
  width: 100%;
}

.field-panel,
.schedule-panel {
  min-width: 0;
  border: 1px solid color-mix(in srgb, var(--brand-primary-500) 11%, var(--main-border));
  border-radius: 1.15rem;
  background: var(--surface-2);
  padding: 1rem;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.field-panel:focus-within,
.schedule-panel:focus-within {
  border-color: color-mix(in srgb, var(--brand-primary-500) 38%, var(--main-border));
  box-shadow: 0 10px 25px color-mix(in srgb, var(--brand-primary-900) 6%, transparent);
}

.embedded-form-panel {
  min-width: 0;
  gap: 0.5rem;
}

.schedule-panel {
  background: linear-gradient(
    180deg,
    var(--surface-2),
    color-mix(in srgb, var(--surface-1) 95%, transparent)
  );
}

.add-dialog {
  display: inline-flex;
  width: auto;
  min-height: 1.75rem;
  align-items: center;
  margin-inline-end: 0.35rem;
  border: 1px solid color-mix(in srgb, var(--brand-primary-500) 22%, transparent);
  border-radius: 999px;
  background: var(--brand-primary-50);
  padding: 0.25rem 0.65rem;
  cursor: pointer;
  color: var(--brand-primary-500);
  text-decoration: none;
  font-family: 'Regular';
  font-size: 0.75rem;
  font-weight: 700;
  transition: 0.2s ease;
}

.add-dialog:hover {
  border-color: var(--brand-primary-500);
  background: var(--brand-primary-500);
  color: var(--text-on-brand);
  transform: translateY(-1px);
}

.add-dialog svg {
  width: 18px;
  height: 18px;
}

.required-field-message {
  margin-top: 0.4rem;
  border-inline-start: 3px solid var(--status-danger);
  border-radius: 0.45rem;
  background: var(--status-danger-soft);
  color: var(--status-danger);
  padding: 0.45rem 0.65rem;
  font-size: 0.82rem;
  font-weight: 700;
}

@media (max-width: 768px) {
  .inspection-form-shell {
    gap: 1rem;
  }

  .form-stage,
  .details-stage {
    border-radius: 1.15rem;
    padding: 1rem;
  }

  .modern-assign-selector :deep(.assign-to-contect) {
    grid-template-columns: 1fr;
  }

  .serial-stage {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .serial-input {
    border-top: 1px solid var(--main-border);
    border-inline-start: 0;
    padding-top: 1rem;
    padding-inline-start: 0;
  }

  .stage-status {
    display: none;
  }

  .field-panel,
  .schedule-panel {
    padding: 0.8rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .modern-assign-selector :deep(.option),
  .add-dialog {
    transition: none;
  }
}
</style>
