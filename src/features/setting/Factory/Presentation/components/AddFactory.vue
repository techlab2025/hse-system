<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// import PrimaryButton from "@/components/HelpersComponents/PrimaryButton.vue";
import type Params from '@/base/core/params/params'
import AddFactoryController from '../controllers/addFactoryController'
import type AddFactoryParams from '../../Core/params/addFactoryParams'
import FactoryForm from './FactoryForm.vue'

const router = useRouter()
const params = ref<Params | null>(null)

const addFactoryController = AddFactoryController.getInstance()

const addFactory = async () => {
  await addFactoryController.addFactory(params.value as AddFactoryParams, router)
}
const setParams = (data: Params) => {
  params.value = data
}
</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="addFactory">
    <FactoryForm @update:data="setParams" />

    <div class="col-span-4 button-wrapper">
      <button type="submit" class="btn btn-primary">Add</button>
    </div>
  </form>
</template>

<style scoped></style>
