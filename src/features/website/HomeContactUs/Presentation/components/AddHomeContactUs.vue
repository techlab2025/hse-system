<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// import PrimaryButton from "@/components/HelpersComponents/PrimaryButton.vue";
import HomeContactUsForm from './HomeContactUsForm.vue'
import type Params from '@/base/core/params/params'
import AddHomeContactUsController from '../controllers/addHomeContactUsController'
import type AddHomeContactUsParams from '../../Core/params/addHomeContactUsParams'


const router = useRouter()
const params = ref<Params | null>(null)

const addHomeContactUsController = AddHomeContactUsController.getInstance()

const addHomeContactUs = async () => {
  console.log(params.value, 'params')
  await addHomeContactUsController.addHomeContactUs(params.value as AddHomeContactUsParams, router)
}
const setParams = (data: Params) => {
  // console.log(data, 'data')
  params.value = data
}
</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="addHomeContactUs">
    <HomeContactUsForm @update:data="setParams" />

    <div class="col-span-4 button-wrapper">
      <button type="submit" class="btn btn-primary">Add</button>
    </div>
  </form>
</template>

<style scoped></style>
