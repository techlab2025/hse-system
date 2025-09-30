<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
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
const id = route.params.id
const params = ref<Params | null>(null)

const showProjectController = ShowProjectController.getInstance()
const state = ref(showProjectController.state.value)
const fetchProjectDetails = async () => {
  const ProjectParams = new ShowProjectParams(Number(id))

  await showProjectController.showProject(ProjectParams)
}

onMounted(() => {
  fetchProjectDetails()
})

const EditProject = async (draft: boolean) => {
  if (draft) {
    await EditProjectController.getInstance().editProject(params.value!, router)
  } else {
    await EditProjectController.getInstance().editProject(params.value!, router)
  }
}

watch(
  () => showProjectController.state.value,
  (newState) => {
    if (newState) {
      console.log(newState, 'newState')
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
      <!--      <pre>-->
      <!--              {{ state.data?.titles }}-->

      <!--      </pre>-->
      <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="EditProject">
        <ProjectForm @update:data="setParams" :data="state.data!" />
        <div class="col-span-4 button-wrapper">
          <button type="submit" class="btn btn-primary">Edit</button>
        </div>
      </form>
    </template>
    <template #loader>
      <FormLoader :inputsCount="5" />
    </template>
  </DataStatus>
</template>

<style scoped></style>
