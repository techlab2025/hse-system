<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import FormLoader from '@/shared/DataStatues/FormLoader.vue'
import type Params from '@/base/core/params/params'
import ShowProjectZoneController from '../controllers/showProjectZoneController'
import ShowProjectZoneParams from '../../Core/params/showProjectZoneParams'
import EditProjectZoneController from '../controllers/editProjectZoneController'
import ProjectZoneForm from './ProjectZoneForm.vue'

const route = useRoute()
const router = useRouter()
const id = route.params.id
const params = ref<Params | null>(null)

const showProjectZoneController = ShowProjectZoneController.getInstance()
const state = ref(showProjectZoneController.state.value)
const fetchProjectZoneDetails = async () => {
  const ProjectZoneParams = new ShowProjectZoneParams(Number(id))

  await showProjectZoneController.showProjectZone(ProjectZoneParams)
}

onMounted(() => {
  fetchProjectZoneDetails()
})

const EditProjectZone = async (draft: boolean) => {
  if (draft) {
    await EditProjectZoneController.getInstance().editProjectZone(params.value!, router)
  } else {
    await EditProjectZoneController.getInstance().editProjectZone(params.value!, router)
  }
}

watch(
  () => showProjectZoneController.state.value,
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
      <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="EditProjectZone">
        <ProjectZoneForm @update:data="setParams" :data="state.data!" />
        <div class="col-span-4 button-wrapper">
          <button type="submit" class="btn btn-primary">{{ $t('Edit') }}</button>
        </div>
      </form>
    </template>
    <template #loader>
      <FormLoader :inputsCount="5" />
    </template>
  </DataStatus>
</template>

<style scoped></style>
