<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import FormLoader from '@/shared/DataStatues/FormLoader.vue'
import type Params from '@/base/core/params/params'
import ShowObjectivesController from '../controllers/showObjectivesController'
import ShowObjectivesParams from '../../Core/params/showObjectivesParams'
import EditObjectivesController from '../controllers/editObjectivesController'
import ObjectivesForm from './ObjectivesForm.vue'

const route = useRoute()
const router = useRouter()
const id = route.params.id
const params = ref<Params | null>(null)

const showObjectivesController = ShowObjectivesController.getInstance()
const state = ref(showObjectivesController.state.value)

const fetchObjectivesDetails = async () => {
  const ObjectivesParams = new ShowObjectivesParams(Number(id))

  await showObjectivesController.showObjectivesType(ObjectivesParams)
}

onMounted(() => {
  fetchObjectivesDetails()
})

const EditObjectives = async (draft: boolean) => {
  if (draft) {
    await EditObjectivesController.getInstance().editObjectives(params.value!, router)
  } else {
    await EditObjectivesController.getInstance().editObjectives(params.value!, router)
  }
}

watch(
  () => showObjectivesController.state.value,
  (newState) => {
    if (newState) {
      // console.log(newState)
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
      <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="EditObjectives">
        <ObjectivesForm @update:data="setParams" :data="state.data!" />
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
