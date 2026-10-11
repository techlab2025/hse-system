<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import FormLoader from '@/shared/DataStatues/FormLoader.vue'
import type Params from '@/base/core/params/params'
import VisitThemeForm from './VisitThemeForm.vue'
import ShowVisitThemeController from '../controllers/showVisitThemeController'
import ShowVisitThemeParams from '../../Core/params/showVisitThemeParams'
import EditVisitThemeController from '../controllers/editVisitThemeController'
const route = useRoute()
const router = useRouter()
const params = ref<Params | null>(null)
const formRef = ref<InstanceType<typeof VisitThemeForm> | null>(null)
const controller = ShowVisitThemeController.getInstance()
const state = ref(controller.state.value)
onMounted(async () => {
  await controller.showVisitTheme(new ShowVisitThemeParams(Number(route.params.id)))
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
const editVisitTheme = async () => {
  if (!(await formRef.value?.validateRequiredFields()) || !params.value) return
  await EditVisitThemeController.getInstance().editVisitTheme(params.value, router)
}
</script>
<template>
  <DataStatus :controller="state">
    <template #success>
      <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="editVisitTheme">
        <VisitThemeForm ref="formRef" :data="state.data!" @update:data="setParams" />
        <div class="col-span-4 button-wrapper">
          <button type="submit" class="btn btn-primary">{{ $t('save') }}</button>
        </div>
      </form>
    </template>
    <template #loader><FormLoader :inputsCount="1" /></template>
  </DataStatus>
</template>
