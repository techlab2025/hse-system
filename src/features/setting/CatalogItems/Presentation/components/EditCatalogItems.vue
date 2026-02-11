<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import FormLoader from '@/shared/DataStatues/FormLoader.vue'
import type Params from '@/base/core/params/params'
import CatalogItemsForm from './CatalogItemsForm.vue'
import ShowCatalogItemsParams from '../../Core/params/showCatalogItemsParams'
import EditCatalogItemsController from '../controllers/editCatalogItemsController'
import ShowCatalogItemsController from '../controllers/showCatalogItemsController'

const route = useRoute()
const router = useRouter()
const id = route.params.id
const params = ref<Params | null>(null)

const showCatalogItemsController = ShowCatalogItemsController.getInstance()
const state = ref(showCatalogItemsController.state.value)

const fetchCatalogItemsDetails = async () => {
  const showCatalogItemsParams = new ShowCatalogItemsParams(Number(id))

  await showCatalogItemsController.showCatalogItemsType(showCatalogItemsParams)
}

onMounted(() => {
  fetchCatalogItemsDetails()
})

const editCatalogItems = async (draft: boolean) => {
  if (draft) {
    await EditCatalogItemsController.getInstance().editCatalogItems(params.value!, router)
  } else {
    await EditCatalogItemsController.getInstance().editCatalogItems(params.value!, router)
  }
}

watch(
  () => showCatalogItemsController.state.value,
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
      <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="editCatalogItems">
        <CatalogItemsForm @update:data="setParams" :data="state.data!" />
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
