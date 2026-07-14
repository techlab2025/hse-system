<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import FormLoader from '@/shared/DataStatues/FormLoader.vue'
import type Params from '@/base/core/params/params'
import ShowIncidentCategoryController from '../controllers/showIncidentCategoryController'
import ShowIncidentCategoryParams from '../../Core/params/showIncidentCategoryParams'
import EditIncidentCategoryController from '../controllers/editIncidentCategoryController'
import IncidentCategoryForm from './IncidentCategoryForm.vue'

const route = useRoute()
const router = useRouter()
const id = route.params.id
const params = ref<Params | null>(null)

const showIncidentCategoryController = ShowIncidentCategoryController.getInstance()
const state = ref(showIncidentCategoryController.state.value)
const fetchHazardTypeDetails = async () => {
  const showIncidentCategoryParams = new ShowIncidentCategoryParams(Number(id))

  await showIncidentCategoryController.showIncidentCategory(showIncidentCategoryParams)
}

onMounted(() => {
  fetchHazardTypeDetails()
})

const EditIncidentCategory = async (draft: boolean) => {
  if (draft) {
    await EditIncidentCategoryController.getInstance().editIncidentCategory(params.value!, router)
  } else {
    await EditIncidentCategoryController.getInstance().editIncidentCategory(params.value!, router)
  }
}

watch(
  () => showIncidentCategoryController.state.value,
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
      <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="EditIncidentCategory">
        <IncidentCategoryForm @update:data="setParams" :data="state.data!" />
        <div class="col-span-4 button-wrapper">
          <button type="submit" class="btn btn-primary">{{ $t('save') }}</button>
        </div>
      </form>
    </template>
    <template #loader>
      <FormLoader :inputsCount="5" />
    </template>
  </DataStatus>
</template>

<style scoped></style>
