<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import FormLoader from '@/shared/DataStatues/FormLoader.vue'
import type Params from '@/base/core/params/params'
import ShowServiceSectionController from '../controllers/showServiceSectionController'
import ShowServiceSectionParams from '../../Core/params/showServiceSectionParams'
import EditServiceSectionController from '../controllers/editServiceSectionController'
import ServiceSectionForm from './ServiceSectionForm.vue'

const route = useRoute()
const router = useRouter()
const id = route.params.id
const params = ref<Params | null>(null)

const showServiceSectionController = ShowServiceSectionController.getInstance()
const state = ref(showServiceSectionController.state.value)
const fetchServiceSectionDetails = async () => {
  const showServiceSectionParams = new ShowServiceSectionParams(Number(id))

  await showServiceSectionController.showServiceSection(showServiceSectionParams)
}

onMounted(() => {
  fetchServiceSectionDetails()
})

const EditServiceSection = async (draft: boolean) => {
  if (draft) {
    await EditServiceSectionController.getInstance().editServiceSection(params.value!, router)
  } else {
    await EditServiceSectionController.getInstance().editServiceSection(params.value!, router)
  }
}

watch(
  () => showServiceSectionController.state.value,
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
      <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="EditServiceSection">
        <ServiceSectionForm @update:data="setParams" :data="state.data!" />
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
