<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import FormLoader from '@/shared/DataStatues/FormLoader.vue'
import type Params from '@/base/core/params/params'
import EditEmployeeController from '../controllers/editEmployeeController'
import ShowEmployeeParams from '../../Core/params/showEmployeeParams'
import ShowEmployeeController from '../controllers/showEmployeeController'
import EmployeeForm from './EmployeeForm.vue'

const route = useRoute()
const router = useRouter()
const id = route.params.id
const params = ref<Params | null>(null)

const showEmployeeController = ShowEmployeeController.getInstance()
const state = ref(showEmployeeController.state.value)

const fetchEmployeeDetails = async () => {
  const EmployeeParams = new ShowEmployeeParams(Number(id))

  await showEmployeeController.showEmployeeType(EmployeeParams)
}

onMounted(() => {
  fetchEmployeeDetails()
})

const EditEmployee = async (draft: boolean) => {
  if (draft) {
    await EditEmployeeController.getInstance().editEmployee(params.value!, router)
  } else {
    await EditEmployeeController.getInstance().editEmployee(params.value!, router)
  }
}

watch(
  () => showEmployeeController.state.value,
  (newState) => {
    if (newState) {
      console.log(newState)
      state.value = newState
    }
  },
)

const setParams = (data: Params) => {
  params.value = data
}
</script>

<template>
  <DataStatus :controller="state">
    <template #success>
      <!--      <pre>-->
      <!--              {{ state.data?.titles }}-->

      <!--      </pre>-->
      <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="EditEmployee">
        <EmployeeForm @update:data="setParams" :data="state.data!" />
        <div class="col-span-4 button-wrapper">
          <button type="submit" class="btn btn-primary">Edit</button>
        </div>
      </form>
    </template>
    <template #loader>
      <FormLoader :inputsCount="5" />
    </template>
  </DataStatus>
</template>

<style scoped></style>
