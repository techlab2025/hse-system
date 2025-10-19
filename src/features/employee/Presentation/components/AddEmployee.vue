<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// import PrimaryButton from "@/components/HelpersComponents/PrimaryButton.vue";
import AddEmployeeTypeParams from '@/features/setting/EmployeeType/Core/params/addEmployeeTypeParams.ts'
import type Params from '@/base/core/params/params'
import EmployeeForm from './EmployeeForm.vue'
import AddEmployeeController from '../controllers/addEmployeeController'
import type AddEmployeeParams from '../../Core/params/addEmployeeParams'
import SingleFileUpload from '@/shared/HelpersComponents/SingleFileUpload.vue'

const router = useRouter()
const params = ref<Params | null>(null)

const addEmployeeController = AddEmployeeController.getInstance()

const addEmployee = async () => {
  console.log(params.value, 'params')
  await addEmployeeController.addEmployee(params.value as AddEmployeeParams, router)
}
const setParams = (data: Params) => {
  params.value = data
}


</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-4 gap-8" @submit.prevent="addEmployee">
    <EmployeeForm @update:data="setParams" />

    <div class="col-span-4 button-wrapper">
      <button type="submit" class="btn btn-primary">Add</button>
    </div>
  </form>
</template>

<style scoped></style>
