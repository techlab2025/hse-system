<script lang="ts" setup>
import { createStayOnPageRouter } from '@/shared/utils/createStayOnPageRouter'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import type Params from '@/base/core/params/params'
import AddScopeController from '../controllers/addScopeController'
import type AddScopeParams from '../../Core/params/addScopeParams'
import ScopeForm from './ScopeForm.vue'

const router = useRouter()
const stayOnPageRouter = createStayOnPageRouter(router)
const emit = defineEmits(['update:data'])
const params = ref<Params | null>(null)
const formKey = ref(0)
const formRef = ref<InstanceType<typeof ScopeForm> | null>(null)

const addScopeController = AddScopeController.getInstance()

const addScope = async () => {
  if (!(await formRef.value?.validateRequiredFields())) return
  await addScopeController.addScope(params.value as AddScopeParams, router)
  emit('update:data')
}

const saveAndNew = async () => {
  if (!(await formRef.value?.validateRequiredFields())) return
  addScopeController.setLoading()
  await addScopeController.addScope(params.value as AddScopeParams, stayOnPageRouter)
  if (addScopeController.isDataSuccess()) {
    params.value = null
    formKey.value++
  }
}
const setParams = (data: Params) => {
  params.value = data
}
</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="addScope">
    <ScopeForm :key="formKey" ref="formRef" @update:data="setParams" />
    <div class="col-span-4 button-wrapper create-form-actions">
      <button type="button" class="btn btn-secondary" @click.prevent="saveAndNew">
        {{ $t('save and new') }}
      </button>
      <button type="submit" class="btn btn-primary">{{ $t('save') }}</button>
    </div>
  </form>
</template>

<style scoped></style>
