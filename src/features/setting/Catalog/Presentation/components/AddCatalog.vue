<script lang="ts" setup>
import { createStayOnPageRouter } from '@/shared/utils/createStayOnPageRouter'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// import PrimaryButton from "@/components/HelpersComponents/PrimaryButton.vue";
import type Params from '@/base/core/params/params'
import AddCatalogController from '../controllers/addCatalogController'
import type AddCatalogParams from '../../Core/params/addCatalogParams'
import CatalogForm from './CatalogForm.vue'

const router = useRouter()
const stayOnPageRouter = createStayOnPageRouter(router)
const params = ref<Params | null>(null)
const formKey = ref(0)

const addCatalogController = AddCatalogController.getInstance()

const addCatalog = async () => {
  console.log(params.value, 'params')
  await addCatalogController.addCatalog(params.value as AddCatalogParams, router)
}

const saveAndNew = async () => {
  console.log(params.value, 'params')
  addCatalogController.setLoading()
  await addCatalogController.addCatalog(params.value as AddCatalogParams, stayOnPageRouter)
  if (addCatalogController.isDataSuccess()) {
    params.value = null
    formKey.value++
  }
}
const setParams = (data: Params) => {
  params.value = data
}
</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-4 gap-8" @submit.prevent="addCatalog">
    <CatalogForm :key="formKey" @update:data="setParams" />

    <div class="col-span-4 button-wrapper create-form-actions">
      <button type="button" class="btn btn-secondary" @click.prevent="saveAndNew">
        {{ $t('save and new') }}
      </button>
      <button type="submit" class="btn btn-primary">{{ $t('save') }}</button>
    </div>
  </form>
</template>

<style scoped></style>
