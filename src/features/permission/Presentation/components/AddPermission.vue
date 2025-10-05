<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// import PrimaryButton from "@/components/HelpersComponents/PrimaryButton.vue";
import PermissionForm from './PermissionForm.vue'
import type Params from '@/base/core/params/params'
import type AddPermissionParams from '../../Core/params/addPermissionParams'
import AddPermissionController from '../controllers/addPermissionController'

const router = useRouter()
const params = ref<Params | null>(null)

const addPermissionController = AddPermissionController.getInstance()

const addPermission = async () => {
  await addPermissionController.addPermission(params.value as AddPermissionParams, router)
}
const setParams = (data: Params) => {
  params.value = data
  console.log(data)
}
</script>

<template>
  <form @submit.prevent="addPermission">
    <PermissionForm @update:data="setParams" />

    <div class="col-span-4 button-wrapper">
      <button type="submit" class="btn btn-primary">Add</button>
    </div>
  </form>
</template>

<style scoped></style>
