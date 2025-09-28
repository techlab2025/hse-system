OurSystemStep
<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// import PrimaryButton from "@/components/HelpersComponents/PrimaryButton.vue";
import OurSystemStepForm from './OurSystemStepForm.vue'
import type Params from '@/base/core/params/params'
import type AddOurSystemStepParams from '../../Core/params/addOurSystemStepParams'
import AddOurSystemStepController from '../controllers/addOurSystemStepController'

const router = useRouter()
const params = ref<Params | null>(null)

const addOurSystemStepController = AddOurSystemStepController.getInstance()

const addOurSystemStep = async () => {
  await addOurSystemStepController.addOurSystemStep(params.value as AddOurSystemStepParams, router)
}
const setParams = (data: Params) => {
  params.value = data
}
</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="addOurSystemStep">
    <OurSystemStepForm @update:data="setParams" />

    <div class="col-span-4 button-wrapper">
      <button type="submit" class="btn btn-primary">Add</button>
    </div>
  </form>
</template>

<style scoped></style>
