<script lang="ts" setup>
import HeaderPage from '@/features/Organization/Project/Presentation/components/Details/DetailsHeader/HeaderPage.vue'
import { ref, watch } from 'vue'
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue'
import TitleInterface from '@/base/Data/Models/title_interface'
import acc from '@/assets/images/acc.png'
import MultiImagesInput from '@/shared/FormInputs/MultiImagesInput.vue'
import { filesToBase64 } from '@/base/Presentation/utils/file_to_base_64'
import IndexOrganizatoinEmployeeController from '@/features/Organization/OrganizationEmployee/Presentation/controllers/indexOrganizatoinEmployeeController'
import IndexOrganizatoinEmployeeParams from '@/features/Organization/OrganizationEmployee/Core/params/indexOrganizatoinEmployeeParams'
import EquipmentForm from '@/features/_templateFeature/Presentation/components/EquipmentForm.vue'
import EmployeeTypeSelect from './EmployeeTypeSelect.vue'
import { EmployeeNameStatus } from '../../../Core/Enums/EmplyeeNameStatus'
import IndexInjuryController from '@/features/Organization/Injury/Presentation/controllers/indexInjuryController'
import IndexInjuryParams from '@/features/Organization/Injury/Core/params/indexInjuryParams'
import Checkbox from 'primevue/checkbox'

const emit = defineEmits(['update:data'])
const time = ref()
const date = ref(new Date())
const SelectedPlatform = ref<TitleInterface>()
const Platforms = ref([
  new TitleInterface({ id: 1, title: 'zoom' }),
  new TitleInterface({ id: 2, title: 'teams' }),
])
const UpdateData = () => {
  emit('update:data', {
    platform: SelectedPlatform.value?.id,
    date: date.value,
    time: time.value,
  })
}

const setPlatform = (data: TitleInterface) => {
  SelectedPlatform.value = data
}

const isAnotherMeeting = ref(0)
const image = ref([])
const updateData = () => {
  console.log(isAnotherMeeting.value, " isAnotherMeeting.value");
  emit('update:data', {
    isAnotherMeeting: isAnotherMeeting.value,
    accidentsImages: image.value?.map((el) => el?.file),
    descripe: descripe.value,
    text: text.value,
    employeeId: isAnotherMeeting.value == 1 ? SelectedEmployee.value?.id : null,
    infectionTypeId: SelectedInfection.value?.id,
    employeeName: EmployeeName.value,
    isWorkStopped: isWorkStopped.value ? 1 : 0
  })
}
const setImages = async (data: string[]) => {
  image.value = typeof data === 'string' ? data : await filesToBase64(data)
  updateData()
}
const descripe = ref<string>('')
const text = ref<string>('')
const SelectedEmployee = ref<TitleInterface>()
const indexOrganizatoinEmployeeController = IndexOrganizatoinEmployeeController.getInstance()
const indexEmployeeParams = new IndexOrganizatoinEmployeeParams('', 1, 10, 0)

const setEmployee = (data: TitleInterface) => {
  SelectedEmployee.value = data
  updateData()
}
const SelectedInfection = ref<TitleInterface>()
const setInfection = (data: TitleInterface) => {
  SelectedInfection.value = data
  updateData()
}

const emplyeeType = ref(EmployeeNameStatus.Select)
const EmployeeName = ref<string>('')

const updateEmployeeState = (data: any) => {
  emplyeeType.value = data
  console.log(emplyeeType.value);
  // updateData()
}

const indexInjuryController = IndexInjuryController.getInstance()
const indexInjuryParams = new IndexInjuryParams('', 1, 10, 0)
watch(() => isAnotherMeeting.value, (newVal) => {
  if (newVal == 1) {
    updateData()
  } else {
    emit('update:data', {
      isAnotherMeeting: isAnotherMeeting.value,
    })
    image.value = []
    text.value = ''
    SelectedEmployee.value = undefined
    descripe.value = ''
    SelectedInfection.value = undefined
    emplyeeType.value = EmployeeNameStatus.Select
    EmployeeName.value = ''
  }
})

const isWorkStopped = ref()
const UpdateWorkStatus = (data) => {
  isWorkStopped.value = data?.target?.checked
  updateData()
}



</script>
<template>
  <div class="another-meeting">
    <div class="another-meeting-header">
      <HeaderPage :title="`Are there Injuries?`" :subtitle="`Did this incident result in any accidents`" :img="acc"
        class="title-header" />
      <div class="meeting-status">
        <button class="meeting-status-yes" @click.prevent="isAnotherMeeting = 1"
          :class="isAnotherMeeting == 1 ? 'active' : ''">Yes</button>
        <button class="meeting-status-on" @click.prevent="isAnotherMeeting = 0"
          :class="isAnotherMeeting == 0 ? 'active' : ''">No</button>
      </div>
    </div>

    <div class="another-meeting-contect" v-if="isAnotherMeeting == 1">
      <div class="col-span-6 md:col-span-6 input-wrapper w-full">
        <label for="">text</label>
        <input type="text" class="input " placeholder="add your title" v-model="text" @input="updateData">
      </div>
      <div class="col-span-6 md:col-span-3 input-wrapper w-full">

        <CustomSelectInput v-if="emplyeeType == EmployeeNameStatus.Select" :modelValue="SelectedEmployee" class="input"
          :component="EmployeeTypeSelect" :controller="indexOrganizatoinEmployeeController"
          :params="indexEmployeeParams" label="Employee" id="employee" placeholder="select your employee"
          @update:modelValue="setEmployee" @update:slot="updateEmployeeState" />

        <div v-if="emplyeeType == EmployeeNameStatus.Name" class="input-wrapper custom">
          <label for="employee" class="flex w-full">
            <span>{{ $t('employee') }}</span>
            <EmployeeTypeSelect @update:data="emplyeeType = $event" :selectedstatus="emplyeeType" />
          </label>
          <input type="text" v-model="EmployeeName" class="input" placeholder="select your employee">
        </div>


      </div>
      <div class="col-span-6 md:col-span-3 input-wrapper w-full">
        <CustomSelectInput :modelValue="SelectedInfection" class="input" :controller="indexInjuryController"
          :params="indexInjuryParams" label="injury Type" id="injury" placeholder="select your injury"
          @update:modelValue="setInfection" />
      </div>

      <div class="col-span-6 md:col-span-6 input-wrapper w-full">
        <label for="">upload image</label>
        <MultiImagesInput :initialImages="image" @update:images="setImages" :index="2" />
      </div>

      <!-- IsWorkStopped -->
      <div class="col-span-6 md:col-span-6 input-wrapper w-full is-stopped is-stopped-white"
        @click="isWorkStopped = !isWorkStopped">
        <label for="is_stoped">{{ $t('is_there_work_days_lost') }}</label>
        <Checkbox binary :modelValue="isWorkStopped" @change="UpdateWorkStatus" inputId="is_stoped"
          :name="`is_stoped`" />
      </div>
    </div>
  </div>
</template>
