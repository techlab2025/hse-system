<script setup lang="ts">
import TeamsIcon from '@/shared/icons/TeamsIcon.vue';
import TeamMemberCard from './TeamMemberCard.vue';
import type ProjectLocationTeamModel from '@/features/Organization/Project/Data/models/CustomLocation/ProjectLocationTeamModel';
import DeleteProjectlocationTeamEmployeeParams from '@/features/Organization/Project/Core/params/deleteProjectlocationTeamEmployeeParams';
import DeleteProjectLocationTeamEmployeeController from '../../../controllers/DeleteProjectLocationTeamEmployeeController';
import ProjectCustomLocationController from '../../../controllers/ProjectCustomLocationController';
import ProjectCustomLocationParams from '@/features/Organization/Project/Core/params/ProjectCustomLocationParams';
import { useRoute, useRouter } from 'vue-router';
import { ProjectCustomLocationEnum } from '@/features/Organization/Project/Core/Enums/ProjectCustomLocationEnum';
import TeamIcon from '@/shared/icons/TeamIcon.vue';


const props = defineProps<{
  team: ProjectLocationTeamModel
  isShow?: boolean
}>()

const projectCustomLocationController = ProjectCustomLocationController.getInstance()

const route = useRoute();
const GetProjectLocationsEmployes = async () => {
  const projectCustomLocationParams = new ProjectCustomLocationParams(route?.params?.project_id, [
    ProjectCustomLocationEnum.TEAM_EMPLOYEE,
    ProjectCustomLocationEnum.EMPLOYEE,
  ])
  const response = await projectCustomLocationController.getData(
    projectCustomLocationParams,
  )
}

const DeleteTeamMember = async (id: number) => {
  const deleteProjectLocationTeamEmployeeparams = new DeleteProjectlocationTeamEmployeeParams(id)
  const deleteProjectLocationTeamEmployeeController = DeleteProjectLocationTeamEmployeeController.getInstance();
  await deleteProjectLocationTeamEmployeeController.deleteProjectLocationTeamEmployee(deleteProjectLocationTeamEmployeeparams, route)
  if (route.path.includes("employee-details")) {
    GetProjectLocationsEmployes()
  }
}

</script>

<template>

  <div class="team-card" v-if="team.Employees?.length > 0">
    <div class="team-card-header">
      <div class="team-card-header-content">
        <TeamsIcon v-if="!isShow" class="team-icon" />
        <TeamIcon v-else class="team-icon" />
        <div class="team-card-text">
          <p class="team-card-title">{{ team.teamTitle }}</p>
          <p class="team-card-members"><span>{{ team.Employees?.length }}</span> members</p>
        </div>
      </div>
      <div class="state">
        <!-- <button>Done</button> -->
      </div>
    </div>
    <div class="members-section">

      <TeamMemberCard v-for="(member, index) in team.Employees" :key="index" :member="member"
        @update:data="DeleteTeamMember" />
    </div>
  </div>
</template>
