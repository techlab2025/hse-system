<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import type Params from '@/base/core/params/params'
import AddIncedantController from '../controllers/addIncedantController'
import type AddIncedantParams from '../../Core/params/addIncedantParams'
import IncedantForm from './IncedantForm.vue'

const router = useRouter()
const params = ref<Params | null>(null)

const addIncedantController = AddIncedantController.getInstance()

const addIncedant = async () => {
  console.log(params.value, 'params')
  await addIncedantController.addIncedant(params.value as AddIncedantParams, router)
}
const setParams = (data: Params) => {
  // console.log(data, 'data')
  params.value = data
}
</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-6 gap-4" @submit.prevent="addIncedant">
    <IncedantForm @update:data="setParams" />

    <div class="col-span-6 button-wrapper">
      <button type="submit" class="btn btn-primary w-full">Add</button>
    </div>
  </form>
</template>

<style scoped></style>
