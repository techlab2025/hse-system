<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import FormLoader from '@/shared/DataStatues/FormLoader.vue'
import OrganizationDocumentsForm from './OrganizationDocumentsForm.vue'
import type Params from '@/base/core/params/params'
import ShowOrganizationDocumentsParams from '../../Core/params/showOrganizationDocumentsParams'
import ShowOrganizationDocumentsController from '../controllers/showOrganizationDocumentsController'
import EditOrganizationDocumentsController from '../controllers/editOrganizationDocumentsController'

const route = useRoute()
const router = useRouter()
const id = route.params.id
const params = ref<Params | null>(null)
const formRef = ref<InstanceType<typeof OrganizationDocumentsForm> | null>(null)

const showOrganizationDocumentsController = ShowOrganizationDocumentsController.getInstance()
const state = ref(showOrganizationDocumentsController.state.value)
const fetchOrganizationDocumentsDetails = async () => {
  const organizationDocumentsParams = new ShowOrganizationDocumentsParams(Number(id))
  await showOrganizationDocumentsController.showOrganizationDocuments(organizationDocumentsParams)
}

onMounted(() => {
  fetchOrganizationDocumentsDetails()
})

const editOrganizationDocuments = async () => {
  if (!(await formRef.value?.validateRequiredFields())) return
  await EditOrganizationDocumentsController.getInstance().editOrganizationDocuments(
    params.value!,
    router,
  )
}

watch(
  () => showOrganizationDocumentsController.state.value,
  (newState) => {
    if (newState) {
      state.value = newState
    }
  },
)

const setParams = (data: Params) => {
  params.value = data
}
</script>

<template>
  <DataStatus :controller="state">
    <template #success>
      <form
        class="grid grid-cols-1 md:grid-cols-4 gap-4"
        @submit.prevent="editOrganizationDocuments"
      >
        <OrganizationDocumentsForm ref="formRef" @update:data="setParams" :data="state.data!" />
        <div class="col-span-4 button-wrapper">
          <button type="submit" class="btn btn-primary">{{ $t('save') }}</button>
        </div>
      </form>
    </template>
    <template #loader>
      <FormLoader :inputsCount="8" />
    </template>
  </DataStatus>
</template>

<style scoped></style>
