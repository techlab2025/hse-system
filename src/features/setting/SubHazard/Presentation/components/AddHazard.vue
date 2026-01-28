<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
// import PrimaryButton from "@/components/HelpersComponents/PrimaryButton.vue";
import AddHazardTypeParams from '@/features/setting/HazardType/Core/params/addHazardTypeParams.ts'
import type Params from '@/base/core/params/params'
import HazardForm from './HazardForm.vue'
import AddHazardTypeController from '../controllers/addHazardController'

const router = useRouter()
const route = useRoute()
const params = ref<Params | null>(null)

const addHazardTypeController = AddHazardTypeController.getInstance()

const addHazardType = async () => {
  // console.log(params.value, 'params')
  await addHazardTypeController.addHazardType(params.value as AddHazardTypeParams, router, route)
}
const setParams = (data: Params) => {
  // console.log(data, 'data')
  params.value = data
}
// router.beforeResolve((to, from, next) => {
//   if (to.params.parent_id) {
//     params.value = {
//       parent_id: Number(to.params.parent_id),
//     }
//   }
//   next()
// })
</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="addHazardType">

    <HazardForm @update:data="setParams" />

    <div class="col-span-4 button-wrapper">
      <button type="submit" class="btn btn-primary">Add</button>
    </div>
  </form>
</template>

<style scoped></style>
