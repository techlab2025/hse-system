<script lang="ts" setup>
import { ref, watch } from 'vue'
import TitleInterface from '@/base/Data/Models/title_interface'
import type ShowInvestigatingTypeModel from '@/features/setting/InvestigatingType/Data/models/hazardTypeDetailsModel'
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue'
import TabsSelection from '@/shared/HelpersComponents/TabsSelection.vue'
// import InvestigatingIcon from '@/shared/icons/InvestigatingIcon.vue'
import DatePicker from 'primevue/datepicker'

import IndexEquipmentParams from '@/features/setting/Equipment/Core/params/indexEquipmentParams'
import FileUpload from '@/shared/FormInputs/FileUpload.vue'
import { filesToBase64 } from '@/base/Presentation/utils/file_to_base_64'
import detectiveImage from '@/assets/images/detective.png'
import HeaderPage from '@/features/Organization/Project/Presentation/components/Details/DetailsHeader/HeaderPage.vue'
// import IndexInvestigatingTypeParams from '@/features/setting/InvestigatingType/Core/params/indexInvestigatingTypeParams'
// import IndexInvestigatingTypeController from '@/features/setting/InvestigatingType/Presentation/controllers/indexInvestigatingTypeController'
import EditInvestigatingParams from '../../../Core/params/editInvestigatingParams'
import AddInvestigatingParams from '../../../Core/params/addInvestigatingParams'
import { Observation } from '../../../Core/Enums/ObservationTypeEnum'
import type { RiskLevelEnum } from '@/features/Organization/ObservationFactory/Core/Enums/risk_level_enum'
import { TypesEnum } from '@/features/Organization/ObservationFactory/Core/Enums/types_enum'
import { SaveStatusEnum } from '@/features/Organization/ObservationFactory/Core/Enums/save_status_enum'
import ObservationLevel from '../../../../ObservationFactory/Presentation/components/Ovservation/ObservationLevel.vue'
import HazerdType from '../../../../ObservationFactory/Presentation/components/Ovservation/HazerdType.vue'
import IndexEquipmentController from '@/features/setting/Equipment/Presentation/controllers/indexEquipmentController'
import FactorInvestigating from './FactorInvestigating.vue'
import meetingImage from '../../../../../../assets/images/meeting.png'
import IndexOrganizatoinEmployeeParams from '@/features/Organization/OrganizationEmployee/Core/params/indexOrganizatoinEmployeeParams'
import IndexOrganizatoinEmployeeController from '@/features/Organization/OrganizationEmployee/Presentation/controllers/indexOrganizatoinEmployeeController'
import { useRoute } from 'vue-router'
import MeetingParams from '../../../Core/params/MeetingParams'
import InvestigatingEmployeeParams from '../../../Core/params/InvestegationEmployeeParams'
import { formatJoinDate } from '@/base/Presentation/utils/date_format'
import { formatTime } from '@/base/Presentation/utils/time_format'

const emit = defineEmits(['update:data'])
const props = defineProps<{
  data?: ShowInvestigatingTypeModel
}>()
const text = ref<string>('')
const date = ref<Date>(new Date())
const descripe = ref<string>('')
const image = ref<string>('')
const route = useRoute()
const id = route.query?.id

const indexOrganizatoinEmployeeController = IndexOrganizatoinEmployeeController.getInstance()
const indexOrganizatoinEmployeeParams = new IndexOrganizatoinEmployeeParams("", 1, 10, 1)


const Employees = ref<InvestigatingEmployeeParams[]>([])
const meetings = ref<MeetingParams[]>([])
const updateData = () => {
  const meeting = new MeetingParams(formatJoinDate(date?.value), formatTime(time?.value), SelectedPlatform?.value?.id)
  const params = props.data?.id
    ? new EditInvestigatingParams(
      {
        id: props.data?.id,
        observationId: id as number,
        employees: Employees.value,
        meetings: meeting,
      }
    )
    : new AddInvestigatingParams(
      {
        observationId: id as number,
        employees: Employees.value,
        meetings: meeting,
      }
    )

  emit('update:data', params)
}

watch([() => props.data], ([newData]) => { }, { immediate: true })

// const indexInvestigatingTypeParams = new IndexInvestigatingTypeParams('', 1, 10, 1)
// const indexInvestigatingTypeController = IndexInvestigatingTypeController.getInstance()
const InvestigatingType = ref<TitleInterface>()
const setInvestigatingType = (data: TitleInterface) => {
  InvestigatingType.value = data
  updateData()
}
const indexEquipmentParams = new IndexEquipmentParams('', 1, 10, 1)
const indexEquipmentController = IndexEquipmentController.getInstance()
const SelectedMachine = ref<TitleInterface>()
const setMachine = (data: TitleInterface) => {
  SelectedMachine.value = data
  updateData()
}

