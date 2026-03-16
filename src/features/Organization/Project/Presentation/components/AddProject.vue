<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import ProjectForm from './ProjectForm.vue'
import type Params from '@/base/core/params/params'
import type AddProjectParams from '../../Core/params/addProjectParams'
import AddProjectController from '../controllers/addProjectController'

const router = useRouter()
const params = ref<Params | null>(null)

const addProjectController = AddProjectController.getInstance()

const addProject = async () => {
  const state = await addProjectController.addProject(params.value as AddProjectParams, router)
  console.log(params?.value, "params?.value");
  if (state.value.data) {
    router.push(`/organization/project-details/${state.value.data.id}`)
  }
}
const setParams = (data: Params) => {
  params.value = data
}
</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="addProject">
    <ProjectForm @update:data="setParams" />

    <div class="col-span-4 btns button-wrapper flex w-full">
      <router-link to="/organization/projects?type=1" @click.prevent class="btn btn-cancel ">{{ $t('cancel')
        }}</router-link>
      <button type="submit" class="btn btn-primary ">{{ $t('confirm') }}</button>
    </div>
  </form>
</template>

<style scoped>
.btns {
  display: flex;
  gap: 6px;
  .btn-cancel {
    width: 25%;
  }
  .btn-primary {
    width: 75%;
  }
}
</style>
