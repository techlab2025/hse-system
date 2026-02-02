<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// import PrimaryButton from "@/components/HelpersComponents/PrimaryButton.vue";
import type Params from '@/base/core/params/params'
import AddCatalogController from '../controllers/addCatalogController'
import type AddCatalogParams from '../../Core/params/addCatalogParams'
import CatalogForm from './CatalogForm.vue'

const router = useRouter()
const params = ref<Params | null>(null)

const addCatalogController = AddCatalogController.getInstance()

const addCatalog = async () => {
  console.log(params.value, 'params')
  await addCatalogController.addCatalog(params.value as AddCatalogParams, router)
}
const setParams = (data: Params) => {
  params.value = data
}
</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-4 gap-8" @submit.prevent="addCatalog">
    <CatalogForm @update:data="setParams" />

    <div class="col-span-4 button-wrapper">
      <button type="submit" class="btn btn-primary">{{ $t('Add') }}</button>
    </div>
  </form>
</template>

<style scoped></style>
