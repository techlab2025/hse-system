<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// import PrimaryButton from "@/components/HelpersComponents/PrimaryButton.vue";
import type Params from '@/base/core/params/params'
import AddSystemRiskTypeController from '../controllers/addSystemRiskTypeController'
import type AddSystemRiskTypeParams from '../../Core/params/addSystemRiskTypeParams'
import SystemRiskTypeForm from './SystemRiskTypeForm.vue'

const router = useRouter()
const params = ref<Params | null>(null)

const addSystemRiskTypeController = AddSystemRiskTypeController.getInstance()

const addSystemRiskType = async () => {
  console.log(params.value, 'params')
  await addSystemRiskTypeController.addSystemRiskType(
    params.value as AddSystemRiskTypeParams,
    router,
  )
}
const setParams = (data: Params) => {
  // console.log(data, 'data')
  params.value = data
}
</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="addSystemRiskType">
    <SystemRiskTypeForm @update:data="setParams" />

    <div class="col-span-4 button-wrapper">
      <button type="submit" class="btn btn-primary">Add</button>
    </div>
  </form>
</template>

<style scoped></style>
