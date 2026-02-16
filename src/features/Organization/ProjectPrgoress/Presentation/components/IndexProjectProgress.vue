<script setup lang="ts">
import { onMounted, ref, watch, computed } from 'vue';
import { useRouter } from 'vue-router';

import IndexProjectProgressController from '../controllers/indexProjectProgressController';
import IndexProjectProgressParams from '../../Core/params/indexProjectProgressParams';
import { ProjectProgressEnum } from '../../Core/Enum/ProjectProgressEnum';

import ProjectProgressHeader from '../supcomponents/ProjectProgressHeader.vue';
import ProjectProgressSidebar from '../supcomponents/ProjectProgressSidebar.vue';
import ProjectProgressLoader from '../supcomponents/ProjectProgressLoader.vue';

import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue';

import AddHerikaly from '@/views/Organization/Herikaly/AddHerikaly.vue';
import AddOrganization from '@/views/Organization/OrganizationEmployee/AddOrganization.vue';
import AddCertificate from '@/views/Admin/Certificate/AddCertificate.vue';
import AddTemplate from '@/views/Admin/Template/AddTemplate.vue';
import AddCountry from '@/views/Admin/Location/Country/AddCountry.vue';
import AddState from '@/views/Admin/Location/State/AddState.vue';
import AddCity from '@/views/Admin/Location/City/AddCity.vue';
import AddArea from '@/views/Admin/Location/Area/AddArea.vue';
import AddProjectZone from '@/features/Organization/ProjectZone/Presentation/components/AddProjectZone.vue';
import AddObserverationType from '@/views/Admin/ObserverationType/AddObserverationType.vue';
import AddAccidentsType from '@/views/Admin/Accidents/AddAccidentsType.vue';
import AddHazardType from '@/views/Admin/HazardType/AddHazardType.vue';
import AddHazard from '@/features/setting/SubHazard/Presentation/components/AddHazard.vue';
import AddEquipmentType from '@/views/Admin/EquipmentType/AddEquipmentType.vue';
import AddSerial from '@/views/Organization/SerialNumber/AddSerial.vue';

import ProgressBackIcon from '@/shared/icons/ProgressBackIcon.vue';
import ProgressPageHeaderIcon from '@/shared/icons/ProgressPageHeaderIcon.vue';
import TemplateItemAdd from '../supcomponents/TemplateItemAdd.vue';

/* ---------------- controller ---------------- */

const indexProjectProgressController = IndexProjectProgressController.getInstance()
const state = ref(indexProjectProgressController.state.value)

const getProjectProgress = async () => {
  const params = new IndexProjectProgressParams("", 1, 10, 0)
  await indexProjectProgressController.getData(params)
}

onMounted(getProjectProgress)

watch(() => indexProjectProgressController.state.value, (newVal) => {
  state.value = newVal
})

/* ---------------- active item ---------------- */

const ActiveItem = ref(0)
const GetActiveItem = (value: number) => ActiveItem.value = value


const AllPagesToView = ref([
  { id: ProjectProgressEnum.codingSystem, component: AddSerial, title: "Codeing System", description: "Define Codeing System structure" },
  { id: ProjectProgressEnum.Certificate, component: AddCertificate, title: "Functional Certificate", description: "Define certificate structure and assign related project roles" },
  { id: ProjectProgressEnum.Tempalte, component: TemplateItemAdd, title: "Functional Template", description: "Define templates structure and assign related project roles" },
  { id: ProjectProgressEnum.Employee, component: AddOrganization, title: "Functional Employee", description: "Define employees structure and assign roles within the organization" },
  { id: ProjectProgressEnum.Heirarchy, component: AddHerikaly, title: "Functional Hierarchy", description: "Define the hierarchy and assign roles for your project team" },
  { id: ProjectProgressEnum.Country, component: AddCountry, title: "Functional Country", description: "Define country structure and assign roles across locations" },
  { id: ProjectProgressEnum.State, component: AddState, title: "Functional State", description: "Define state structure and assign roles within each country" },
  { id: ProjectProgressEnum.City, component: AddCity, title: "Functional City", description: "Define city structure and assign roles within each state" },
  { id: ProjectProgressEnum.Locatio, component: AddArea, title: "Functional Location", description: "Define location structure and assign roles within each city" },
  { id: ProjectProgressEnum.Zone, component: AddProjectZone, title: "Functional Zone", description: "Define zone structure and assign roles within each location" },
  { id: ProjectProgressEnum.ObservationType, component: AddObserverationType, title: "Functional Observation Type", description: "Define observation types and assign related project roles" },
  { id: ProjectProgressEnum.IncidantType, component: AddAccidentsType, title: "Functional Incident Type", description: "Define incident types and assign related project roles" },
  { id: ProjectProgressEnum.HazardType, component: AddHazardType, title: "Functional Hazard Type", description: "Define hazard types and assign related project roles" },
  { id: ProjectProgressEnum.Hazard, component: AddHazard, title: "Functional Hazard", description: "Define hazards and assign roles for risk management" },
  { id: ProjectProgressEnum.EquipmentType, component: AddEquipmentType, title: "Functional Equipment Type", description: "Define equipment types and assign roles for asset management" },
])

const selectedPage = computed(() =>
  AllPagesToView.value.find(item => item.id === ActiveItem.value)
)


const router = useRouter()
const routerBack = () => router.back()

</script>

<template>
  <div class="project-progress-container">

    <div class="project-progress-actions">
      <div class="back" @click="routerBack">
        <ProgressBackIcon />
        <span>Back</span>
      </div>
    </div>

    <DataStatus :controller="state">

      <template #success>

        <ProjectProgressHeader :progressValue="state.data?.progress" />

        <div class="project-progress-body-container">

          <div class="project-progress-body-sidebar">
            <ProjectProgressSidebar @update:ActiveItem="GetActiveItem" :sidebarItems="state.data?.progressItems" />
          </div>

          <!-- FIXED AREA -->
          <div class="project-progress-body-content" v-if="selectedPage">

            <div class="content-header">
              <div class="flex items-center gap-2">
                <h2 class="title">{{ selectedPage.title }}</h2>
                <ProgressPageHeaderIcon />
              </div>
              <p class="description">{{ selectedPage.description }}</p>
            </div>

            <component :is="selectedPage.component" :key="selectedPage.id" class="full-content"
              @update:data="getProjectProgress" />

          </div>

        </div>

      </template>

      <template #loader>
        <ProjectProgressLoader />
      </template>

      <template #initial>
        <ProjectProgressLoader />
      </template>

    </DataStatus>

  </div>
</template>

<style scoped>
.project-progress-body-content {
  margin-left: auto;
  margin-right: auto;
  padding: 50px;
}
</style>
