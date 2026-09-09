<script lang="ts" setup>
import { createStayOnPageRouter } from '@/shared/utils/createStayOnPageRouter'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// import PrimaryButton from "@/components/HelpersComponents/PrimaryButton.vue";
import AddEquipmentTypeParams from '@/features/setting/EquipmentType/Core/params/addEquipmentTypeParams.ts'
import type Params from '@/base/core/params/params'
import EquipmentForm from './EquipmentForm.vue'
import AddEquipmentController from '../controllers/addEquipmentController'
import type AddEquipmentParams from '../../Core/params/addEquipmentParams'
import SingleFileUpload from '@/shared/HelpersComponents/SingleFileUpload.vue'

const router = useRouter()
const stayOnPageRouter = createStayOnPageRouter(router)
const params = ref<Params | null>(null)
const formKey = ref(0)

const addEquipmentController = AddEquipmentController.getInstance()

const addEquipment = async () => {
  console.log(params.value, 'params')
  await addEquipmentController.addEquipment(params.value as AddEquipmentParams, router)
}

const saveAndNew = async () => {
  console.log(params.value, 'params')
  addEquipmentController.setLoading()
  await addEquipmentController.addEquipment(params.value as AddEquipmentParams, stayOnPageRouter)
  if (addEquipmentController.isDataSuccess()) {
    params.value = null
    formKey.value++
  }
}
const setParams = (data: Params) => {
  params.value = data
}
</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-4 gap-8" @submit.prevent="addEquipment">
    <EquipmentForm :key="formKey" @update:data="setParams" />

    <div class="col-span-4 button-wrapper create-form-actions">
      <button type="button" class="btn btn-secondary" @click.prevent="saveAndNew">
        {{ $t('save and new') }}
      </button>
      <button type="submit" class="btn btn-primary">{{ $t('save') }}</button>
    </div>
  </form>
</template>

<style scoped></style>
