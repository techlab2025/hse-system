<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// import PrimaryButton from "@/components/HelpersComponents/PrimaryButton.vue";
import type Params from '@/base/core/params/params'
// import AddCatalogController from '../controllers/addCatalogItemsController'
// import type AddCatalogParams from '../../Core/params/addCatalogItemsParams'
// import CatalogForm from './CatalogForm.vue'
import type AddCatalogItemsDetailsParams from '../../Core/params/addCatalogItemsDetailsParams'
import AddCatalogItemsDetailsController from '../controllers/addCatalogItemsDetailsController'
import CatalogItemsForm from './CatalogItemsDetailsForm.vue'

const router = useRouter()
const params = ref<Params | null>(null)

const addCatalogItemsDetailsController = AddCatalogItemsDetailsController.getInstance()

const addCatalogItemsDetails = async () => {
  console.log(params.value, 'params')
  await addCatalogItemsDetailsController.addCatalogItemsDetails(params.value as AddCatalogItemsDetailsParams, router)
}
const setParams = (data: Params) => {
  params.value = data
}
</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-4 gap-8" @submit.prevent="addCatalogItemsDetails">
    <CatalogItemsForm @update:data="setParams" />

    <div class="col-span-4 button-wrapper">
      <button type="submit" class="btn btn-primary">{{ $t('Add') }}</button>
    </div>
  </form>
</template>

<style scoped></style>
