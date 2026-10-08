<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import MultiImagesInput from '@/shared/FormInputs/MultiImagesInput.vue'
import TitleInterface from '@/base/Data/Models/title_interface'
import { OpenWarningDilaog } from '@/base/Presentation/utils/OpenWarningDialog'
import DatePicker from 'primevue/datepicker'
import { Icon } from '@iconify/vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import IndexOrganizatoinEmployeeController from '@/features/Organization/OrganizationEmployee/Presentation/controllers/indexOrganizatoinEmployeeController'
import IndexOrganizatoinEmployeeParams from '@/features/Organization/OrganizationEmployee/Core/params/indexOrganizatoinEmployeeParams'
import IndexEquipmentController from '@/features/setting/Equipment/Presentation/controllers/indexEquipmentController'
import IndexEquipmentParams from '@/features/setting/Equipment/Core/params/indexEquipmentParams'
import HandleFIlesUpload, {
  type UploadedFile,
} from '@/features/Organization/OrganizationEmployee/Presentation/supcomponents/HandleFIlesUpload.vue'
import {
  filesToBase64,
  type FileBase64,
} from '@/base/Presentation/utils/file_to_base_64'
import { MangementChangeTopicTypeEnum } from '@/features/Organization/MangementChangeTopicType/Core/Core/MangementChangeTopicTypeEnum'
import IndexMangementChangeTopicTypeParams from '@/features/Organization/MangementChangeTopicType/Core/params/indexMangementChangeTopicTypeParams'
import IndexMangementChangeTopicTypeController from '@/features/Organization/MangementChangeTopicType/Presentation/controllers/indexMangementChangeTopicTypeController'
import { ChangeTypeMangementEnum } from '../../Core/Core/ChangeTypeEnum'
import { ChangeApprovalMangementEnum } from '../../Core/Core/ChangeApprovalEnum'
import AddMangementChangeParams from '../../Core/params/addMangementChangeParams'
import EditMangementChangeParams from '../../Core/params/editMangementChangeParams'
import type MangementChangeModel from '../../Data/models/MangementChangeModel'
import UpdatedCustomInputSelect from '@/shared/FormInputs/UpdatedCustomInputSelect.vue'
import { useProjectAppStatusStore } from '@/stores/ProjectStatus'
import FieldHelpIcon from '@/shared/FormInputs/FieldHelpIcon.vue'

const emit = defineEmits<{
  (event: 'update:data', value: AddMangementChangeParams | EditMangementChangeParams): void
}>()
const props = defineProps<{ data?: MangementChangeModel }>()

const route = useRoute()
const { t } = useI18n()
const projectId = Number(route.query.project_id || route.params.id)
const formKey = ref(0)

const riskAssismentFile = ref<string | null>(null)
const images = ref<{ alt: string; file: string }[]>([])
const changerRequestId = ref<number | null>(null)
const facilty = ref('')
const area = ref('')
const date = ref<Date | null>(new Date())
const changeType = ref(ChangeTypeMangementEnum.temp)
const topicType = ref<MangementChangeTopicTypeEnum>(
  MangementChangeTopicTypeEnum.employee,
)
const selectedTopicType = ref<number | null>(null)
const status = ref(ChangeApprovalMangementEnum.approve)
const approvalBy = ref<number | null>(null)
const employeeId = ref<number | null>(null)
const initiatorEmployeeId = ref<number | null>(null)
const equipmentId = ref<number | null>(null)
const topicText = ref('')
const Selectedmangement = ref<TitleInterface | null>(null)
const Selectedemployee = ref<TitleInterface | null>(null)
const Selectedemployeeid = ref<TitleInterface | null>(null)
const Selectedinitiatoremployeeid = ref<TitleInterface | null>(null)
const Selectedequipment = ref<TitleInterface | null>(null)
const requiredFieldErrors = ref<Record<string, string>>({})
const error = ref('')
const serial = ref('')
const statusStore = useProjectAppStatusStore()
const serialIsAuto = computed(() => statusStore.isSerialNumberAuto())

