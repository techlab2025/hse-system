<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// import PrimaryButton from "@/components/HelpersComponents/PrimaryButton.vue";
import type Params from '@/base/core/params/params'
import AddServiceController from '../controllers/addServiceFeatureController'
import type AddServiceParams from '../../Core/params/addServiceFeatureParams'
import ServiceForm from './ServiceFeatureForm.vue'

const router = useRouter()
const params = ref<Params | null>(null)

const addServiceController = AddServiceController.getInstance()

const addService = async () => {
  console.log(params.value, 'params')
  await addServiceController.addService(params.value as AddServiceParams, router)
}
const setParams = (data: Params) => {
  // console.log(data, 'data')
  params.value = data
}
</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="addService">
    <ServiceForm @update:data="setParams" />

    <div class="col-span-4 button-wrapper">
      <button type="submit" class="btn btn-primary">Add</button>
    </div>
  </form>
</template>

<style scoped></style>
