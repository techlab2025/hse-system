<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// import PrimaryButton from "@/components/HelpersComponents/PrimaryButton.vue";
import type Params from '@/base/core/params/params'
import AddServiceSectionController from '../controllers/addServiceSectionController'
import type AddServiceSectionParams from '../../Core/params/addServiceSectionParams'
import ServiceSectionForm from './ServiceSectionForm.vue'

const router = useRouter()
const params = ref<Params | null>(null)

const addServiceSectionController = AddServiceSectionController.getInstance()

const addServiceSection = async () => {
  console.log(params.value, 'params')
  await addServiceSectionController.addServiceSection(
    params.value as AddServiceSectionParams,
    router,
  )
}
const setParams = (data: Params) => {
  // console.log(data, 'data')
  params.value = data
}
</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="addServiceSection">
    <ServiceSectionForm @update:data="setParams" />

    <div class="col-span-4 button-wrapper">
      <button type="submit" class="btn btn-primary">Add</button>
    </div>
  </form>
</template>

<style scoped></style>