const indexMangementChangeTopicTypeController =
  IndexMangementChangeTopicTypeController.getInstance()
const indexMangementChangeTopicTypeParams =
  new IndexMangementChangeTopicTypeParams('', 0, 0, 0)

const indexEquipmentController = IndexEquipmentController.getInstance()
const indexEquipmentParams = new IndexEquipmentParams('', 0, 0, 0)

const indexOrganizatoinEmployeeController =
  IndexOrganizatoinEmployeeController.getInstance()
const indexOrganizatoinEmployeeParams =
  new IndexOrganizatoinEmployeeParams('', 0, 0, 0)
  
const indexOrganizatoinEmployeeidParams =
  new IndexOrganizatoinEmployeeParams(
    '',
    0,
    0,
    0,
    null,
    undefined,
    undefined,
    undefined,
    undefined,
    false,
    Number.isInteger(projectId) && projectId > 0
      ? projectId
      : null,
  )

const ChangeTypeMangementList = computed<TitleInterface[]>(() => [
  new TitleInterface({
    id: ChangeTypeMangementEnum.temp,
    title: t('temporary'),
  }),
  new TitleInterface({
    id: ChangeTypeMangementEnum.permenent,
    title: t('permanent'),
  }),
])

const selectedChangeTypeMangement = computed(
  () =>
    ChangeTypeMangementList.value.find(
      (item) => item.id === changeType.value,
    ) ?? ChangeTypeMangementList.value[0],
)

const ChangeApprovalMangementList = computed<TitleInterface[]>(() => [
  new TitleInterface({
    id: ChangeApprovalMangementEnum.approve,
    title: t('approve'),
  }),
  new TitleInterface({
    id: ChangeApprovalMangementEnum.reject,
    title: t('reject'),
  }),
])

const selectedChangeApprovalMangement = computed(
  () =>
    ChangeApprovalMangementList.value.find(
      (item) => item.id === status.value,
    ) ?? ChangeApprovalMangementList.value[0],
)

const formParams = computed(() => [
  riskAssismentFile.value,
  images.value.map((image) => image.file),
  changerRequestId.value,
  facilty.value,
  area.value,
  date.value,
  changeType.value,
  Number(Selectedmangement.value?.id ?? 0),
  status.value,
  approvalBy.value,
  employeeId.value ?? undefined,
  topicType.value === MangementChangeTopicTypeEnum.equipment
    ? equipmentId.value ?? undefined
    : undefined,
  topicType.value === MangementChangeTopicTypeEnum.other
    ? topicText.value || undefined
    : undefined,
  initiatorEmployeeId.value ?? undefined,
  serial.value.trim(),
] as const)

const updateData = () => {
   error.value = ''
   if (!serialIsAuto.value && !serial.value.trim()) {
    error.value = 'Serial number is required when manual serial numbering is enabled.'
    return
  }
  emit(
    'update:data',
    props.data?.id
      ? new EditMangementChangeParams(
        props.data.id,
        ...formParams.value,
      )
      : new AddMangementChangeParams(...formParams.value),
  )
}

const setImages = async (files: File[]) => {
  const base64Files = await Promise.all(files.map(filesToBase64))
  images.value = base64Files.flat() as FileBase64[]
}

const handleFilesChange = (files: UploadedFile[]) => {
  const file = files?.[0]
  riskAssismentFile.value = file?.file ? file.base64 : null
}

const setManagement = (data: TitleInterface | null) => {
  Selectedmangement.value = data

  if (!data) {
    selectedTopicType.value = null
    topicType.value = MangementChangeTopicTypeEnum.employee
    Selectedemployeeid.value = null
    Selectedequipment.value = null
    employeeId.value = null
    equipmentId.value = null
    topicText.value = ''
    return
  }

  selectedTopicType.value =
    data.type !== null && data.type !== undefined
      ? Number(data.type)
      : null
  topicType.value =
    selectedTopicType.value as MangementChangeTopicTypeEnum
  Selectedemployeeid.value = null
  Selectedequipment.value = null
  employeeId.value = null
  equipmentId.value = null
  topicText.value = ''
}

