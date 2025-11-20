<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import EditObservationController from '@/features/setting/Observation/Presentation/controllers/editObservationController'
import ShowObservationParams from '@/features/setting/Observation/Core/params/showObservationParams'
import ShowObservationController from '@/features/setting/Observation/Presentation/controllers/showObservationController.ts'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import FormLoader from '@/shared/DataStatues/FormLoader.vue'
import type Params from '@/base/core/params/params'
import ObservationForm from './ObservationForm.vue'

const route = useRoute()
const router = useRouter()
const id = route.params.id
const params = ref<Params | null>(null)

const showObservationController = ShowObservationController.getInstance()
const state = ref(showObservationController.state.value)
const fetchObservationDetails = async () => {
  const ObservationParams = new ShowObservationParams(Number(id))

  await showObservationController.showObservation(ObservationParams)
}

onMounted(() => {
  fetchObservationDetails()
})

const EditObservation = async (draft: boolean) => {
  if (draft) {
    await EditObservationController.getInstance().editObservation(params.value!, router)
  } else {
    await EditObservationController.getInstance().editObservation(params.value!, router)
  }
}

watch(
  () => showObservationController.state.value,
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
      <form class="grid grid-cols-1 md:grid-cols-1 gap-4" @submit.prevent="EditObservation">
        <ObservationForm @update:data="setParams" :data="state.data!" />
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
