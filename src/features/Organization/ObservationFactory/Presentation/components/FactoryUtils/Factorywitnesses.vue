<script lang="ts" setup>
import HeaderPage from '@/features/Organization/Project/Presentation/components/Details/DetailsHeader/HeaderPage.vue'
import { ref } from 'vue'
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
import WitnessesTimeLine from './WitnessesTimeLine.vue'
import people from '@/assets/images/people.png'

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

const isAnotherMeeting = ref(1)
const image = ref([])
const updateData = () => {
  emit('update:data', {
    accidentsImages: image.value?.map((el) => el?.file),
    descripe: descripe.value,
    text: text.value,
    employeeId: SelectedEmployee.value?.id,
    infectionTypeId: SelectedInfection.value?.id,
    employeeName: EmployeeName.value,
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
const indexEmployeeParams = new IndexOrganizatoinEmployeeParams('', 1, 10, 1)

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

const UpdateWitnessesData = (data: any) => {
  console.log('witnesses data', data);
}


</script>
<template>
  <div class="another-meeting">
    <div class="another-meeting-header">
      <HeaderPage :title="`Are there witnesses?`" :subtitle="`Were there any witnesses present at this incident?`"
        :img="people" class="title-header" />
      <div class="meeting-status">
        <button class="meeting-status-yes" @click.prevent="isAnotherMeeting = 1"
          :class="isAnotherMeeting == 1 ? 'active' : ''">Yes</button>
        <button class="meeting-status-on" @click.prevent="isAnotherMeeting = 0"
          :class="isAnotherMeeting == 0 ? 'active' : ''">No</button>
      </div>
    </div>

    <div class="another-meeting-contect" v-if="isAnotherMeeting == 1">
      <WitnessesTimeLine @update:data="UpdateWitnessesData" />
    </div>

  </div>
</template>