const setinitiatorEmployee = (data: TitleInterface | TitleInterface[] | null) => {
  const employee = Array.isArray(data) ? data[0] ?? null : data
  Selectedinitiatoremployeeid.value = employee
  initiatorEmployeeId.value = employee?.id ?? null
}
const setEmployee = (data: TitleInterface | TitleInterface[] | null) => {
  const employee = Array.isArray(data) ? data[0] ?? null : data
  Selectedemployeeid.value = employee
  employeeId.value = employee?.id ?? null
}

const setApprovalBy = (data: TitleInterface | null) => {
  Selectedemployee.value = data
  approvalBy.value = data?.id ?? null
}

const setequipment = (data: TitleInterface | TitleInterface[] | null) => {
  const equipment = Array.isArray(data) ? data[0] ?? null : data
  Selectedequipment.value = equipment
  equipmentId.value = equipment?.id ?? null
}

const setFormData = (change?: MangementChangeModel) => {
  
  if (!change) {
    updateData()
    return
  }

  riskAssismentFile.value = change.risk_assisment_file ?? null
  images.value = change.attachments.map((file) => ({
    alt: file,
    file,
  }))
  changerRequestId.value = change.changer_request_id
  serial.value = change.serial ?? ''
  facilty.value = change.facilty
  area.value = change.area

  if (change.date) {
    const parsedDate = new Date(change.date)
    date.value = Number.isNaN(parsedDate.getTime())
      ? null
      : parsedDate
  } else {
    date.value = null
  }

  changeType.value = (
    change.change_type ?? ChangeTypeMangementEnum.temp
  ) as ChangeTypeMangementEnum

  const hasManagementTopic = Boolean(change.management_change_topic_type_id)
  const topicValue = hasManagementTopic
    ? ((change.topicType ?? MangementChangeTopicTypeEnum.employee) as MangementChangeTopicTypeEnum)
    : null

  topicType.value = topicValue ?? MangementChangeTopicTypeEnum.employee
  selectedTopicType.value = topicValue ? Number(topicValue) : null
  status.value = (
    change.status ?? ChangeApprovalMangementEnum.approve
  ) as ChangeApprovalMangementEnum
  approvalBy.value = change.approval_by
  employeeId.value = change.management_change_topic_employee_id
  initiatorEmployeeId.value = change.initiatore_employee_id
  equipmentId.value = change.management_change_topic_equipment_id
  topicText.value = change.management_change_topic_text ?? ''

  Selectedmangement.value = change.management_change_topic_type_id
    ? new TitleInterface({
      id: change.management_change_topic_type_id,
      title:
        change.topicTitle ??
        `Management #${change.management_change_topic_type_id}`,
      type: Number(topicValue ?? MangementChangeTopicTypeEnum.employee),
    })
    : null
  Selectedemployee.value = change.approval_by
    ? new TitleInterface({
      id: change.approval_by,
      title:
        change.approvalByName ??
        `Employee #${change.approval_by}`,
    })
    : null
  Selectedemployeeid.value = change.management_change_topic_employee_id  ? new TitleInterface({
      id: change.management_change_topic_employee_id,
      title:
        change.employeeName ??
        `Employee #${change.management_change_topic_employee_id}`,
    })
    : null
  Selectedequipment.value = change.management_change_topic_equipment_id
    ? new TitleInterface({
      id: change.management_change_topic_equipment_id,
      title:
        change.equipmentTitle ??
        `Equipment #${change.management_change_topic_equipment_id}`,
    })
    : null

      Selectedinitiatoremployeeid.value = change.initiatore_employee_id  ? new TitleInterface({
      id: change.initiatore_employee_id,
      title:
        change.initiatorEmployeeName ??
        `Employee #${change.initiatore_employee_id}`,
    })
    : null

  formKey.value++
  updateData()
}

