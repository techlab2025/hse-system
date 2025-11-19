<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import FormLoader from '@/shared/DataStatues/FormLoader.vue'
import HazardForm from '@/features/setting/Hazard/Presentation/components/HazardForm.vue'
import type Params from '@/base/core/params/params'
import ShowHazardController from '../controllers/showHazardController'
import ShowHazardParams from '../../Core/params/showHazardParams'
import EditHazardController from '../controllers/editHazardController'

const route = useRoute()
const router = useRouter()
const id = route.params.id
const params = ref<Params | null>(null)

const showHazardController = ShowHazardController.getInstance()
const state = ref(showHazardController.state.value)
const fetchHazardDetails = async () => {
  const HazardParams = new ShowHazardParams(Number(id))

  await showHazardController.showHazard(HazardParams)
}

onMounted(() => {
  fetchHazardDetails()
})

const EditHazard = async (draft: boolean) => {
  if (draft) {
    await EditHazardController.getInstance().editHazard(params.value!, router)
  } else {
    await EditHazardController.getInstance().editHazard(params.value!, router)
  }
}

watch(
  () => showHazardController.state.value,
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
      <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="EditHazard">
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
