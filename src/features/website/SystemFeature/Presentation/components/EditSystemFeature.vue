<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import FormLoader from '@/shared/DataStatues/FormLoader.vue'
import type Params from '@/base/core/params/params'
import ShowSystemFeatureController from '../controllers/showSystemFeatureController'
import ShowSystemFeatureParams from '../../Core/params/showSystemFeatureParams'
import EditSystemFeatureController from '../controllers/editSystemFeatureController'
import SystemFeatureForm from './SystemFeatureForm.vue'

const route = useRoute()
const router = useRouter()
const id = route.params.id
const params = ref<Params | null>(null)

const showSystemFeatureController = ShowSystemFeatureController.getInstance()
const state = ref(showSystemFeatureController.state.value)
const fetchSystemFeatureDetails = async () => {
  const showSystemFeatureParams = new ShowSystemFeatureParams(Number(id))

  await showSystemFeatureController.showSystemFeature(showSystemFeatureParams)
}

onMounted(() => {
  fetchSystemFeatureDetails()
})

const EditSystemFeature = async (draft: boolean) => {
  if (draft) {
    await EditSystemFeatureController.getInstance().editSystemFeature(params.value!, router)
  } else {
    await EditSystemFeatureController.getInstance().editSystemFeature(params.value!, router)
  }
}

watch(
  () => showSystemFeatureController.state.value,
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
      <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="EditSystemFeature">
        <SystemFeatureForm @update:data="setParams" :data="state.data!" />
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
