<script lang="ts" setup>
import { createStayOnPageRouter } from '@/shared/utils/createStayOnPageRouter'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// import PrimaryButton from "@/components/HelpersComponents/PrimaryButton.vue";
import type Params from '@/base/core/params/params'
import MangementChangeTopicTypeForm from './MangementChangeTopicTypeForm.vue'
import AddMangementChangeTopicTypeController from '../controllers/addMangementChangeTopicTypeController.ts'
import type AddMangementChangeTopicTypeParams from '../../Core/params/addMangementChangeTopicTypeParams.ts'

const router = useRouter()
const stayOnPageRouter = createStayOnPageRouter(router)
const params = ref<Params | null>(null)
const formKey = ref(0)
const formRef = ref<InstanceType<typeof MangementChangeTopicTypeForm> | null>(null)
const emit = defineEmits(['update:data'])

const addMangementChangeTopicTypeController = AddMangementChangeTopicTypeController.getInstance()

const addMangementChangeTopicType = async () => {
  if (!(await formRef.value?.validateRequiredFields())) return
  await addMangementChangeTopicTypeController.addMangementChangeTopicType(
    params.value as AddMangementChangeTopicTypeParams,
    router,
  )
  emit('update:data')
}

const saveAndNew = async () => {
  if (!(await formRef.value?.validateRequiredFields())) return
  addMangementChangeTopicTypeController.setLoading()
  await addMangementChangeTopicTypeController.addMangementChangeTopicType(
    params.value as AddMangementChangeTopicTypeParams,
    stayOnPageRouter,
  )
  if (addMangementChangeTopicTypeController.isDataSuccess()) {
    params.value = null
    formKey.value++
  }
}
const setParams = (data: Params) => {
  params.value = data
}
</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="addMangementChangeTopicType">
    <MangementChangeTopicTypeForm :key="formKey" ref="formRef" @update:data="setParams" />

    <div class="col-span-4 button-wrapper create-form-actions">
      <button type="button" class="btn btn-secondary" @click.prevent="saveAndNew">
        {{ $t('save and new') }}
      </button>
      <button type="submit" class="btn btn-primary">{{ $t('save') }}</button>
    </div>
  </form>
</template>

<style scoped></style>
