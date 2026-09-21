<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import MultiImagesInput from '@/shared/FormInputs/MultiImagesInput.vue'
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue'
import TitleInterface from '@/base/Data/Models/title_interface'
import { OpenWarningDilaog } from '@/base/Presentation/utils/OpenWarningDialog'
import DatePicker from 'primevue/datepicker'
import { Icon } from '@iconify/vue'
import { useRoute } from 'vue-router'
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

const emit = defineEmits<{
  (event: 'update:data', value: AddMangementChangeParams | EditMangementChangeParams): void
}>()
const props = defineProps<{ data?: MangementChangeModel }>()

const route = useRoute()
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
const equipmentId = ref<number | null>(null)
const topicText = ref('')
const Selectedmangement = ref<TitleInterface | null>(null)
const Selectedemployee = ref<TitleInterface | null>(null)
const Selectedemployeeid = ref<TitleInterface | null>(null)
const Selectedequipment = ref<TitleInterface | null>(null)
const requiredFieldErrors = ref<Record<string, string>>({})

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

const ChangeTypeMangementList = ref<TitleInterface[]>([
  new TitleInterface({
    id: ChangeTypeMangementEnum.temp,
    title: 'temporary',
  }),
  new TitleInterface({
    id: ChangeTypeMangementEnum.permenent,
    title: 'permanent',
  }),
])

const selectedChangeTypeMangement = computed(
  () =>
    ChangeTypeMangementList.value.find(
      (item) => item.id === changeType.value,
    ) ?? ChangeTypeMangementList.value[0],
)

