<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// import PrimaryButton from "@/components/HelpersComponents/PrimaryButton.vue";
import AboutUsCoreForm from './AboutUsCoreForm.vue'
import type Params from '@/base/core/params/params'
import AddAboutUsCoreController from '../controllers/addAboutUsCoreController'
import type AddAboutUsCoreParams from '../../Core/params/addAboutUsCoreParams'

const router = useRouter()
const params = ref<Params | null>(null)

const addAboutUsCoreController = AddAboutUsCoreController.getInstance()

const addAboutUsCore = async () => {
  await addAboutUsCoreController.addAboutUsCore(params.value as AddAboutUsCoreParams, router)
}
const setParams = (data: Params) => {
  params.value = data
}
</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="addAboutUsCore">
    <AboutUsCoreForm @update:data="setParams" />

    <div class="col-span-4 button-wrapper">
      <button type="submit" class="btn btn-primary">Add</button>
    </div>
  </form>
</template>

<style scoped></style>
