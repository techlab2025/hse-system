<script setup lang="ts">
import TitleInterface from '@/base/Data/Models/title_interface';
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue';
import { ref } from 'vue';
import FetchProjectZoneController from '../../controllers/FetchProjectZoneController';
import FetchProjectZonesParams from '../../../Core/params/FetchProjectZonesParams';
import InspectionGeneralForm from './InspectionGeneralForm.vue';

const emit = defineEmits(['update:data'])
const SelectedZones = ref<TitleInterface>()

const fetchProjectZoneController = FetchProjectZoneController.getInstance()
const fetchProjectZonesParams = new FetchProjectZonesParams(37)

const UpdateData = () => {
  emit('update:data', {
    zones: SelectedZones.value,
    data: Data.value
  })
}
const setZones = (data: TitleInterface) => {
  SelectedZones.value = data
  UpdateData()
}

const Data = ref()
const GetGeneralData = (data) => {
  Data.value = data
  UpdateData();
}



</script>
<template>

  <div class="input-wrapper">
    <CustomSelectInput :modelValue="SelectedZones" class="input" :controller="fetchProjectZoneController"
      :params="fetchProjectZonesParams" :label="$t('Zone')" id="employee" placeholder="select your employee"
      @update:modelValue="setZones" />
  </div>
  <!-- Dialog -->

  <InspectionGeneralForm @update:data="GetGeneralData" />


</template>
