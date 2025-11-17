<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// import PrimaryButton from "@/components/HelpersComponents/PrimaryButton.vue";
import ObservationForm from '@/features/setting/Observation/Presentation/components/ObservationForm.vue'
import AddObservationController from '@/features/setting/Observation/Presentation/controllers/addObservationController.ts'
import AddObservationParams from '@/features/setting/Observation/Core/params/addObservationParams.ts'
import type Params from '@/base/core/params/params'

const router = useRouter()
const params = ref<Params | null>(null)

const addObservationController = AddObservationController.getInstance()

const addObservation = async () => {
  console.log(params.value, 'params')
  await addObservationController.addObservation(params.value as AddObservationParams, router)
}
const setParams = (data: Params) => {
  // console.log(data, 'data')
  params.value = data
}
</script>

<template>
  <form class="grid grid-cols- md:grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-4 " @submit.prevent="addObservation">

    <ObservationForm @update:data="setParams" />

    <div class="col-span-4 button-wrapper">
      <button type="submit" class="btn btn-primary">Add</button>
    </div>
  </form>
</template>

<style scoped></style>
