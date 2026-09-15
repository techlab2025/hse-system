```vue
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

const riskAssismentFile = ref<File | null>(null)
const images = ref<File[]>([])
const changerRequestId = ref<number | null>(null)
const facilty = ref('')
const area = ref('')
const date = ref<Date | null>(new Date())
const changeType = ref(ChangeTypeMangementEnum.temp)
const topicType = ref(MangementChangeTopicTypeEnum.employee)
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

const selectedTopicType = computed(
  () => Selectedmangement.value?.type ?? null,
)

const route = useRoute()
const projectId = Number(route.query.project_id)

const indexMangementChangeTopicTypeController = IndexMangementChangeTopicTypeController.getInstance()
const indexMangementChangeTopicTypeParams = new IndexMangementChangeTopicTypeParams('', 1, 10000, 1)

const indexequipmentController = IndexEquipmentController.getInstance()
const indexequipmentParams = new IndexEquipmentParams('', 1, 10000, 1)

const indexOrganizatoinEmployeeController = IndexOrganizatoinEmployeeController.getInstance()
const indexOrganizatoinEmployeeParams = new IndexOrganizatoinEmployeeParams('', 1, 10, 1)
const indexOrganizatoinEmployeeidParams = new IndexOrganizatoinEmployeeParams(
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
  Number.isInteger(projectId) && projectId > 0 ? projectId : null,
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


const setImages = (files: File[]) => {
  images.value = files
}

const setRiskAssismentFile = (event: Event) => {
  const input = event.target as HTMLInputElement

  riskAssismentFile.value = input.files?.[0] ?? null
}


const submit = async () => {
  errorMessage.value = ''
  successMessage.value = ''

  if (
    !riskAssismentFile.value ||
    changerRequestId.value === null ||
    approvalBy.value === null
  ) {
    errorMessage.value = 'Please complete the required fields.'
    return
  }

  const params = new AddMangementChangeParams(
    riskAssismentFile.value,
    images.value,
    changerRequestId.value,
    facilty.value,
    area.value,
    date.value,
    changeType.value,
    topicType.value,
    status.value,
    approvalBy.value,

    topicType.value === MangementChangeTopicTypeEnum.employee
      ? employeeId.value ?? undefined
      : undefined,

    topicType.value === MangementChangeTopicTypeEnum.equipment
      ? equipmentId.value ?? undefined
      : undefined,

    topicType.value === MangementChangeTopicTypeEnum.other
      ? topicText.value || undefined
      : undefined,
  )

  const controller = AddMangementChangeController.getInstance()

  await controller.addMangementChange(params)

  if (controller.isDataSuccess()) {
    successMessage.value = 'Management change created successfully.'
  } else {
    errorMessage.value = 'Unable to create management change.'
  }
}
const setManagement = (data: TitleInterface | null) => {
  Selectedmangement.value = data
  topicType.value = data?.type ?? MangementChangeTopicTypeEnum.employee
  Selectedemployee.value = null
  Selectedemployeeid.value = null
  Selectedequipment.value = null
  employeeId.value = null
  equipmentId.value = null
  topicText.value = ''
  approvalBy.value = null
  updateData()
}
const setEmployee = (data: TitleInterface | null) => {
  Selectedemployeeid.value = data
  employeeId.value = data?.id ?? null
  updateData()
}
const setequipment = (data: TitleInterface | null) => {
  Selectedequipment.value = data
  equipmentId.value = data?.id ?? null
  updateData()
}
const setApprovalBy = (data: TitleInterface | null) => {
  Selectedemployee.value = data
  approvalBy.value = data?.id ?? null
  updateData()
}
</script>

<template>
  <form
    class="grid grid-cols-1 gap-4 md:grid-cols-4"
    @submit.prevent="submit"
  >
    <!-- Risk Assessment File -->
    <div class="input-wrapper col-span-4 md:col-span-2">
      <label for="risk-assisment-file">
        Risk assessment file
      </label>

      <input
        id="risk-assisment-file"
        class="input"
        type="file"
        required
        @change="setRiskAssismentFile"
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

    <!-- Change Request ID -->
    <!-- <div class="input-wrapper col-span-4 md:col-span-2">
      <label for="changer-request-id">
        Change request ID
      </label>

      <input
        id="changer-request-id"
        v-model.number="changerRequestId"
        class="input"
        type="number"
        min="1"
        required
      />
    </div> -->

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
       <!-- Date -->
  <div class="col-span-2 md:col-span-2 input-wrapper">
    <label for="date">Date</label>
    <DatePicker v-model="date" placeholder="Add your date" />
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

   
     <!-- Management -->
  <div class="col-span-3 md:col-span-2 input-wrapper">
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
      <!-- equipment -->
    <div v-if="selectedTopicType === MangementChangeTopicTypeEnum.equipment" class="col-span-3 md:col-span-2 input-wrapper">
    <CustomSelectInput
      :modelValue="Selectedequipment"
      class="input"
      :controller="indexequipmentController"
      :params="indexequipmentParams"
      label="select equipment (optional)"
      id="equipment"
      placeholder="select your equipment"
      @update:modelValue="setequipment"
    />
  </div>
  <!-- approval by -->
  <div v-if="selectedTopicType === MangementChangeTopicTypeEnum.employee" class="col-span-3 md:col-span-2 input-wrapper">
    <CustomSelectInput
      :modelValue="Selectedemployee"
      class="input"
      :controller="indexOrganizatoinEmployeeController"
      :params="indexOrganizatoinEmployeeParams"
      label="select approvel by (optional)"
      id="employee"
      placeholder="select your employee"
      @update:modelValue="setApprovalBy"
    />
  </div>

      <!-- employee filtered by project -->
    <div v-if="selectedTopicType === MangementChangeTopicTypeEnum.employee" class="col-span-3 md:col-span-2 input-wrapper">
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

  <!-- other topic text -->
  <div v-if="selectedTopicType === MangementChangeTopicTypeEnum.other" class="col-span-3 md:col-span-2 input-wrapper">
    <label for="topic-text">Topic</label>
    <input
      id="topic-text"
      v-model="topicText"
      class="input"
      type="text"
      placeholder="Enter topic"
    />
  </div>

    <!-- Approval By -->
    <!-- <div class="input-wrapper col-span-4 md:col-span-2">
      <label for="approval-by">
        Approval by
      </label>

      <input
        id="approval-by"
        v-model.number="approvalBy"
        class="input"
        type="number"
        min="1"
        required
      />
    </div> -->

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
