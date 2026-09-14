<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import FormLoader from '@/shared/DataStatues/FormLoader.vue'
import type Params from '@/base/core/params/params'
import MeetingTypeForm from './MeetingTypeForm.vue'
import ShowMeetingTypeController from '../controllers/showMeetingTypeController.ts'
import ShowMeetingTypeParams from '../../Core/params/showMeetingTypeParams.ts'
import EditMeetingTypeController from '../controllers/editMeetingTypeController.ts'

const route = useRoute()
const router = useRouter()
const id = route.params.id
const params = ref<Params | null>(null)
const formRef = ref<InstanceType<typeof MeetingTypeForm> | null>(null)

const showMeetingTypeController = ShowMeetingTypeController.getInstance()
const state = ref(showMeetingTypeController.state.value)
const fetchPpeItemDetails = async () => {
  const showMeetingTypeParams = new ShowMeetingTypeParams(Number(id))

  await showMeetingTypeController.showMeetingType(showMeetingTypeParams)
}

onMounted(() => {
  fetchPpeItemDetails()
})

const editPpeItem = async () => {
  if (!(await formRef.value?.validateRequiredFields())) return
  await EditMeetingTypeController.getInstance().editMeetingType(params.value!, router)
}

watch(
  () => showMeetingTypeController.state.value,
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
      <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="editPpeItem">
        <MeetingTypeForm ref="formRef" @update:data="setParams" :data="state.data!" />
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

<style scoped></style>
