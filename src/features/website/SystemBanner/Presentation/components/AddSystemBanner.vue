<script lang="ts" setup>
import { createStayOnPageRouter } from '@/shared/utils/createStayOnPageRouter'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// import PrimaryButton from "@/components/HelpersComponents/PrimaryButton.vue";
import type Params from '@/base/core/params/params'
import AddSystemBannerController from '../controllers/addSystemBannerController'
import type AddSystemBannerParams from '../../Core/params/addSystemBannerParams'
import SystemBannerForm from './SystemBannerForm.vue'

const router = useRouter()
const stayOnPageRouter = createStayOnPageRouter(router)
const params = ref<Params | null>(null)
const formKey = ref(0)

const addSystemBannerController = AddSystemBannerController.getInstance()

const addSystemBanner = async () => {
  console.log(params.value, 'params')
  await addSystemBannerController.addSystemBanner(params.value as AddSystemBannerParams, router)
}

const saveAndNew = async () => {
  console.log(params.value, 'params')
  addSystemBannerController.setLoading()
  await addSystemBannerController.addSystemBanner(
    params.value as AddSystemBannerParams,
    stayOnPageRouter,
  )
  if (addSystemBannerController.isDataSuccess()) {
    params.value = null
    formKey.value++
  }
}
const setParams = (data: Params) => {
  // console.log(data, 'data')
  params.value = data
}
</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="addSystemBanner">
    <SystemBannerForm :key="formKey" @update:data="setParams" />

    <div class="col-span-4 button-wrapper create-form-actions">
      <button type="button" class="btn btn-secondary" @click.prevent="saveAndNew">
        {{ $t('save and new') }}
      </button>
      <button type="submit" class="btn btn-primary">{{ $t('save') }}</button>
    </div>
  </form>
</template>

<style scoped></style>
