<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import FormLoader from '@/shared/DataStatues/FormLoader.vue'

import type Params from '@/base/core/params/params'
import ShowInspectionController from '../controllers/showInspectionController'
import ShowInspectionParams from '../../Core/params/showInspectionParams'
import EditInspectionController from '../controllers/editInspectionController'
import InspectionForm from './InspectionForm.vue'

const route = useRoute()
const router = useRouter()
const id = route.params.id
const params = ref<Params | null>(null)

const showInspectionController = ShowInspectionController.getInstance()
const state = ref(showInspectionController.state.value)
const fetchInspectionDetails = async () => {
  const InspectionParams = new ShowInspectionParams(Number(id))

  await showInspectionController.showInspection(InspectionParams)
}

onMounted(() => {
  fetchInspectionDetails()
})

const EditInspection = async (draft: boolean) => {
  if (draft) {
    await EditInspectionController.getInstance().editInspection(params.value!, router)
  } else {
    await EditInspectionController.getInstance().editInspection(params.value!, router)
  }
}

watch(
  () => showInspectionController.state.value,
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
      <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="EditInspection">
        <InspectionForm @update:data="setParams" :data="state.data!" />
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
