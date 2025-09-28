<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import FormLoader from '@/shared/DataStatues/FormLoader.vue'
import SystemRiskManagementForm from './SystemRiskManagementForm.vue'
import type Params from '@/base/core/params/params'
import ShowSystemRiskManagementController from '../controllers/showSystemRiskManagementController'
import ShowSystemRiskManagementParams from '../../Core/params/showSystemRiskManagementParams'
import EditSystemRiskManagementController from '../controllers/editSystemRiskManagementController'

const route = useRoute()
const router = useRouter()
const id = route.params.id
const params = ref<Params | null>(null)

const showSystemRiskManagementController = ShowSystemRiskManagementController.getInstance()
const state = ref(showSystemRiskManagementController.state.value)
const fetchSystemRiskManagementDetails = async () => {
  const SystemRiskManagementParams = new ShowSystemRiskManagementParams(Number(id))

  await showSystemRiskManagementController.showSystemRiskManagement(SystemRiskManagementParams)
}

onMounted(() => {
  fetchSystemRiskManagementDetails()
})

const EditSystemRiskManagement = async (draft: boolean) => {
  if (draft) {
    await EditSystemRiskManagementController.getInstance().editSystemRiskManagement(params.value!, router)
  } else {
    await EditSystemRiskManagementController.getInstance().editSystemRiskManagement(params.value!, router)
  }
}

watch(
  () => showSystemRiskManagementController.state.value,
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
      <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="EditSystemRiskManagement">
        <SystemRiskManagementForm @update:data="setParams" :data="state.data!" />
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
