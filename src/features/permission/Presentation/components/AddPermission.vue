<script lang="ts" setup>
import { createStayOnPageRouter } from '@/shared/utils/createStayOnPageRouter'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// import PrimaryButton from "@/components/HelpersComponents/PrimaryButton.vue";
import PermissionForm from './PermissionForm.vue'
import type Params from '@/base/core/params/params'
import type AddPermissionParams from '../../Core/params/addPermissionParams'
import AddPermissionController from '../controllers/addPermissionController'

const router = useRouter()
const stayOnPageRouter = createStayOnPageRouter(router)
const params = ref<Params | null>(null)
const formKey = ref(0)

const addPermissionController = AddPermissionController.getInstance()

const addPermission = async () => {
  await addPermissionController.addPermission(params.value as AddPermissionParams, router)
}

const saveAndNew = async () => {
  addPermissionController.setLoading()
  await addPermissionController.addPermission(params.value as AddPermissionParams, stayOnPageRouter)
  if (addPermissionController.isDataSuccess()) {
    params.value = null
    formKey.value++
  }
}
const setParams = (data: Params) => {
  params.value = data
  console.log(data)
}
</script>

<template>
  <form @submit.prevent="addPermission">
    <PermissionForm :key="formKey" @update:data="setParams" />

    <div class="col-span-4 button-wrapper create-form-actions">
      <button type="button" class="btn btn-secondary" @click.prevent="saveAndNew">
        {{ $t('save and new') }}
      </button>
      <button type="submit" class="btn btn-primary">{{ $t('save') }}</button>
    </div>
  </form>
</template>

<style scoped></style>
