<script setup lang="ts">
import { useRoute } from 'vue-router'
import ShowProjectDetailsParams from '../../../Core/params/ShowProjectDetailsParams'
import ShowProjectDetailsController from '../../controllers/ShowProjectDetailsController'
import EquipmentSection from './Equipment/EquipmentSection.vue'
import LocationsTeamsSection from './LocationsTeams/LocationsTeamsSection.vue'
import MainObjectivesSection from './Objectives/MainObjectivesSection.vue'
import ProjectSiteSection from './ProjectSite/ProjectSiteSection.vue'
import { onMounted, ref, watch } from 'vue'
import type ShowProjectDetailsModel from '../../../Data/models/ShowProjectDeatilsModel'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import TableLoader from '@/shared/DataStatues/TableLoader.vue'
import DataEmpty from '@/shared/DataStatues/DataEmpty.vue'
import DataFailed from '@/shared/DataStatues/DataFailed.vue'
import InspectionsSections from './Inspection/InspectionsSections.vue'
import zoneInspectionTasks from '@/assets/images/check-list.png'
import EmployeeInspectionTasks from '@/assets/images/employee Inspection Tasks.png'
import ProjectHeader from './PorjectUtils/ProjectHeader.vue'

const showProjectDetailsController = ShowProjectDetailsController.getInstance()
const state = ref(showProjectDetailsController.state.value)

const route = useRoute()
const id = route.params.id
const ProjectDetails = ref<ShowProjectDetailsModel>(null)
const GetProjectDetails = async () => {
  const showProjectDetailsParams = new ShowProjectDetailsParams(id)
  const state = await showProjectDetailsController.showProjectDetails(showProjectDetailsParams)
  if (state.value.data) {
    ProjectDetails.value = state.value.data
  }
}

onMounted(() => {
  GetProjectDetails()
})

watch(
  () => showProjectDetailsController.state.value,
  (newState) => {
    state.value = newState
  },
)
</script>
<template>
  <DataStatus :controller="state">
    <template #success>
      <div class="project-details-section">
        <ProjectHeader :projectName="state.data?.title" :SerialNumber="state.data?.SerialNumber"
          :Projectdate="state.data?.startDate" :Contractors="state.data?.contractors?.length" />
        <MainObjectivesSection :description="state.data?.description" />

        <!-- <div class="inspections-sections">
          <InspectionsSections :inspectionsImage="zoneInspectionTasks" :inspectionHeaderTitle="'zone Inspection Tasks'"
            :inspectionHeaderSubtitle="'Track and manage all inspection assignments by zone.'" :showHeader="true"
            :showArrowLink="true" :isAssign="false" />
          <hr class="divider" />
          <InspectionsSections :inspectionsImage="EmployeeInspectionTasks"
            :inspectionHeaderTitle="'employee Inspection Tasks'"
            :inspectionHeaderSubtitle="'Track and manage all inspection assignments for employee'" :showHeader="false"
            :showArrowLink="false" :isAssign="false" />
        </div> -->


        <ProjectSiteSection :locations="state.data?.locations" :projectId="state.data?.id" />
        <LocationsTeamsSection :teamLocations="state.data?.TeamLocations"
          :project_locations="state.data?.project_locations" :hierarchy="state.data?.hierarchies" />
        <EquipmentSection :project_zoons="state.data?.projectZoons" />
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
