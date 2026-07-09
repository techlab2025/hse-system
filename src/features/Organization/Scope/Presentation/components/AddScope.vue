<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import type Params from '@/base/core/params/params'
import AddScopeController from '../controllers/addScopeController'
import type AddScopeParams from '../../Core/params/addScopeParams'
import ScopeForm from './ScopeForm.vue'

const router = useRouter()
const emit = defineEmits(['update:data'])
const params = ref<Params | null>(null)
const formRef = ref<InstanceType<typeof ScopeForm> | null>(null)

const addScopeController = AddScopeController.getInstance()

const addScope = async () => {
  if (!(await formRef.value?.validateRequiredFields())) return
  await addScopeController.addScope(params.value as AddScopeParams, router)
  emit('update:data')
}
const setParams = (data: Params) => {
  params.value = data
}
</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="addScope">
    <ScopeForm ref="formRef" @update:data="setParams" />
    <div class="col-span-4 button-wrapper">
      <button type="submit" class="btn btn-primary">{{ $t('save') }}</button>
    </div>
  </form>
</template>

<style scoped></style>
