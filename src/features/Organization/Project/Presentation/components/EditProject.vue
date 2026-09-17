<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import FormLoader from '@/shared/DataStatues/FormLoader.vue'
import ProjectForm from './ProjectForm.vue'
import type Params from '@/base/core/params/params'
import ShowProjectController from '../controllers/showProjectController'
import ShowProjectParams from '../../Core/params/showProjectParams'
import EditProjectController from '../controllers/editProjectController'

const route = useRoute()
const router = useRouter()
const params = ref<Params | null>(null)
const formRef = ref<InstanceType<typeof ProjectForm> | null>(null)

const showProjectController = ShowProjectController.getInstance()
const state = ref(showProjectController.state.value)
const fetchProjectDetails = async (id: string | string[]) => {
  const projectId = Number(Array.isArray(id) ? id[0] : id)
  if (!Number.isFinite(projectId)) return

  const ProjectParams = new ShowProjectParams(projectId)

  await showProjectController.showProject(ProjectParams)
}

const EditProject = async () => {
  if (!(await formRef.value?.validateRequiredFields())) return
  if (!params.value) return
  await EditProjectController.getInstance().editProject(params.value, router)
}

watch(
  () => route.params.id,
  (newId) => fetchProjectDetails(newId),
  { immediate: true },
)

watch(
  () => showProjectController.state.value,
  (newState) => {
    if (newState) {
      state.value = newState
    }
  },
)

const setParams = (data: Params) => {
  params.value = data
}
</script>

<template>
  <DataStatus :controller="state">
    <template #success>
      <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="EditProject">
        <ProjectForm ref="formRef" @update:data="setParams" :data="state.data!" />
        <div class="col-span-4 button-wrapper w-full">
          <button type="submit" class="btn btn-primary w-full">{{ $t('save') }}</button>
        </div>
      </form>
    </template>
    <template #loader>
      <FormLoader :inputsCount="5" />
    </template>
  </DataStatus>
</template>

<style scoped></style>
