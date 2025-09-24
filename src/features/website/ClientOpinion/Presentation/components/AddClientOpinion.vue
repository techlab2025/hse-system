<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// import PrimaryButton from "@/components/HelpersComponents/PrimaryButton.vue";
import ClientOpinionForm from './ClientOpinionForm.vue'
import type Params from '@/base/core/params/params'
import AddClientOpinionController from '../controllers/addClientOpinionController'
import type AddClientOpinionParams from '../../Core/params/addClientOpinionParams'

const router = useRouter()
const params = ref<Params | null>(null)

const addClientOpinionController = AddClientOpinionController.getInstance()

const addClientOpinion = async () => {
  console.log(params.value, 'params')
  await addClientOpinionController.addClientOpinion(params.value as AddClientOpinionParams, router)
}
const setParams = (data: Params) => {
  // console.log(data, 'data')
  params.value = data
}
</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="addClientOpinion">
    <ClientOpinionForm @update:data="setParams" />

    <div class="col-span-4 button-wrapper">
      <button type="submit" class="btn btn-primary">Add</button>
    </div>
  </form>
</template>

<style scoped></style>
