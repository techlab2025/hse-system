<script lang="ts" setup>
import { canOrganizationOperation } from '@/features/permission/Presentation/Helpers/organization_authorization'

import { canPolicy } from '@/features/permission/Presentation/Helpers/organization_authorization'
import { organizationApiPolicies } from '@/features/permission/Core/organizationPolicies'

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
  if (!canOrganizationOperation('create_document_reference')) return

  await addDocumentRefrenceController.addDocumentRefrence(
    params.value as AddDocumentRefrenceParams,
    router,
  )
  emit('close:dialog')
}

const saveAndNew = async () => {
  if (!canOrganizationOperation('create_document_reference')) return

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
  <template v-if="canPolicy(organizationApiPolicies['create_document_reference'])">

  <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="addDocumentRefrence">
    <DocumentRefrenceForm :key="formKey" @update:data="setParams" />

    <div class="col-span-4 button-wrapper create-form-actions">
      <button v-if="canOrganizationOperation('create_document_reference')" type="button" class="btn btn-secondary" @click.prevent="saveAndNew">
        {{ $t('save and new') }}
      </button>
      <button v-if="canOrganizationOperation('create_document_reference')" type="submit" class="btn btn-primary">{{ $t('save') }}</button>
    </div>
  </form>

  </template>
</template>

<style scoped></style>
