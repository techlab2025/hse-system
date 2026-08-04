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
            <AccordArrowDown v-if="OpenAccordion.includes('0')" class="arrow-accord" />
            <AccordArrowRight v-else class="arrow-right" />
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
        <div class="workforce-intro" v-if="employeeCount > 0 || visibleTeams.length > 0">
          <div class="workforce-intro-copy">
            <span class="workforce-mark" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <circle cx="8" cy="8" r="3" />
                <circle cx="17" cy="9" r="2.5" />
                <path d="M2.5 20v-2a5.5 5.5 0 0 1 11 0v2M14 15a4.5 4.5 0 0 1 6.5 4v1" />
              </svg>
            </span>
            <div>
              <span class="workforce-kicker">{{ $t('Location workforce') }}</span>
              <h3>{{ $t('Teams and employees') }}</h3>
              <p>
                {{
                  $t('Review assigned employees and the active teams operating at this location.')
                }}
              </p>
            </div>
          </div>
          <div class="workforce-summary" aria-label="Workforce totals">
            <span
              ><strong>{{ employeeCount }}</strong> {{ $t('Employees') }}</span
            >
            <i aria-hidden="true"></i>
            <span
              ><strong>{{ visibleTeams.length }}</strong> {{ $t('Teams') }}</span
            >
            <i aria-hidden="true"></i>
            <span
              ><strong>{{ teamMembersCount }}</strong> {{ $t('Team members') }}</span
            >
          </div>
        </div>

        <div class="workforce-sections">
          <section class="all-employees workforce-panel employees-panel" v-if="employeeCount > 0">
            <div class="all-employees-header-container">
              <div class="section-title">
                <span class="section-icon"><ProjectEmployeeIcon class="icon" /></span>
                <div class="all-employees-header flex flex-col">
                  <span class="section-kicker">{{ $t('People') }}</span>
                  <p class="employee">{{ $t('Employees') }}</p>
                  <p class="employee-count">{{ $t('People assigned to this location') }}</p>
                </div>
              </div>
              <router-link :to="`/organization/employee-details/${id}`" class="all-employees-view"
                >{{ $t('View all') }} <span>{{ employeeCount }}</span>
                <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m7 4 6 6-6 6" /></svg>
              </router-link>
            </div>
            <div class="team-members">
              <TeamMemberCard
                v-for="(member, index) in selectedLocation?.employees"
                :key="member.id || index"
                :member="member"
                @update:data="DeleteTeamMember"
                :hierarchy="
                  employeesHierarchy?.find((h) => h.id === member.organization_employee_id)
                "
              />
            </div>
          </section>

          <section
            class="teams-container workforce-panel teams-panel"
            v-if="visibleTeams.length > 0"
          >
            <div class="all-employees-header-container">
              <div class="section-title">
                <span class="section-icon"><TeamsIcon class="icon" /></span>
                <div class="all-employees-header flex flex-col">
                  <span class="section-kicker">{{ $t('Collaboration') }}</span>
                  <p class="employee">{{ $t('Teams') }}</p>
                  <p class="employee-count">
                    {{ $t('Active groups working at this location') }}
                  </p>
                </div>
              </div>
              <router-link :to="`/organization/employee-details/${id}`" class="all-employees-view"
                >{{ $t('View all') }} <span>{{ visibleTeams.length }}</span>
                <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m7 4 6 6-6 6" /></svg>
              </router-link>
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
          </section>
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
          <!-- <span class="inline-empty-icon" aria-hidden="true">+</span> -->
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

  .location > :deep(.arrow-accord),
  .location > :deep(.arrow-right) {
    width: 30px;
    height: 30px;
    flex: 0 0 30px;
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

.workforce-intro {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;
  gap: 20px;
  margin-bottom: 14px;
  padding: 18px 20px;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 18%, var(--main-border));
  border-radius: 17px;
  background:
    radial-gradient(
      circle at 100% 0,
      color-mix(in srgb, var(--PrimaryColor) 14%, transparent),
      transparent 38%
    ),
    linear-gradient(
      135deg,
      color-mix(in srgb, var(--PrimaryColor) 7%, var(--surface-1)),
      var(--surface-1)
    );
}

.workforce-intro::after {
  position: absolute;
  inset-inline-end: -34px;
  bottom: -58px;
  width: 130px;
  height: 130px;
  border: 22px solid color-mix(in srgb, var(--PrimaryColor) 5%, transparent);
  border-radius: 50%;
  content: '';
  pointer-events: none;
}

.workforce-intro-copy {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  min-width: 0;
  gap: 13px;
}

