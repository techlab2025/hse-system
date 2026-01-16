<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ShowHazardTypeParams from '@/features/setting/HazardType/Core/params/showHazardTypeParams'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import FormLoader from '@/shared/DataStatues/FormLoader.vue'
import type Params from '@/base/core/params/params'
import HazardForm from './HazardForm.vue'
import ShowHazardTypeController from '../controllers/showHazardController'
import EditHazardTypeController from '../controllers/editHazardController'

const route = useRoute()
const router = useRouter()
const id = route.params.id
const params = ref<Params | null>(null)

const showHazardTypeController = ShowHazardTypeController.getInstance()
const state = ref(showHazardTypeController.state.value)
const fetchHazardTypeDetails = async () => {
  const HazardTypeParams = new ShowHazardTypeParams(Number(id))

  await showHazardTypeController.showHazardType(HazardTypeParams)
}

onMounted(() => {
  fetchHazardTypeDetails()
})

const EditHazardType = async (draft: boolean) => {
  if (draft) {
    await EditHazardTypeController.getInstance().editHazardType(params.value!, router)
  } else {
    await EditHazardTypeController.getInstance().editHazardType(params.value!, router)
  }
}

watch(
  () => showHazardTypeController.state.value,
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
      <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="EditHazardType">
        <HazardForm @update:data="setParams" :data="state.data!" />
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
