<script lang="ts" setup>
import { ref, watch } from 'vue'
import TitleInterface from '@/base/Data/Models/title_interface'

import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue'
import TabsSelection from '@/shared/HelpersComponents/TabsSelection.vue'
import DatePicker from 'primevue/datepicker'
import HazardImage from '@/assets/images/alert 2.png'

import IndexEquipmentParams from '@/features/setting/Equipment/Core/params/indexEquipmentParams'
import FileUpload from '@/shared/FormInputs/FileUpload.vue'
import { filesToBase64 } from '@/base/Presentation/utils/file_to_base_64'
import HeaderPage from '@/features/Organization/Project/Presentation/components/Details/DetailsHeader/HeaderPage.vue'
import { title } from 'process'
import type HazardDetailsModel from '../../../Data/models/hazardDetailsModel'
import EditHazardParams from '../../../Core/params/editHazardParams'
import AddHazardParams from '../../../Core/params/addHazardParams'
import IndexHazardParams from '../../../Core/params/indexHazardParams'
import IndexHazardController from '../../controllers/indexHazardController'
import { Observation } from '../../../Core/Enums/ObservationTypeEnum'
import IndexEquipmentController from '@/features/setting/Equipment/Presentation/controllers/indexEquipmentController'
import MultiImagesInput from '@/shared/FormInputs/MultiImagesInput.vue'

const emit = defineEmits(['update:data'])
const props = defineProps<{
  data?: HazardDetailsModel
}>()
const text = ref<string>('')
const date = ref<string>()
const descripe = ref<string>('')
const image = ref<string>('')

const updateData = () => {
  const params = props.data?.id
    ? new EditHazardParams(
      props.data?.id! ?? 0,
      text.value,
      descripe.value,
      image.value?.map((el) => el.file),

      0,
      Observation.AccidentsType,
      SelectedMachine.value?.id ?? null,
      ZoneIds.value ?? 0,
      37,
      0,
      0,
      0,
      '',
      0,
      0,
      date.value ?? '',
      [],
      0,
    )
    : new AddHazardParams(
      text.value,
      descripe.value,
      image.value?.map((el) => el.file),
      0,
      Observation.AccidentsType,
      SelectedMachine.value?.id ?? null,
      ZoneIds.value ?? 0,
      37,
      0,
      0,
      0,
      '',
      0,
      0,
      date.value ?? '',
      [],
      0,
    )

  emit('update:data', params)
}

watch([() => props.data], ([newData]) => { }, { immediate: true })

// const indexHazardTypeParams = new IndexHazardParams('', 1, 10, 1)
// const indexHazardTypeController = IndexHazardController.getInstance()
const HazardType = ref<TitleInterface[]>([])
const setHazardType = (data: TitleInterface[]) => {
  HazardType.value = data
  updateData()
}
const indexEquipmentParams = new IndexEquipmentParams('', 1, 10, 1)
const indexEquipmentController = IndexEquipmentController.getInstance()
const SelectedMachine = ref<TitleInterface | null>(null)
const setMachine = (data: TitleInterface | null) => {
  SelectedMachine.value = data
  updateData()
}

// const setImage = async (data: File) => {
//   image.value = await filesToBase64(data)
//   updateData()
// }
const ZoneIds = ref<number>()
const GetZones = (data: number) => {
  ZoneIds.value = data
  updateData()
}

const setImages = async (data: string[]) => {
  image.value = typeof data === 'string' ? data : await filesToBase64(data)
  updateData()
}
</script>

<template>
  <div class="col-span-6 md:col-span-6">
    <HeaderPage :title="'create Incedant'" :subtitle="'Identify and report potential Incedants before they cause harm'"
      :img="HazardImage" />
  </div>

  <div class="col-span-6 md:col-span-6">
    <TabsSelection :LocationIds="[137]" @update:data="GetZones" />
  </div>
  <div class="Hazard-form col-span-6 md:col-span-6">
    <div class="Hazard-form-header">
      <HazardIcon class="icon" />
      <p class="title">Incedant form <span>( #001 )</span></p>
    </div>
  </div>
  <div class="col-span-6 md:col-span-6 input-wrapper">
    <label for="text">Text</label>
    <input placeholder="Add your title" type="text" class="input" id="text" v-model="text" />
  </div>
  <div class="col-span-6 md:col-span-3 input-wrapper">
    <label for="date">Date</label>
    <DatePicker v-model="date" placeholder="Add your date" />
  </div>

  <div class="col-span-6 md:col-span-3 input-wrapper">
    <CustomSelectInput :modelValue="SelectedMachine" class="input" :controller="indexEquipmentController"
      :params="indexEquipmentParams" label="select machine (optional)" id="machine" placeholder="select your machine"
      @update:modelValue="setMachine" />
  </div>
  <div class="col-span-6 md:col-span-6 input-wrapper w-full">
    <label for="">upload image</label>
    <!-- <FileUpload class="w-full" :modelValue="image" @update:fileData="setImage" /> -->
    <MultiImagesInput :initialImages="image" @update:images="setImages" />

  </div>
  <div class="col-span-6 md:col-span-6 input-wrapper w-full">
    <label for="descripe">descripe <span class="optional">(optional)</span></label>
    <textarea v-model="descripe" id="descripe" placeholder="add your descripe"></textarea>
  </div>
</template>
