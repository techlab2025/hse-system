<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// import PrimaryButton from "@/components/HelpersComponents/PrimaryButton.vue";
import type Params from '@/base/core/params/params'
import AddSystemBannerController from '../controllers/addSystemBannerController'
import type AddSystemBannerParams from '../../Core/params/addSystemBannerParams'
import SystemBannerForm from './SystemBannerForm.vue'

const router = useRouter()
const params = ref<Params | null>(null)

const addSystemBannerController = AddSystemBannerController.getInstance()

const addSystemBanner = async () => {
  console.log(params.value, 'params')
  await addSystemBannerController.addSystemBanner(
    params.value as AddSystemBannerParams,
    router,
  )
}
const setParams = (data: Params) => {
  // console.log(data, 'data')
  params.value = data
}
</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="addSystemBanner">
    <SystemBannerForm @update:data="setParams" />

    <div class="col-span-4 button-wrapper">
      <button type="submit" class="btn btn-primary">Add</button>
    </div>
  </form>
</template>

<style scoped></style>
