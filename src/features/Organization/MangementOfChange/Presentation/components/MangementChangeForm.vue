<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import MultiImagesInput from '@/shared/FormInputs/MultiImagesInput.vue'
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue'
import TitleInterface from '@/base/Data/Models/title_interface'
import { OpenWarningDilaog } from '@/base/Presentation/utils/OpenWarningDialog'
import DatePicker from 'primevue/datepicker'
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


  <div
    class="input-wrapper col-span-4 md:col-span-2"
    data-required-field="facilty"
  >
    <label for="facilty">Facility</label>
    <input
      id="facilty"
      placeholder="Enter The Facilty"
      v-model="facilty"
      class="input"
      required
    />
    <p v-if="requiredFieldErrors.facilty" class="required-field-message">
      {{ requiredFieldErrors.facilty }}
    </p>
  </div>

  <div
    class="input-wrapper col-span-4 md:col-span-2"
    data-required-field="area"
  >
    <label for="area">Area</label>
    <input
      id="area"
      placeholder="Enter The Area"
      v-model="area"
      class="input"
      required
    />
    <p v-if="requiredFieldErrors.area" class="required-field-message">
      {{ requiredFieldErrors.area }}
    </p>
  </div>

  <div
    class="input-wrapper col-span-4 md:col-span-2"
    data-required-field="date"
  >
    <label for="date">Date</label>
    <DatePicker
      v-model="date"
      placeholder="Add your date"
    />
    <p v-if="requiredFieldErrors.date" class="required-field-message">
      {{ requiredFieldErrors.date }}
    </p>
  </div>

  <div class="input-wrapper col-span-4 md:col-span-2">
    <CustomSelectInput
      :model-value="selectedChangeTypeMangement"
      :static-options="ChangeTypeMangementList"
      label="Change type"
      id="change-type"
      placeholder="Select change type"
      @update:model-value="changeType = $event.id"
    />
  </div>

  <div class="input-wrapper col-span-4 md:col-span-2">
    <CustomSelectInput
      :model-value="selectedChangeApprovalMangement"
      :static-options="ChangeApprovalMangementList"
      label="Change approval"
      id="change-approval"
      placeholder="Select approval"
      @update:model-value="status = $event.id"
    />
  </div>

  <div class="col-span-4 md:col-span-2 input-wrapper">
    <CustomSelectInput
      :modelValue="Selectedemployee"
      class="input"
      :controller="indexOrganizatoinEmployeeController"
      :params="indexOrganizatoinEmployeeParams"
      label="approval by (optional)"
      id="approval-by"
      placeholder="select your employee"
      @update:modelValue="setApprovalBy"
    />
  </div>

  <div class="col-span-4 md:col-span-2 input-wrapper">
    <CustomSelectInput
      :modelValue="Selectedmangement"
      class="input"
      :controller="indexMangementChangeTopicTypeController"
      :params="indexMangementChangeTopicTypeParams"
      label="management (optional)"
      id="management"
      placeholder="select your management"
      @update:modelValue="setManagement"
    />
  </div>

  <div
    v-if="selectedTopicType === 1"
    class="col-span-4 md:col-span-2 input-wrapper"
  >
    <CustomSelectInput
      :modelValue="Selectedemployeeid"
      class="input"
      :controller="indexOrganizatoinEmployeeController"
      :params="indexOrganizatoinEmployeeidParams"
      label="employee (optional)"
      id="project-employee"
      placeholder="select your employee"
      @update:modelValue="setEmployee"
    />
  </div>

  <div
    v-if="selectedTopicType === 2"
    class="col-span-4 md:col-span-2 input-wrapper"
  >
    <CustomSelectInput
      :modelValue="Selectedequipment"
      class="input"
      :controller="indexEquipmentController"
      :params="indexEquipmentParams"
      label="select equipment (optional)"
      id="equipment"
      placeholder="select your equipment"
      @update:modelValue="setequipment"
    />
  </div>

  <div
    v-if="selectedTopicType === 3"
    class="col-span-4 md:col-span-2 input-wrapper"
  >
    <label for="topic-text">Topic</label>
    <input
      id="topic-text"
      v-model="topicText"
      class="input"
      type="text"
      placeholder="Enter topic"
    />
  </div>
    <div
    :key="formKey"
    class="col-span-4 md:col-span-2"
  >
    <HandleFIlesUpload
      :label="$t('Risk assessment file')"
      accept=".pdf,.doc,.docx,.xls,.xlsx,image/*"
      :max-files="1"
      :multiple="false"
      className="input-file"
      @change="handleFilesChange"
    />
  </div>

  <div class="input-wrapper col-span-4 md:col-span-2">
    <label>Images</label>
    <MultiImagesInput
      accept="image/*"
      :initial-images="images.map((image) => image.file)"
      @update:images="setImages"
    />
  </div>
</template>

<style scoped>
:deep(.input-file) {
  border: 1px solid var(--brand-primary-100) !important;
  padding: 11px;
  border-radius: 20px !important;
  cursor: pointer;
  color: var(--text-strong);
  font-family: 'Light';
}

.required-field-message {
  margin-top: 0.35rem;
  color: var(--status-danger);
  font-size: 0.82rem;
  font-weight: 700;
}
</style>
