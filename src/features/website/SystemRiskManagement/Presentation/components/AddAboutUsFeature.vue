<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// import PrimaryButton from "@/components/HelpersComponents/PrimaryButton.vue";
import AboutUsFeatureForm from './AboutUsFeatureForm.vue'
import type Params from '@/base/core/params/params'
import AddAboutUsFeatureController from '../controllers/addAboutUsFeatureController'
import type AddAboutUsFeatureParams from '../../Core/params/addSystemRiskManagementParams'

const router = useRouter()
const params = ref<Params | null>(null)

const addAboutUsFeatureController = AddAboutUsFeatureController.getInstance()

const addAboutUsFeature = async () => {
  console.log(params.value, 'params')
  await addAboutUsFeatureController.addAboutUsFeature(
    params.value as AddAboutUsFeatureParams,
    router,
  )
}
const setParams = (data: Params) => {
  // console.log(data, 'data')
  params.value = data
}
</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="addAboutUsFeature">
    <AboutUsFeatureForm @update:data="setParams" />

    <div class="col-span-4 button-wrapper">
      <button type="submit" class="btn btn-primary">Add</button>
    </div>
  </form>
</template>

<style scoped></style>
