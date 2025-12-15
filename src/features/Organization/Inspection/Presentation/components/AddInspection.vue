<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import type Params from '@/base/core/params/params'
import AddInspectionController from '../controllers/addInspectionController'
import type AddInspectionParams from '../../Core/params/addInspectionParams'
import InspectionForm from './InspectionForm.vue'

const router = useRouter()
const params = ref<Params | null>(null)

const addInspectionController = AddInspectionController.getInstance()

const addInspection = async () => {
  await addInspectionController.addInspection(params.value as AddInspectionParams, router)
}
const setParams = (data: Params) => {
  console.log(data as AddInspectionParams, 'data Params')
  params.value = data
}
</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-6 gap-4" @submit.prevent="addInspection">
    <InspectionForm @update:data="setParams" />

    <div class="col-span-6 button-wrapper">
      <button type="submit" class="btn btn-primary w-full">Add</button>
    </div>
  </form>
</template>

<style scoped></style>
