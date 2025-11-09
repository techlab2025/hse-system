<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// import PrimaryButton from "@/components/HelpersComponents/PrimaryButton.vue";

import type Params from '@/base/core/params/params'
import AddMethodsController from '../controllers/addMethodsController'
import type AddMethodsParams from '../../Core/params/addMethodsParams'
import MethodsForm from './MethodsForm.vue'

const router = useRouter()
const params = ref<Params | null>(null)

const addMethodsController = AddMethodsController.getInstance()

const addMethods = async () => {
  console.log(params.value, 'params')
  await addMethodsController.addMethods(params.value as AddMethodsParams, router)
}
const setParams = (data: Params) => {
  // console.log(data, 'data')
  params.value = data
}
</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="addMethods">

    <MethodsForm @update:data="setParams" />

    <div class="col-span-4 button-wrapper">
      <button type="submit" class="btn btn-primary">Add</button>
    </div>
  </form>
</template>

<style scoped></style>
