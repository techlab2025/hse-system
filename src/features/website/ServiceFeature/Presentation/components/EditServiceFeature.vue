<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import FormLoader from '@/shared/DataStatues/FormLoader.vue'
import ServiceFeatureForm from './ServiceFeatureForm.vue'
import type Params from '@/base/core/params/params'
import ShowServiceFeatureController from '../controllers/showServiceFeatureController'
import ShowServiceFeatureParams from '../../Core/params/showServiceFeatureParams'
import EditServiceFeatureController from '../controllers/editServiceFeatureController'


const route = useRoute()
const router = useRouter()
const id = route.params.id
const params = ref<Params | null>(null)

const showServiceFeatureController = ShowServiceFeatureController.getInstance()
const state = ref(showServiceFeatureController.state.value)
const fetchServiceFeatureDetails = async () => {
  const ServiceFeatureParams = new ShowServiceFeatureParams(Number(id))

  await showServiceFeatureController.showServiceFeature(ServiceFeatureParams)
}

onMounted(() => {
  fetchServiceFeatureDetails()
})

const EditServiceFeature = async (draft: boolean) => {
  if (draft) {
    await EditServiceFeatureController.getInstance().editServiceFeature(params.value!, router)
  } else {
    await EditServiceFeatureController.getInstance().editServiceFeature(params.value!, router)
  }
}

watch(
  () => showServiceFeatureController.state.value,
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
      <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="EditServiceFeature">
        <ServiceFeatureForm @update:data="setParams" :data="state.data!" />
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
