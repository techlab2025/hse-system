<script setup lang="ts">
import EmployeeIcon from '@/assets/images/EmployeeIcon.png'
import HeaderSection from '../Details/DetailsHeader/HeaderSection.vue'
import TeamMemberCard from '../Details/LocationsTeams/TeamMemberCard.vue'
import { computed, onMounted, ref, watch } from 'vue'
import TeamCard from '../Details/LocationsTeams/TeamCard.vue'
import AddCreateTeam from '../Dialogs/CreateTeamDialog/AddCreateTeam.vue'
import { useRoute } from 'vue-router'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import TableLoader from '@/shared/DataStatues/TableLoader.vue'
import DataEmpty from '@/shared/DataStatues/DataEmpty.vue'
import DataFailed from '@/shared/DataStatues/DataFailed.vue'
import ProjectCustomLocationParams from '../../../Core/params/ProjectCustomLocationParams'
import ProjectCustomLocationController from '../../controllers/ProjectCustomLocationController'
import { ProjectCustomLocationEnum } from '../../../Core/Enums/ProjectCustomLocationEnum'

import DeleteProjectlocationHierarchyEmployeeParams from '../../../Core/params/deleteProjectlocationHierarchyEmployeeParams'
import DeleteProjectLocationHeirarchyEmployeeController from '../../controllers/DeleteProjectLocationHeirarchyEmployeeController'

const router = useRoute()
const id = router.params.project_id
const projectCustomLocationController = ProjectCustomLocationController.getInstance()
const state = ref(projectCustomLocationController.state.value)

const locationsCount = computed(() => state.value?.data?.length || 0)
const employeesCount = computed(() =>
  (state.value?.data || []).reduce(
    (total: number, location: any) => total + (location?.locationEmplyees?.length || 0),
    0,
  ),
)
const teamsCount = computed(() =>
  (state.value?.data || []).reduce(
    (total: number, location: any) => total + (location?.locationTeams?.length || 0),
    0,
  ),
)

const GetProjectLocationsEmployes = async () => {
  const projectCustomLocationParams = new ProjectCustomLocationParams(id, [
    ProjectCustomLocationEnum.TEAM_EMPLOYEE,
    ProjectCustomLocationEnum.EMPLOYEE,
    ProjectCustomLocationEnum.HIERARCHY,
    ProjectCustomLocationEnum.HIERARCHY_EMPLOYEE,
  ])
  await projectCustomLocationController.getData(projectCustomLocationParams)
}

