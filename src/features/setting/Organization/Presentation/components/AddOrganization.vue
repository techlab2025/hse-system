<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// import PrimaryButton from "@/components/HelpersComponents/PrimaryButton.vue";
import type Params from '@/base/core/params/params'
import OrganizationForm from './OrganizationForm.vue'
import AddOrganizationController from '../controllers/addOrganizationController'
import type AddOrganizationParams from '../../Core/params/addOrganizationParams'

const router = useRouter()
const params = ref<Params | null>(null)

const addOrganizationController = AddOrganizationController.getInstance()

const addOrganization = async () => {
  await addOrganizationController.addOrganization(params.value as AddOrganizationParams, router)
}
const setParams = (data: Params) => {
  params.value = data
}
</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="addOrganization">
    <OrganizationForm @update:data="setParams" />

    <div class="col-span-4 button-wrapper">
      <button type="submit" class="btn btn-primary">Add</button>
    </div>
  </form>
</template>

<style scoped></style>
