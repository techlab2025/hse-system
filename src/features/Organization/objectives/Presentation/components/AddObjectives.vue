<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// import PrimaryButton from "@/components/HelpersComponents/PrimaryButton.vue";
import type Params from '@/base/core/params/params'
import ObjectivesForm from './ObjectivesForm.vue'
import type AddObjectivesParams from '../../Core/params/addObjectivesParams'
import AddObjectivesController from '../controllers/addObjectivesController'

const router = useRouter()
const params = ref<Params | null>(null)

const addObjectivesController = AddObjectivesController.getInstance()

const addObjectives = async () => {
  await addObjectivesController.addObjectives(params.value as AddObjectivesParams, router)
}
const setParams = (data: Params) => {
  params.value = data
}
</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-4 gap-8" @submit.prevent="addObjectives">
    <ObjectivesForm @update:data="setParams" />

    <div class="col-span-4 button-wrapper">
      <button type="submit" class="btn btn-primary">Add</button>
    </div>
  </form>
</template>

<style scoped></style>
