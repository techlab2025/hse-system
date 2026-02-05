<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import FormLoader from '@/shared/DataStatues/FormLoader.vue'
import type Params from '@/base/core/params/params'
import EditCatalogController from '../controllers/editCatalogController'
import ShowCatalogController from '../controllers/showCatalogController'
import CatalogForm from './CatalogForm.vue'
import ShowCatalogParams from '../../Core/params/showCatalogParams'

const route = useRoute()
const router = useRouter()
const id = route.params.id
const params = ref<Params | null>(null)

const showCatalogController = ShowCatalogController.getInstance()
const state = ref(showCatalogController.state.value)

const fetchCatalogDetails = async () => {
  const showCatalogParams = new ShowCatalogParams(Number(id))

  await showCatalogController.showCatalogType(showCatalogParams)
}

onMounted(() => {
  fetchCatalogDetails()
})

const EditCatalog = async (draft: boolean) => {
  if (draft) {
    await EditCatalogController.getInstance().editCatalog(params.value!, router)
  } else {
    await EditCatalogController.getInstance().editCatalog(params.value!, router)
  }
}

watch(
  () => showCatalogController.state.value,
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
      <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="EditCatalog">
        <CatalogForm @update:data="setParams" :data="state.data!" />
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
