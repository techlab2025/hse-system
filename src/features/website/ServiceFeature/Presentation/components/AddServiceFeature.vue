<script lang="ts" setup>
import { createStayOnPageRouter } from '@/shared/utils/createStayOnPageRouter'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// import PrimaryButton from "@/components/HelpersComponents/PrimaryButton.vue";
import ServiceFeatureForm from './ServiceFeatureForm.vue'
import type Params from '@/base/core/params/params'
import AddServiceFeatureController from '../controllers/addServiceFeatureController'
import type AddServiceFeatureParams from '../../Core/params/addServiceFeatureParams'

const router = useRouter()
const stayOnPageRouter = createStayOnPageRouter(router)
const params = ref<Params | null>(null)
const formKey = ref(0)

const addServiceFeatureController = AddServiceFeatureController.getInstance()

const addServiceFeature = async () => {
  console.log(params.value, 'Final params From Add ')
  await addServiceFeatureController.addServiceFeature(
    params.value as AddServiceFeatureParams,
    router,
  )
}

const saveAndNew = async () => {
  console.log(params.value, 'Final params From Add ')
  addServiceFeatureController.setLoading()
  await addServiceFeatureController.addServiceFeature(
    params.value as AddServiceFeatureParams,
    stayOnPageRouter,
  )
  if (addServiceFeatureController.isDataSuccess()) {
    params.value = null
    formKey.value++
  }
}
const setParams = (data: Params) => {
  params.value = data
}
</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="addServiceFeature">
    <ServiceFeatureForm :key="formKey" @update:data="setParams" />

    <div class="col-span-4 button-wrapper create-form-actions">
      <button type="button" class="btn btn-secondary" @click.prevent="saveAndNew">
        {{ $t('save and new') }}
      </button>
      <button type="submit" class="btn btn-primary">{{ $t('save') }}</button>
    </div>
  </form>
</template>

<style scoped></style>
