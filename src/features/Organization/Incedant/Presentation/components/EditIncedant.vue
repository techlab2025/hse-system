<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import FormLoader from '@/shared/DataStatues/FormLoader.vue'

import type Params from '@/base/core/params/params'
import ShowIncedantController from '../controllers/showIncedantController'
import ShowIncedantParams from '../../Core/params/showIncedantParams'
import EditIncedantController from '../controllers/editIncedantController'
import IncedantForm from './IncedantForm.vue'

const route = useRoute()
const router = useRouter()
const id = route.params.id
const params = ref<Params | null>(null)

const showIncedantController = ShowIncedantController.getInstance()
const state = ref(showIncedantController.state.value)
const fetchIncedantDetails = async () => {
  const IncedantParams = new ShowIncedantParams(Number(id))

  await showIncedantController.showIncedant(IncedantParams)
}

onMounted(() => {
  fetchIncedantDetails()
})

const EditIncedant = async (draft: boolean) => {
  if (draft) {
    await EditIncedantController.getInstance().editIncedant(params.value!, router)
  } else {
    await EditIncedantController.getInstance().editIncedant(params.value!, router)
  }
}

watch(
  () => showIncedantController.state.value,
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
      <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="EditIncedant">
        <IncedantForm @update:data="setParams" :data="state.data!" />
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