const route = useRoute()
const DeleteMember = async (id: number) => {
  const deleteProjectLocationTeamEmployeeparams = new DeleteProjectlocationHierarchyEmployeeParams(
    id,
  )
  const deleteProjectLocationTeamEmployeeController =
    DeleteProjectLocationHeirarchyEmployeeController.getInstance()
  await deleteProjectLocationTeamEmployeeController.deleteProjectLocationHeirarchyEmployee(
    deleteProjectLocationTeamEmployeeparams,
    route,
  )
  GetProjectLocationsEmployes()
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
      <section class="people-overview" aria-label="Project people overview">
        <div class="overview-copy">
          <span class="overview-kicker">{{ $t('Project workforce') }}</span>
          <h2>{{ $t('People and teams at a glance') }}</h2>
          <p>
            {{
              $t('Manage positions, employees and working teams for every operational location.')
            }}
          </p>
        </div>
        <div class="overview-stats">
          <div class="stat-item stat-locations">
            <span class="stat-icon">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
            </span>
            <span
              ><strong>{{ locationsCount }}</strong
              >{{ $t('Locations') }}</span
            >
          </div>
          <div class="stat-item stat-employees">
            <span class="stat-icon">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="9" cy="8" r="3" />
                <path
                  d="M3.5 20v-2a5.5 5.5 0 0 1 11 0v2M16 4.5a3 3 0 0 1 0 5.8M17 13a5.5 5.5 0 0 1 3.5 5.1V20"
                />
              </svg>
            </span>
            <span
              ><strong>{{ employeesCount }}</strong
              >{{ $t('Employees') }}</span
            >
          </div>
          <div class="stat-item stat-teams">
            <span class="stat-icon">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M4 19a4 4 0 0 1 4-4h2a4 4 0 0 1 4 4M6 8a3 3 0 1 0 6 0 3 3 0 0 0-6 0ZM15 11a2.5 2.5 0 1 0 0-5M16 14a4 4 0 0 1 4 4v1"
                />
              </svg>
            </span>
            <span
              ><strong>{{ teamsCount }}</strong
              >{{ $t('Teams') }}</span
            >
          </div>
        </div>
      </section>

      <div class="locations-list">
        <article
          class="emoloyees-details"
          v-for="(locationTeam, index) in state.data"
          :key="locationTeam.id || index"
        >
          <div class="card-header">
            <div class="location-heading">
              <span class="location-number">{{ String(index + 1).padStart(2, '0') }}</span>
              <HeaderSection
                :img="EmployeeIcon"
                :title="locationTeam?.title"
                :subtitle="`${locationTeam?.locationEmplyees?.length || 0} ${$t('employees')} · ${locationTeam?.locationTeams?.length || 0} ${$t('teams')}`"
              />
            </div>

            <div class="card-actions">
              <RouterLink
                :to="`/organization/project-hierarchy/project/${id}?locationId=${locationTeam.id}`"
                class="edit-btn"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 20V10M6 20v-4M18 20V4M4 20h16" />
                </svg>
                {{ $t('Add Position') }}
              </RouterLink>
              <AddCreateTeam
                :ProjectLocationId="locationTeam.projectLocationId"
                :LocationId="locationTeam.id"
                @update:data="GetProjectLocationsEmployes"
                v-if="
                  locationTeam?.locationHierarchies?.length! > 0 &&
                  locationTeam.locationEmplyees?.length! > 0
                "
              />
              <RouterLink
                :to="`/organization/project-employee/project/${id}?locationId=${locationTeam.id}`"
                class="add-btn btn"
                v-if="locationTeam?.locationHierarchies?.length! > 0"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
                {{ $t('Add Employee') }}
              </RouterLink>
            </div>
          </div>

          <section class="content-block">
            <div class="content-heading">
              <div>
                <span class="content-icon employee-icon"
                  ><svg viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="9" cy="8" r="3" />
                    <path
                      d="M3.5 20v-2a5.5 5.5 0 0 1 11 0v2M16 5a3 3 0 0 1 0 6M17 14a5 5 0 0 1 3.5 4.8V20"
                    /></svg
                ></span>
                <span
                  ><strong>{{ $t('Assigned employees') }}</strong
                  ><small>{{ $t('People working at this location') }}</small></span
                >
              </div>
              <span class="count-badge">{{ locationTeam.locationEmplyees?.length || 0 }}</span>
            </div>
            <div class="employees-section" v-if="locationTeam.locationEmplyees?.length">
              <TeamMemberCard
                @update:data="DeleteMember"
                class="employee-card"
                v-for="(member, index) in locationTeam.locationEmplyees"
                :key="index"
                :member="member"
              />
            </div>
            <div class="section-empty" v-else>
              <!-- <span>+</span> -->
              <p>
                <strong>{{ $t('No employees assigned yet') }}</strong
                ><small>{{
                  $t('Add a position first, then assign employees to this location.')
                }}</small>
              </p>
            </div>
          </section>

          <section class="content-block teams-block">
            <div class="content-heading">
              <div>
                <span class="content-icon team-icon"
                  ><svg viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="8" cy="8" r="3" />
                    <circle cx="17" cy="9" r="2.5" />
                    <path d="M2.5 20v-2a5.5 5.5 0 0 1 11 0v2M14 15a4.5 4.5 0 0 1 6.5 4v1" /></svg
                ></span>
                <span
                  ><strong>{{ $t('Operational teams') }}</strong
                  ><small>{{ $t('Organized groups and their members') }}</small></span
                >
              </div>
              <span class="count-badge">{{ locationTeam.locationTeams?.length || 0 }}</span>
            </div>
            <div class="project-teams-cards" v-if="locationTeam.locationTeams?.length">
              <TeamCard
                class="employee-card"
                v-for="(team, index) in locationTeam.locationTeams"
                :key="index"
                :team="team"
                :teamId="team.teamId"
                :LocationId="locationTeam.id"
                :ProjectLocationId="locationTeam.projectLocationId"
              />
            </div>
            <div class="section-empty" v-else>
              <!-- <span>+</span> -->
              <p>
                <strong>{{ $t('No teams created yet') }}</strong
                ><small>{{
                  $t('Assign employees, then create the first team for this location.')
                }}</small>
              </p>
            </div>
          </section>
        </article>
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
        :description="
          $t(
            'Sorry .. You have no project types .. All your joined customers will appear here when you add your customer data',
          )
        "
        :title="$t('..ops! You have No Projects')"
        :addText="$t('Add Projects')"
      />
    </template>
    <template #failed>
      <DataFailed />
    </template>
  </DataStatus>
</template>

<style scoped lang="scss">
.people-overview {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 24px;
  overflow: hidden;
  margin: 18px 0 22px;
  padding: 22px;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 18%, var(--main-border));
  border-radius: 22px;
  background:
    radial-gradient(
      circle at 0 0,
      color-mix(in srgb, var(--PrimaryColor) 13%, transparent),
      transparent 42%
    ),
    var(--surface-1);
  box-shadow: 0 14px 34px color-mix(in srgb, var(--brand-primary-900) 7%, transparent);
}

