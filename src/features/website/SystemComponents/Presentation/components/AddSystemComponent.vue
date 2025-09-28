<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// import PrimaryButton from "@/components/HelpersComponents/PrimaryButton.vue";
import type Params from '@/base/core/params/params'
import AddSystemComponentController from '../controllers/addSystemComponentController'
import type AddSystemComponentParams from '../../Core/params/addSystemComponentParams'
import SystemComponentForm from './SystemComponentForm.vue'

const router = useRouter()
const params = ref<Params | null>(null)

const addSystemComponentController = AddSystemComponentController.getInstance()

const addSystemComponent = async () => {
  console.log(params.value, 'params')
  await addSystemComponentController.addSystemComponent(
    params.value as AddSystemComponentParams,
    router,
  )
}
const setParams = (data: Params) => {
  // console.log(data, 'data')
  params.value = data
}
</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="addSystemComponent">
    <SystemComponentForm @update:data="setParams" />

    <div class="col-span-4 button-wrapper">
      <button type="submit" class="btn btn-primary">Add</button>
    </div>
  </form>
</template>

<style scoped></style>
