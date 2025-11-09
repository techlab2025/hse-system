<script setup lang="ts">
import { onMounted, ref } from 'vue'
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue'
import TitleInterface from '@/base/Data/Models/title_interface'
import FetchProjectLocationEmployeeController from '../../../controllers/FetchProjectLocationEmployeeController'
import FetchProjectLocationEmployee from '@/features/Organization/Project/Core/params/FetchProjectLocationEmployeeParams'
import { useRoute } from 'vue-router'
import IndexTeamParams from '@/features/setting/Teams/Core/params/indexTeamParams'
import IndexTeamController from '@/features/setting/Teams/Presentation/controllers/indexTeamController'

const props = defineProps<{
  LocationId: number
}>()
const route = useRoute()
const id = route.params.project_id
const TeamType = ref<TitleInterface>()
const setTeamType = (data: TitleInterface) => {
  TeamType.value = data
}
const indexTeamController = IndexTeamController.getInstance();
const indexTeamsParams = new IndexTeamParams('', 1, 10, 1)


const Employee = ref<TitleInterface>()
const Employees = ref<TitleInterface[]>([
  new TitleInterface({ id: 1, title: 'Employee 1', subtitle: '' }),
  new TitleInterface({ id: 2, title: 'Employee 2', subtitle: '' }),
  new TitleInterface({ id: 3, title: 'Employee 3', subtitle: '' }),
])
const setEmployees = (data: TitleInterface) => {
  Employee.value = data
}

const GetProjectLocationEmployees = async () => {
  const fetchProjectLocationEmployeeParams = new FetchProjectLocationEmployee(props.LocationId);
  const fetchProjectLocationEmployeeController = FetchProjectLocationEmployeeController.getInstance();
  const State = await fetchProjectLocationEmployeeController.FetchProjectLocationEmployee(fetchProjectLocationEmployeeParams);
}

onMounted(() => {
  console.log(id, "id");
  GetProjectLocationEmployees()
})
</script>

<template>
  <div class="equipment-form">
    <form>
      <div class="input-container">
        <div class="input-wrapper">
          <CustomSelectInput :modelValue="TeamType" :controller="indexTeamController" :params="indexTeamsParams"
            class="input" :label="$t('team_type')" id="team type" :placeholder="$t('team_type')"
            @update:modelValue="setTeamType" />
        </div>
        <div class="input-wrapper">
          <CustomSelectInput :modelValue="Employee" :static-options="Employees" class="input" :label="$t('employee')"
            id="employee" :placeholder="$t('employee')" @update:modelValue="setEmployees" />
        </div>
      </div>

      <div class="submit-btn">
        <button class="btn btn-ptimary">confirm</button>
      </div>
    </form>
  </div>
</template>
