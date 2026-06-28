<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import type Params from '@/base/core/params/params'
import AddDocumentRefrenceController from '../controllers/AddDocumentRefrenceController'
import type AddDocumentRefrenceParams from '../../Core/params/AddDocumentRefrenceParams'
import DocumentRefrenceForm from './DocumentRefrenceForm.vue'

const router = useRouter()
const params = ref<Params | null>(null)

const emit = defineEmits(['close:dialog'])
const addDocumentRefrenceController = AddDocumentRefrenceController.getInstance()

const addDocumentRefrence = async () => {
  await addDocumentRefrenceController.addDocumentRefrence(
    params.value as AddDocumentRefrenceParams,
    router,
  )
  emit('close:dialog')
}
const setParams = (data: Params) => {
  params.value = data
}
</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="addDocumentRefrence">
    <DocumentRefrenceForm @update:data="setParams" />

    <div class="col-span-4 button-wrapper">
      <button type="submit" class="btn btn-primary">{{ $t('save') }}</button>
    </div>
  </form>
</template>

<style scoped></style>
