<script lang="ts" setup>
import { createStayOnPageRouter } from '@/shared/utils/createStayOnPageRouter'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import type Params from '@/base/core/params/params'
import type AddRoleParams from '../../Core/params/addRoleParams'
import AddRoleController from '../controllers/addRoleController'
import RoleForm from './RoleForm.vue'

const router = useRouter()
const stayOnPageRouter = createStayOnPageRouter(router)
const params = ref<Params | null>(null)
const formKey = ref(0)
const emit = defineEmits(['update:data'])
const addRoleController = AddRoleController.getInstance()

const addRole = async () => {
  await addRoleController.addRole(params.value as AddRoleParams, router)
  emit('update:data')
}

const saveAndNew = async () => {
  addRoleController.setLoading()
  await addRoleController.addRole(params.value as AddRoleParams, stayOnPageRouter)
  if (addRoleController.isDataSuccess()) {
    params.value = null
    formKey.value++
  }
}
const setParams = (data: Params) => {
  params.value = data
}
</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="addRole">
    <RoleForm :key="formKey" @update:data="setParams" />

    <div class="col-span-4 button-wrapper create-form-actions">
      <button type="button" class="btn btn-secondary" @click.prevent="saveAndNew">
        {{ $t('save and new') }}
      </button>
      <button type="submit" class="btn btn-primary">{{ $t('save') }}</button>
    </div>
  </form>
</template>

<style scoped></style>
