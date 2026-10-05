<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import TitleInterface from '@/base/Data/Models/title_interface'
import UpdatedCustomInputSelect from '@/shared/FormInputs/UpdatedCustomInputSelect.vue'
import IndexOrganizatoinEmployeeParams from '@/features/Organization/OrganizationEmployee/Core/params/indexOrganizatoinEmployeeParams'
import IndexTeamController from '@/features/setting/Teams/Presentation/controllers/indexTeamController'
import IndexTeamParams from '@/features/setting/Teams/Core/params/indexTeamParams'
import ProjectCustomLocationController from '../../../controllers/ProjectCustomLocationController'
import ProjectCustomLocationParams from '../../../../Core/params/ProjectCustomLocationParams'
import { ProjectCustomLocationEnum } from '../../../../Core/Enums/ProjectCustomLocationEnum'
import type ProjectCustomLocationModel from '../../../../Data/models/CustomLocation/ProjectCustomLocationModel'
import type {
  TeamForm,
  TeamLocationForm,
} from '../../../../Core/params/UpdatedProjectFlow/ProjectTeamFormParams'

const props = defineProps<{ projectId?: number }>()
const teams = defineModel<TeamLocationForm[]>('teams', { required: true })

const teamController = IndexTeamController.getInstance()
const projectCustomLocationController = ProjectCustomLocationController.getInstance()
const projectLocations = ref<ProjectCustomLocationModel[]>([])
const isLoadingLocations = ref(false)
const locationsError = ref('')
const teamParams = computed(
  () => new IndexTeamParams('', 1, 30, 0, undefined, props.projectId ?? null),
)
const employeeParams = () =>
  new IndexOrganizatoinEmployeeParams(
    '',
    1,
    30,
    0,
    null,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
  )

const selectedTeams = (location: TeamLocationForm) =>
  location.projectTeams.flatMap((item) => (item.team ? [item.team] : []))

const setLocationTeams = (
  location: TeamLocationForm,
  value: TitleInterface | TitleInterface[] | null,
) => {
  const selected = Array.isArray(value) ? value : value ? [value] : []
  const existingById = new Map(
    location.projectTeams.flatMap((item) =>
      item.team ? [[item.team.id, item] as const] : [],
    ),
  )

  location.projectTeams = selected.map(
    (team) =>
      existingById.get(team.id) ?? {
        team,
        employees: [],
        employeeParams: employeeParams(),
      },
  )
}

const setTeamEmployees = (team: TeamForm, value: TitleInterface | TitleInterface[] | null) => {
  team.employees = Array.isArray(value) ? value : value ? [value] : []
}

const toEmployeeTitle = (employee: {
  organization_employee_id: number
  employeeId: number
  name: string
}) =>
  new TitleInterface({
    id: employee.organization_employee_id || employee.employeeId,
    title: employee.name,
  })

const projectEmployees = (location: TeamLocationForm) => {
  const projectLocation = projectLocations.value.find(
    (item) => item.projectLocationId === location.projectLocation?.id,
  )
  const employees = [
    ...(projectLocation?.locationEmplyees ?? []),
    ...(projectLocation?.locationHierarchy ?? []).flatMap((hierarchy) => hierarchy.Employees ?? []),
  ]
  return Array.from(
    new Map(
      employees.map((employee) => [toEmployeeTitle(employee).id, toEmployeeTitle(employee)]),
    ).values(),
  )
}

const mapProjectLocation = (location: ProjectCustomLocationModel): TeamLocationForm => ({
  projectLocation: new TitleInterface({ id: location.projectLocationId, title: location.title }),
  projectTeams: (location.locationTeams ?? []).map((team) => ({
    team: new TitleInterface({ id: team.teamId, title: team.teamTitle ?? team.title }),
    employees: (team.Employees ?? []).map(toEmployeeTitle),
    employeeParams: employeeParams(),
  })),
})

const getProjectLocationsTeamsEmployees = async () => {
  if (!props.projectId) {
    projectLocations.value = []
    teams.value = []
    return
  }

  isLoadingLocations.value = true
  locationsError.value = ''
  try {
    const params = new ProjectCustomLocationParams(props.projectId, [
      ProjectCustomLocationEnum.TEAM,
      ProjectCustomLocationEnum.TEAM_EMPLOYEE,
      ProjectCustomLocationEnum.EMPLOYEE,
      ProjectCustomLocationEnum.HIERARCHY_EMPLOYEE,
    ])
    const state = await projectCustomLocationController.getData(params)
    projectLocations.value = state.value.data ?? []
    teams.value = projectLocations.value.map(mapProjectLocation)
  } catch (error: unknown) {
    projectLocations.value = []
    teams.value = []
    locationsError.value =
      error instanceof Error ? error.message : 'Could not load project locations.'
  } finally {
    isLoadingLocations.value = false
  }
}

watch(() => props.projectId, getProjectLocationsTeamsEmployees, { immediate: true })
</script>

<template>
  <div class="form-stack">
    <div class="section-title">
      <span>04</span>
      <div>
        <h2>Project teams</h2>
        <p>Assign teams and their employees by location, or skip for now.</p>
      </div>
    </div>
    <p v-if="isLoadingLocations" class="locations-status">Loading project locations…</p>
    <p v-else-if="locationsError" class="locations-status locations-error">
      {{ locationsError }}
    </p>
    <p v-else-if="!teams.length" class="locations-status">
      No locations are assigned to this project.
    </p>
    <div v-for="(location, locationIndex) in teams" :key="locationIndex" class="group-card">
      <div class="group-head">
        <div class="fixed-location">
          <span>Project location</span>
          <strong>{{ location.projectLocation?.title }}</strong>
        </div>
      </div>
      <div class="input-wrapper">
        <UpdatedCustomInputSelect
          :model-value="selectedTeams(location)"
          :params="teamParams"
          :controller="teamController"
          label="Teams"
          placeholder="Select teams"
          :type="2"
          @update:model-value="setLocationTeams(location, $event)"
        />
      </div>
      <div
        v-for="team in location.projectTeams"
        :key="team.team?.id"
        class="team-assignment"
      >
        <h3>{{ team.team?.title }}</h3>
        <div class="input-wrapper">
          <UpdatedCustomInputSelect
            :model-value="team.employees"
            :static-options="projectEmployees(location)"
            label="Project employees"
            placeholder="Select project employees"
            :type="2"
            @update:model-value="setTeamEmployees(team, $event)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped src="../ProjectFlowStepStyles.css"></style>

<style scoped>
.team-assignment {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 14px;
  border: 1px solid var(--main-border);
  border-radius: 15px;
  background: var(--Gray-1);
}

.team-assignment h3 {
  margin: 0;
  color: var(--GrayText-1);
  font-size: 14px;
  font-weight: 800;
}
</style>