.overview-kicker {
  color: var(--PrimaryColor);
  font-size: 0.66rem;
  font-weight: 900;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
.overview-copy h2 {
  margin: 5px 0;
  color: var(--text-strong);
  font-family: 'Bold';
  font-size: clamp(1.08rem, 2vw, 1.42rem);
}
.overview-copy p {
  max-width: 620px;
  margin: 0;
  color: var(--text-soft);
  font-size: 0.76rem;
  line-height: 1.6;
}
.overview-stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(100px, 1fr));
  gap: 9px;
}
.stat-item {
  display: flex;
  align-items: center;
  gap: 9px;
  min-width: 112px;
  padding: 11px;
  border: 1px solid var(--main-border);
  border-radius: 15px;
  background: color-mix(in srgb, var(--surface-1) 88%, transparent);
}
.stat-item > span:last-child {
  display: flex;
  flex-direction: column;
  color: var(--text-soft);
  font-size: 0.61rem;
  font-weight: 700;
}
.stat-item strong {
  color: var(--text-strong);
  font-family: 'Bold';
  font-size: 1rem;
  line-height: 1.1;
}
.stat-icon,
.content-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  border-radius: 11px;
  color: var(--PrimaryColor);
  background: color-mix(in srgb, var(--PrimaryColor) 9%, transparent);
}
.stat-icon {
  width: 34px;
  height: 34px;
}
.stat-icon svg,
.content-icon svg {
  width: 19px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.7;
}
.stat-employees .stat-icon {
  color: var(--status-success);
  background: color-mix(in srgb, var(--status-success) 10%, transparent);
}
.stat-teams .stat-icon {
  color: var(--brand-secondary-500);
  background: color-mix(in srgb, var(--brand-secondary-500) 10%, transparent);
}
.locations-list {
  display: grid;
  gap: 18px;
}
.emoloyees-details {
  position: relative;
  overflow: hidden;
  margin: 0 !important;
  padding: 18px !important;
  border: 1px solid var(--main-border);
  border-radius: 22px;
  background: var(--surface-1) !important;
  box-shadow: 0 14px 34px color-mix(in srgb, var(--brand-primary-900) 7%, transparent);
}
.emoloyees-details::before {
  position: absolute;
  top: 0;
  inset-inline: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--PrimaryColor), var(--status-success));
  content: '';
}
.card-header {
  padding-bottom: 17px;
  border-bottom: 1px solid var(--main-border);
}
.location-heading {
  display: flex;
  align-items: center;
  min-width: 0;
  gap: 12px;
}
.location-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  flex: 0 0 34px;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 18%, var(--main-border));
  border-radius: 11px;
  color: var(--PrimaryColor);
  background: color-mix(in srgb, var(--PrimaryColor) 7%, transparent);
  font-family: 'Bold';
  font-size: 0.7rem;
}
.card-actions :deep(button),
.card-actions a {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 40px;
  gap: 7px;
  padding: 9px 13px !important;
  border-radius: 12px !important;
  line-height: 1.2;
  text-decoration: none;
}
.card-actions svg {
  width: 16px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.8;
}
.content-block {
  margin-top: 15px;
  padding: 13px;
  border: 1px solid var(--main-border);
  border-radius: 17px;
  background: color-mix(in srgb, var(--surface-2) 42%, var(--surface-1));
}
.content-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 11px;
}
.content-heading > div {
  display: flex;
  align-items: center;
  min-width: 0;
  gap: 9px;
}
.content-heading > div > span:last-child {
  display: flex;
  min-width: 0;
  flex-direction: column;
}
.content-heading strong {
  color: var(--text-strong);
  font-family: 'Bold';
  font-size: 0.78rem;
}
.content-heading small {
  margin-top: 1px;
  color: var(--text-soft);
  font-size: 0.61rem;
}
.content-icon {
  width: 34px;
  height: 34px;
}
.team-icon {
  color: var(--brand-secondary-500);
  background: color-mix(in srgb, var(--brand-secondary-500) 9%, transparent);
}
.count-badge {
  min-width: 29px;
  padding: 5px 8px;
  border-radius: 999px;
  color: var(--PrimaryColor);
  background: color-mix(in srgb, var(--PrimaryColor) 9%, transparent);
  font-family: 'Bold';
  font-size: 0.65rem;
  text-align: center;
}
.employees-section {
  grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
  gap: 9px !important;
  padding: 0 !important;
  border: 0 !important;
  border-radius: 0 !important;
  background: transparent !important;
}
.project-teams-cards {
  display: grid !important;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  align-items: stretch !important;
  gap: 10px !important;
  padding: 0 !important;
  border: 0 !important;
  border-radius: 0 !important;
  background: transparent !important;
}
.section-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 78px;
  gap: 10px;
  padding: 14px;
  border: 1px dashed color-mix(in srgb, var(--PrimaryColor) 27%, var(--main-border));
  border-radius: 13px;
  background: color-mix(in srgb, var(--PrimaryColor) 3%, transparent);
  text-align: start;
}
.section-empty > span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 31px;
  height: 31px;
  flex: 0 0 31px;
  border-radius: 10px;
  color: var(--PrimaryColor);
  background: color-mix(in srgb, var(--PrimaryColor) 10%, transparent);
  font-size: 1.1rem;
}
.section-empty p {
  display: flex;
  flex-direction: column;
  margin: 0;
}
.section-empty strong {
  color: var(--text-strong);
  font-size: 0.72rem;
}
.section-empty small {
  color: var(--text-soft);
  font-size: 0.61rem;
  line-height: 1.45;
}

@media (max-width: 1100px) {
  .people-overview {
    grid-template-columns: 1fr;
  }
  .overview-stats {
    width: 100%;
  }
  .employees-section {
    grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
  }
}
@media (max-width: 820px) {
  .employees-section,
  .project-teams-cards {
    grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
  }
  .card-header {
    align-items: stretch !important;
  }
  .card-actions {
    width: 100%;
    justify-content: flex-start !important;
  }
}
@media (max-width: 560px) {
  .people-overview,
  .emoloyees-details {
    padding: 14px !important;
    border-radius: 18px;
  }
  .overview-stats {
    grid-template-columns: 1fr;
  }
  .stat-item {
    min-width: 0;
  }
  .location-number {
    display: none;
  }
  .card-actions {
    display: grid !important;
    grid-template-columns: 1fr !important;
  }
  .card-actions > *,
  .card-actions a,
  .card-actions :deep(button) {
    width: 100% !important;
  }
  .employees-section,
  .project-teams-cards {
    grid-template-columns: 1fr !important;
  }
  .content-heading small {
    display: none;
  }
}
</style>
