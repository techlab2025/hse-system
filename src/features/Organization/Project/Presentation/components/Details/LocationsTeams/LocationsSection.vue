<script setup lang="ts">
import type TeamLocation from '@/features/Organization/Project/Data/models/TeamLocationModel'
import TeamCard from './TeamCard.vue'
import EmptyData from './EmptyData.vue'
import EmptyFolder from '@/assets/images/EmptyFolder.png'
import { useRoute } from 'vue-router'
import Accordion from 'primevue/accordion'
import AccordionPanel from 'primevue/accordionpanel'
import AccordionHeader from 'primevue/accordionheader'
import AccordionContent from 'primevue/accordioncontent'
import AccordArrowDown from '@/shared/icons/AccordArrowDown.vue'
import AccordArrowRight from '@/shared/icons/AccordArrowRight.vue'

import { computed, ref, watch } from 'vue'
import AddCreateTeam from '../../Dialogs/CreateTeamDialog/AddCreateTeam.vue'
import ProjectCustomLocationParams from '@/features/Organization/Project/Core/params/ProjectCustomLocationParams'
import { ProjectCustomLocationEnum } from '@/features/Organization/Project/Core/Enums/ProjectCustomLocationEnum'
import ProjectCustomLocationController from '../../../controllers/ProjectCustomLocationController'

import TeamMemberCard from './TeamMemberCard.vue'
import ProjectEmployeeIcon from '@/shared/icons/ProjectEmployeeIcon.vue'
import TeamsIcon from '@/shared/icons/TeamsIcon.vue'
import AddEmployeeDialog from './AddEmployeeDialog.vue'
import type OrganizatoinEmployeeDetailsModel from '@/features/Organization/OrganizationEmployee/Data/models/OrganizatoinEmployeeDetailsModel'

import type projectLocationModel from '@/features/Organization/Project/Data/models/ProjectLocationModel'
import type TitleInterface from '@/base/Data/Models/title_interface'
import DeleteProjectlocationHierarchyEmployeeParams from '@/features/Organization/Project/Core/params/deleteProjectlocationHierarchyEmployeeParams'
import DeleteProjectLocationHeirarchyEmployeeController from '../../../controllers/DeleteProjectLocationHeirarchyEmployeeController'
import ShowProjectDetailsController from '../../../controllers/ShowProjectDetailsController'
import ShowProjectDetailsParams from '@/features/Organization/Project/Core/params/ShowProjectDetailsParams'

const route = useRoute()
const id = route.params.id
const projectCustomLocationController = ProjectCustomLocationController.getInstance()
const OpenAccordion = ref<string[]>(['0'])

const { location, projectLocation, hierarchy, employeesHierarchy } = defineProps<{
  location: TeamLocation | null | undefined
  projectLocation: projectLocationModel[] | null | undefined
  hierarchy: TitleInterface[] | null | undefined
  employeesHierarchy: OrganizatoinEmployeeDetailsModel[] | null | undefined
}>()

const GetProjectLocationsEmployes = async () => {
  const projectCustomLocationParams = new ProjectCustomLocationParams(id, [
    ProjectCustomLocationEnum.TEAM_EMPLOYEE,
    ProjectCustomLocationEnum.EMPLOYEE,
  ])
  await projectCustomLocationController.getData(projectCustomLocationParams)
}

const selectedLocation = computed(() =>
  projectLocation?.find((projectItem) => projectItem.locationId === location?.locationId),
)
const employeeCount = computed(() => selectedLocation.value?.employees?.length || 0)
const visibleTeams = computed(
  () => location?.projectLocationTeams?.filter((team) => (team.Employees?.length || 0) > 0) || [],
)
const teamMembersCount = computed(() =>
  visibleTeams.value.reduce((total, team) => total + (team.Employees?.length || 0), 0),
)

