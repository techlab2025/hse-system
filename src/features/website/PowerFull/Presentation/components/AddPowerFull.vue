<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// import PrimaryButton from "@/components/HelpersComponents/PrimaryButton.vue";
import PowerFullForm from './PowerFullForm.vue'
import type Params from '@/base/core/params/params'
import AddPowerFullController from '../controllers/addPowerFullController'
import type AddPowerFullParams from '../../Core/params/addPowerFullParams'

const router = useRouter()
const params = ref<Params | null>(null)

const addPowerFullController = AddPowerFullController.getInstance()

const addPowerFull = async () => {
  console.log(params.value, 'params')
  await addPowerFullController.addPowerFull(params.value as AddPowerFullParams, router)
}
const setParams = (data: Params) => {
  // console.log(data, 'data')
  params.value = data
}
</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="addPowerFull">
    <PowerFullForm @update:data="setParams" />

    <div class="col-span-4 button-wrapper">
      <button type="submit" class="btn btn-primary">Add</button>
    </div>
  </form>
</template>

<style scoped></style>
