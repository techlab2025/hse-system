<script lang="ts" setup>
import { createStayOnPageRouter } from '@/shared/utils/createStayOnPageRouter'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import type Params from '@/base/core/params/params'
import AddDocumentRefrenceController from '../controllers/AddDocumentRefrenceController'
import type AddDocumentRefrenceParams from '../../Core/params/AddDocumentRefrenceParams'
import DocumentRefrenceForm from './DocumentRefrenceForm.vue'

const router = useRouter()
const stayOnPageRouter = createStayOnPageRouter(router)
const params = ref<Params | null>(null)
const formKey = ref(0)

const emit = defineEmits(['close:dialog'])
const addDocumentRefrenceController = AddDocumentRefrenceController.getInstance()

const addDocumentRefrence = async () => {
  await addDocumentRefrenceController.addDocumentRefrence(
    params.value as AddDocumentRefrenceParams,
    router,
  )
  emit('close:dialog')
}

const saveAndNew = async () => {
  addDocumentRefrenceController.setLoading()
  await addDocumentRefrenceController.addDocumentRefrence(
    params.value as AddDocumentRefrenceParams,
    stayOnPageRouter,
  )
  if (addDocumentRefrenceController.isDataSuccess()) {
    params.value = null
    formKey.value++
  }
}
const setParams = (data: Params) => {
  params.value = data
}
</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="addDocumentRefrence">
    <DocumentRefrenceForm :key="formKey" @update:data="setParams" />

    <div class="col-span-4 button-wrapper create-form-actions">
      <button type="button" class="btn btn-secondary" @click.prevent="saveAndNew">
        {{ $t('save and new') }}
      </button>
      <button type="submit" class="btn btn-primary">{{ $t('save') }}</button>
    </div>
  </form>
</template>

<style scoped></style>