const DeleteTeamMember = async (id: number) => {
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

const updatetabValue = (value: any) => {
  OpenAccordion.value = value
}

watch(
  () => location,
  () => {
    ShowProjectDetailsController.getInstance().showProjectDetails(
      new ShowProjectDetailsParams(Number(route.params?.id)),
    )
  },
)
</script>

<template>
  <Accordion
    class="location-accordion"
    :value="OpenAccordion"
    multiple
    @update:value="updatetabValue"
  >
    <AccordionPanel value="0">
      <AccordionHeader>
        <div class="location-container">
          <div class="location">
            <span class="accordion-arrow">
              <AccordArrowDown v-if="OpenAccordion.includes('0')" class="arrow-accord" />
              <AccordArrowRight v-else class="arrow-right" />
            </span>
            <span class="location-pin" aria-hidden="true"><i></i></span>
            <div class="location-copy">
              <span class="location-eyebrow">{{ $t('Operational location') }}</span>
              <p class="location-title">
                {{ selectedLocation?.locationTitle || $t('Location') }}
              </p>
              <div class="location-info-statics">
                <p>
                  <strong>{{ employeeCount }}</strong>
                  <span>{{ $t('Employees') }}</span>
                </p>
                <p>
                  <strong>{{ visibleTeams.length }}</strong>
                  <span>{{ $t('Teams') }}</span>
                </p>
                <p v-if="teamMembersCount">
                  <strong>{{ teamMembersCount }}</strong>
                  <span>{{ $t('Team members') }}</span>
                </p>
              </div>
            </div>
          </div>
          <div class="card-actions" @click.stop>
            <RouterLink
              :to="`/organization/project-hierarchy/project/${id}?locationId=${location?.locationId}`"
              class="location-action position-action"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 20V10M6 20v-4M18 20V4M4 20h16" />
              </svg>
              {{ $t('add_position') }}
            </RouterLink>

            <AddCreateTeam
              :ProjectLocationId="location?.projectLocationId!"
              :LocationId="location?.locationId!"
              @update:data="GetProjectLocationsEmployes"
            />
            <AddEmployeeDialog
              :hierarchy="hierarchy"
              :ProjectLocation="location?.projectLocationId!"
            />
          </div>
        </div>
      </AccordionHeader>
      <AccordionContent>
        <div class="location-content-overview">
          <span>{{ $t('Location workforce') }}</span>
          <p>
            {{ $t('Review assigned employees and the active teams operating at this location.') }}
          </p>
        </div>

        <div class="all-employees" v-if="employeeCount > 0">
          <div class="all-employees-header-container">
            <div class="flex items-center gap-2">
              <ProjectEmployeeIcon class="icon" />
              <div class="all-employees-header flex flex-col">
                <p class="employee">{{ $t('Employees') }}</p>
                <p class="employee-count">{{ employeeCount }} {{ $t('Employees') }}</p>
              </div>
            </div>
            <router-link :to="`/organization/employee-details/${id}`" class="all-employees-view"
              >{{ $t('View all employees') }} ({{ employeeCount }})</router-link
            >
          </div>
          <div class="team-members">
            <TeamMemberCard
              v-for="(member, index) in selectedLocation?.employees"
              :key="member.id || index"
              :member="member"
              @update:data="DeleteTeamMember"
              :hierarchy="employeesHierarchy?.find((h) => h.id === member.organization_employee_id)"
            />
          </div>
        </div>

        <div class="teams-container" v-if="visibleTeams.length > 0">
          <div class="all-employees-header-container">
            <div class="flex items-center gap-2">
              <TeamsIcon class="icon" />
              <div class="all-employees-header flex flex-col">
                <p class="employee">{{ $t('Teams') }}</p>
                <p class="employee-count">
                  {{ visibleTeams.length }} {{ $t('Teams') }} · {{ teamMembersCount }}
                  {{ $t('members') }}
                </p>
              </div>
            </div>
            <router-link :to="`/organization/employee-details/${id}`" class="all-employees-view"
              >{{ $t('View all teams') }} ({{ visibleTeams.length }})</router-link
            >
          </div>
          <div class="teams">
            <TeamCard
              :isShow="true"
              v-for="(team, index) in visibleTeams"
              :key="team.teamId || index"
              :team="team"
              :location="location"
            />
          </div>
        </div>
        <div class="empty-teams" v-if="employeeCount < 1">
          <EmptyData
            :img="EmptyFolder"
            :title="$t('No Teams Or Employees Yet')"
            :subtitle="
              $t('You haven’t added any employees to this team. Start building your crew now!')
            "
            :link="`/organization/project-employee/project/${id}?locationId=${location?.locationId}`"
            :linkText="$t('Start building your crew now!')"
          />
        </div>
        <div class="inline-empty" v-else-if="visibleTeams.length < 1">
          <span class="inline-empty-icon" aria-hidden="true">+</span>
          <span>
            <strong>{{ $t('Employees are ready — create the first team') }}</strong>
            <small>{{
              $t('Use the create team action above to organize this location workforce.')
            }}</small>
          </span>
        </div>
      </AccordionContent>
    </AccordionPanel>
  </Accordion>
</template>

<style scoped lang="scss">
.location-accordion {
  width: 100%;
}

.location-accordion :deep(.p-accordionpanel) {
  overflow: hidden;
  margin: 0;
  border: 1px solid var(--main-border) !important;
  border-radius: 19px !important;
  background: var(--surface-1);
  box-shadow: 0 10px 25px color-mix(in srgb, var(--brand-primary-900) 6%, transparent);
}

.location-accordion :deep(.p-accordionheader) {
  padding: 16px;
  border: 0 !important;
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--PrimaryColor) 6%, transparent), transparent),
    var(--surface-1) !important;
}

