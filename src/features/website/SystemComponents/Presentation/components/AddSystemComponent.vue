<script lang="ts" setup>
import { createStayOnPageRouter } from '@/shared/utils/createStayOnPageRouter'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// import PrimaryButton from "@/components/HelpersComponents/PrimaryButton.vue";
import type Params from '@/base/core/params/params'
import AddSystemComponentController from '../controllers/addSystemComponentController'
import type AddSystemComponentParams from '../../Core/params/addSystemComponentParams'
import SystemComponentForm from './SystemComponentForm.vue'

const router = useRouter()
const stayOnPageRouter = createStayOnPageRouter(router)
const params = ref<Params | null>(null)
const formKey = ref(0)

const addSystemComponentController = AddSystemComponentController.getInstance()

const addSystemComponent = async () => {
  console.log(params.value, 'params')
  await addSystemComponentController.addSystemComponent(
    params.value as AddSystemComponentParams,
    router,
  )
}

const saveAndNew = async () => {
  console.log(params.value, 'params')
  addSystemComponentController.setLoading()
  await addSystemComponentController.addSystemComponent(
    params.value as AddSystemComponentParams,
    stayOnPageRouter,
  )
  if (addSystemComponentController.isDataSuccess()) {
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
  <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="addSystemComponent">
    <SystemComponentForm :key="formKey" @update:data="setParams" />

    <div class="col-span-4 button-wrapper create-form-actions">
      <button type="button" class="btn btn-secondary" @click.prevent="saveAndNew">
        {{ $t('save and new') }}
      </button>
      <button type="submit" class="btn btn-primary">{{ $t('save') }}</button>
    </div>
  </form>
</template>

<style scoped></style>
