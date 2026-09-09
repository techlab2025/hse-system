<script lang="ts" setup>
import { createStayOnPageRouter } from '@/shared/utils/createStayOnPageRouter'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// import PrimaryButton from "@/components/HelpersComponents/PrimaryButton.vue";
import SystemWorkForm from './SystemWorkForm.vue'
import type Params from '@/base/core/params/params'
import AddSystemWorkController from '../controllers/addSystemWorkController'
import type AddSystemWorkParams from '../../Core/params/addSystemWorkParams'

const router = useRouter()
const stayOnPageRouter = createStayOnPageRouter(router)
const params = ref<Params | null>(null)
const formKey = ref(0)

const addSystemWorkController = AddSystemWorkController.getInstance()

const addSystemWork = async () => {
  console.log(params.value, 'params')
  await addSystemWorkController.addSystemWork(params.value as AddSystemWorkParams, router)
}

const saveAndNew = async () => {
  console.log(params.value, 'params')
  addSystemWorkController.setLoading()
  await addSystemWorkController.addSystemWork(params.value as AddSystemWorkParams, stayOnPageRouter)
  if (addSystemWorkController.isDataSuccess()) {
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
  <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="addSystemWork">
    <SystemWorkForm :key="formKey" @update:data="setParams" />

    <div class="col-span-4 button-wrapper create-form-actions">
      <button type="button" class="btn btn-secondary" @click.prevent="saveAndNew">
        {{ $t('save and new') }}
      </button>
      <button type="submit" class="btn btn-primary">{{ $t('save') }}</button>
    </div>
  </form>
</template>

<style scoped></style>
