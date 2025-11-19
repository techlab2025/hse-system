<script lang="ts" setup>
import { ref, watch } from 'vue'
import TitleInterface from '@/base/Data/Models/title_interface'

import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue'
import TabsSelection from '@/shared/HelpersComponents/TabsSelection.vue'
import DatePicker from 'primevue/datepicker'
import InspectionImage from '@/assets/images/alert 2.png'

import IndexEquipmentController from '@/features/setting/Equipment/Presentation/controllers/indexEquipmentController'
import IndexEquipmentParams from '@/features/setting/Equipment/Core/params/indexEquipmentParams'
import FileUpload from '@/shared/FormInputs/FileUpload.vue'
import { filesToBase64 } from '@/base/Presentation/utils/file_to_base_64'

import HeaderPage from '@/features/Organization/Project/Presentation/components/Details/DetailsHeader/HeaderPage.vue'
import { title } from 'process'
import type InspectionDetailsModel from '../../Data/models/InspectionDetailsModel'
import EditInspectionParams from '../../Core/params/editInspectionParams'
import AddInspectionParams from '../../Core/params/addInspectionParams'
import IndexInspectionParams from '../../Core/params/indexInspectionParams'
import IndexInspectionController from '../controllers/indexInspectionController'

const emit = defineEmits(['update:data'])
const props = defineProps<{
  data?: InspectionDetailsModel
}>()
const text = ref<string>('')
const date = ref<Date>()
const descripe = ref<string>('')
const image = ref<string>('')

const updateData = () => {
  const params = props.data?.id
    ? new EditInspectionParams(
        props.data?.id! ?? 0,
        text.value,
        date.value,
        ZoneIds.value,
        InspectionType.value.map((h) => h.id),
        SelectedMachine.value.map((el) => el.id),
        image.value,
        descripe.value,
      )
    : new AddInspectionParams(
        text.value,
        date.value,
        ZoneIds.value,
        InspectionType.value.map((h) => h.id),
        SelectedMachine.value.map((el) => el.id),
        image.value,
        descripe.value,
      )

  emit('update:data', params)
}

watch([() => props.data], ([newData]) => {}, { immediate: true })

const indexInspectionTypeParams = new IndexInspectionParams('', 1, 10, 1)
const indexInspectionTypeController = IndexInspectionController.getInstance()
const InspectionType = ref<TitleInterface[]>([])
const setInspectionType = (data: TitleInterface[]) => {
  InspectionType.value = data
  updateData()
}
const indexEquipmentParams = new IndexEquipmentParams('', 1, 10, 1)
const indexEquipmentController = IndexEquipmentController.getInstance()
const SelectedMachine = ref<TitleInterface[]>([])
const setMachine = (data: TitleInterface[]) => {
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
  updateData()
}
</script>

<template>
  <div class="col-span-6 md:col-span-6">
    <HeaderPage
      :title="'create Inspection'"
      :subtitle="'Identify and report potential hazards before they cause harm'"
      :img="InspectionImage"
    />
  </div>

  <div class="col-span-6 md:col-span-6">
    <TabsSelection :LocationIds="[137]" @update:data="GetZones" />
  </div>
  <div class="Inspection-form col-span-6 md:col-span-6">
    <div class="Inspection-form-header">
      <InspectionIcon class="icon" />
      <p class="title">Hazerd form <span>( #001 )</span></p>
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
    <CustomSelectInput
      :modelValue="SelectedMachine"
      class="input"
      :controller="indexEquipmentController"
      :params="indexEquipmentParams"
      label="select machine (optional)"
      id="machine"
      placeholder="select your machine"
      :type="2"
      @update:modelValue="setMachine"
    />
  </div>
  <div class="col-span-6 md:col-span-6 input-wrapper w-full">
    <label for="">upload image</label>
    <FileUpload class="w-full" :modelValue="image" @update:fileData="setImage" />
  </div>
  <div class="col-span-6 md:col-span-6 input-wrapper w-full">
    <label for="descripe">descripe <span class="optional">(optional)</span></label>
    <textarea v-model="descripe" id="descripe" placeholder="add your descripe"></textarea>
  </div>
</template>
