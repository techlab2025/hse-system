<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import type Params from '@/base/core/params/params'
import { createStayOnPageRouter } from '@/shared/utils/createStayOnPageRouter'
import VisitActivityForm from './VisitActivityForm.vue'
import AddVisitActivityController from '../controllers/addVisitActivityController'
import type AddVisitActivityParams from '../../Core/params/addVisitActivityParams'

const router = useRouter()
const stayOnPageRouter = createStayOnPageRouter(router)
const params = ref<Params | null>(null)
const formKey = ref(0)
const formRef = ref<InstanceType<typeof VisitActivityForm> | null>(null)
const controller = AddVisitActivityController.getInstance()

const setParams = (data: Params) => {
  params.value = data
}

const addVisitActivity = async () => {
  if (!(await formRef.value?.validateRequiredFields()) || !params.value) return
  await controller.addVisitActivity(params.value as AddVisitActivityParams, router)
}

const saveAndNew = async () => {
  if (!(await formRef.value?.validateRequiredFields()) || !params.value) return
  controller.setLoading()
  await controller.addVisitActivity(
    params.value as AddVisitActivityParams,
    stayOnPageRouter,
    true,
  )
  if (controller.isDataSuccess()) {
    params.value = null
    formKey.value++
  }
}
</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="addVisitActivity">
    <VisitActivityForm :key="formKey" ref="formRef" @update:data="setParams" />
    <div class="col-span-4 button-wrapper create-form-actions">
      <button type="button" class="btn btn-secondary" @click.prevent="saveAndNew">
        {{ $t('save and new') }}
      </button>
      <button type="submit" class="btn btn-primary">{{ $t('save') }}</button>
    </div>
  </form>
</template>