watch(
  [
    riskAssismentFile,
    images,
    changerRequestId,
    serial,
    facilty,
    area,
    date,
    changeType,
    topicType,
    status,
    approvalBy,
    employeeId,
    initiatorEmployeeId,
    equipmentId,
    topicText,
  ],
  updateData,
  { deep: true },
)

watch(
  () => props.data,
  (data) => setFormData(data),
  { immediate: true },
)

const hasText = (value: unknown) => String(value ?? '').trim().length > 0
const requiredFields = computed(() => [
  {
    key: 'initiatorEmployee',
    message: t('Change Initiator Is Required'),
    isMissing: () => !initiatorEmployeeId.value,
  },
  {
    key: 'area',
    message: t('Area Is Required'),
    isMissing: () => !hasText(area.value),
  },
  {
    key: 'date',
    message: t('Date Is Required'),
    isMissing: () => !date.value,
  },
  {
    key: 'changeType',
    message: t('Change Type Is Required'),
    isMissing: () => changeType.value === null || changeType.value === undefined,
  },
  {
    key: 'management',
    message: t('Proposed Change Is Required'),
    isMissing: () => !Selectedmangement.value,
  },
  {
    key: 'topicEmployee',
    message: t('Employee Is Required'),
    isMissing: () =>
      selectedTopicType.value === MangementChangeTopicTypeEnum.employee && !employeeId.value,
  },
  {
    key: 'topicEquipment',
    message: t('Equipment Is Required'),
    isMissing: () =>
      selectedTopicType.value === MangementChangeTopicTypeEnum.equipment && !equipmentId.value,
  },
  {
    key: 'topicText',
    message: t('Topic Is Required'),
    isMissing: () =>
      selectedTopicType.value === MangementChangeTopicTypeEnum.other && !hasText(topicText.value),
  },
  {
    key: 'riskAssessmentDocument',
    message: t('Risk Assessment Document Is Required'),
    isMissing: () => !riskAssismentFile.value,
  },
  {
    key: 'changeApproval',
    message: t('Change Approval Is Required'),
    isMissing: () => status.value === null || status.value === undefined,
  },
  {
    key: 'approvalBy',
    message: t('Approved / Rejected By Is Required'),
    isMissing: () => !approvalBy.value,
  },
])

const validateRequiredFields = async () => {
  const missedFields = requiredFields.value.filter((field) => field.isMissing())
  requiredFieldErrors.value = Object.fromEntries(
    missedFields.map((field) => [field.key, field.message]),
  )
  if (!missedFields.length) return true

  new OpenWarningDilaog(missedFields[0].message).openDialog()
  await nextTick()
  document
    .querySelector<HTMLElement>(`[data-required-field="${missedFields[0].key}"]`)
    ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  return false
}

defineExpose({ validateRequiredFields })
onMounted(updateData)
</script>

