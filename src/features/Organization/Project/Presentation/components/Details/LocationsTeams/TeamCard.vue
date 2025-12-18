<script setup lang="ts">
import TeamsIcon from '@/shared/icons/TeamsIcon.vue';
import TeamMemberCard from './TeamMemberCard.vue';
import type ProjectLocationTeamModel from '@/features/Organization/Project/Data/models/CustomLocation/ProjectLocationTeamModel';
import DeleteProjectlocationTeamEmployeeParams from '@/features/Organization/Project/Core/params/deleteProjectlocationTeamEmployeeParams';
import DeleteProjectLocationTeamEmployeeController from '../../../controllers/DeleteProjectLocationTeamEmployeeController';


const props = defineProps<{
  team: ProjectLocationTeamModel
}>()

const DeleteTeamMember = async (id: number) => {
  const deleteProjectLocationTeamEmployeeparams = new DeleteProjectlocationTeamEmployeeParams(id)
  const deleteProjectLocationTeamEmployeeController = DeleteProjectLocationTeamEmployeeController.getInstance();
  await deleteProjectLocationTeamEmployeeController.deleteProjectLocationTeamEmployee(deleteProjectLocationTeamEmployeeparams)
}

</script>

<template>

  <div class="team-card">
    <div class="team-card-header">
      <div class="team-card-header-content">
        <TeamsIcon class="team-icon" />
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