.workforce-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  flex: 0 0 48px;
  border-radius: 15px;
  color: var(--text-on-brand);
  background: linear-gradient(135deg, var(--PrimaryColor), var(--brand-secondary-500));
  box-shadow: 0 9px 20px color-mix(in srgb, var(--PrimaryColor) 24%, transparent);
}

.workforce-mark svg {
  width: 25px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.6;
}

.workforce-kicker,
.section-kicker {
  display: block;
  color: var(--PrimaryColor);
  font-size: 0.55rem;
  font-weight: 900;
  letter-spacing: 0.09em;
  line-height: 1.2;
  text-transform: uppercase;
}

.workforce-intro h3 {
  margin: 3px 0 2px;
  color: var(--text-strong);
  font-family: 'Bold';
  font-size: 0.96rem;
}

.workforce-intro p {
  margin: 0;
  color: var(--text-soft);
  font-size: 0.64rem;
  line-height: 1.5;
}

.workforce-summary {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  flex: 0 0 auto;
  gap: 11px;
  padding: 10px 12px;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 13%, var(--main-border));
  border-radius: 13px;
  background: color-mix(in srgb, var(--surface-1) 84%, transparent);
  backdrop-filter: blur(8px);
}

.workforce-summary span {
  display: flex;
  flex-direction: column;
  color: var(--text-soft);
  font-size: 0.55rem;
  white-space: nowrap;
}

.workforce-summary strong {
  color: var(--text-strong);
  font-family: 'Bold';
  font-size: 0.9rem;
  line-height: 1.1;
}

.workforce-summary i {
  width: 1px;
  height: 25px;
  background: var(--main-border);
}

.workforce-sections {
  display: grid;
  gap: 14px;
}

.all-employees,
.teams-container {
  margin: 0 0 14px;
  padding: 15px;
  border: 1px solid var(--main-border);
  border-radius: 17px;
}

.workforce-panel {
  position: relative;
  overflow: hidden;
}

.employees-panel {
  background:
    linear-gradient(
      105deg,
      color-mix(in srgb, var(--status-success) 5%, transparent),
      transparent 30%
    ),
    color-mix(in srgb, var(--surface-2) 52%, var(--surface-1));
}

.teams-panel {
  background:
    linear-gradient(
      105deg,
      color-mix(in srgb, var(--brand-secondary-500) 6%, transparent),
      transparent 32%
    ),
    color-mix(in srgb, var(--surface-2) 52%, var(--surface-1));
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

.section-title {
  display: flex;
  align-items: center;
  min-width: 0;
  gap: 10px;
}

.section-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  flex: 0 0 42px;
  border-radius: 13px;
  background: color-mix(in srgb, var(--status-success) 9%, var(--surface-1));
}

.teams-panel .section-icon {
  background: color-mix(in srgb, var(--brand-secondary-500) 9%, var(--surface-1));
}

.section-icon :deep(.icon) {
  width: 40px;
  height: 40px;
  padding: 8px;
}

.all-employees-header .employee {
  margin: 0;
  color: var(--text-strong);
  font-family: 'Bold';
  font-size: 0.8rem;
}

.all-employees-header .employee-count {
  margin: 2px 0 0;
  color: var(--text-soft);
  font-size: 0.64rem;
}

.all-employees-view {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 8px 7px 10px;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 12%, transparent);
  border-radius: 10px;
  background: color-mix(in srgb, var(--PrimaryColor) 8%, transparent);
  color: var(--PrimaryColor);
  font-size: 0.64rem;
  font-weight: 850;
  text-decoration: none;
  transition: 0.18s ease;
}

.all-employees-view span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 5px;
  border-radius: 7px;
  color: var(--surface-1);
  background: var(--PrimaryColor);
  font-size: 0.58rem;
}

.all-employees-view svg {
  width: 14px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.8;
}

.all-employees-view:hover {
  transform: translateX(2px);
  background: var(--PrimaryColor);
  color: var(--text-on-brand);
}

.all-employees-view:hover span {
  color: var(--PrimaryColor);
  background: var(--surface-1);
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
  .workforce-intro {
    align-items: flex-start;
    flex-direction: column;
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
  .workforce-intro {
    padding: 15px;
  }
  .workforce-summary {
    width: 100%;
    justify-content: space-around;
  }
  .workforce-mark {
    width: 42px;
    height: 42px;
    flex-basis: 42px;
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
    justify-content: center;
  }
}

:global([dir='rtl']) .all-employees-view svg {
  transform: rotate(180deg);
}

:global([dir='rtl']) .all-employees-view:hover {
  transform: translateX(-2px);
}
</style>
