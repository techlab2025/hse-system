<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import FormLoader from '@/shared/DataStatues/FormLoader.vue'
import type Params from '@/base/core/params/params'
import VisitActivityForm from './VisitActivityForm.vue'
import ShowVisitActivityController from '../controllers/showVisitActivityController'
import ShowVisitActivityParams from '../../Core/params/showVisitActivityParams'
import EditVisitActivityController from '../controllers/editVisitActivityController'

const route = useRoute()
const router = useRouter()
const params = ref<Params | null>(null)
const formRef = ref<InstanceType<typeof VisitActivityForm> | null>(null)
const showController = ShowVisitActivityController.getInstance()
const state = ref(showController.state.value)

const fetchDetails = async () => {
  await showController.showVisitActivity(new ShowVisitActivityParams(Number(route.params.id)))
}

onMounted(fetchDetails)
watch(
  () => showController.state.value,
  (value) => {
    state.value = value
  },
)

const setParams = (data: Params) => {
  params.value = data
}

const editVisitActivity = async () => {
  if (!(await formRef.value?.validateRequiredFields()) || !params.value) return
  await EditVisitActivityController.getInstance().editVisitActivity(params.value, router)
}
</script>

<template>
  <DataStatus :controller="state">
    <template #success>
      <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="editVisitActivity">
        <VisitActivityForm ref="formRef" :data="state.data!" @update:data="setParams" />
        <div class="col-span-4 button-wrapper">
          <button type="submit" class="btn btn-primary">{{ $t('save') }}</button>
        </div>
      </form>
    </template>
    <template #loader><FormLoader :inputsCount="1" /></template>
  </DataStatus>
</template>
