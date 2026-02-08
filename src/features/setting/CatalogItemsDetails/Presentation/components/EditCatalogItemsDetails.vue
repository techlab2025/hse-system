<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import FormLoader from '@/shared/DataStatues/FormLoader.vue'
import type Params from '@/base/core/params/params'
import ShowCatalogItemsDetailsParams from '../../Core/params/showCatalogItemsDetailsParams'
import EditCatalogItemsDetailsController from '../controllers/editCatalogItemsDetailsController'
import CatalogItemsDetailsForm from './CatalogItemsDetailsForm.vue'

const route = useRoute()
const router = useRouter()
const id = route.params.id
const params = ref<Params | null>(null)

const showCatalogItemsDetailsController = ShowCatalogItemsDetailsParams.getInstance()
const state = ref(showCatalogItemsDetailsController.state.value)

const fetchCatalogItemsDetails = async () => {
  const showCatalogItemsDetailsParams = new ShowCatalogItemsDetailsParams(Number(id))

  await showCatalogItemsDetailsController.showCatalogItemsDetails(showCatalogItemsDetailsParams)
}

onMounted(() => {
  fetchCatalogItemsDetails()
})

const editCatalogItemsDetails = async (draft: boolean) => {
  if (draft) {
    await EditCatalogItemsDetailsController.getInstance().editCatalogItemsDetails(params.value!, router)
  } else {
    await EditCatalogItemsDetailsController.getInstance().editCatalogItemsDetails(params.value!, router)
  }
}

watch(
  () => showCatalogItemsDetailsController.state.value,
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
      <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="editCatalogItemsDetails">
        <CatalogItemsDetailsForm @update:data="setParams" :data="state.data!" />
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