.location-accordion :deep(.p-accordioncontent-content) {
  padding: 15px !important;
  border-top: 1px solid var(--main-border) !important;
  background: var(--surface-1);
}

.location-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 14px;

  .location {
    display: flex;
    align-items: center;
    min-width: 220px;
    gap: 10px;
    margin: 0;
  }

  .accordion-arrow {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 31px;
    height: 31px;
    flex: 0 0 31px;
    border: 1px solid var(--main-border);
    border-radius: 10px;
    color: var(--PrimaryColor);
    background: var(--surface-1);
  }

  .accordion-arrow :deep(svg) {
    width: 17px;
    height: 17px;
  }

  .location-pin {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 42px;
    height: 42px;
    flex: 0 0 42px;
    border-radius: 13px;
    color: var(--PrimaryColor);
    background: color-mix(in srgb, var(--PrimaryColor) 9%, transparent);
  }

  .location-pin::before {
    width: 14px;
    height: 14px;
    border: 2px solid currentColor;
    border-radius: 50% 50% 50% 0;
    content: '';
    transform: rotate(-45deg);
  }

  .location-pin i {
    position: absolute;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: currentColor;
  }

  .location-copy {
    display: flex;
    min-width: 0;
    flex-direction: column;
    align-items: flex-start;
  }
  .location-eyebrow {
    margin-bottom: 1px;
    color: var(--PrimaryColor);
    font-size: 0.55rem;
    font-weight: 900;
    letter-spacing: 0.07em;
    text-transform: uppercase;
  }

  .location-title {
    margin: 0;
    color: var(--text-strong);
    font-family: 'Bold';
    font-size: 0.9rem;
    font-weight: 900;
  }

  .location-info-statics {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 5px;
    margin-top: 4px;
  }

  .location-info-statics p {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    margin: 0;
    padding: 4px 7px;
    border-radius: 8px;
    background: var(--surface-1);
    color: var(--PrimaryColor);
    font-family: 'Bold';
    font-size: 0.65rem;
  }

  .location-info-statics strong {
    color: var(--PrimaryColor);
    font-family: 'Bold';
  }

  .location-info-statics span {
    color: var(--text-soft);
    font-family: 'Regular';
  }

  .card-actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex-wrap: wrap;
    gap: 7px;
  }

  .card-actions :deep(.btn),
  .card-actions > .btn,
  .location-action {
    min-height: 36px;
    padding: 8px 11px;
    border: 1px solid color-mix(in srgb, var(--PrimaryColor) 20%, var(--main-border));
    border-radius: 10px;
    background: color-mix(in srgb, var(--PrimaryColor) 7%, var(--surface-1));
    color: var(--PrimaryColor);
    font-size: 0.68rem;
    font-weight: 850;
    text-decoration: none;
  }

  .location-action {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
  }
  .location-action svg {
    width: 15px;
    fill: none;
    stroke: currentColor;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 1.8;
  }

  @media (max-width: 768px) {
    .card-actions {
      width: 100%;
      justify-content: flex-start;
    }
  }
}

