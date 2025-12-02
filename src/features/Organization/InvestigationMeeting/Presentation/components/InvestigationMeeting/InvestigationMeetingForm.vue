<script lang="ts" setup>
import { ref, watch } from 'vue'
import TitleInterface from '@/base/Data/Models/title_interface'
import type ShowInvestigationMeetingTypeModel from '@/features/setting/InvestigationMeetingType/Data/models/hazardTypeDetailsModel'
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue'
import TabsSelection from '@/shared/HelpersComponents/TabsSelection.vue'
// import InvestigationMeetingIcon from '@/shared/icons/InvestigationMeetingIcon.vue'
import DatePicker from 'primevue/datepicker'

import IndexEquipmentParams from '@/features/setting/Equipment/Core/params/indexEquipmentParams'
import FileUpload from '@/shared/FormInputs/FileUpload.vue'
import { filesToBase64 } from '@/base/Presentation/utils/file_to_base_64'
import detectiveImage from '@/assets/images/detective.png'
import HeaderPage from '@/features/Organization/Project/Presentation/components/Details/DetailsHeader/HeaderPage.vue'
// import IndexInvestigationMeetingTypeParams from '@/features/setting/InvestigationMeetingType/Core/params/indexInvestigationMeetingTypeParams'
// import IndexInvestigationMeetingTypeController from '@/features/setting/InvestigationMeetingType/Presentation/controllers/indexInvestigationMeetingTypeController'
import EditInvestigationMeetingParams from '../../../Core/params/editInvestigationMeetingParams'
import AddInvestigationMeetingParams from '../../../Core/params/addInvestigationMeetingParams'
import { Observation } from '../../../Core/Enums/ObservationTypeEnum'
import type { RiskLevelEnum } from '@/features/Organization/ObservationFactory/Core/Enums/risk_level_enum'
import { TypesEnum } from '@/features/Organization/ObservationFactory/Core/Enums/types_enum'
import { SaveStatusEnum } from '@/features/Organization/ObservationFactory/Core/Enums/save_status_enum'
import ObservationLevel from '../../../../ObservationFactory/Presentation/components/Ovservation/ObservationLevel.vue'
import HazerdType from '../../../../ObservationFactory/Presentation/components/Ovservation/HazerdType.vue'
import IndexEquipmentController from '@/features/setting/Equipment/Presentation/controllers/indexEquipmentController'
import FactorInvestigationMeeting from './FactorInvestigationMeeting.vue'
import meetingImage from '../../../../../../assets/images/meeting.png'

const emit = defineEmits(['update:data'])
const props = defineProps<{
  data?: ShowInvestigationMeetingTypeModel
}>()
const text = ref<string>('')
const date = ref<Date>()
const descripe = ref<string>('')
const image = ref<string>('')

const updateData = () => {
  // console.log(ZoneIds.value, "ZoneIds.value");
  const params = props.data?.id
    ? new EditInvestigationMeetingParams(
        props.data?.id! ?? 0,
        text.value,
        descripe.value,
        image.value,
        InvestigationMeetingType.value.id,
        2,
        SelectedMachine.value.id,
        ZoneIds.value,
        22,
        null,
        null,
        null,
        null,
        null,
        null,
        date.value,
        null,
        null,
      )
    : new AddInvestigationMeetingParams(
        text.value,
        actionText.value,
        image.value?.file,
        InvestigationMeetingType.value?.id,
        Observation.InvestigationMeetingType,
        SelectedMachine.value?.id,
        ZoneIds.value,
        37,
        isResult.value ? 1 : 0,
        riskLevel.value,
        SaveStatusEnum.NotSaved,
        null,
        null,
        null,
        date.value,
        null,
        isAction.value ? 1 : 0,
      )

  emit('update:data', params)
}

watch([() => props.data], ([newData]) => {}, { immediate: true })

// const indexInvestigationMeetingTypeParams = new IndexInvestigationMeetingTypeParams('', 1, 10, 1)
// const indexInvestigationMeetingTypeController = IndexInvestigationMeetingTypeController.getInstance()
const InvestigationMeetingType = ref<TitleInterface>()
const setInvestigationMeetingType = (data: TitleInterface) => {
  InvestigationMeetingType.value = data
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

const handleInvestigationMeetingData = (data: any) => {
  type_id.value = data.type_id
  isAction.value = data.take_action === 'yes'
  isResult.value = data.solved === 'yes'
  actionText.value = data.action
  updateData()
}

watch([title, date, riskLevel, isNearMiss, saveStatus], () => {
  updateData()
})
</script>

<template>
  <div class="col-span-6 md:col-span-6">
    <HeaderPage
      :title="'create InvestigationMeeting'"
      :subtitle="'Document what you observe to improve workplace safety'"
      :img="detectiveImage"
    />
  </div>
  <!-- <div class="col-span-6 md:col-span-6">
    <TabsSelection :LocationIds="[137]" @update:data="GetZones" />
  </div> -->
  <div class="investigating-form col-span-6 md:col-span-6">
    <div class="investigating-form-header">
      <p class="title">InvestigationMeeting form <span>( #001 )</span></p>
    </div>
  </div>

  <div class="col-span-6 md:col-span-4 input-wrapper">
    <CustomSelectInput
      :modelValue="SelectedMachine"
      class="input"
      :controller="indexEquipmentController"
      :params="indexEquipmentParams"
      label="Investigation team"
      id="machine"
      placeholder="select your machine"
      @update:modelValue="setMachine"
    />
  </div>
  <div class="col-span-6 md:col-span-2 input-wrapper">
    <CustomSelectInput
      :modelValue="SelectedMachine"
      class="input"
      :controller="indexEquipmentController"
      :params="indexEquipmentParams"
      label="assign leader "
      id="machine"
      placeholder="select your machine"
      @update:modelValue="setMachine"
    />
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

  <!-- <FactorInvestigationMeeting /> -->
  <div class="col-span-6 md:col-span-6 input-wrapper">
    <CustomSelectInput
      :modelValue="SelectedMachine"
      class="input"
      :controller="indexEquipmentController"
      :params="indexEquipmentParams"
      label="meeting platform "
      id="machine"
      placeholder="select meeting platform"
      @update:modelValue="setMachine"
    />
  </div>
</template>
