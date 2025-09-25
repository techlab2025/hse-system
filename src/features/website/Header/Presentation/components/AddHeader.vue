<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// import PrimaryButton from "@/components/HelpersComponents/PrimaryButton.vue";
import HeaderForm from './HeaderForm.vue'
import type Params from '@/base/core/params/params'
import AddHeaderController from '../controllers/addHeaderController'
import type AddHeaderParams from '../../Core/params/addHeaderParams'


const router = useRouter()
const params = ref<Params | null>(null)

const addHeaderController = AddHeaderController.getInstance()

const addHeader = async () => {
  console.log(params.value, 'params')
  await addHeaderController.addHeader(params.value as AddHeaderParams, router)
}
const setParams = (data: Params) => {
  // console.log(data, 'data')
  params.value = data
}
</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="addHeader">
    <HeaderForm @update:data="setParams" />

    <div class="col-span-4 button-wrapper">
      <button type="submit" class="btn btn-primary">Add</button>
    </div>
  </form>
</template>

<style scoped></style>
