<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// import PrimaryButton from "@/components/HelpersComponents/PrimaryButton.vue";
import SystemWorkForm from './SystemWorkForm.vue'
import type Params from '@/base/core/params/params'
import AddSystemWorkController from '../controllers/addSystemWorkController'
import type AddSystemWorkParams from '../../Core/params/addSystemWorkParams'


const router = useRouter()
const params = ref<Params | null>(null)

const addSystemWorkController = AddSystemWorkController.getInstance()

const addSystemWork = async () => {
  console.log(params.value, 'params')
  await addSystemWorkController.addSystemWork(params.value as AddSystemWorkParams, router)
}
const setParams = (data: Params) => {
  // console.log(data, 'data')
  params.value = data
}
</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="addSystemWork">
    <SystemWorkForm @update:data="setParams" />

    <div class="col-span-4 button-wrapper">
      <button type="submit" class="btn btn-primary">Add</button>
    </div>
  </form>
</template>

<style scoped></style>
