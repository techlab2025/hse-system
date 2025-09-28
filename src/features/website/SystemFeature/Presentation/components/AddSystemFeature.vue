<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// import PrimaryButton from "@/components/HelpersComponents/PrimaryButton.vue";
import type Params from '@/base/core/params/params'
import AddSystemFeatureController from '../controllers/addSystemFeatureController'
import type AddSystemFeatureParams from '../../Core/params/addSystemFeatureParams'
import SystemFeatureForm from './SystemFeatureForm.vue'

const router = useRouter()
const params = ref<Params | null>(null)

const addSystemFeatureController = AddSystemFeatureController.getInstance()

const addSystemFeature = async () => {
  console.log(params.value, 'params')
  await addSystemFeatureController.addSystemFeature(
    params.value as AddSystemFeatureParams,
    router,
  )
}
const setParams = (data: Params) => {
  // console.log(data, 'data')
  params.value = data
}
</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="addSystemFeature">
    <SystemFeatureForm @update:data="setParams" />

    <div class="col-span-4 button-wrapper">
      <button type="submit" class="btn btn-primary">Add</button>
    </div>
  </form>
</template>

<style scoped></style>
