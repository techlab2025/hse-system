<script lang="ts" setup>
import { setFormValidationScope } from '@/shared/utils/formValidationScope'
import { ref as validationRef } from 'vue'

import { createStayOnPageRouter } from '@/shared/utils/createStayOnPageRouter'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AddHazardTypeParams from '@/features/setting/HazardType/Core/params/addHazardTypeParams.ts'
import type Params from '@/base/core/params/params'
import AddAccidentsTypeController from '../controllers/addAccidentsTypeController'
import AccidentsTypeForm from './AccidentsTypeForm.vue'

const validationFormRef = validationRef<InstanceType<typeof AccidentsTypeForm> | null>(null)

const router = useRouter()
const stayOnPageRouter = createStayOnPageRouter(router)
const route = useRoute()
const params = ref<Params | null>(null)
const formKey = ref(0)
const emit = defineEmits(['update:data'])
const addAccidentsTypeController = AddAccidentsTypeController.getInstance()

const addAccidentsType = async () => {
  if (!(await validationFormRef.value?.validateRequiredFields())) return
  setFormValidationScope(params.value, 'AccidentsTypeForm')

  addAccidentsTypeController.setLoading()
  await addAccidentsTypeController.addAccidentsType(params.value as AddHazardTypeParams, router)
  if (addAccidentsTypeController.isDataSuccess()) emit('update:data')
}

const saveAndNew = async () => {
  if (!(await validationFormRef.value?.validateRequiredFields())) return
  setFormValidationScope(params.value, 'AccidentsTypeForm')

  addAccidentsTypeController.setLoading()
  await addAccidentsTypeController.addAccidentsType(
    params.value as AddHazardTypeParams,
    stayOnPageRouter,
    true,
  )
  if (addAccidentsTypeController.isDataSuccess()) {
    params.value = null
    formKey.value++
  }
}

const setParams = (data: Params) => {
  params.value = data
}
</script>

<template>
  <form novalidate class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="addAccidentsType">
    <AccidentsTypeForm ref="validationFormRef" :key="formKey" @update:data="setParams" />

    <div class="col-span-4 button-wrapper create-form-actions">
      <button type="button" @click.prevent="saveAndNew" class="btn btn-secondary">
        {{ $t('save and new') }}
      </button>
      <button type="submit" class="btn btn-primary">
        {{ route.path.includes('project-progress') ? $t('save and next step') : $t('save') }}
      </button>
    </div>
  </form>
</template>

<style scoped>
.button-wrapper {
  display: flex;
  gap: 1rem;
  flex-direction: row !important;
  width: 100% !important;
  button {
    &.w-full {
      width: 100%;
    }
    &.w-1\/2 {
      width: 50%;
    }
  }
}
</style>
