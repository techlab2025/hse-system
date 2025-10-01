<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// import PrimaryButton from "@/components/HelpersComponents/PrimaryButton.vue";
import ServiceFeatureForm from './ServiceFeatureForm.vue'
import type Params from '@/base/core/params/params'
import AddServiceFeatureController from '../controllers/addServiceFeatureController'
import type AddServiceFeatureParams from '../../Core/params/addServiceFeatureParams'

const router = useRouter()
const params = ref<Params | null>(null)

const addServiceFeatureController = AddServiceFeatureController.getInstance()

const addServiceFeature = async () => {
  console.log(params.value, 'Final params From Add ')
  await addServiceFeatureController.addServiceFeature(
    params.value as AddServiceFeatureParams,
    router,
  )
}
const setParams = (data: Params) => {
  params.value = data
}
</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="addServiceFeature">
    <ServiceFeatureForm @update:data="setParams" />

    <div class="col-span-4 button-wrapper">
      <button type="submit" class="btn btn-primary">Add</button>
    </div>
  </form>
</template>

<style scoped></style>
