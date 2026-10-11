<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import type Params from '@/base/core/params/params'
import { createStayOnPageRouter } from '@/shared/utils/createStayOnPageRouter'
import VisitCategoryForm from './VisitCategoryForm.vue'
import AddVisitCategoryController from '../controllers/addVisitCategoryController'
import type AddVisitCategoryParams from '../../Core/params/addVisitCategoryParams'
const router = useRouter()
const stayOnPageRouter = createStayOnPageRouter(router)
const params = ref<Params | null>(null)
const formKey = ref(0)
const formRef = ref<InstanceType<typeof VisitCategoryForm> | null>(null)
const controller = AddVisitCategoryController.getInstance()
const setParams = (data: Params) => {
  params.value = data
}
const addVisitCategory = async () => {
  if (!(await formRef.value?.validateRequiredFields()) || !params.value) return
  await controller.addVisitCategory(params.value as AddVisitCategoryParams, router)
}
const saveAndNew = async () => {
  if (!(await formRef.value?.validateRequiredFields()) || !params.value) return
  controller.setLoading()
  await controller.addVisitCategory(params.value as AddVisitCategoryParams, stayOnPageRouter, true)
  if (controller.isDataSuccess()) {
    params.value = null
    formKey.value++
  }
}
</script>
<template>
  <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="addVisitCategory">
    <VisitCategoryForm :key="formKey" ref="formRef" @update:data="setParams" />
    <div class="col-span-4 button-wrapper create-form-actions">
      <button type="button" class="btn btn-secondary" @click.prevent="saveAndNew">
        {{ $t('save and new') }}
      </button>
      <button type="submit" class="btn btn-primary">{{ $t('save') }}</button>
    </div>
  </form>
</template>
