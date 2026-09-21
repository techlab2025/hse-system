<script lang="ts" setup>
import { createStayOnPageRouter } from '@/shared/utils/createStayOnPageRouter'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// import PrimaryButton from "@/components/HelpersComponents/PrimaryButton.vue";
import type Params from '@/base/core/params/params'
import PPEToolForm from './PPEToolForm.vue'
import AddPPEToolController from '../controllers/addPPEToolController'
import type AddPPEToolParams from '../../Core/params/addPPEToolParams'

const router = useRouter()
const stayOnPageRouter = createStayOnPageRouter(router)
const params = ref<Params | null>(null)
const formKey = ref(0)
const formRef = ref<InstanceType<typeof PPEToolForm> | null>(null)
const emit = defineEmits(['update:data'])

const addPPEToolController = AddPPEToolController.getInstance()

const addPPETool = async () => {
  if (!(await formRef.value?.validateRequiredFields())) return
  await addPPEToolController.addPPETool(
    params.value as AddPPEToolParams,
    router,
  )
  emit('update:data')
}

const saveAndNew = async () => {
  if (!(await formRef.value?.validateRequiredFields())) return
  addPPEToolController.setLoading()
  await addPPEToolController.addPPETool(
    params.value as AddPPEToolParams,
    stayOnPageRouter,
  )
  if (addPPEToolController.isDataSuccess()) {
    params.value = null
    formKey.value++
  }
}
const setParams = (data: Params) => {
  params.value = data
}
</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="addPPETool">
    <PPEToolForm :key="formKey" ref="formRef" @update:data="setParams" />

    <div class="col-span-4 button-wrapper create-form-actions">
      <button type="button" class="btn btn-secondary" @click.prevent="saveAndNew">
        {{ $t('save and new') }}
      </button>
      <button type="submit" class="btn btn-primary">{{ $t('save') }}</button>
    </div>
  </form>
</template>

<style scoped></style>
