<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import TitleInterface from '@/base/Data/Models/title_interface'
import UpdatedCustomInputSelect from '@/shared/FormInputs/UpdatedCustomInputSelect.vue'
import IndexHerikalyController from '@/features/Organization/Herikaly/Presentation/controllers/indexHerikalyController'
import IndexHerikalyParams from '@/features/Organization/Herikaly/Core/params/indexHerikalyParams'
import IndexOrganizatoinEmployeeController from '@/features/Organization/OrganizationEmployee/Presentation/controllers/indexOrganizatoinEmployeeController'
import IndexOrganizatoinEmployeeParams from '@/features/Organization/OrganizationEmployee/Core/params/indexOrganizatoinEmployeeParams'
import ProjectCustomLocationController from '../../../controllers/ProjectCustomLocationController'
import ProjectCustomLocationParams from '../../../../Core/params/ProjectCustomLocationParams'
import { ProjectCustomLocationEnum } from '../../../../Core/Enums/ProjectCustomLocationEnum'
import type ProjectCustomLocationModel from '../../../../Data/models/CustomLocation/ProjectCustomLocationModel'
import type {
  PositionHierarchyForm,
  PositionLocationForm,
} from '../../../../Core/params/UpdatedProjectFlow/ProjectPositionFormParams'

const props = defineProps<{ projectId?: number }>()
const positions = defineModel<PositionLocationForm[]>('positions', { required: true })

const hierarchyController = IndexHerikalyController.getInstance()
const employeeController = IndexOrganizatoinEmployeeController.getInstance()
const projectCustomLocationController = ProjectCustomLocationController.getInstance()
const isLoadingLocations = ref(false)
const locationsError = ref('')
const hierarchyParams = computed(() => new IndexHerikalyParams('', 1, 30, 0, false, undefined))

const employeeParams = (hierarchyId: number | null = null) =>
  new IndexOrganizatoinEmployeeParams(
    '',
    1,
    30,
    0,
    hierarchyId,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
  )
const addHierarchy = (location: PositionLocationForm) => {
  location.heirarchys.push({
    hierarchy: null,
    employees: [],
    teamLeader: null,
    employeeParams: employeeParams(),
  })
}
const setHierarchy = (
  hierarchy: PositionHierarchyForm,
  value: TitleInterface | TitleInterface[] | null,
) => {
  hierarchy.hierarchy = Array.isArray(value) ? (value[0] ?? null) : value
  hierarchy.employees = []
  hierarchy.teamLeader = null
  hierarchy.employeeParams = employeeParams(hierarchy.hierarchy?.id ?? null)
}
const setPositionEmployees = (
  hierarchy: PositionHierarchyForm,
  value: TitleInterface | TitleInterface[] | null,
) => {
  hierarchy.employees = Array.isArray(value) ? value : value ? [value] : []

  if (!hierarchy.employees.some((employee) => employee.id === hierarchy.teamLeader?.id)) {
    hierarchy.teamLeader = null
  }
}

const setTeamLeader = (
  hierarchy: PositionHierarchyForm,
  value: TitleInterface | TitleInterface[] | null,
) => {
  hierarchy.teamLeader = Array.isArray(value) ? (value[0] ?? null) : value
}

type PositionEmployeeOption = {
  id?: number
  organization_employee_id?: number
  employeeId?: number
  name?: string
  title?: string
  is_leader?: boolean | number | string
}

const isLeaderValue = (value: PositionEmployeeOption['is_leader']) => {
  return value === true || value === 1 || value === '1'
}

const toEmployeeTitle = (employee: PositionEmployeeOption) =>
  new TitleInterface({
    id: employee.organization_employee_id || employee.employeeId || employee.id || 0,
    title: employee.name || employee.title || '',
  })

