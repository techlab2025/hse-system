<script setup lang="ts">
import TeamsIcon from '@/shared/icons/TeamsIcon.vue'
import TeamMemberCard from './TeamMemberCard.vue'
import type ProjectLocationTeamModel from '@/features/Organization/Project/Data/models/CustomLocation/ProjectLocationTeamModel'
import DeleteProjectlocationTeamEmployeeParams from '@/features/Organization/Project/Core/params/deleteProjectlocationTeamEmployeeParams'
import DeleteProjectLocationTeamEmployeeController from '../../../controllers/DeleteProjectLocationTeamEmployeeController'
import ProjectCustomLocationController from '../../../controllers/ProjectCustomLocationController'
import ProjectCustomLocationParams from '@/features/Organization/Project/Core/params/ProjectCustomLocationParams'
import { useRoute, useRouter } from 'vue-router'
import { ProjectCustomLocationEnum } from '@/features/Organization/Project/Core/Enums/ProjectCustomLocationEnum'
import TeamIcon from '@/shared/icons/TeamIcon.vue'
import AddCreateTeam from '../../Dialogs/CreateTeamDialog/AddCreateTeam.vue'
import type TeamLocation from '@/features/Organization/Project/Data/models/TeamLocationModel'

const props = defineProps<{
  team: ProjectLocationTeamModel
  isShow?: boolean
  location?: TeamLocation | null | undefined
  teamId?: number
  LocationId?: number
  ProjectLocationId?: number
}>()

const projectCustomLocationController = ProjectCustomLocationController.getInstance()

const route = useRoute()
const GetProjectLocationsEmployes = async () => {
  const projectCustomLocationParams = new ProjectCustomLocationParams(
    Number(route?.params?.project_id),
    [ProjectCustomLocationEnum.TEAM_EMPLOYEE, ProjectCustomLocationEnum.EMPLOYEE],
  )
  const response = await projectCustomLocationController.getData(projectCustomLocationParams)
}

const DeleteTeamMember = async (id: number) => {
  const deleteProjectLocationTeamEmployeeparams = new DeleteProjectlocationTeamEmployeeParams(id)
  const deleteProjectLocationTeamEmployeeController =
    DeleteProjectLocationTeamEmployeeController.getInstance()
  await deleteProjectLocationTeamEmployeeController.deleteProjectLocationTeamEmployee(
    deleteProjectLocationTeamEmployeeparams,
    route,
  )
  if (route.path.includes('employee-details')) {
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
          <p class="team-card-members">
            <span>{{ team.Employees?.length }}</span> {{ $t('members') }}
          </p>
        </div>
      </div>
      <div class="state"><i aria-hidden="true"></i>{{ $t('Active') }}</div>
    </div>
    <div class="members-section">
      <TeamMemberCard
        v-for="(member, index) in team.Employees"
        :key="index"
        :member="member"
        @update:data="DeleteTeamMember"
      />

      <AddCreateTeam
        :ProjectLocationId="location?.projectLocationId! || ProjectLocationId"
        :LocationId="location?.locationId! || LocationId"
        @update:data="GetProjectLocationsEmployes"
        :teamId="team.teamId! || teamId"
        :isInCard="true"
        mode="leader"
      />
      <AddCreateTeam
        :ProjectLocationId="location?.projectLocationId! || ProjectLocationId"
        :LocationId="location?.locationId! || LocationId"
        @update:data="GetProjectLocationsEmployes"
        :teamId="team.teamId! || teamId"
        :isInCard="true"
        mode="employee"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.team-card {
  position: relative;
  overflow: hidden;
  height: 100%;
  padding: 15px;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 15%, var(--main-border));
  border-radius: 18px;
  background:
    radial-gradient(
      circle at 100% 0%,
      color-mix(in srgb, var(--PrimaryColor) 7%, transparent),
      transparent 35%
    ),
    var(--surface-1);
  box-shadow: 0 11px 26px color-mix(in srgb, var(--brand-primary-900) 6%, transparent);
}

.team-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 13px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--main-border);
}

.team-card-header-content {
  display: flex;
  align-items: center;
  min-width: 0;
  gap: 10px;
}

.team-card-header-content :deep(.team-icon) {
  width: 40px;
  height: 40px;
  flex: 0 0 40px;
  padding: 8px;
  border-radius: 12px;
  background: color-mix(in srgb, var(--PrimaryColor) 9%, transparent);
}

.team-card-text {
  min-width: 0;
}

.team-card-text .team-card-title {
  overflow: hidden;
  margin: 0;
  color: var(--text-strong);
  font-family: 'Bold';
  font-size: 0.86rem;
  font-weight: 900;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.team-card-text .team-card-members {
  margin: 2px 0 0;
  color: var(--text-soft);
  font-size: 0.66rem;
}

.team-card-members span {
  color: var(--PrimaryColor);
  font-family: 'Bold';
}

.state {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 8px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--status-success) 9%, transparent);
  color: var(--status-success);
  font-size: 0.61rem;
  font-weight: 850;
}

.state i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.members-section {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 9px;
}

@media (max-width: 620px) {
  .members-section {
    grid-template-columns: 1fr;
  }
}
</style>
