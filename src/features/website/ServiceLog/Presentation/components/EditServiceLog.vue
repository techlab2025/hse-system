<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import FormLoader from '@/shared/DataStatues/FormLoader.vue'
import type Params from '@/base/core/params/params'
import ShowServiceLogController from '../controllers/showServiceLogController'
import ShowServiceLogParams from '../../Core/params/showServiceLogParams'
import EditServiceLogController from '../controllers/editServiceLogController'
import ServiceLogForm from './ServiceLogForm.vue'

const route = useRoute()
const router = useRouter()
const id = route.params.id
const params = ref<Params | null>(null)

const showServiceLogController = ShowServiceLogController.getInstance()
const state = ref(showServiceLogController.state.value)
const fetchServiceLogDetails = async () => {
  const showServiceLogParams = new ShowServiceLogParams(Number(id))

  await showServiceLogController.showServiceLog(showServiceLogParams)
}

onMounted(() => {
  fetchServiceLogDetails()
})

const EditServiceLog = async (draft: boolean) => {
  if (draft) {
    await EditServiceLogController.getInstance().editServiceLog(params.value!, router)
  } else {
    await EditServiceLogController.getInstance().editServiceLog(params.value!, router)
  }
}

watch(
  () => showServiceLogController.state.value,
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
      <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="EditServiceLog">
        <ServiceLogForm @update:data="setParams" :data="state.data!" />
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
