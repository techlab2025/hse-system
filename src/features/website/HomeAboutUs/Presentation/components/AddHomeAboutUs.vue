<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// import PrimaryButton from "@/components/HelpersComponents/PrimaryButton.vue";
import HomeAboutUsForm from './HomeAboutUsForm.vue'
import type Params from '@/base/core/params/params'
import AddHomeAboutUsController from '../controllers/addHomeAboutUsController'
import type AddHomeAboutUsParams from '../../Core/params/addHomeAboutUsParams'

const router = useRouter()
const params = ref<Params | null>(null)

const addHomeAboutUsController = AddHomeAboutUsController.getInstance()

const addHomeAboutUs = async () => {
  await addHomeAboutUsController.addHomeAboutUs(params.value as AddHomeAboutUsParams, router)
}
const setParams = (data: Params) => {
  params.value = data
}
</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="addHomeAboutUs">
    <HomeAboutUsForm @update:data="setParams" />

    <div class="col-span-4 button-wrapper">
      <button type="submit" class="btn btn-primary">Add</button>
    </div>
  </form>
</template>

<style scoped></style>
