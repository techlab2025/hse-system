<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// import PrimaryButton from "@/components/HelpersComponents/PrimaryButton.vue";
import type Params from '@/base/core/params/params'
import ContractorForm from './ContractorForm.vue'
import AddContractorController from '../controllers/addContractorController'
import type AddContractorParams from '../../Core/params/addContractorParams'

const router = useRouter()
const params = ref<Params | null>(null)

const addContractorController = AddContractorController.getInstance()

const addContractor = async () => {
  console.log(params.value, 'params')
  await addContractorController.addContractor(params.value as AddContractorParams, router)
}
const setParams = (data: Params) => {
  params.value = data
}
</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-4 gap-8" @submit.prevent="addContractor">
    <ContractorForm @update:data="setParams" />

    <div class="col-span-4 button-wrapper">
      <button type="submit" class="btn btn-primary">Add</button>
    </div>
  </form>
</template>

<style scoped></style>