const setImage = async (data: File) => {
  image.value = await filesToBase64(data)
  updateData()
}
const ZoneIds = ref<number>()
const GetZones = (data: number) => {
  ZoneIds.value = data
  // console.log(ZoneIds.value, 'ZoneIds.value')
  updateData()
}
const riskLevel = ref<RiskLevelEnum | null>(null)
const isNearMiss = ref<boolean | number>(0)
const handleObservationLevel = (data: any) => {
  // console.log(data, 'data')
  riskLevel.value = data.level
  isNearMiss.value = data.is_near_miss
  updateData()
}
watch([riskLevel], () => {
  updateData()
})

const title = ref<string>('')
const isResult = ref<boolean>(false)
const isAction = ref<boolean>()
const saveStatus = ref<SaveStatusEnum | null>(null)
const actionText = ref<string>('')
const type_id = ref<number | null>(null)
const time = ref()

const handleInvestigatingData = (data: any) => {
  type_id.value = data.type_id
  isAction.value = data.take_action === 'yes'
  isResult.value = data.solved === 'yes'
  actionText.value = data.action
  updateData()
}

watch([title, date, riskLevel, isNearMiss, saveStatus], () => {
  updateData()
})

const SelectedTeam = ref<TitleInterface[]>([])
const setTeams = (data: TitleInterface[]) => {
  SelectedTeam.value = data
  Employees.value = data.map(el => (new InvestigatingEmployeeParams(el.id!, false)))
  updateData()
}

const SelectedTeamLeader = ref<TitleInterface>(null)
const setTeamLeader = (data: TitleInterface) => {
  SelectedTeamLeader.value = data
  Employees.value = Employees.value.map(el => el.organization_employee_id === data.id ? { ...el, is_leader: true } : el)
  updateData()
}

const MeetingPlatforms = ref<TitleInterface[]>([
  new TitleInterface({ id: 1, title: 'zoom' }),
  new TitleInterface({ id: 2, title: 'teams' }),
  new TitleInterface({ id: 3, title: 'skype' }),
  new TitleInterface({ id: 4, title: 'google meet' }),
  new TitleInterface({ id: 5, title: 'other' }),
])
const SelectedPlatform = ref<TitleInterface>(null)
const setSelectedPlatform = (data: TitleInterface) => {
  SelectedPlatform.value = data
  updateData()
}
</script>

<template>
  <div class="col-span-6 md:col-span-6">
    <HeaderPage :title="'create Investigating'" :subtitle="'Document what you observe to improve workplace safety'"
      :img="detectiveImage" />
  </div>
  <!-- <div class="col-span-6 md:col-span-6">
    <TabsSelection :LocationIds="[137]" @update:data="GetZones" />
  </div> -->
  <div class="investigating-form col-span-6 md:col-span-6">
    <div class="investigating-form-header">
      <p class="title">Investigating form <span>( #001 )</span></p>
    </div>
  </div>

  <div class="col-span-6 md:col-span-4 input-wrapper">
    <CustomSelectInput :modelValue="SelectedTeam" class="input" :controller="indexOrganizatoinEmployeeController"
      :params="indexOrganizatoinEmployeeParams" label="Investigation team" :type="2" id="machine"
      placeholder="select your team" @update:modelValue="setTeams" />
  </div>
  <div class="col-span-6 md:col-span-2 input-wrapper">
    <CustomSelectInput :modelValue="SelectedTeamLeader" class="input" :staticOptions="SelectedTeam"
      label="assign leader " id="leader" placeholder="select your leader" @update:modelValue="setTeamLeader" />
  </div>

  <div class="meeting-investigation col-span-6 md:col-span-6">
    <img :src="meetingImage" alt="" class="meeting-icon" />

    <p>Investigation Meeting</p>
  </div>

  <div class="col-span-6 md:col-span-3 input-wrapper">
    <label for="date">Date</label>
    <DatePicker v-model="date" placeholder="Add your date" />
  </div>
  <div class="col-span-6 md:col-span-3 input-wrapper">
    <label for="time">Time</label>
    <DatePicker v-model="time" timeOnly hourFormat="24" placeholder="Add your time" />
  </div>

  <!-- <FactorInvestigating /> -->
  <div class="col-span-6 md:col-span-6 input-wrapper">
    <CustomSelectInput :modelValue="SelectedPlatform" class="input" :staticOptions="MeetingPlatforms"
      label="meeting platform " id="machine" placeholder="select meeting platform"
      @update:modelValue="setSelectedPlatform" />
  </div>
</template>
