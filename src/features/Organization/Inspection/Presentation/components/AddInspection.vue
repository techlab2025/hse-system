<script lang="ts" setup>
import { createStayOnPageRouter } from '@/shared/utils/createStayOnPageRouter'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import type Params from '@/base/core/params/params'
import AddInspectionController from '../controllers/addInspectionController'
import type AddInspectionParams from '../../Core/params/addInspectionParams'
import InspectionForm from './InspectionForm.vue'

const router = useRouter()
const stayOnPageRouter = createStayOnPageRouter(router)
const params = ref<Params | null>(null)
const formKey = ref(0)
const inspectionFormRef = ref<InstanceType<typeof InspectionForm> | null>(null)

const addInspectionController = AddInspectionController.getInstance()

const addInspection = async () => {
  const isValid = await inspectionFormRef.value?.validateRequiredFields()
  if (!isValid) return
  await addInspectionController.addInspection(params.value as AddInspectionParams, router)
}

const saveAndNew = async () => {
  const isValid = await inspectionFormRef.value?.validateRequiredFields()
  if (!isValid) return
  addInspectionController.setLoading()
  await addInspectionController.addInspection(params.value as AddInspectionParams, stayOnPageRouter)
  if (addInspectionController.isDataSuccess()) {
    params.value = null
    formKey.value++
  }
}
const setParams = (data: Params) => {
  // console.log(data as AddInspectionParams, 'data Params')
  params.value = data
}
</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-6 gap-4" @submit.prevent="addInspection">
    <InspectionForm :key="formKey" ref="inspectionFormRef" @update:data="setParams" />

    <div class="col-span-6 button-wrapper create-form-actions">
      <button type="button" class="btn btn-secondary" @click.prevent="saveAndNew">
        {{ $t('save and new') }}
      </button>
      <button type="submit" class="btn btn-primary w-full">{{ $t('save') }}</button>
    </div>
  </form>
</template>

<style scoped></style>
