<script lang="ts" setup>
import { createStayOnPageRouter } from '@/shared/utils/createStayOnPageRouter'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// import PrimaryButton from "@/components/HelpersComponents/PrimaryButton.vue";
import HeaderForm from './HeaderForm.vue'
import type Params from '@/base/core/params/params'
import AddHeaderController from '../controllers/addHeaderController'
import type AddHeaderParams from '../../Core/params/addHeaderParams'

const router = useRouter()
const stayOnPageRouter = createStayOnPageRouter(router)
const params = ref<Params | null>(null)
const formKey = ref(0)

const addHeaderController = AddHeaderController.getInstance()

const addHeader = async () => {
  console.log(params.value, 'params')
  await addHeaderController.addHeader(params.value as AddHeaderParams, router)
}

const saveAndNew = async () => {
  console.log(params.value, 'params')
  addHeaderController.setLoading()
  await addHeaderController.addHeader(params.value as AddHeaderParams, stayOnPageRouter)
  if (addHeaderController.isDataSuccess()) {
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
  <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="addHeader">
    <HeaderForm :key="formKey" @update:data="setParams" />

    <div class="col-span-4 button-wrapper create-form-actions">
      <button type="button" class="btn btn-secondary" @click.prevent="saveAndNew">
        {{ $t('save and new') }}
      </button>
      <button type="submit" class="btn btn-primary">{{ $t('save') }}</button>
    </div>
  </form>
</template>

<style scoped></style>
