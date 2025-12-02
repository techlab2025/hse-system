<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import type Params from '@/base/core/params/params'
import InvestigationMeetingForm from './InvestigationMeetingForm.vue'
import AddInvestigatingController from '../../controllers/addInvestigatingController'
import type AddInvestigatingParams from '../../../Core/params/addInvestigatingParams'

const router = useRouter()
const params = ref<Params | null>(null)

const addInvestigatingController = AddInvestigatingController.getInstance()

const addInvestigating = async () => {
  console.log(params.value, 'params')
  await addInvestigatingController.addInvestigating(params.value as AddInvestigatingParams, router)
}
const setParams = (data: Params) => {
  // console.log(data, 'data')
  params.value = data
}
</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-6 gap-4" @submit.prevent="addInvestigating">
    <InvestigationMeetingForm @update:data="setParams" />

    <div class="col-span-6 button-wrapper">
      <button type="submit" class="btn btn-primary w-full">Add</button>
    </div>
  </form>
</template>

<style scoped></style>
