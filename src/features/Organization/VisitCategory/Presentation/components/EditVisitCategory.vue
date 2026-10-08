<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import FormLoader from '@/shared/DataStatues/FormLoader.vue'
import type Params from '@/base/core/params/params'
import VisitCategoryForm from './VisitCategoryForm.vue'
import ShowVisitCategoryController from '../controllers/showVisitCategoryController'
import ShowVisitCategoryParams from '../../Core/params/showVisitCategoryParams'
import EditVisitCategoryController from '../controllers/editVisitCategoryController'
const route = useRoute()
const router = useRouter()
const params = ref<Params | null>(null)
const formRef = ref<InstanceType<typeof VisitCategoryForm> | null>(null)
const controller = ShowVisitCategoryController.getInstance()
const state = ref(controller.state.value)
onMounted(async () => {
  await controller.showVisitCategory(new ShowVisitCategoryParams(Number(route.params.id)))
})
watch(
  () => controller.state.value,
  (value) => {
    state.value = value
  },
)
const setParams = (data: Params) => {
  params.value = data
}
const editVisitCategory = async () => {
  if (!(await formRef.value?.validateRequiredFields()) || !params.value) return
  await EditVisitCategoryController.getInstance().editVisitCategory(params.value, router)
}
</script>
<template>
  <DataStatus :controller="state">
    <template #success>
      <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="editVisitCategory">
        <VisitCategoryForm ref="formRef" :data="state.data!" @update:data="setParams" />
        <div class="col-span-4 button-wrapper">
          <button type="submit" class="btn btn-primary">{{ $t('save') }}</button>
        </div>
      </form>
    </template>
    <template #loader><FormLoader :inputsCount="1" /></template>
  </DataStatus>
</template>
