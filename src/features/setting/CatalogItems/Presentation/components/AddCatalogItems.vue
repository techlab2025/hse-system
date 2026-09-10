<script lang="ts" setup>
import { createStayOnPageRouter } from '@/shared/utils/createStayOnPageRouter'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// import PrimaryButton from "@/components/HelpersComponents/PrimaryButton.vue";
import type Params from '@/base/core/params/params'
// import AddCatalogController from '../controllers/addCatalogItemsController'
// import type AddCatalogParams from '../../Core/params/addCatalogItemsParams'
// import CatalogForm from './CatalogForm.vue'
import type AddCatalogItemsParams from '../../Core/params/addCatalogItemsParams'
import AddCatalogItemsController from '../controllers/addCatalogItemsController'
import CatalogItemsForm from './CatalogItemsForm.vue'

const router = useRouter()
const stayOnPageRouter = createStayOnPageRouter(router)
const params = ref<Params | null>(null)
const formKey = ref(0)

const addCatalogItemsController = AddCatalogItemsController.getInstance()

const addCatalogItems = async () => {
  console.log(params.value, 'params')
  await addCatalogItemsController.addCatalogItems(params.value as AddCatalogItemsParams, router)
}

const saveAndNew = async () => {
  console.log(params.value, 'params')
  addCatalogItemsController.setLoading()
  await addCatalogItemsController.addCatalogItems(
    params.value as AddCatalogItemsParams,
    stayOnPageRouter,
  )
  if (addCatalogItemsController.isDataSuccess()) {
    params.value = null
    formKey.value++
  }
}
const setParams = (data: Params) => {
  params.value = data
}
</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-4 gap-8" @submit.prevent="addCatalogItems">
    <CatalogItemsForm :key="formKey" @update:data="setParams" />

    <div class="col-span-4 button-wrapper create-form-actions">
      <button type="button" class="btn btn-secondary" @click.prevent="saveAndNew">
        {{ $t('save and new') }}
      </button>
      <button type="submit" class="btn btn-primary">{{ $t('save') }}</button>
    </div>
  </form>
</template>

<style scoped></style>
