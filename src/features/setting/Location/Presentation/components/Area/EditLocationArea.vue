<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import FormLoader from '@/shared/DataStatues/FormLoader.vue'
import type Params from '@/base/core/params/params'
import OrganizationForm from './LocationAreaForm.vue'
import ShowOrganizationController from '../../controllers/showLocationController'
import ShowOrganizationParams from '../../../Core/params/showLocationParams'
import EditOrganizationController from '../../controllers/editLocationController'

const route = useRoute()
const router = useRouter()
const id = route.params.id
const params = ref<Params | null>(null)

const showOrganizationController = ShowOrganizationController.getInstance()
const state = ref(showOrganizationController.state.value)
const fetchOrganizationDetails = async () => {
  const showOrganizationParams = new ShowOrganizationParams(Number(id))

  await showOrganizationController.showOrganization(showOrganizationParams)
}

onMounted(() => {
  fetchOrganizationDetails()
})

const EditOrganization = async (draft: boolean) => {
  if (draft) {
    await EditOrganizationController.getInstance().editOrganization(params.value!, router)
  } else {
    await EditOrganizationController.getInstance().editOrganization(params.value!, router)
  }
}

watch(
  () => showOrganizationController.state.value,
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
      <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="EditOrganization">
        <OrganizationForm @update:data="setParams" :data="state.data!" />
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
