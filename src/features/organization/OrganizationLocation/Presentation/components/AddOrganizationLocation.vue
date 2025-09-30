<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// import PrimaryButton from "@/components/HelpersComponents/PrimaryButton.vue";
import OrganizationLocationForm from './OrganizationLocationForm.vue'
import type Params from '@/base/core/params/params'
import AddOrganizationLocationController from '../controllers/addOrganizationLocationController'
import type AddOrganizationLocationParams from '../../Core/params/addOrganizationLocationParams'

const router = useRouter()
const params = ref<Params | null>(null)

const addOrganizationLocationController = AddOrganizationLocationController.getInstance()

const addOrganizationLocation = async () => {
  await addOrganizationLocationController.addOrganizationLocation(params.value as AddOrganizationLocationParams, router)
}
const setParams = (data: Params) => {
  params.value = data
}
</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="addOrganizationLocation">
    <OrganizationLocationForm @update:data="setParams" />

    <div class="col-span-4 button-wrapper">
      <button type="submit" class="btn btn-primary">Add</button>
    </div>
  </form>
</template>

<style scoped></style>