const mapProjectLocation = (location: ProjectCustomLocationModel): PositionLocationForm => ({
  projectLocation: new TitleInterface({
    id: location.projectLocationId,
    title: location.title,
  }),
  heirarchys: (location.locationHierarchy ?? []).map((hierarchy) => {
    const employees = hierarchy.Employees ?? []
    const leader = employees.find((employee) => isLeaderValue(employee.is_leader))

    return {
      hierarchy: new TitleInterface({ id: hierarchy.id, title: hierarchy.title }),
      employees: employees.map(toEmployeeTitle),
      teamLeader: leader ? toEmployeeTitle(leader) : null,
      employeeParams: employeeParams(hierarchy.id),
    }
  }),
})

const getProjectLocationsHierarchiesEmployees = async () => {
  if (!props.projectId) {
    positions.value = []
    return
  }

  isLoadingLocations.value = true
  locationsError.value = ''
  try {
    const params = new ProjectCustomLocationParams(props.projectId, [
      ProjectCustomLocationEnum.HIERARCHY_EMPLOYEE,
      ProjectCustomLocationEnum.HIERARCHY,
      ProjectCustomLocationEnum.ZOON,
    ])
    const state = await projectCustomLocationController.getData(params)
    positions.value = (state.value.data ?? []).map(mapProjectLocation)
  } catch (error: unknown) {
    positions.value = []
    locationsError.value =
      error instanceof Error ? error.message : 'Could not load project locations.'
  } finally {
    isLoadingLocations.value = false
  }
}

watch(() => props.projectId, getProjectLocationsHierarchiesEmployees, { immediate: true })
</script>

<template>
  <div class="form-stack">
    <div class="section-title">
      <span>03</span>
      <div>
        <h2>Positions & employees</h2>
        <p>Connect hierarchies and employees to every project location.</p>
      </div>
    </div>
    <p v-if="isLoadingLocations" class="locations-status">Loading project locations…</p>
    <p v-else-if="locationsError" class="locations-status locations-error">
      {{ locationsError }}
    </p>
    <p v-else-if="!positions.length" class="locations-status">
      No locations are assigned to this project.
    </p>
    <div v-for="(location, locationIndex) in positions" :key="locationIndex" class="group-card">
      <div class="group-head">
        <div class="fixed-location">
          <span>Project location</span>
          <strong>{{ location.projectLocation?.title }}</strong>
        </div>
      </div>
      <div
        v-for="(hierarchy, index) in location.heirarchys"
        :key="index"
        class="nested-row position-row"
        :class="{ 'has-team-leader': hierarchy.employees.length }"
      >
        <div class="input-wrapper">
          <UpdatedCustomInputSelect
            :model-value="hierarchy.hierarchy"
            :params="hierarchyParams"
            :controller="hierarchyController"
            label="position"
            placeholder="Select position"
            :type="1"
            :required="true"
            @update:model-value="setHierarchy(hierarchy, $event)"
          />
        </div>
        <div class="input-wrapper">
          <UpdatedCustomInputSelect
            :model-value="hierarchy.employees"
            :params="hierarchy.employeeParams"
            :controller="employeeController"
            label="employees"
            placeholder="Select employees"
            :type="2"
            :disabled="!hierarchy.hierarchy"
            @update:model-value="setPositionEmployees(hierarchy, $event)"
          />
        </div>
        <div v-if="hierarchy.employees.length" class="input-wrapper">
          <UpdatedCustomInputSelect
            :model-value="hierarchy.teamLeader"
            :static-options="hierarchy.employees"
            label="Team leader"
            placeholder="Select team leader"
            :type="1"
            :required="true"
            @update:model-value="setTeamLeader(hierarchy, $event)"
          />
        </div>
        <button
          type="button"
          class="icon-button danger"
          @click="location.heirarchys.splice(index, 1)"
        >
          ×
        </button>
      </div>
      <button type="button" class="add-row" @click="addHierarchy(location)">+ Add Position</button>
    </div>
  </div>
</template>

<style scoped src="../ProjectFlowStepStyles.css"></style>

<style scoped>
.position-row.has-team-leader {
  grid-template-columns: 1fr 1fr ;
}

@media (max-width: 850px) {
  .position-row.has-team-leader {
    grid-template-columns: 1fr;
  }
}
</style>
