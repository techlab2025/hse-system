<script setup lang="ts">
import { useRoute } from 'vue-router';
import ShowProjectDetailsParams from '../../../Core/params/ShowProjectDetailsParams';
import ShowProjectDetailsController from '../../controllers/ShowProjectDetailsController';
import EquipmentSection from './Equipment/EquipmentSection.vue';
import LocationsTeamsSection from './LocationsTeams/LocationsTeamsSection.vue';
import MainObjectivesSection from './Objectives/MainObjectivesSection.vue';
import ProjectSiteSection from './ProjectSite/ProjectSiteSection.vue';
import { onMounted, ref, watch } from 'vue';
import type ShowProjectDetailsModel from '../../../Data/models/ShowProjectDeatilsModel';
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import TableLoader from '@/shared/DataStatues/TableLoader.vue'
import DataEmpty from '@/shared/DataStatues/DataEmpty.vue'
import DataFailed from '@/shared/DataStatues/DataFailed.vue'

const showProjectDetailsController = ShowProjectDetailsController.getInstance();
const state = ref(showProjectDetailsController.state.value);

const route = useRoute();
const id = route.params.id
const ProjectDetails = ref<ShowProjectDetailsModel>(null);
const GetProjectDetails = async () => {
  const showProjectDetailsParams = new ShowProjectDetailsParams(id);
  const state = await showProjectDetailsController.showProjectDetails(showProjectDetailsParams);
  if (state.value.data) {
    ProjectDetails.value = state.value.data
  }
}

onMounted(() => {
  GetProjectDetails();
})

watch(() => showProjectDetailsController.state.value, (newState) => {
  state.value = newState
})
</script>
<template>


  <DataStatus :controller="state">
    <template #success>
      <div class="project-details-section">
        <MainObjectivesSection :description="ProjectDetails?.description" />
        <ProjectSiteSection :locations="ProjectDetails?.locations" />
        <LocationsTeamsSection :teamLocations="ProjectDetails?.TeamLocations" />
        <EquipmentSection :project_zoons="ProjectDetails?.projectZoons" />
      </div>
    </template>
    <template #loader>
      <TableLoader :cols="8" :rows="10" />
    </template>
    <template #initial>
      <TableLoader :cols="8" :rows="10" />
    </template>
    <template #empty>
      <DataEmpty :link="`/organization/project/add`" addText="Add Project"
        description="Sorry .. You have no Project .. All your joined customers will appear here when you add your customer data"
        title="..ops! You have No Project" />
    </template>
    <template #failed>
      <DataFailed :link="`/organization/project/add`" addText="Add Project"
        description="Sorry .. You have no Project .. All your joined customers will appear here when you add your customer data"
        title="..ops! You have No Project" />
    </template>
  </DataStatus>

</template>
