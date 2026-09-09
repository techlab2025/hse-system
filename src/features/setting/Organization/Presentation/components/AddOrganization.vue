<script lang="ts" setup>
import { createStayOnPageRouter } from '@/shared/utils/createStayOnPageRouter'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// import PrimaryButton from "@/components/HelpersComponents/PrimaryButton.vue";
import type Params from '@/base/core/params/params'
import OrganizationForm from './OrganizationForm.vue'
import AddOrganizationController from '../controllers/addOrganizationController'
import type AddOrganizationParams from '../../Core/params/addOrganizationParams'

const router = useRouter()
const stayOnPageRouter = createStayOnPageRouter(router)
const params = ref<Params | null>(null)
const formKey = ref(0)

const addOrganizationController = AddOrganizationController.getInstance()

const addOrganization = async () => {
  await addOrganizationController.addOrganization(params.value as AddOrganizationParams, router)
}

const saveAndNew = async () => {
  addOrganizationController.setLoading()
  await addOrganizationController.addOrganization(
    params.value as AddOrganizationParams,
    stayOnPageRouter,
  )
  if (addOrganizationController.isDataSuccess()) {
    params.value = null
    formKey.value++
  }
}
const setParams = (data: Params) => {
  params.value = data
}
</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="addOrganization">
    <OrganizationForm :key="formKey" @update:data="setParams" />

    <div class="col-span-4 button-wrapper create-form-actions">
      <button type="button" class="btn btn-secondary" @click.prevent="saveAndNew">
        {{ $t('save and new') }}
      </button>
      <button type="submit" class="btn btn-primary w-full">{{ $t('save') }}</button>
    </div>
  </form>
</template>

<style scoped></style>
