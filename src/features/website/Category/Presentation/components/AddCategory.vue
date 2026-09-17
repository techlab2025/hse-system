<script lang="ts" setup>
import { createStayOnPageRouter } from '@/shared/utils/createStayOnPageRouter'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// import PrimaryButton from "@/components/HelpersComponents/PrimaryButton.vue";
import CategoryForm from './CategoryForm.vue'
import type Params from '@/base/core/params/params'
import type AddCategoryParams from '../../Core/params/addCategoryParams'
import AddCategoryController from '../controllers/addCategoryController'

const router = useRouter()
const stayOnPageRouter = createStayOnPageRouter(router)
const params = ref<Params | null>(null)
const formKey = ref(0)

const addCategoryController = AddCategoryController.getInstance()

const addCategory = async () => {
  await addCategoryController.addCategory(params.value as AddCategoryParams, router)
}

const saveAndNew = async () => {
  addCategoryController.setLoading()
  await addCategoryController.addCategory(params.value as AddCategoryParams, stayOnPageRouter)
  if (addCategoryController.isDataSuccess()) {
    params.value = null
    formKey.value++
  }
}
const setParams = (data: Params) => {
  params.value = data
}
</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="addCategory">
    <CategoryForm :key="formKey" @update:data="setParams" />

    <div class="col-span-4 button-wrapper create-form-actions">
      <button type="button" class="btn btn-secondary" @click.prevent="saveAndNew">
        {{ $t('save and new') }}
      </button>
      <button type="submit" class="btn btn-primary">{{ $t('save') }}</button>
    </div>
  </form>
</template>

<style scoped></style>
