<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue'
import TitleInterface from '@/base/Data/Models/title_interface'
import IndexTeamController from '@/features/setting/Teams/Presentation/controllers/indexTeamController'
import IndexTeamParams from '@/features/setting/Teams/Core/params/indexTeamParams'
import IndexHierarchyEmployeeController from '../../../controllers/Hierarchy/HierarchyEmployee/indexHierarchyEmployeeController'
import IndexLocationHierarchyEmployeeParams from '@/features/Organization/Project/Core/params/Hierarchy/HierarchyEmployee/indexHierarchyEmployeeParams'
import CreateProjectLocationTeamEmployeeController from '../../../controllers/CreateProjectLocationTeamEmployeeController'
import CreateProjectLocationTeamEmployeeParams from '@/features/Organization/Project/Core/params/CreateProjectLocationTeamEmployeeParams'

const props = defineProps<{
  ProjectLocationId: number
  LocationId: number
}>()

const emit = defineEmits(['update:data'])

const route = useRoute()
const id = Number(route.params.project_id || route.params.id)


const TeamType = ref<TitleInterface | null>(null)
const setTeamType = (data: TitleInterface) => {
  TeamType.value = data
}

const indexTeamController = IndexTeamController.getInstance()
const indexTeamsParams = new IndexTeamParams('', 1, 10, 1)


const Employees = ref<TitleInterface[]>([])
const setEmployees = (data: TitleInterface[]) => {
  Employees.value = data
}
const indexHierarchyEmployeeController = IndexHierarchyEmployeeController.getInstance()
const indexLocationHierarchyEmployeeParams = new IndexLocationHierarchyEmployeeParams(id, props.LocationId, null)

const loading = ref(false)
const CreateProjectLocationTeamEmployee = async () => {
  if (!TeamType.value || Employees.value.length === 0) {
    return
  }

  const employeeIds = Employees.value.map(emp => emp.id)

  const teams = [
    {
      project_location_id: props.ProjectLocationId,
      team_id: TeamType.value.id,
      employee_ids: employeeIds,
    },
  ]

  const createParams = new CreateProjectLocationTeamEmployeeParams(id, teams)
  const controller = CreateProjectLocationTeamEmployeeController.getInstance()


  try {
    loading.value = true
    const response = await controller.CreatePorjectLocationTeamEmployee(createParams, route)
    emit('update:data')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="equipment-form">
    <form @submit.prevent="CreateProjectLocationTeamEmployee">
      <div class="input-container">
        <div class="input-wrapper">
          <CustomSelectInput :modelValue="TeamType" :controller="indexTeamController" :params="indexTeamsParams"
            class="input" :label="$t('team_type')" id="team-type" :placeholder="$t('team_type')"
            @update:modelValue="setTeamType" />
        </div>

        <div class="input-wrapper">
          <CustomSelectInput :modelValue="Employees" :controller="indexHierarchyEmployeeController"
            :params="indexLocationHierarchyEmployeeParams" class="input" :label="$t('employee')" id="employee" :type="2"
            :placeholder="$t('employee')" @update:modelValue="setEmployees" />
        </div>
      </div>

      <div class="submit-btn">
        <button class="btn btn-primary" type="submit" :disabled="loading">
          {{ loading ? $t('loading') : $t('confirm') }}
        </button>
      </div>
    </form>
  </div>
</template>
