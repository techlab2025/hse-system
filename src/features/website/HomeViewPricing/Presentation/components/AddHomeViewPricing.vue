<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// import PrimaryButton from "@/components/HelpersComponents/PrimaryButton.vue";
import HomeViewPricingForm from './HomeViewPricingForm.vue'
import type Params from '@/base/core/params/params'
import AddHomeViewPricingController from '../controllers/addHomeViewPricingController'
import type AddHomeViewPricingParams from '../../Core/params/addHomeViewPricingParams'

const router = useRouter()
const params = ref<Params | null>(null)

const addHomeViewPricingController = AddHomeViewPricingController.getInstance()

const addHomeViewPricing = async () => {
  console.log(params.value, 'params')
  await addHomeViewPricingController.addHomeViewPricing(
    params.value as AddHomeViewPricingParams,
    router,
  )
}
const setParams = (data: Params) => {
  // console.log(data, 'data')
  params.value = data
}
</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="addHomeViewPricing">
    <HomeViewPricingForm @update:data="setParams" />

    <div class="col-span-4 button-wrapper">
      <button type="submit" class="btn btn-primary">Add</button>
    </div>
  </form>
</template>

<style scoped></style>
