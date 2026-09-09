<script lang="ts" setup>
import { createStayOnPageRouter } from '@/shared/utils/createStayOnPageRouter'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// import PrimaryButton from "@/components/HelpersComponents/PrimaryButton.vue";

import type Params from '@/base/core/params/params'
import AddMethodsController from '../controllers/addMethodsController'
import type AddMethodsParams from '../../Core/params/addMethodsParams'
import MethodsForm from './MethodsForm.vue'

const router = useRouter()
const stayOnPageRouter = createStayOnPageRouter(router)
const params = ref<Params | null>(null)
const formKey = ref(0)

const addMethodsController = AddMethodsController.getInstance()

const addMethods = async () => {
  console.log(params.value, 'params')
  await addMethodsController.addMethods(params.value as AddMethodsParams, router)
}

const saveAndNew = async () => {
  console.log(params.value, 'params')
  addMethodsController.setLoading()
  await addMethodsController.addMethods(params.value as AddMethodsParams, stayOnPageRouter)
  if (addMethodsController.isDataSuccess()) {
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
  <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="addMethods">
    <MethodsForm :key="formKey" @update:data="setParams" />

    <div class="col-span-4 button-wrapper create-form-actions">
      <button type="button" class="btn btn-secondary" @click.prevent="saveAndNew">
        {{ $t('save and new') }}
      </button>
      <button type="submit" class="btn btn-primary">{{ $t('save') }}</button>
    </div>
  </form>
</template>

<style scoped></style>
