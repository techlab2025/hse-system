<script setup lang="ts">
import EmployeeIcon from '@/assets/images/EmployeeIcon.png'
import HeaderSection from '../Details/DetailsHeader/HeaderSection.vue'
import TeamMemberCard from '../Details/LocationsTeams/TeamMemberCard.vue'
import { onMounted, ref, watch } from 'vue'
import TeamCard from '../Details/LocationsTeams/TeamCard.vue'
import AddCreateTeam from '../Dialogs/CreateTeamDialog/AddCreateTeam.vue'
import { useRoute } from 'vue-router'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import TableLoader from '@/shared/DataStatues/TableLoader.vue'
import DataEmpty from '@/shared/DataStatues/DataEmpty.vue'
import ProjectCustomLocationParams from '../../../Core/params/ProjectCustomLocationParams'
import ProjectCustomLocationController from '../../controllers/ProjectCustomLocationController'
import { ProjectCustomLocationEnum } from '../../../Core/Enums/ProjectCustomLocationEnum'

const router = useRoute()
const id = router.params.project_id
const projectCustomLocationController = ProjectCustomLocationController.getInstance()
const state = ref(projectCustomLocationController.state.value)

const GetProjectLocationsEmployes = async () => {
  const projectCustomLocationParams = new ProjectCustomLocationParams(id, [
    ProjectCustomLocationEnum.TEAM_EMPLOYEE,
    ProjectCustomLocationEnum.EMPLOYEE,
  ])
  const response = await projectCustomLocationController.getData(
    projectCustomLocationParams,
  )
  console.log(response.value.data, 'response.va')
}

const DeleteMember = (id: number) => {
  console.log(id, 'delete')
}
onMounted(() => {
  GetProjectLocationsEmployes()
})
watch(
  () => projectCustomLocationController.state.value,
  (newState) => {
    state.value = newState
  },
)
</script>
<template>
  <DataStatus :controller="state">
    <template #success>
      <div class="emoloyees-details" v-for="(locationTeam, index) in state.data" :key="index">
        <div class="card-header">
          <HeaderSection
            :img="EmployeeIcon"
            :title="locationTeam?.title"
            :subtitle="locationTeam?.locationEmplyees?.length"
          />

          <div class="card-actions">
            <RouterLink :to="`/organization/project-hierarchy/project/${id}`" class="edit-btn">
              Edit Hierarchy
            </RouterLink>
            <AddCreateTeam
              :ProjectLocationId="locationTeam.projectLocationId"
              :LocationId="locationTeam.id"
              @update:data="GetProjectLocationsEmployes"
            />
            <RouterLink :to="`/organization/project-employee/project/${id}`" class="add-btn">
              Add employee
            </RouterLink>
          </div>
        </div>
        <hr class="employee-hr" />
        <div class="employees-section">
          <TeamMemberCard
            @update:data="DeleteMember(index)"
            class="employee-card"
            v-for="(member, index) in locationTeam.locationEmplyees"
            :key="index"
            :member="member"
          />
        </div>
        <div class="project-teams-cards">
          <TeamCard
            class="employee-card"
            v-for="(team, index) in locationTeam.locationTeams"
            :key="index"
            :team="team"
          />
        </div>
      </div>
    </template>
    <template #loader>
      <TableLoader :cols="3" :rows="10" />
    </template>
    <template #initial>
      <TableLoader :cols="3" :rows="10" />
    </template>
    <template #empty>
      <DataEmpty
        :link="`/add-project`"
        description="Sorry .. You have no project types .. All your joined customers will appear here when you add your customer data"
        title="..ops! You have No Projects"
        addText="Add Projects"
      />
    </template>
    <template #failed>
      <DataFailed />
    </template>
  </DataStatus>
</template>