.location-content-overview {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
  padding: 10px 12px;
  border-inline-start: 3px solid var(--PrimaryColor);
  border-radius: 10px;
  background: color-mix(in srgb, var(--PrimaryColor) 5%, transparent);
}

.location-content-overview span {
  color: var(--text-strong);
  font-family: 'Bold';
  font-size: 0.72rem;
}
.location-content-overview p {
  margin: 0;
  color: var(--text-soft);
  font-size: 0.6rem;
}

.all-employees,
.teams-container {
  margin: 0 0 14px;
  padding: 14px;
  border: 1px solid var(--main-border);
  border-radius: 15px;
  background: color-mix(in srgb, var(--surface-2) 56%, transparent);
}

.all-employees-header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 11px;
  padding: 0 0 11px;
  border-bottom: 1px solid var(--main-border);
  background: transparent;
}

.all-employees-header-container :deep(.icon) {
  width: 40px;
  height: 40px;
  padding: 7px;
  border-radius: 12px;
  background: color-mix(in srgb, var(--PrimaryColor) 9%, transparent);
}

.all-employees-header .employee {
  margin: 0;
  color: var(--text-strong);
  font-family: 'Bold';
  font-size: 0.8rem;
}

.all-employees-header .employee-count {
  color: var(--text-soft);
  font-size: 0.64rem;
}

.all-employees-view {
  padding: 6px 9px;
  border-radius: 9px;
  background: color-mix(in srgb, var(--PrimaryColor) 8%, transparent);
  color: var(--PrimaryColor);
  font-size: 0.64rem;
  font-weight: 850;
  text-decoration: none;
}

.team-members,
.teams {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 9px;
  padding: 2px 1px 7px;
}

.teams {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.inline-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 88px;
  gap: 10px;
  padding: 14px;
  border: 1px dashed color-mix(in srgb, var(--brand-accent-500) 28%, var(--main-border));
  border-radius: 14px;
  background: color-mix(in srgb, var(--brand-accent-500) 4%, transparent);
}

.inline-empty-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  flex: 0 0 34px;
  border-radius: 11px;
  color: var(--brand-accent-500);
  background: color-mix(in srgb, var(--brand-accent-500) 10%, transparent);
  font-size: 1.1rem;
}
.inline-empty > span:last-child {
  display: flex;
  flex-direction: column;
}
.inline-empty strong {
  color: var(--text-strong);
  font-size: 0.7rem;
}
.inline-empty small {
  color: var(--text-soft);
  font-size: 0.59rem;
  line-height: 1.45;
}

@media (max-width: 1000px) {
  .location-container {
    align-items: flex-start;
    flex-direction: column;
  }
  .team-members {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .location-accordion :deep(.p-accordionheader),
  .location-accordion :deep(.p-accordioncontent-content) {
    padding: 12px !important;
  }
  .location-container .location {
    min-width: 0;
    width: 100%;
  }
  .location-pin {
    display: none !important;
  }
  .location-content-overview {
    align-items: flex-start;
    flex-direction: column;
  }
  .team-members,
  .teams {
    grid-template-columns: 1fr;
  }
  .all-employees-header-container {
    align-items: flex-start;
    flex-direction: column;
  }
  .all-employees-view {
    width: 100%;
    text-align: center;
  }
}
</style>
