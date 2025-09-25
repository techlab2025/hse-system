<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import FormLoader from '@/shared/DataStatues/FormLoader.vue'
import type Params from '@/base/core/params/params'
import ShowServiceController from '../controllers/showServiceFeatureController'
import ShowServiceParams from '../../Core/params/showServiceFeatureParams'
import EditServiceController from '../controllers/editServiceFeatureController'
import ServiceForm from './ServiceFeatureForm.vue'

const route = useRoute()
const router = useRouter()
const id = route.params.id
const params = ref<Params | null>(null)

const showServiceController = ShowServiceController.getInstance()
const state = ref(showServiceController.state.value)
const fetchHomeContactUsDetails = async () => {
  const showServiceParams = new ShowServiceParams(Number(id))

  await showServiceController.showService(showServiceParams)
}

onMounted(() => {
  fetchHomeContactUsDetails()
})

const EditService = async (draft: boolean) => {
  if (draft) {
    await EditServiceController.getInstance().editService(params.value!, router)
  } else {
    await EditServiceController.getInstance().editService(params.value!, router)
  }
}

watch(
  () => showServiceController.state.value,
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
      <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="EditService">
        <ServiceForm @update:data="setParams" :data="state.data!" />
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
