<script setup lang="ts">
import { computed, ref } from 'vue'
import MultiImagesInput from '@/shared/FormInputs/MultiImagesInput.vue'
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue'
import TitleInterface from '@/base/Data/Models/title_interface'
import AddMangementChangeParams from '../../Core/params/addMangementChangeParams'
import AddMangementChangeController from '../controllers/addMangementChangeController'
import { MangementChangeTopicTypeEnum } from '../../Core/Core/MangementChangeTopicTypeEnum'
import { ChangeTypeMangementEnum } from '../../Core/Core/ChangeTypeEnum'
import { ChangeApprovalMangementEnum } from '../../Core/Core/ChangeApprovalEnum'
import IndexMangementChangeTopicTypeParams from '../../Core/params/indexMangementChangeTopicTypeParams'
import IndexMangementChangeTopicTypeController from '../controllers/indexMangementChangeTopicTypeController'
import IndexOrganizatoinEmployeeController from '@/features/Organization/OrganizationEmployee/Presentation/controllers/indexOrganizatoinEmployeeController'
import IndexOrganizatoinEmployeeParams from '@/features/Organization/OrganizationEmployee/Core/params/indexOrganizatoinEmployeeParams'
import DatePicker from 'primevue/datepicker'
import { useRoute } from 'vue-router'
import IndexEquipmentController from '@/features/setting/Equipment/Presentation/controllers/indexEquipmentController'
import IndexEquipmentParams from '@/features/setting/Equipment/Core/params/indexEquipmentParams'
import HandleFIlesUpload, {
  type UploadedFile,
} from '@/features/Organization/OrganizationEmployee/Presentation/supcomponents/HandleFIlesUpload.vue'
import { filesToBase64 } from '@/base/Presentation/utils/file_to_base_64'

const riskAssismentFile = ref<string | null>(null)
const images = ref<{alt:string,file:string}[]>([])
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
const errorMessage = ref('')
const successMessage = ref('')
const Selectedmangement = ref<TitleInterface | null>(null)
const Selectedemployee = ref<TitleInterface | null>(null)
const Selectedemployeeid = ref<TitleInterface | null>(null)
const Selectedequipment = ref<TitleInterface | null>(null)
const route = useRoute()
const projectId = Number(route.query.project_id)

const indexMangementChangeTopicTypeController =
  IndexMangementChangeTopicTypeController.getInstance()

const indexMangementChangeTopicTypeParams =
  new IndexMangementChangeTopicTypeParams(
    '',
    1,
    10000,
    1,
  )


const indexEquipmentController =
  IndexEquipmentController.getInstance()

const indexEquipmentParams =
  new IndexEquipmentParams(
    '',
    1,
    10000,
    1,
  )


const indexOrganizatoinEmployeeController =
  IndexOrganizatoinEmployeeController.getInstance()

const indexOrganizatoinEmployeeParams =
  new IndexOrganizatoinEmployeeParams(
    '',
    1,
    10,
    1,
  )

const indexOrganizatoinEmployeeidParams =
  new IndexOrganizatoinEmployeeParams(
    '',
    1,
    10,
    1,
    null,
    null,
    false,
    null,
    null,
    false,
    Number.isInteger(projectId) && projectId > 0
      ? projectId
      : null,
  )
const formKey = ref(0)
const resetForm = () => {
  riskAssismentFile.value = null
  images.value = []

  changerRequestId.value = null

  facilty.value = ''
  area.value = ''

  date.value = new Date()

  changeType.value = ChangeTypeMangementEnum.temp

  topicType.value = MangementChangeTopicTypeEnum.employee
  selectedTopicType.value = null

  status.value = ChangeApprovalMangementEnum.approve

  approvalBy.value = null
  employeeId.value = null
  equipmentId.value = null

  topicText.value = ''

  Selectedmangement.value = null
  Selectedemployee.value = null
  Selectedemployeeid.value = null
  Selectedequipment.value = null

  // Clear file inputs/components
  formKey.value++
}

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


const setImages = async(files: File[]) => {
  const base64Files = await Promise.all(files.map(filesToBase64));
  // console.log(base64Files , "base64Files");
  images.value = base64Files
}


