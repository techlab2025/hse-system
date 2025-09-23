<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import EditProjectTypeController from '@/features/setting/ProjectType/Presentation/controllers/editProjectTypeController'
import ShowProjectTypeParams from '@/features/setting/ProjectType/Core/params/showProjectTypeParams'
import ShowProjectTypeController from '@/features/setting/ProjectType/Presentation/controllers/showProjectTypeController'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import FormLoader from '@/shared/DataStatues/FormLoader.vue'
import ProjectTypeForm from '@/features/setting/ProjectType/Presentation/components/ProjectTypeForm.vue'
import type Params from '@/base/core/params/params'

const route = useRoute()
const router = useRouter()
const id = route.params.id
const params = ref<Params | null>(null)

const showProjectTypeController = ShowProjectTypeController.getInstance()
const state = ref(showProjectTypeController.state.value)
const fetchProjectTypeDetails = async () => {
  const ProjectTypeParams = new ShowProjectTypeParams(Number(id))

  await showProjectTypeController.showProjectType(ProjectTypeParams)
}

onMounted(() => {
  fetchProjectTypeDetails()
})

const EditProjectType = async (draft: boolean) => {
  if (draft) {
    await EditProjectTypeController.getInstance().editProjectType(params.value!, router)
  } else {
    await EditProjectTypeController.getInstance().editProjectType(params.value!, router)
  }
}

watch(
  () => showProjectTypeController.state.value,
  (newState) => {
    if (newState) {
      console.log(newState)
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
      <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="EditProjectType">
        <ProjectTypeForm @update:data="setParams" :data="state.data!" />
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
