<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// import PrimaryButton from "@/components/HelpersComponents/PrimaryButton.vue";
import ProjectTypeForm from '@/features/setting/ProjectType/Presentation/components/ProjectTypeForm.vue'
import AddProjectTypeController from '@/features/setting/ProjectType/Presentation/controllers/addProjectTypeController.ts'
import AddProjectTypeParams from '@/features/setting/ProjectType/Core/params/addProjectTypeParams.ts'
import type Params from '@/base/core/params/params'

const router = useRouter()
const params = ref<Params | null>(null)

const addProjectTypeController = AddProjectTypeController.getInstance()

const addProjectType = async () => {
  await addProjectTypeController.addProjectType(params.value as AddProjectTypeParams, router)
}
const setParams = (data: Params) => {
  params.value = data
}
</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="addProjectType">

    <ProjectTypeForm @update:data="setParams" />

    <div class="col-span-4 button-wrapper">
      <button type="submit" class="btn btn-primary">Add</button>
    </div>
  </form>
</template>

<style scoped></style>