const handleFilesChange = (files: UploadedFile[]) => {
  console.log('FILES:', files)

  const file = files?.[0]

  if (!file?.file) {
    riskAssismentFile.value = null
    return
  }

  riskAssismentFile.value = file.base64 
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

const submit = async () => {
  errorMessage.value = ''
  successMessage.value = ''

  const params = new AddMangementChangeParams(
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
  )

  const controller =
    AddMangementChangeController.getInstance()

  await controller.addMangementChange(params)

  if (controller.isDataSuccess()) {
    successMessage.value =
      'Management change created successfully.'

    resetForm()
  } else {
    errorMessage.value =
      'Unable to create management change.'
  }
}
</script>

<template>
  <form
  :key="formKey"
  class="grid grid-cols-1 gap-4 md:grid-cols-4"
  @submit.prevent="submit"
>

    <!-- Risk Assessment File -->
    <div class="col-span-4 md:col-span-2">
      <HandleFIlesUpload
        :label="$t('Risk assessment file')"
        accept=".pdf,.doc,.docx,.xls,.xlsx,image/*"
        :max-files="1"
        :multiple="false"
        className="input-file"
        @change="handleFilesChange"
      />
    </div>

    <!-- Images -->
    <div class="input-wrapper col-span-4 md:col-span-2">
      <label>
        Images
      </label>

      <MultiImagesInput
        accept="image/*"
        :initial-images="[]"
        @update:images="setImages"
      />
    </div>

    <!-- Facility -->
    <div class="input-wrapper col-span-4 md:col-span-2">
      <label for="facilty">
        Facility
      </label>

      <input
        id="facilty"
        v-model="facilty"
        class="input"
        required
      />
    </div>

    <!-- Area -->
    <div class="input-wrapper col-span-4 md:col-span-2">
      <label for="area">
        Area
      </label>

      <input
        id="area"
        v-model="area"
        class="input"
        required
      />
    </div>

    <!-- Date -->
    <div class="input-wrapper col-span-4 md:col-span-2">
      <label for="date">
        Date
      </label>

      <DatePicker
        v-model="date"
        placeholder="Add your date"
      />
    </div>

    <!-- Change Type -->
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

    <!-- Change Approval -->
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

    <!-- Project Employee -->
    <div
      class="col-span-4 md:col-span-2 input-wrapper"
    >
      <CustomSelectInput
        :modelValue="Selectedemployee"
        class="input"
        :controller="indexOrganizatoinEmployeeController"
        :params="indexOrganizatoinEmployeeParams"
        label="select approval by (optional)"
        id="approval-by"
        placeholder="select your employee"
        @update:modelValue="setApprovalBy"
      />
    
    </div>

    <!-- Management -->
    <div
      class="col-span-4 md:col-span-2 input-wrapper"
    >
      <CustomSelectInput
        :modelValue="Selectedmangement"
        class="input"
        :controller="indexMangementChangeTopicTypeController"
        :params="indexMangementChangeTopicTypeParams"
        label="select management (optional)"
        id="management"
        placeholder="select your management"
        @update:modelValue="setManagement"
      />
    </div>

    <!--
      TYPE 1
      Approval By
    -->
    <div
      v-if="selectedTopicType === 1"
      class="col-span-4 md:col-span-2 input-wrapper"
    >
       <CustomSelectInput
        :modelValue="Selectedemployeeid"
        class="input"
        :controller="indexOrganizatoinEmployeeController"
        :params="indexOrganizatoinEmployeeidParams"
        label="select employee (optional)"
        id="project-employee"
        placeholder="select your employee"
        @update:modelValue="setEmployee"
      />
    </div>

    <!--
      TYPE 2
      Equipment
    -->
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

    <!--
      TYPE 3
      Other / Text
    -->
    <div
      v-if="selectedTopicType === 3"
      class="col-span-4 md:col-span-2 input-wrapper"
    >
      <label for="topic-text">
        Topic
      </label>

      <input
        id="topic-text"
        v-model="topicText"
        class="input"
        type="text"
        placeholder="Enter topic"
      />
    </div>

    <!-- Error -->
    <p
      v-if="errorMessage"
      class="col-span-4 text-red-600"
    >
      {{ errorMessage }}
    </p>

    <!-- Success -->
    <p
      v-if="successMessage"
      class="col-span-4 text-green-600"
    >
      {{ successMessage }}
    </p>

    <!-- Submit -->
    <div class="col-span-4 button-wrapper">
      <button
        type="submit"
        class="btn btn-primary"
      >
        Create management change
      </button>
    </div>

  </form>
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
</style>