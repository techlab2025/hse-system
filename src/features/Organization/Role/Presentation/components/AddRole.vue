<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import type Params from '@/base/core/params/params'
import type AddRoleParams from '../../Core/params/addRoleParams'
import AddRoleController from '../controllers/addRoleController'
import RoleForm from './RoleForm.vue'

const router = useRouter()
const params = ref<Params | null>(null)

const addRoleController = AddRoleController.getInstance()

const addRole = async () => {
  await addRoleController.addRole(params.value as AddRoleParams, router)
}
const setParams = (data: Params) => {
  params.value = data
}
</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="addRole">
    <RoleForm @update:data="setParams" />

    <div class="col-span-4 button-wrapper">
      <button type="submit" class="btn btn-primary">{{ $t('Add') }}</button>
    </div>
  </form>
</template>

<style scoped></style>
