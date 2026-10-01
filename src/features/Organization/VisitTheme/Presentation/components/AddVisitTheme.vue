<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import type Params from '@/base/core/params/params'
import { createStayOnPageRouter } from '@/shared/utils/createStayOnPageRouter'
import VisitThemeForm from './VisitThemeForm.vue'
import AddVisitThemeController from '../controllers/addVisitThemeController'
import type AddVisitThemeParams from '../../Core/params/addVisitThemeParams'
const router = useRouter()
const stayOnPageRouter = createStayOnPageRouter(router)
const params = ref<Params | null>(null)
const formKey = ref(0)
const formRef = ref<InstanceType<typeof VisitThemeForm> | null>(null)
const controller = AddVisitThemeController.getInstance()
const setParams = (data: Params) => {
  params.value = data
}
const addVisitTheme = async () => {
  if (!(await formRef.value?.validateRequiredFields()) || !params.value) return
  await controller.addVisitTheme(params.value as AddVisitThemeParams, router)
}
const saveAndNew = async () => {
  if (!(await formRef.value?.validateRequiredFields()) || !params.value) return
  controller.setLoading()
  await controller.addVisitTheme(params.value as AddVisitThemeParams, stayOnPageRouter, true)
  if (controller.isDataSuccess()) {
    params.value = null
    formKey.value++
  }
}
</script>
<template>
  <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="addVisitTheme">
    <VisitThemeForm :key="formKey" ref="formRef" @update:data="setParams" />
    <div class="col-span-4 button-wrapper create-form-actions">
      <button type="button" class="btn btn-secondary" @click.prevent="saveAndNew">
        {{ $t('save and new') }}
      </button>
      <button type="submit" class="btn btn-primary">{{ $t('save') }}</button>
    </div>
  </form>
</template>
