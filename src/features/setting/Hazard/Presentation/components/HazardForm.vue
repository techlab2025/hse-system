<script lang="ts" setup>
import { ref, watch } from 'vue'
import TitleInterface from '@/base/Data/Models/title_interface'
import type ShowHazardTypeModel from '@/features/setting/HazardType/Data/models/hazardTypeDetailsModel'
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue'
import TabsSelection from '@/shared/HelpersComponents/TabsSelection.vue'
import HazardIcon from '@/shared/icons/HazardIcon.vue'
import IndexHazardTypeParams from '@/features/setting/HazardType/Core/params/indexHazardTypeParams'
import IndexHazardTypeController from '@/features/setting/HazardType/Presentation/controllers/indexHazardTypeController'
import IndexEquipmentController from '@/features/setting/Equipment/Presentation/controllers/indexEquipmentController'
import IndexEquipmentParams from '@/features/setting/Equipment/Core/params/indexEquipmentParams'
import FileUpload from '@/shared/FormInputs/FileUpload.vue'
import { filesToBase64 } from '@/base/Presentation/utils/file_to_base_64'
import EditHazardParams from '../../Core/params/editHazardParams'
import AddHazardParams from '../../Core/params/addHazardParams'

const emit = defineEmits(['update:data'])
const props = defineProps<{
  data?: ShowHazardTypeModel
}>()
const text = ref<string>('')
const date = ref<Date>()
const descripe = ref<string>("")
const image = ref<string>('')

const updateData = () => {
  const params = props.data?.id
    ? new EditHazardParams(
      props.data?.id! ?? 0,
      text.value,
      date.value,
      ZoneIds.value,
      HazardType.value.map((h) => h.id),
      SelectedMachine.value.map(el => el.id),
      image.value,
      descripe.value

    )
    : new AddHazardParams(
      text.value,
      date.value,
      ZoneIds.value,
      HazardType.value.map((h) => h.id),
      SelectedMachine.value.map(el => el.id),
      image.value,
      descripe.value


    )

  emit('update:data', params)
}

watch(
  [() => props.data],
  ([newData]) => {


  },
  { immediate: true },
)



const indexHazardTypeParams = new IndexHazardTypeParams("", 1, 10, 1)
const indexHazardTypeController = IndexHazardTypeController.getInstance()
const HazardType = ref<TitleInterface[]>([])
const setHazardType = (data: TitleInterface[]) => {
  HazardType.value = data
  updateData();
}
const indexEquipmentParams = new IndexEquipmentParams("", 1, 10, 1)
const indexEquipmentController = IndexEquipmentController.getInstance()
const SelectedMachine = ref<TitleInterface[]>([])
const setMachine = (data: TitleInterface[]) => {
  SelectedMachine.value = data
  updateData();
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
    <input placeholder="Add your title" type="text" class="input" id="text" v-model="text">
  </div>
  <div class="col-span-6 md:col-span-2 input-wrapper">
    <label for="date">Date</label>
    <input placeholder="Add your title" type="date" class="input" id="date" v-model="date">
  </div>
  <div class="col-span-6 md:col-span-2 input-wrapper">
    <CustomSelectInput :modelValue="HazardType" class="input" :controller="indexHazardTypeController"
      :params="indexHazardTypeParams" label="HazardType" id="HazardType" placeholder="Select Hazard Type" :type="2"
      @update:modelValue="setHazardType" />
  </div>
  <div class="col-span-6 md:col-span-2 input-wrapper">
    <CustomSelectInput :modelValue="SelectedMachine" class="input" :controller="indexEquipmentController"
      :params="indexEquipmentParams" label="select machine (optional)" id="machine" placeholder="select your machine"
      :type="2" @update:modelValue="setMachine" />
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
