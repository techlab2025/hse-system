<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// import PrimaryButton from "@/components/HelpersComponents/PrimaryButton.vue";
import type Params from '@/base/core/params/params'
import AddServiceLogController from '../controllers/addServiceLogController'
import type AddServiceLogParams from '../../Core/params/addServiceLogParams'
import ServiceLogForm from './ServiceLogForm.vue'

const router = useRouter()
const params = ref<Params | null>(null)

const addServiceLogController = AddServiceLogController.getInstance()

const addServiceLog = async () => {
  console.log(params.value, 'params')
  await addServiceLogController.addServiceLog(
    params.value as AddServiceLogParams,
    router,
  )
}
const setParams = (data: Params) => {
  // console.log(data, 'data')
  params.value = data
}
</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="addServiceLog">
    <ServiceLogForm @update:data="setParams" />

    <div class="col-span-4 button-wrapper">
      <button type="submit" class="btn btn-primary">Add</button>
    </div>
  </form>
</template>

<style scoped></style>
