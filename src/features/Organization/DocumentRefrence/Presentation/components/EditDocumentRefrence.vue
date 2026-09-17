<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import FormLoader from '@/shared/DataStatues/FormLoader.vue'
import ShowDocumentRefrenceController from '../controllers/ShowDocumentRefrenceController'
import ShowDocumentRefrenceParams from '../../Core/params/ShowDocumentRefrenceParams'
import EditDocumentRefrenceController from '../controllers/EditDocumentRefrenceController'
import DocumentRefrenceForm from './DocumentRefrenceForm.vue'
import type EditDocumentRefrenceParams from '../../Core/params/EditDocumentRefrenceParams.ts'

const route = useRoute()
const router = useRouter()
const id = route.params.id
const params = ref<EditDocumentRefrenceParams>()

const showDocumentRefrenceController = ShowDocumentRefrenceController.getInstance()
const state = ref(showDocumentRefrenceController.state.value)
const fetchDocumentRefrenceDetails = async () => {
  const DocumentRefrenceParams = new ShowDocumentRefrenceParams(Number(id))

  await showDocumentRefrenceController.showDocumentRefrence(DocumentRefrenceParams)
}

onMounted(() => {
  fetchDocumentRefrenceDetails()
})

const EditDocumentRefrence = async () => {
  await EditDocumentRefrenceController.getInstance().editDocumentRefrence(params.value!, router)
}

watch(
  () => showDocumentRefrenceController.state.value,
  (newState) => {
    if (newState) {
      console.log(newState)
      state.value = newState
    }
  },
)

const setParams = (data: EditDocumentRefrenceParams) => {
  params.value = data
}
</script>

<template>
  <DataStatus :controller="state">
    <template #success>
      <form @submit.prevent="EditDocumentRefrence" class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <DocumentRefrenceForm @update:data="setParams" :data="state.data!" />
        <div class="col-span-4 button-wrapper">
          <button type="submit" class="btn btn-primary">{{ $t('save') }}</button>
        </div>
      </form>
    </template>
    <template #loader>
      <FormLoader :inputsCount="5" />
    </template>
  </DataStatus>
</template>
