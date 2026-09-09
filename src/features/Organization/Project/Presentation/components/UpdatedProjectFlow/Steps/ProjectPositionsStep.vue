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
const hierarchyParams = computed(
  () => new IndexHerikalyParams('', 1, 30, 0, false, props.projectId ?? null),
)

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
  location.heirarchys.push({ hierarchy: null, employees: [], employeeParams: employeeParams() })
}
const setHierarchy = (
  hierarchy: PositionHierarchyForm,
  value: TitleInterface | TitleInterface[] | null,
) => {
  hierarchy.hierarchy = Array.isArray(value) ? (value[0] ?? null) : value
  hierarchy.employees = []
  hierarchy.employeeParams = employeeParams(hierarchy.hierarchy?.id ?? null)
}
const setPositionEmployees = (
  hierarchy: PositionHierarchyForm,
  value: TitleInterface | TitleInterface[] | null,
) => {
  hierarchy.employees = Array.isArray(value) ? value : value ? [value] : []
}

const mapProjectLocation = (location: ProjectCustomLocationModel): PositionLocationForm => ({
  projectLocation: new TitleInterface({
    id: location.projectLocationId,
    title: location.title,
  }),
  heirarchys: (location.locationHierarchy ?? []).map((hierarchy) => ({
    hierarchy: new TitleInterface({ id: hierarchy.id, title: hierarchy.title }),
    employees: (hierarchy.Employees ?? []).map(
      (employee) =>
        new TitleInterface({
          id: employee.organization_employee_id || employee.employeeId,
          title: employee.name,
        }),
    ),
    employeeParams: employeeParams(hierarchy.id),
  })),
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
      <div v-for="(hierarchy, index) in location.heirarchys" :key="index" class="nested-row">
        <div class="input-wrapper">
          <UpdatedCustomInputSelect
            :model-value="hierarchy.hierarchy"
            :params="hierarchyParams"
            :controller="hierarchyController"
            label="Functional position"
            placeholder="Select hierarchy"
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
            label="Organization employees"
            placeholder="Select employees"
            :type="2"
            :disabled="!hierarchy.hierarchy"
            @update:model-value="setPositionEmployees(hierarchy, $event)"
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
      <button type="button" class="add-row" @click="addHierarchy(location)">+ Add hierarchy</button>
    </div>
  </div>
</template>

<style scoped src="../ProjectFlowStepStyles.css"></style>
