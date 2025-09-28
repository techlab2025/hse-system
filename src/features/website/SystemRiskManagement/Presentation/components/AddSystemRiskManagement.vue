<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// import PrimaryButton from "@/components/HelpersComponents/PrimaryButton.vue";
import SystemRiskManagementForm from './SystemRiskManagementForm.vue'
import type Params from '@/base/core/params/params'
import AddSystemRiskManagementController from '../controllers/addSystemRiskManagementController'
import type AddSystemRiskManagementParams from '../../Core/params/addSystemRiskManagementParams'

const router = useRouter()
const params = ref<Params | null>(null)

const addSystemRiskManagementController = AddSystemRiskManagementController.getInstance()

const addSystemRiskManagement = async () => {
  console.log(params.value, 'params')
  await addSystemRiskManagementController.addSystemRiskManagement(
    params.value as AddSystemRiskManagementParams,
    router,
  )
}
const setParams = (data: Params) => {
  // console.log(data, 'data')
  params.value = data
}
</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="addSystemRiskManagement">
    <SystemRiskManagementForm @update:data="setParams" />

    <div class="col-span-4 button-wrapper">
      <button type="submit" class="btn btn-primary">Add</button>
    </div>
  </form>
</template>

<style scoped></style>
