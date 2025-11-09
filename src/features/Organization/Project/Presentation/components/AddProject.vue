<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// import PrimaryButton from "@/components/HelpersComponents/PrimaryButton.vue";
import ProjectForm from './ProjectForm.vue'
import type Params from '@/base/core/params/params'
import type AddProjectParams from '../../Core/params/addProjectParams'
import AddProjectController from '../controllers/addProjectController'

const router = useRouter()
const params = ref<Params | null>(null)

const addProjectController = AddProjectController.getInstance()

const addProject = async () => {
  await addProjectController.addProject(params.value as AddProjectParams, router)
}
const setParams = (data: Params) => {
  params.value = data
}
</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="addProject">
    <ProjectForm @update:data="setParams" />

    <div class="col-span-4 button-wrapper">
      <button type="submit" class="btn btn-primary w-full">Add</button>
    </div>
  </form>
</template>

<style scoped></style>
