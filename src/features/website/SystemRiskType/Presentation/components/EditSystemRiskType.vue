<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import FormLoader from '@/shared/DataStatues/FormLoader.vue'
import type Params from '@/base/core/params/params'
import ShowSystemRiskTypeController from '../controllers/showSystemRiskTypeController'
import ShowSystemRiskTypeParams from '../../Core/params/showSystemRiskTypeParams'
import EditSystemRiskTypeController from '../controllers/editSystemRiskTypeController'
import SystemRiskTypeForm from './SystemRiskTypeForm.vue'

const route = useRoute()
const router = useRouter()
const id = route.params.id
const params = ref<Params | null>(null)

const showSystemRiskTypeController = ShowSystemRiskTypeController.getInstance()
const state = ref(showSystemRiskTypeController.state.value)
const fetchSystemRiskTypeDetails = async () => {
  const showSystemRiskTypeParams = new ShowSystemRiskTypeParams(Number(id))

  await showSystemRiskTypeController.showSystemRiskType(showSystemRiskTypeParams)
}

onMounted(() => {
  fetchSystemRiskTypeDetails()
})

const EditSystemRiskType = async (draft: boolean) => {
  if (draft) {
    await EditSystemRiskTypeController.getInstance().editSystemRiskType(params.value!, router)
  } else {
    await EditSystemRiskTypeController.getInstance().editSystemRiskType(params.value!, router)
  }
}

watch(
  () => showSystemRiskTypeController.state.value,
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
      <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="EditSystemRiskType">
        <SystemRiskTypeForm @update:data="setParams" :data="state.data!" />
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