const ChangeApprovalMangementList = ref<TitleInterface[]>([
  new TitleInterface({
    id: ChangeApprovalMangementEnum.approve,
    title: 'approve',
  }),
  new TitleInterface({
    id: ChangeApprovalMangementEnum.reject,
    title: 'reject',
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
  topicType.value,
  status.value,
  approvalBy.value,
  employeeId.value ?? undefined,
  topicType.value === MangementChangeTopicTypeEnum.equipment
    ? equipmentId.value ?? undefined
    : undefined,
  topicType.value === MangementChangeTopicTypeEnum.other
    ? topicText.value || undefined
    : undefined,
] as const)

const updateData = () => {
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
    Selectedemployee.value = null
    Selectedequipment.value = null
    approvalBy.value = null
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
  Selectedemployee.value = null
  Selectedequipment.value = null
  approvalBy.value = null
  equipmentId.value = null
  topicText.value = ''
}

const setEmployee = (data: TitleInterface | null) => {
  Selectedemployeeid.value = data
  employeeId.value = data?.id ?? null
}

const setApprovalBy = (data: TitleInterface | null) => {
  Selectedemployee.value = data
  approvalBy.value = data?.id ?? null
}

const setequipment = (data: TitleInterface | null) => {
  Selectedequipment.value = data
  equipmentId.value = data?.id ?? null
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

  const topicValue = (
    change.topicType ??
    change.management_change_topic_type_id ??
    MangementChangeTopicTypeEnum.employee
  ) as MangementChangeTopicTypeEnum

  topicType.value = topicValue
  selectedTopicType.value = Number(topicValue)
  status.value = (
    change.status ?? ChangeApprovalMangementEnum.approve
  ) as ChangeApprovalMangementEnum
  approvalBy.value = change.approval_by
  employeeId.value = change.management_change_topic_employee_id
  equipmentId.value = change.management_change_topic_equipment_id
  topicText.value = change.management_change_topic_text ?? ''

  Selectedmangement.value = change.management_change_topic_type_id
    ? new TitleInterface({
      id: change.management_change_topic_type_id,
      title:
        change.topicTitle ??
        `Management #${change.management_change_topic_type_id}`,
      type: Number(topicValue),
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
  Selectedemployeeid.value = change.management_change_topic_employee_id
    ? new TitleInterface({
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

  formKey.value++
  updateData()
}

watch(
  [
    riskAssismentFile,
    images,
    changerRequestId,
    facilty,
    area,
    date,
    changeType,
    topicType,
    status,
    approvalBy,
    employeeId,
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
    key: 'facilty',
    message: 'Facility Is Required',
    isMissing: () => !hasText(facilty.value),
  },
  {
    key: 'area',
    message: 'Area Is Required',
    isMissing: () => !hasText(area.value),
  },
  {
    key: 'date',
    message: 'Date Is Required',
    isMissing: () => !date.value,
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
        <h1>{{ $t('create management of change') }}</h1>
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
      <span class="management-change-section__number">01</span>
      <div>
        <h2>{{ $t('change request details') }}</h2>
        <p>{{ $t('Capture where and when the change will happen.') }}</p>
      </div>
    </div>

    <div class="management-change-fields">
      <div
        class="management-change-field input-wrapper"
        data-required-field="facilty"
      >
        <label for="facilty">
          {{ $t('facility') }}
          <span class="management-change-required-mark">*</span>
        </label>
        <input
          id="facilty"
          v-model="facilty"
          :placeholder="$t('Enter the facility')"
          class="input"
          required
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

      <div class="management-change-field input-wrapper">
        <CustomSelectInput
          :model-value="selectedChangeTypeMangement"
          :static-options="ChangeTypeMangementList"
          label="change type"
          id="change-type"
          :placeholder="$t('Select change type')"
          @update:model-value="changeType = $event.id"
        />
      </div>

      <div class="management-change-field input-wrapper">
        <CustomSelectInput
          :model-value="selectedChangeApprovalMangement"
          :static-options="ChangeApprovalMangementList"
          label="change approval"
          id="change-approval"
          :placeholder="$t('Select approval status')"
          @update:model-value="status = $event.id"
        />
      </div>

      <div class="management-change-field input-wrapper">
        <CustomSelectInput
          :model-value="Selectedemployee"
          :controller="indexOrganizatoinEmployeeController"
          :params="indexOrganizatoinEmployeeParams"
          label="approval by"
          id="approval-by"
          :placeholder="$t('Select an employee')"
          optional
          @update:model-value="setApprovalBy"
        />
      </div>
    </div>
  </section>

  <section class="management-change-section">
    <div class="management-change-section__heading">
      <span class="management-change-section__number">02</span>
      <div>
        <h2>{{ $t('change scope') }}</h2>
        <p>{{ $t('Define what is affected by this change.') }}</p>
      </div>
    </div>

    <div class="management-change-fields">
      <div class="management-change-field input-wrapper management-change-field--full">
        <CustomSelectInput
          :model-value="Selectedmangement"
          :controller="indexMangementChangeTopicTypeController"
          :params="indexMangementChangeTopicTypeParams"
          label="management"
          id="management"
          :placeholder="$t('Select a management area')"
          optional
          @update:model-value="setManagement"
        />
        <p class="management-change-field__hint">
          {{ $t('Choose a management topic to show the related field.') }}
        </p>
      </div>

      <div
        v-if="selectedTopicType === 1"
        class="management-change-field input-wrapper"
      >
        <UpdatedCustomInputSelect
          :model-value="Selectedemployeeid"
          :controller="indexOrganizatoinEmployeeController"
          :params="indexOrganizatoinEmployeeidParams"
          label="employee"
          id="project-employee"
          :placeholder="$t('Select an employee')"
          optional
          @update:model-value="setEmployee"
        />
      </div>

      <div
        v-if="selectedTopicType === 2"
        class="management-change-field input-wrapper"
      >
        <UpdatedCustomInputSelect
          :model-value="Selectedequipment"
          :controller="indexEquipmentController"
          :params="indexEquipmentParams"
          label="equipment"
          id="equipment"
          :placeholder="$t('Select equipment')"
          optional
          @update:model-value="setequipment"
        />
      </div>

      <div
        v-if="selectedTopicType === 3"
        class="management-change-field input-wrapper"
      >
        <label for="topic-text">
          {{ $t('topic') }}
          <span class="management-change-optional-mark">({{ $t('optional') }})</span>
        </label>
        <input
          id="topic-text"
          v-model="topicText"
          class="input"
          type="text"
          :placeholder="$t('Enter the topic')"
        />
      </div>
    </div>
  </section>

  <section class="management-change-section">
    <div class="management-change-section__heading">
      <span class="management-change-section__number">03</span>
      <div>
        <h2>{{ $t('supporting documents') }}</h2>
        <p>{{ $t('Attach the risk assessment and any supporting images.') }}</p>
      </div>
    </div>

    <div class="management-change-fields management-change-fields--attachments">
      <div :key="formKey" class="management-change-upload-field">
        <HandleFIlesUpload
          :label="$t('risk assessment file')"
          accept=".pdf,.doc,.docx,.xls,.xlsx,image/*"
          :max-files="1"
          :multiple="false"
          class-name="input-file management-change-file-input"
          @change="handleFilesChange"
        />
      </div>

      <div class="management-change-upload-field input-wrapper">
        <label>{{ $t('images') }}</label>
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
/* :deep(.p-datepicker-dropdown) {
   border-color: var(--management-change-border) !important;
}
.management-change-form .management-change-field .p-datepicker-dropdown {
  border-color: var(--management-change-border) !important;
  background: transparent !important;
  color: var(--brand-primary-500) !important;
} */
.required-field-message {
  margin-top: 0.35rem;
  color: var(--status-danger);
  font-size: 0.82rem;
  font-weight: 700;
}
</style>
