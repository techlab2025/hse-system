<script setup lang="ts">
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue';
import { ref, watch } from 'vue';
import IndexOrganizatoinEmployeeParams from '@/features/Organization/OrganizationEmployee/Core/params/indexOrganizatoinEmployeeParams';
import IndexOrganizatoinEmployeeController from '@/features/Organization/OrganizationEmployee/Presentation/controllers/indexOrganizatoinEmployeeController';
import InspectionGeneralForm from './InspectionGeneralForm.vue';
import TitleInterface from '@/base/Data/Models/title_interface'
// import IndexEmployeeParams from '@/features/employee/Core
import InspectionTemplateDialog from '../InspectionDialog/InspectionTemplateDialog.vue'
import IndexProjectController from '@/features/Organization/Project/Presentation/controllers/indexProjectController';
import IndexProjectParams from '@/features/Organization/Project/Core/params/indexProjectParams';
import FetchMyZonesController from '@/features/Organization/ObservationFactory/Presentation/controllers/FetchMyZonesController';
import FetchMyZonesParams from '@/features/Organization/ObservationFactory/Core/params/FetchMyZonesParams';
import type MyZonesModel from '@/features/Organization/ObservationFactory/Data/models/MyZonesModel';

const emit = defineEmits(['update:data'])
const SelectedProject = ref<TitleInterface>()
const SelectedEmployee = ref<TitleInterface>()
const SelectedProjectZone = ref<TitleInterface>()

const indexOrganizatoinEmployeeController = IndexOrganizatoinEmployeeController.getInstance()
const indexEmployeeParams = ref<IndexOrganizatoinEmployeeParams | null>(null);
watch(SelectedProjectZone, (newVal) => {
  indexEmployeeParams.value = new IndexOrganizatoinEmployeeParams('', 1, 10, 1, null, newVal?.id);
});

const indexProjectController = IndexProjectController.getInstance()
const indexProjectParams = new IndexProjectParams('', 1, 10, 1)

const fetchMyZoneController = FetchMyZonesController.getInstance()
const fetchMyZoneParams = ref<FetchMyZonesParams | null>(null)
// watch(SelectedProject, (newVal) => {
//   fetchMyZoneParams.value = new FetchMyZonesParams(newVal?.id);
// });


// const ProjectZoneId = ref<number>()
const UpdateData = () => {
  emit('update:data', {
    morph: SelectedEmployee.value,
    data: Data.value,
    TempalteIds: TempalteIds.value,
    ProjectZoneId: SelectedProjectZone.value?.id,
    ProjectId: SelectedProject.value?.id,
  })
}
const setEmployee = (data: TitleInterface) => {
  SelectedEmployee.value = data
  UpdateData()
}
const Data = ref()

const GetGeneralData = (data) => {
  Data.value = data
  UpdateData()
}
const TempalteIds = ref<number>()
const GetTemplateId = (data: number) => {
  TempalteIds.value = data
  UpdateData()
}

const setProject = (data: TitleInterface) => {
  SelectedProject.value = data
  if (data?.id) {
    GetProjectZones(data?.id)
  }
  UpdateData()
}

const setProjectZone = (data: TitleInterface) => {
  SelectedProjectZone.value = data
  UpdateData()
}

const AllZones = ref<TitleInterface[]>([])

const GetProjectZones = async (projectId: number) => {
  AllZones.value = []

  const params = new FetchMyZonesParams(projectId)
  const state = await fetchMyZoneController.getData(params)

  if (state.value.data) {
    state.value.data.forEach((zone: MyZonesModel) => {
      AllZones.value.push(
        new TitleInterface({
          id: zone.ProjectZoneId,
          title: zone.title,
        })
      )
    })
  }
}
const ClearDate = () => {
  Data.value = {
    PeridWithDate: [],
    bydates: [],
    fromDate: null,
    toDate: null,
    inspectionType: null,
    WithDays: null,
    onceday: null,
    periodByday: null,
    periodType: null,
  }

  UpdateData()
}


</script>

<template>
  <div class="input-wrapper">
    <CustomSelectInput :modelValue="SelectedProject" class="input" :controller="indexProjectController"
      :params="indexProjectParams" label="Projects" id="project" placeholder="select your Project"
      @update:modelValue="setProject" />

    <CustomSelectInput v-if="SelectedProject" :modelValue="SelectedProjectZone" class="input" :static-options="AllZones"
      label="Zones" id="project" placeholder="select your Zone" @update:modelValue="setProjectZone" />


    <CustomSelectInput v-if="SelectedProjectZone" :modelValue="SelectedEmployee" class="input"
      :controller="indexOrganizatoinEmployeeController" :params="indexEmployeeParams" label="Employee" id="employee"
      placeholder="select your employee" @update:modelValue="setEmployee" />

    <InspectionTemplateDialog @update:data="GetTemplateId" />

  </div>
  <InspectionGeneralForm @change:btn="ClearDate" @update:data="GetGeneralData" />
</template>
