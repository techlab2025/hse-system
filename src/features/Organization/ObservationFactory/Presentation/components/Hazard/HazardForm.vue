<script lang="ts" setup>
import { ref, watch } from 'vue'
import TitleInterface from '@/base/Data/Models/title_interface'
import type ShowHazardTypeModel from '@/features/setting/HazardType/Data/models/hazardTypeDetailsModel'
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue'
import TabsSelection from '@/shared/HelpersComponents/TabsSelection.vue'
import HazardIcon from '@/shared/icons/HazardIcon.vue'
import DatePicker from 'primevue/datepicker'

import IndexEquipmentParams from '@/features/setting/Equipment/Core/params/indexEquipmentParams'
import FileUpload from '@/shared/FormInputs/FileUpload.vue'
import { filesToBase64 } from '@/base/Presentation/utils/file_to_base_64'
import hazardImage from '@/assets/images/alert 1.png'
import HeaderPage from '@/features/Organization/Project/Presentation/components/Details/DetailsHeader/HeaderPage.vue'
import IndexHazardTypeParams from '@/features/setting/HazardType/Core/params/indexHazardTypeParams'
import IndexHazardTypeController from '@/features/setting/HazardType/Presentation/controllers/indexHazardTypeController'
import EditHazardParams from '../../../Core/params/editHazardParams'
import AddHazardParams from '../../../Core/params/addHazardParams'
import { Observation } from '../../../Core/Enums/ObservationTypeEnum'
import type { RiskLevelEnum } from '@/features/Organization/ObservationFactory/Core/Enums/risk_level_enum'
import { TypesEnum } from '@/features/Organization/ObservationFactory/Core/Enums/types_enum'
import { SaveStatusEnum } from '@/features/Organization/ObservationFactory/Core/Enums/save_status_enum'
import ObservationLevel from '../Ovservation/ObservationLevel.vue'
import HazerdType from '../Ovservation/HazerdType.vue'
import IndexEquipmentController from '@/features/setting/Equipment/Presentation/controllers/indexEquipmentController'
import MultiImagesInput from '@/shared/FormInputs/MultiImagesInput.vue'

const emit = defineEmits(['update:data'])
const props = defineProps<{
  data?: ShowHazardTypeModel
}>()
const text = ref<string>('')
const date = ref<Date>()
const descripe = ref<string>('')
const image = ref([])

const updateData = () => {
  // console.log(ZoneIds.value, "ZoneIds.value");
  const params = props.data?.id
    ? new EditHazardParams(
      props.data?.id! ?? 0,
      text.value,
      descripe.value,
      image.value?.map((el) => el.file),
      HazardType.value.id,
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
    : new AddHazardParams(
      text.value,
      actionText.value,
      image.value?.map((el) => el.file),
      HazardType.value?.id,
      Observation.HazardType,
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

watch([() => props.data], ([newData]) => { }, { immediate: true })

const indexHazardTypeParams = new IndexHazardTypeParams('', 1, 10, 1)
const indexHazardTypeController = IndexHazardTypeController.getInstance()
const HazardType = ref<TitleInterface>()
const setHazardType = (data: TitleInterface) => {
  HazardType.value = data
  updateData()
}
const indexEquipmentParams = new IndexEquipmentParams('', 1, 10, 1)
const indexEquipmentController = IndexEquipmentController.getInstance()
const SelectedMachine = ref<TitleInterface>()
const setMachine = (data: TitleInterface) => {
  SelectedMachine.value = data
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

const handleHazardData = (data: any) => {
  type_id.value = data.type_id
  isAction.value = data.take_action === 'yes'
  isResult.value = data.solved === 'yes'
  actionText.value = data.action
  updateData()
}

watch([title, date, riskLevel, isNearMiss, saveStatus], () => {
  updateData()
})


const setImages = async (data: string[]) => {
  image.value = typeof data === 'string' ? data : await filesToBase64(data)
  updateData()
}
</script>

<template>
  <div class="col-span-6 md:col-span-6">
    <HeaderPage :title="'create Hazerd'" :subtitle="'Identify and report potential hazards before they cause harm'"
      :img="hazardImage" />
  </div>
  <div class="col-span-6 md:col-span-6">
    <TabsSelection :LocationIds="[137]" @update:data="GetZones" />
  </div>
  <div class="hazard-form col-span-6 md:col-span-6">
    <div class="hazard-form-header">
      <HazardIcon class="icon" />
      <p class="title">Hazerd form <span>( #001 )</span></p>
    </div>
  </div>
  <div class="col-span-6 md:col-span-6 input-wrapper">
    <label for="text">Text</label>
    <input placeholder="Add your title" type="text" class="input" id="text" v-model="text" />
  </div>
  <div class="col-span-6 md:col-span-2 input-wrapper">
    <label for="date">Date</label>
    <DatePicker v-model="date" placeholder="Add your date" />
  </div>
  <div class="col-span-6 md:col-span-2 input-wrapper">
    <CustomSelectInput :modelValue="HazardType" class="input" :controller="indexHazardTypeController"
      :params="indexHazardTypeParams" label="HazardType" id="HazardType" placeholder="Select Hazard Type"
      @update:modelValue="setHazardType" />
  </div>
  <div class="col-span-6 md:col-span-2 input-wrapper">
    <CustomSelectInput :modelValue="SelectedMachine" class="input" :controller="indexEquipmentController"
      :params="indexEquipmentParams" label="select machine (optional)" id="machine" placeholder="select your machine"
      @update:modelValue="setMachine" />
  </div>
  <div class="col-span-6 md:col-span-6 input-wrapper w-full">
    <label for="">upload image</label>
    <!-- <FileUpload class="w-full" :modelValue="image" @update:fileData="setImage" /> -->
    <MultiImagesInput :initialImages="image" @update:images="setImages" />


  </div>
  <div class="col-span-6 md:col-span-6 input-wrapper w-full observation-form">
    <ObservationLevel :modelRiskLevel="riskLevel" :modelIsNearMiss="isNearMiss" :isHazard="true"
      @update:data="handleObservationLevel" />
    <HazerdType :riskLevel="riskLevel" :is_near_miss="isNearMiss" :modelTakeAction="isAction ? 'yes' : 'no'"
      :modelSolved="isResult ? 'yes' : 'no'" :modelAction="actionText" @update:data="handleHazardData" />
  </div>
  <!-- <div class="col-span-6 md:col-span-6 input-wrapper w-full">
    <label for="descripe">descripe <span class="optional">(optional)</span></label>
    <textarea v-model="descripe" id="descripe" placeholder="add your descripe"></textarea>
  </div> -->
</template>
