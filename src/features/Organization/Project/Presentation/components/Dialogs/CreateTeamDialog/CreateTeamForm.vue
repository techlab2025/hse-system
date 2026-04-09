<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue'
import TitleInterface from '@/base/Data/Models/title_interface'
import IndexTeamController from '@/features/setting/Teams/Presentation/controllers/indexTeamController'
import IndexTeamParams from '@/features/setting/Teams/Core/params/indexTeamParams'
import IndexHierarchyEmployeeController from '../../../controllers/Hierarchy/HierarchyEmployee/indexHierarchyEmployeeController'
import IndexLocationHierarchyEmployeeParams from '@/features/Organization/Project/Core/params/Hierarchy/HierarchyEmployee/indexHierarchyEmployeeParams'
import CreateProjectLocationTeamEmployeeController from '../../../controllers/CreateProjectLocationTeamEmployeeController'
import CreateProjectLocationTeamEmployeeParams from '@/features/Organization/Project/Core/params/CreateProjectLocationTeamEmployeeParams'

const emit = defineEmits(['update:data'])
const { ProjectLocationId, LocationId, teamId } = defineProps<{
  ProjectLocationId: number | undefined
  LocationId: number | undefined
  teamId?: number | undefined
}>()
const route = useRoute()
const id = Number(route.params.project_id || route.params.id)
const loading = ref(false)
const indexTeamController = IndexTeamController.getInstance()
const indexTeamsParams = new IndexTeamParams('', 1, 10, 1)
const TeamType = ref<TitleInterface | null>(null)
const Employees = ref<TitleInterface[]>([])
const TeamLeader = ref<TitleInterface | null>(null)
const indexHierarchyEmployeeController = IndexHierarchyEmployeeController.getInstance()
const indexLocationHierarchyEmployeeParams = new IndexLocationHierarchyEmployeeParams(
  id,
  LocationId!,
)

const setTeamType = (data: TitleInterface) => {
  TeamType.value = data
}

const setEmployees = (data: TitleInterface[]) => {
  Employees.value = data
  if (TeamLeader.value && !data.find((e) => e.id === TeamLeader.value?.id)) {
    TeamLeader.value = null
  }
}

const setTeamLeader = (data: TitleInterface) => {
  TeamLeader.value = data
}

const CreateProjectLocationTeamEmployee = async () => {
  // if (!TeamType.value || Employees.value.length === 0) {
  //   return
  // }

  const employees = Employees.value.map((emp) => ({
    employee_id: emp.id,
    is_leader: emp.id === TeamLeader.value?.id,
  }))

  const teams = [
    {
      project_location_id: ProjectLocationId!,
      team_id: (teamId ? teamId : TeamType.value?.id) as number,
      employees,
    },
  ]

  const createParams = new CreateProjectLocationTeamEmployeeParams(id, teams)
  const controller = CreateProjectLocationTeamEmployeeController.getInstance()

  try {
    loading.value = true
    await controller.CreatePorjectLocationTeamEmployee(createParams, route)
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
        <div class="input-wrapper" v-if="!teamId">
          <CustomSelectInput
            :modelValue="TeamType"
            :controller="indexTeamController"
            :params="indexTeamsParams"
            class="input"
            :label="$t('team_type')"
            id="team-type"
            :placeholder="$t('team_type')"
            @update:modelValue="setTeamType"
          />
        </div>

        <div class="input-wrapper">
          <CustomSelectInput
            :modelValue="Employees"
            :controller="indexHierarchyEmployeeController"
            :params="indexLocationHierarchyEmployeeParams"
            class="input"
            :label="$t('employee')"
            id="employee"
            :type="2"
            :placeholder="$t('employee')"
            @update:modelValue="setEmployees"
          />
        </div>

        <div class="input-wrapper">
          <CustomSelectInput
            :modelValue="TeamLeader"
            class="input"
            :staticOptions="Employees"
            :label="$t('team_leader')"
            id="team-leader"
            :placeholder="$t('team_leader')"
            @update:modelValue="setTeamLeader"
          />
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