<template>
  <div class="management-change-form__hero">
    <div class="management-change-form__hero-copy">
      <span class="management-change-form__hero-icon" aria-hidden="true">
        <Icon icon="uil:exchange" />
      </span>
      <div>
        <p class="management-change-form__eyebrow">
          {{ $t('Management of change') }}
        </p>
        <h1>{{ $t('management of change') }}</h1>
        <p class="management-change-form__subtitle">
          {{ $t('Record the change, its scope, and the approvals needed before work starts.') }}
        </p>
      </div>
    </div>
    <div class="management-change-form__required-note">
      <span class="management-change-form__required-dot">*</span>
      {{ $t('required fields') }}
    </div>
  </div>

  <section class="management-change-section">
    <div class="management-change-section__heading">
      <!-- <span class="management-change-section__number">01</span> -->
      <div>
        <h2>{{ $t('New Change Request') }}</h2>
        <p>{{ $t('Create the change request for the current project.') }}</p>
      </div>
    </div>

    <div class="management-change-fields">

      <div class="input-wrapper  drill-serial">
        <div class="field-label"><label for="management_change_serial">{{ $t('serial_number') }}</label><FieldHelpIcon :text="serialIsAuto ? 'The serial will be generated automatically.' : 'Enter the serial number.'" /></div>
        <input id="management_change_serial" v-model="serial" class="input" type="text" :disabled="serialIsAuto" :placeholder="serialIsAuto ? $t('Auto-generated') : $t('Enter serial number')" />
        <small v-if="serialIsAuto">{{ $t('Automatic serial numbering is enabled') }}</small>
      </div>
       <div
        class="management-change-field input-wrapper"
        data-required-field="initiatorEmployee"
      >
        <UpdatedCustomInputSelect
          :model-value="Selectedinitiatoremployeeid"
          :controller="indexOrganizatoinEmployeeController"
          :params="indexOrganizatoinEmployeeidParams"
          label="Change Initiator"
          id="initiator-employee"
          :placeholder="$t('Select an initiator employee')"
          required
          @update:model-value="setinitiatorEmployee"
        />
       
        <p v-if="requiredFieldErrors.initiatorEmployee" class="required-field-message">
          {{ requiredFieldErrors.initiatorEmployee }}
        </p>
      </div>

      <div
        class="management-change-field input-wrapper"
        data-required-field="facilty"
      >
        <label for="facilty">
          {{ $t('facility') }}
          <!-- <span class="management-change-required-mark">*</span> -->
        </label>
        <input
          id="facilty"
          v-model="facilty"
          :placeholder="$t('Enter the facility')"
          class="input"
          
        />
        <p v-if="requiredFieldErrors.facilty" class="required-field-message">
          {{ requiredFieldErrors.facilty }}
        </p>
      </div>

      <div
        class="management-change-field input-wrapper"
        data-required-field="area"
      >
        <label for="area">
          {{ $t('area') }}
          <span class="management-change-required-mark">*</span>
        </label>
        <input
          id="area"
          v-model="area"
          :placeholder="$t('Enter the area')"
          class="input"
          required
        />
        <p v-if="requiredFieldErrors.area" class="required-field-message">
          {{ requiredFieldErrors.area }}
        </p>
      </div>

      <div
        class="management-change-field input-wrapper"
        data-required-field="date"
      >
        <label for="date">
          {{ $t('date') }}
          <span class="management-change-required-mark">*</span>
        </label>
        <DatePicker
          v-model="date"
          input-id="date"
          :placeholder="$t('Select the date')"
          show-icon
        />
        <p v-if="requiredFieldErrors.date" class="required-field-message">
          {{ requiredFieldErrors.date }}
        </p>
      </div>

     

       <div class="management-change-field input-wrapper" data-required-field="changeType">
          <UpdatedCustomInputSelect
            :model-value="selectedChangeTypeMangement"
            :static-options="ChangeTypeMangementList"
            label="change type"
            id="change-type"
            :placeholder="$t('Select change type')"
            required
            @update:model-value="changeType = $event.id"
          />
          <p v-if="requiredFieldErrors.changeType" class="required-field-message">
            {{ requiredFieldErrors.changeType }}
          </p>
        </div>
   
      
      <div
        class="management-change-field input-wrapper management-change-field--full"
        data-required-field="management"
      >
        <UpdatedCustomInputSelect
          :model-value="Selectedmangement"
          :controller="indexMangementChangeTopicTypeController"
          :params="indexMangementChangeTopicTypeParams"
          label="Description of Proposed Change/Modification"
          id="management"
          :placeholder="$t('Select Proposed Change/Modification')"
          required
          @update:model-value="setManagement"
        />
        <p v-if="requiredFieldErrors.management" class="required-field-message">
          {{ requiredFieldErrors.management }}
        </p>
        <p class="management-change-field__hint">
          {{ $t('Choose a management topic to show the related field.') }}
        </p>
      </div>

      <div
        v-if="selectedTopicType === 1"
        class="management-change-field input-wrapper"
        data-required-field="topicEmployee"
      >
        <UpdatedCustomInputSelect
          :model-value="Selectedemployeeid"
          :controller="indexOrganizatoinEmployeeController"
          :params="indexOrganizatoinEmployeeidParams"
          label="employee"
          id="project-employee"
          :placeholder="$t('Select an employee')"
          required
          @update:model-value="setEmployee"
        />
       
        <p v-if="requiredFieldErrors.topicEmployee" class="required-field-message">
          {{ requiredFieldErrors.topicEmployee }}
        </p>
      </div>

      <div
        v-if="selectedTopicType === 2"
        class="management-change-field input-wrapper"
        data-required-field="topicEquipment"
      >
        <UpdatedCustomInputSelect
          :model-value="Selectedequipment"
          :controller="indexEquipmentController"
          :params="indexEquipmentParams"
          label="equipment"
          id="equipment"
          :placeholder="$t('Select equipment')"
          required
          @update:model-value="setequipment"
        />
        <p v-if="requiredFieldErrors.topicEquipment" class="required-field-message">
          {{ requiredFieldErrors.topicEquipment }}
        </p>
      </div>

      <div
        v-if="selectedTopicType === 3"
        class="management-change-field input-wrapper"
        data-required-field="topicText"
      >
        <label for="topic-text">
          {{ $t('topic') }}
          <span class="management-change-required-mark">*</span>
        </label>
        <input
          id="topic-text"
          v-model="topicText"
          class="input"
          type="text"
          :placeholder="$t('Enter the topic')"
          required
        />
        <p v-if="requiredFieldErrors.topicText" class="required-field-message">
          {{ requiredFieldErrors.topicText }}
        </p>
      </div>
    </div>
     
   
  </section>

  <section class="management-change-section">
     <div class="management-change-fields">

      
  
        <div class="management-change-field input-wrapper" data-required-field="changeApproval">
          <UpdatedCustomInputSelect
            :model-value="selectedChangeApprovalMangement"
            :static-options="ChangeApprovalMangementList"
            label="change approval"
            id="change-approval"
            :placeholder="$t('Select approval status')"
            required
            @update:model-value="status = $event.id"
          />
          
          <p v-if="requiredFieldErrors.changeApproval" class="required-field-message">
            {{ requiredFieldErrors.changeApproval }}
          </p>
        </div>
           <div class="management-change-field input-wrapper" data-required-field="approvalBy">
        <UpdatedCustomInputSelect
          :model-value="Selectedemployee"
          :controller="indexOrganizatoinEmployeeController"
          :params="indexOrganizatoinEmployeeParams"
          label="Approved / Rejected By "
          id="approval-by"
          :placeholder="$t('Select an employee')"
          required
          @update:model-value="setApprovalBy"
        />
     
        <p v-if="requiredFieldErrors.approvalBy" class="required-field-message">
          {{ requiredFieldErrors.approvalBy }}
        </p>
      </div>
     </div>
    <!-- <div class="management-change-section__heading">
      <span class="management-change-section__number">02</span>
      <div>
        <h2>{{ $t('change scope') }}</h2>
        <p>{{ $t('Define what is affected by this change.') }}</p>
      </div>
    </div> -->

    <!-- <div class="management-change-fields">
      <div
        class="management-change-field input-wrapper management-change-field--full"
        data-required-field="management"
      >
        <UpdatedCustomInputSelect
          :model-value="Selectedmangement"
          :controller="indexMangementChangeTopicTypeController"
          :params="indexMangementChangeTopicTypeParams"
          label="Description of Proposed Change/Modification"
          id="management"
          :placeholder="$t('Select Proposed Change/Modification')"
          required
          @update:model-value="setManagement"
        />
        <p v-if="requiredFieldErrors.management" class="required-field-message">
          {{ requiredFieldErrors.management }}
        </p>
        <p class="management-change-field__hint">
          {{ $t('Choose a management topic to show the related field.') }}
        </p>
      </div>

      <div
        v-if="selectedTopicType === 1"
        class="management-change-field input-wrapper"
        data-required-field="topicEmployee"
      >
        <UpdatedCustomInputSelect
          :model-value="Selectedemployeeid"
          :controller="indexOrganizatoinEmployeeController"
          :params="indexOrganizatoinEmployeeidParams"
          label="employee"
          id="project-employee"
          :placeholder="$t('Select an employee')"
          required
          @update:model-value="setEmployee"
        />
       
        <p v-if="requiredFieldErrors.topicEmployee" class="required-field-message">
          {{ requiredFieldErrors.topicEmployee }}
        </p>
      </div>

      <div
        v-if="selectedTopicType === 2"
        class="management-change-field input-wrapper"
        data-required-field="topicEquipment"
      >
        <UpdatedCustomInputSelect
          :model-value="Selectedequipment"
          :controller="indexEquipmentController"
          :params="indexEquipmentParams"
          label="equipment"
          id="equipment"
          :placeholder="$t('Select equipment')"
          required
          @update:model-value="setequipment"
        />
        <p v-if="requiredFieldErrors.topicEquipment" class="required-field-message">
          {{ requiredFieldErrors.topicEquipment }}
        </p>
      </div>

      <div
        v-if="selectedTopicType === 3"
        class="management-change-field input-wrapper"
        data-required-field="topicText"
      >
        <label for="topic-text">
          {{ $t('topic') }}
          <span class="management-change-required-mark">*</span>
        </label>
        <input
          id="topic-text"
          v-model="topicText"
          class="input"
          type="text"
          :placeholder="$t('Enter the topic')"
          required
        />
        <p v-if="requiredFieldErrors.topicText" class="required-field-message">
          {{ requiredFieldErrors.topicText }}
        </p>
      </div>
    </div> -->
  </section>

  <section class="management-change-section">
    <!-- <div class="management-change-section__heading">
      <span class="management-change-section__number">03</span>
      <div>
        <h2>{{ $t('supporting documents') }}</h2>
        <p>{{ $t('Attach the risk assessment and any supporting images.') }}</p>
      </div>
    </div> -->

    <div class="management-change-fields management-change-fields--attachments management-change-fields-full">
      <div
        :key="formKey"
        class="management-change-upload-field"
        data-required-field="riskAssessmentDocument"
      >
        <HandleFIlesUpload
          :label="$t('Risk Assessment Document ')"
          accept=".pdf,.doc,.docx,.xls,.xlsx,image/*"
          :max-files="1"
          :multiple="false"
          :file="riskAssismentFile ?? undefined"
          required
          class-name="input-file management-change-file-input"
          @change="handleFilesChange"
        />
        <p v-if="requiredFieldErrors.riskAssessmentDocument" class="required-field-message">
          {{ requiredFieldErrors.riskAssessmentDocument }}
        </p>
      </div>

      <div class="management-change-upload-field input-wrapper">
        <label>{{ $t('Additional Documents') }}</label>
        <MultiImagesInput
          accept="image/*"
          :initial-images="images.map((image) => image.file)"
          @update:images="setImages"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.management-change-fields-full{
  grid-template-columns: repeat(1, minmax(0, 1fr));
}
/* :deep(.p-datepicker-dropdown) {
   border-color: var(--management-change-border) !important;
}
.management-change-form .management-change-field .p-datepicker-dropdown {
  border-color: var(--management-change-border) !important;
  background: transparent !important;
  color: var(--brand-primary-500) !important;
} */
 .drill-serial #management_change_serial{
  min-height: 48px;
  border: 1px solid var(--management-change-border) !important;
  border-radius: 12px !important;
  background: var(--management-change-soft) !important;
  color: var(--text-strong) !important;
  box-shadow: none !important;
 }
.required-field-message {
  margin-top: 0.35rem;
  color: var(--status-danger);
  font-size: 0.82rem;
  font-weight: 700;
}
</style>
