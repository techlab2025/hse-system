<script setup lang="ts">
import { computed } from 'vue'
import TitleInterface from '@/base/Data/Models/title_interface'
import UpdatedCustomInputSelect from '@/shared/FormInputs/UpdatedCustomInputSelect.vue'
import IndexLocationController from '@/features/setting/Location/Presentation/controllers/indexLocationController'
import IndexLocationParams from '@/features/setting/Location/Core/params/indexLocationParams'
import { LocationEnum } from '@/features/setting/Location/Core/Enum/LocationEnum'
import IndexOrganizatoinEmployeeController from '@/features/Organization/OrganizationEmployee/Presentation/controllers/indexOrganizatoinEmployeeController'
import IndexOrganizatoinEmployeeParams from '@/features/Organization/OrganizationEmployee/Core/params/indexOrganizatoinEmployeeParams'
import IndexTeamController from '@/features/setting/Teams/Presentation/controllers/indexTeamController'
import IndexTeamParams from '@/features/setting/Teams/Core/params/indexTeamParams'
import type {
  TeamForm,
  TeamLocationForm,
} from '../../../../Core/params/UpdatedProjectFlow/ProjectTeamFormParams'

const props = defineProps<{ projectId?: number }>()
const teams = defineModel<TeamLocationForm[]>('teams', { required: true })

const projectLocationController = IndexLocationController.getInstance()
const employeeController = IndexOrganizatoinEmployeeController.getInstance()
const teamController = IndexTeamController.getInstance()
const projectLocationParams = computed(() =>
  props.projectId
    ? new IndexLocationParams(
        '',
        1,
        30,
        0,
        LocationEnum.AREA,
        undefined,
        undefined,
        undefined,
        props.projectId,
      )
    : null,
)
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

const addTeamLocation = () => teams.value.push({ projectLocation: null, projectTeams: [] })
const addTeam = (location: TeamLocationForm) => {
  location.projectTeams.push({ team: null, employees: [], employeeParams: employeeParams() })
}
const setTeamLocation = (
  location: TeamLocationForm,
  value: TitleInterface | TitleInterface[] | null,
) => {
  location.projectLocation = Array.isArray(value) ? (value[0] ?? null) : value
}
const setTeam = (team: TeamForm, value: TitleInterface | TitleInterface[] | null) => {
  team.team = Array.isArray(value) ? (value[0] ?? null) : value
}
const setTeamEmployees = (team: TeamForm, value: TitleInterface | TitleInterface[] | null) => {
  team.employees = Array.isArray(value) ? value : value ? [value] : []
}
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
    <div v-for="(location, locationIndex) in teams" :key="locationIndex" class="group-card">
      <div class="group-head">
        <div class="input-wrapper group-select">
          <UpdatedCustomInputSelect
            :model-value="location.projectLocation"
            :params="projectLocationParams"
            :controller="projectLocationController"
            label="Project location"
            placeholder="Select project location"
            :type="1"
            @update:model-value="setTeamLocation(location, $event)"
          />
        </div>
        <button type="button" class="icon-button danger" @click="teams.splice(locationIndex, 1)">
          ×
        </button>
      </div>
      <div v-for="(team, index) in location.projectTeams" :key="index" class="nested-row">
        <div class="input-wrapper">
          <UpdatedCustomInputSelect
            :model-value="team.team"
            :params="teamParams"
            :controller="teamController"
            label="Team"
            placeholder="Select team"
            :type="1"
            @update:model-value="setTeam(team, $event)"
          />
        </div>
        <div class="input-wrapper">
          <UpdatedCustomInputSelect
            :model-value="team.employees"
            :params="team.employeeParams"
            :controller="employeeController"
            label="Project employees"
            placeholder="Select project employees"
            :type="2"
            @update:model-value="setTeamEmployees(team, $event)"
          />
        </div>
        <button
          type="button"
          class="icon-button danger"
          @click="location.projectTeams.splice(index, 1)"
        >
          ×
        </button>
      </div>
      <button type="button" class="add-row" @click="addTeam(location)">+ Add team</button>
    </div>
    <button type="button" class="add-group" @click="addTeamLocation">+ Add project location</button>
  </div>
</template>

<style scoped src="../ProjectFlowStepStyles.css"></style>
