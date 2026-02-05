<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import IndexProjectProgressController from '../controllers/indexProjectProgressController';
import ProjectProgressHeader from '../supcomponents/ProjectProgressHeader.vue';
import ProjectProgressSidebar from '../supcomponents/ProjectProgressSidebar.vue';
import IndexProjectProgressParams from '../../Core/params/indexProjectProgressParams';
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import TableLoader from '@/shared/DataStatues/TableLoader.vue'
import DataEmpty from '@/shared/DataStatues/DataEmpty.vue'
import AddHerikaly from '@/views/Organization/Herikaly/AddHerikaly.vue';
import AddProject from '@/views/Organization/Project/AddProject.vue';
import AddEquipment from '@/views/Admin/Equipment/AddEquipment.vue';
import AddOrganization from '@/views/Organization/OrganizationEmployee/AddOrganization.vue';
import AddTeams from '@/views/Admin/Teams/AddTeams.vue';
import SkipIcon from '@/shared/icons/SkipIcon.vue';
import ProgressBackIcon from '@/shared/icons/ProgressBackIcon.vue';
import { useRouter } from 'vue-router';
import ProgressPageHeaderIcon from '@/shared/icons/ProgressPageHeaderIcon.vue';
import { ProjectProgressEnum } from '../../Core/Enum/ProjectProgressEnum';
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
import ProjectProgressLoader from '../supcomponents/ProjectProgressLoader.vue';
import ProgressComplate from "@/assets/images/ProgressComplate.png"

const indexProjectProgressController = IndexProjectProgressController.getInstance()
const state = ref(indexProjectProgressController.state.value)
const getProjectProgress = async () => {
  const indexProjectProgressParams = new IndexProjectProgressParams("", 1, 10, 0)
  const response = await indexProjectProgressController.getData(indexProjectProgressParams)
}
onMounted(() => {
  getProjectProgress()
})

watch(() => indexProjectProgressController.state.value, (newVal) => {
  state.value = newVal
})

const ActiveItem = ref(0)
const GetActiveItem = (value: number) => {
  ActiveItem.value = value
}


const AllPagesToView = ref([
  {
    id: ProjectProgressEnum.Certificate,
    component: AddCertificate,
    title: "Functional Certificate",
    description: "Define certificate structure and assign related project roles",
  },
  {
    id: ProjectProgressEnum.Tempalte,
    component: AddTemplate,
    title: "Functional Template",
    description: "Define templates structure and assign related project roles",
  },
  {
    id: ProjectProgressEnum.Employee,
    component: AddOrganization,
    title: "Functional Employee",
    description: "Define employees structure and assign roles within the organization",
  },
  {
    id: ProjectProgressEnum.Heirarchy,
    component: AddHerikaly,
    title: "Functional Hierarchy",
    description: "Define the hierarchy and assign roles for your project team",
  },
  {
    id: ProjectProgressEnum.Country,
    component: AddCountry,
    title: "Functional Country",
    description: "Define country structure and assign roles across locations",
  },
  {
    id: ProjectProgressEnum.State,
    component: AddState,
    title: "Functional State",
    description: "Define state structure and assign roles within each country",
  },
  {
    id: ProjectProgressEnum.City,
    component: AddCity,
    title: "Functional City",
    description: "Define city structure and assign roles within each state",
  },
  {
    id: ProjectProgressEnum.Locatio,
    component: AddArea,
    title: "Functional Location",
    description: "Define location structure and assign roles within each city",
  },
  {
    id: ProjectProgressEnum.Zone,
    component: AddProjectZone,
    title: "Functional Zone",
    description: "Define zone structure and assign roles within each location",
  },
  {
    id: ProjectProgressEnum.ObservationType,
    component: AddObserverationType,
    title: "Functional Observation Type",
    description: "Define observation types and assign related project roles",
  },
  {
    id: ProjectProgressEnum.IncidantType,
    component: AddAccidentsType,
    title: "Functional Incident Type",
    description: "Define incident types and assign related project roles",
  },
  {
    id: ProjectProgressEnum.HazardType,
    component: AddHazardType,
    title: "Functional Hazard Type",
    description: "Define hazard types and assign related project roles",
  },
  {
    id: ProjectProgressEnum.Hazard,
    component: AddHazard,
    title: "Functional Hazard",
    description: "Define hazards and assign roles for risk management",
  },
  {
    id: ProjectProgressEnum.EquipmentType,
    component: AddEquipmentType,
    title: "Functional Equipment Type",
    description: "Define equipment types and assign roles for asset management",
  },
]);

const router = useRouter()
const routerBack = () => {
  router.back();
}
</script>


<template>
  <div class="project-progress-container">
    <div class="project-progress-actions">
      <div class="back" @click="routerBack">
        <ProgressBackIcon />
        <span>Back</span>
      </div>
      <!-- <router-link to="/organization" class="skip">
        <span>skip</span>
        <SkipIcon />
      </router-link> -->
    </div>
    <DataStatus :controller="state">
      <template #success>
        <ProjectProgressHeader v-if="state.data?.progress" :progressValue="state.data?.progress" />
        <div class="project-progress-body-container">
          <div class="project-progress-body-sidebar">
            <ProjectProgressSidebar @update:ActiveItem="GetActiveItem" :sidebarItems="state.data?.progressItems" />
          </div>
          <div class="project-progress-body-content" v-if="AllPagesToView.find((item) => item.id == ActiveItem)">
            <div class="content-header">
              <div class="flex items-center gap-2">
                <h2 class="title">{{AllPagesToView.find((item) => item.id == ActiveItem)?.title}}</h2>
                <ProgressPageHeaderIcon />
              </div>
              <p class="description">{{AllPagesToView.find((item) => item.id == ActiveItem)?.description}}</p>
            </div>
            <component @update:data="getProjectProgress" class="full-content"
              :is="AllPagesToView.find((item) => item.id == ActiveItem)?.component" />

          </div>

          <div v-else class="project-progress-body-content flex flex-col items-center justify-start">
            <img class="complate-img" :src="ProgressComplate" alt=" complate">
            <p class="complate-title">Great! You've hit the target.</p>
            <p class="complate-description">You have completed all the required steps. Would you like to complete the
              remaining 3 steps?</p>
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

  .complate-img {
    width: 120px;
    height: 120px;
    /* padding: 30px; */
  }

  .complate-title {
    font-size: 24px;
    font-weight: 700;
    color: #000000;
    text-align: center;
  }

  .complate-description {
    font-size: 16px;
    font-weight: 500;
    color: #AAAAAA;
  }
}
</style>
