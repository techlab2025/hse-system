<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import FormLoader from '@/shared/DataStatues/FormLoader.vue'
import HazardTypeForm from '@/features/setting/HazardType/Presentation/components/HazardTypeForm.vue'
import type Params from '@/base/core/params/params'
import ShowAccidentsTypeController from '../controllers/showOrganizationController'
import ShowAccidentsTypeParams from '../../Core/params/showOrganizationParams'
import EditAccidentsTypeController from '../controllers/ediOrganizationController'
import AccidentsTypeForm from './OrganizationForm.vue'

const route = useRoute()
const router = useRouter()
const id = route.params.id
const params = ref<Params | null>(null)

const showAccidentsTypeController = ShowAccidentsTypeController.getInstance()
const state = ref(showAccidentsTypeController.state.value)
const fetchHazardTypeDetails = async () => {
  const showAccidentsTypeParams = new ShowAccidentsTypeParams(Number(id))

  await showAccidentsTypeController.showAccidentsType(showAccidentsTypeParams)
}

onMounted(() => {
  fetchHazardTypeDetails()
})

const EditAccidentsType = async (draft: boolean) => {
  if (draft) {
    await EditAccidentsTypeController.getInstance().editAccidentsType(params.value!, router)
  } else {
    await EditAccidentsTypeController.getInstance().editAccidentsType(params.value!, router)
  }
}

watch(
  () => showAccidentsTypeController.state.value,
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
      <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="EditAccidentsType">
        <AccidentsTypeForm @update:data="setParams" :data="state.data!" />
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
