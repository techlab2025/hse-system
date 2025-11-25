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

const emit = defineEmits(['update:data'])
const props = defineProps<{
  data?: ShowInvestigatingTypeModel
}>()
const text = ref<string>('')
const date = ref<Date>()
const descripe = ref<string>('')
const image = ref<string>('')

const updateData = () => {
  // console.log(ZoneIds.value, "ZoneIds.value");
  const params = props.data?.id
    ? new EditInvestigatingParams(
        props.data?.id! ?? 0,
        text.value,
        descripe.value,
        image.value,
        InvestigatingType.value.id,
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
    : new AddInvestigatingParams(
        text.value,
        actionText.value,
        image.value?.file,
        InvestigatingType.value?.id,
        Observation.InvestigatingType,
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
const ZoneIds = ref<number[]>()
const GetZones = (data: number[]) => {
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
</script>

<template>
  <div class="col-span-6 md:col-span-6">
    <HeaderPage
      :title="'create Investigating'"
      :subtitle="'Document what you observe to improve workplace safety'"
      :img="detectiveImage"
    />
  </div>
  <div class="col-span-6 md:col-span-6">
    <TabsSelection :LocationIds="[137]" @update:data="GetZones" />
  </div>
  <div class="investigating-form col-span-6 md:col-span-6">
    <div class="investigating-form-header">
      <p class="title">Investigating form <span>( #001 )</span></p>
    </div>
  </div>
  <div class="col-span-6 md:col-span-4 input-wrapper">
    <label for="text">Text</label>
    <input placeholder="Add your title" type="text" class="input" id="text" v-model="text" />
  </div>
  <div class="col-span-6 md:col-span-2 input-wrapper">
    <CustomSelectInput
      :modelValue="SelectedMachine"
      class="input"
      :controller="indexEquipmentController"
      :params="indexEquipmentParams"
      label="select machine (optional)"
      id="machine"
      placeholder="select your machine"
      @update:modelValue="setMachine"
    />
  </div>
  <div class="col-span-6 md:col-span-2 input-wrapper">
    <label for="date">Date</label>
    <DatePicker v-model="date" placeholder="Add your date" />
  </div>
  <div class="col-span-6 md:col-span-2 input-wrapper">
    <CustomSelectInput
      :modelValue="InvestigatingType"
      class="input"
      :controller="indexInvestigatingTypeController"
      :params="indexInvestigatingTypeParams"
      label="InvestigatingType"
      id="InvestigatingType"
      placeholder="Select Investigating Type"
      @update:modelValue="setInvestigatingType"
    />
  </div>
  <div class="col-span-6 md:col-span-2 input-wrapper">
    <CustomSelectInput
      :modelValue="SelectedMachine"
      class="input"
      :controller="indexEquipmentController"
      :params="indexEquipmentParams"
      label="select machine (optional)"
      id="machine"
      placeholder="select your machine"
      @update:modelValue="setMachine"
    />
  </div>
  <div class="col-span-6 md:col-span-6 input-wrapper w-full factor-item">
    <label class="factot-title">Factors & Items</label>
    <div class="radio-grid">
      <div class="radio-column">
        <div class="radio-item">
          <input type="radio" name="factor1" id="factor1" />
          <label class="radio-label" for="factor1">Lorem Ipsum 1</label>
        </div>
        <div class="radio-item">
          <input type="radio" name="factor2" id="factor2" />
          <label class="radio-label" for="factor2">Lorem Ipsum 2</label>
        </div>
      </div>

      <div class="radio-column">
        <div class="radio-item">
          <input type="radio" name="item1" id="item1" />
          <label class="radio-label" for="item1">Lorem Ipsum 3</label>
        </div>
        <div class="radio-item">
          <input type="radio" name="item2" id="item2" />
          <label class="radio-label" for="item2">Lorem Ipsum 4</label>
        </div>
      </div>
    </div>
  </div>

  <div class="col-span-6 md:col-span-6 input-wrapper w-full observation-form">
    <ObservationLevel
      :modelRiskLevel="riskLevel"
      :modelIsNearMiss="isNearMiss"
      :isInvestigating="true"
      @update:data="handleObservationLevel"
    />
    <HazerdType
      :riskLevel="riskLevel"
      :is_near_miss="isNearMiss"
      :modelTakeAction="isAction ? 'yes' : 'no'"
      :modelSolved="isResult ? 'yes' : 'no'"
      :modelAction="actionText"
      @update:data="handleInvestigatingData"
    />
  </div>
  <!-- <div class="col-span-6 md:col-span-6 input-wrapper w-full">
    <label for="descripe">descripe <span class="optional">(optional)</span></label>
    <textarea v-model="descripe" id="descripe" placeholder="add your descripe"></textarea>
  </div> -->
</template>
