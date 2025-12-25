<script setup lang="ts">
import TitleInterface from '@/base/Data/Models/title_interface'
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue'
import { ref } from 'vue'
import FetchProjectZoneController from '../../controllers/FetchProjectZoneController'
import FetchProjectZonesParams from '../../../Core/params/FetchProjectZonesParams'
import InspectionGeneralForm from './InspectionGeneralForm.vue'
import InspectionTemplateDialog from '@/features/Organization/Inspection/Presentation/components/InspectionDialog/InspectionTemplateDialog.vue'
import FetchMyProjectsController from '@/features/Organization/ObservationFactory/Presentation/controllers/FetchMyProjectsController'
import FetchMyProjectsParams from '@/features/Organization/ObservationFactory/Core/params/fetchMyProjectsParams'
import FetchMyZonesController from '@/features/Organization/ObservationFactory/Presentation/controllers/FetchMyZonesController'
import FetchMyZonesParams from '@/features/Organization/ObservationFactory/Core/params/FetchMyZonesParams'
import { PeriodTypeEnum } from '../../../Core/Enum/PeriodTypeEnum'

const emit = defineEmits(['update:data'])
const SelectedZones = ref<TitleInterface>()

// const fetchProjectZoneController = FetchProjectZoneController.getInstance()
// const fetchProjectZonesParams = new FetchProjectZonesParams(37)
const SelectedProject = ref<TitleInterface>()

const fetchMyProjectsController = FetchMyProjectsController.getInstance()
const fetchMyProjectsParams = new FetchMyProjectsParams()

const fetchMyZonesController = FetchMyZonesController.getInstance()
// const fetchMyZoneaParams = new FetchMyZonesParams(SelectedProject?.value?.id)
const fetchMyZoneaParams = ref(new FetchMyZonesParams(null))

const UpdateData = () => {
  emit('update:data', {
    morph: SelectedZones.value,
    data: date.value,
    TempalteIds: TempalteIds.value,
  })
}
const setZones = (data: TitleInterface) => {
  SelectedZones.value = data
  UpdateData()
}

const date = ref()
const GetGeneralData = (data) => {
  date.value = data
  UpdateData()
}
const TempalteIds = ref<number>()
const GetTemplateId = (data: number) => {
  TempalteIds.value = data
  UpdateData()
}

const setProject = (data: TitleInterface) => {
  SelectedProject.value = data
  fetchMyZoneaParams.value = new FetchMyZonesParams(SelectedProject.value?.id || null)
  UpdateData()
}

const ClearDate = () => {
  // date.value = null

}

</script>
<template>
  <div class="grid grid-cols-4 gap-2">

    <div class="input-wrapper col-span-2 pt-15">
      <CustomSelectInput :modelValue="SelectedProject" class="input" :controller="fetchMyProjectsController"
        :params="fetchMyProjectsParams" :label="$t('Projects')" id="employee" placeholder="select your project"
        @update:modelValue="setProject" />
    </div>

    <div class="input-wrapper col-span-2" v-if="SelectedProject">
      <CustomSelectInput :modelValue="SelectedZones" class="input" :controller="fetchMyZonesController"
        :params="fetchMyZoneaParams" :label="$t('Zone')" id="employee" placeholder="select your Zone"
        @update:modelValue="setZones" />
    </div>
    <!-- Dialog -->
    <div class="input-wrapper col-span-2">
      <InspectionTemplateDialog @update:data="GetTemplateId" />
    </div>
  </div>

  <InspectionGeneralForm @change:btn="ClearDate" @update:data="GetGeneralData" />
</template>
