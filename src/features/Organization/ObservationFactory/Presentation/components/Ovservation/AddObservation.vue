<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// import PrimaryButton from "@/components/HelpersComponents/PrimaryButton.vue";
import type Params from '@/base/core/params/params'
import AddHazardController from '../../controllers/addHazardController'
import type AddHazardParams from '../../../Core/params/addHazardParams'
import ObservationForm from './ObservationForm.vue'
import FullObservationFactoryForm from '../FullForm/FullObservationFactoryForm.vue'

const router = useRouter()
const params = ref<Params | null>(null)

const addObservationController = AddHazardController.getInstance()

const addObservation = async () => {
  console.log(params.value, 'params')
  await addObservationController.addHazard(params.value as AddHazardParams, router)
}
const setParams = (data: Params) => {
  // console.log(data, 'data')
  params.value = data
}
</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-6 gap-4" @submit.prevent="addObservation">
    <!-- <ObservationForm @update:data="setParams" /> -->
    <FullObservationFactoryForm @update:data="setParams" />

    <div class="col-span-4 button-wrapper">
      <button type="submit" class="btn btn-primary">Add</button>
    </div>
  </form>
</template>

<style scoped></style>
