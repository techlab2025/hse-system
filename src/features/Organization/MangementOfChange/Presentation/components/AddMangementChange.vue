<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import type Params from '@/base/core/params/params'
import MangementChangeForm from './MangementChangeForm.vue'
import AddMangementChangeController from '../controllers/addMangementChangeController'
import type AddMangementChangeParams from '../../Core/params/addMangementChangeParams'

const router = useRouter()
const params = ref<Params | null>(null)
const formKey = ref(0)
const formRef = ref<InstanceType<typeof MangementChangeForm> | null>(null)
const addMangementChangeController = AddMangementChangeController.getInstance()

const addMangementChange = async () => {
  if (!(await formRef.value?.validateRequiredFields())) return
  await addMangementChangeController.addMangementChange(
    params.value as AddMangementChangeParams,
  )

  if (addMangementChangeController.isDataSuccess()) {
    router.push('/organization/management-of-change')
  }
}

const saveAndNew = async () => {
  if (!(await formRef.value?.validateRequiredFields())) return
  addMangementChangeController.setLoading()
  await addMangementChangeController.addMangementChange(
    params.value as AddMangementChangeParams,
  )

  if (addMangementChangeController.isDataSuccess()) {
    params.value = null
    formKey.value++
  }
}

const setParams = (data: Params) => {
  params.value = data
}
</script>

<template>
  <form
    class="management-change-form"
    @submit.prevent="addMangementChange"
  >
    <MangementChangeForm
      :key="formKey"
      ref="formRef"
      @update:data="setParams"
    />

    <div class="management-change-actions create-form-actions">
      <button
        type="button"
        class="btn btn-secondary"
        @click.prevent="saveAndNew"
      >
        {{ $t('save and new') }}
      </button>
      <button type="submit" class="btn btn-primary">
        {{ $t('save') }}
      </button>
    </div>
  </form>
</template>

<style scoped></style>
