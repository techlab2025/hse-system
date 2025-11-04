<script setup lang="ts">
import { useRoute } from 'vue-router';
import ShowProjectDetailsParams from '../../../Core/params/ShowProjectDetailsParams';
import ShowProjectDetailsController from '../../controllers/ShowProjectDetailsController';
import EquipmentSection from './Equipment/EquipmentSection.vue';
import LocationsTeamsSection from './LocationsTeams/LocationsTeamsSection.vue';
import MainObjectivesSection from './Objectives/MainObjectivesSection.vue';
import ProjectSiteSection from './ProjectSite/ProjectSiteSection.vue';
import { onMounted } from 'vue';

const route = useRoute();
const id = route.params.id
const GetProjectDetails = async () => {
  const showProjectDetailsParams = new ShowProjectDetailsParams(id);
  const showProjectDetailsController = ShowProjectDetailsController.getInstance();
  const state = await showProjectDetailsController.showProjectDetails(showProjectDetailsParams);
  if (state.value.data) {
    console.log(state.value.data, "state.value.data");
  }
}

onMounted(() => {
  GetProjectDetails();
})

</script>
<template>
  <div class="project-details-section">
    <MainObjectivesSection />
    <ProjectSiteSection />
    <LocationsTeamsSection />
    <EquipmentSection />
  </div>
</template>
