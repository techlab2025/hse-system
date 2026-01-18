<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import type Params from '@/base/core/params/params'
import InvestigatingForm from './InvestigatingForm.vue'
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
    <InvestigatingForm @update:data="setParams" />

    <div class="col-span-6 button-wrapper flex gap-2">
      <router-link to="/organization/investigating" @click.prevent="" class="btn btn-cancel "
        style="width:30%  ">Cancel</router-link>
      <button type="submit" class="btn btn-primary " style="width: 70%;">Add</button>
    </div>
  </form>
</template>

<style scoped></style>
