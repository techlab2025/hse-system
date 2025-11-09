<script setup lang="ts">
import { useRoute } from 'vue-router';
import ShowProjectDetailsParams from '../../../Core/params/ShowProjectDetailsParams';
import ShowProjectDetailsController from '../../controllers/ShowProjectDetailsController';
import EquipmentSection from './Equipment/EquipmentSection.vue';
import LocationsTeamsSection from './LocationsTeams/LocationsTeamsSection.vue';
import MainObjectivesSection from './Objectives/MainObjectivesSection.vue';
import ProjectSiteSection from './ProjectSite/ProjectSiteSection.vue';
import { onMounted, ref } from 'vue';
import type ShowProjectDetailsModel from '../../../Data/models/ShowProjectDeatilsModel';

const route = useRoute();
const id = route.params.id
const ProjectDetails = ref<ShowProjectDetailsModel>(null);
const GetProjectDetails = async () => {
  const showProjectDetailsParams = new ShowProjectDetailsParams(id);
  const showProjectDetailsController = ShowProjectDetailsController.getInstance();
  const state = await showProjectDetailsController.showProjectDetails(showProjectDetailsParams);
  if (state.value.data) {
    ProjectDetails.value = state.value.data
    console.log(state.value.data, "state.value.data");
  }
}

onMounted(() => {
  GetProjectDetails();
})

</script>
<template>
  <div class="project-details-section">
    <MainObjectivesSection :description="ProjectDetails?.description" />
    <ProjectSiteSection :locations="ProjectDetails?.locations" />
    <LocationsTeamsSection :teamLocations="ProjectDetails?.TeamLocations" />
    <EquipmentSection :project_zoons="ProjectDetails?.projectZoons" />
  </div>
</template>
