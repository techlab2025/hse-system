<script lang="ts" setup>
import { createStayOnPageRouter } from '@/shared/utils/createStayOnPageRouter'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
// import PrimaryButton from "@/components/HelpersComponents/PrimaryButton.vue";
import OrganizationCertificateForm from './OrganizationCertificateForm.vue'
import type Params from '@/base/core/params/params'
import type AddOrganizationCertificateParams from '../../Core/params/addOrganizationCertificateParams.ts'
import AddOrganizationCertificateController from '../controllers/addOrganizationCertificateController.ts'

const router = useRouter()
const stayOnPageRouter = createStayOnPageRouter(router)
const params = ref<Params | null>(null)
const formKey = ref(0)
const formRef = ref<InstanceType<typeof OrganizationCertificateForm> | null>(null)
const emit = defineEmits(['update:data'])
const addOrganizationCertificateController = AddOrganizationCertificateController.getInstance()

const addOrganizationCertificate = async () => {
  if (!(await formRef.value?.validateRequiredFields())) return
  addOrganizationCertificateController.setLoading()
  await addOrganizationCertificateController.addOrganizationCertificate(params.value as AddOrganizationCertificateParams, router)
  if (addOrganizationCertificateController.isDataSuccess()) emit('update:data')
}
const setParams = (data: Params) => {
  params.value = data
}

const saveAndNew = async () => {
  if (!(await formRef.value?.validateRequiredFields())) return
  addOrganizationCertificateController.setLoading()
  await addOrganizationCertificateController.addOrganizationCertificate(
    params.value as AddOrganizationCertificateParams,
    stayOnPageRouter,
    true,
  )
  if (addOrganizationCertificateController.isDataSuccess()) {
    params.value = null
    formKey.value++
  }
}
const route = useRoute()
</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="addOrganizationCertificate">
    <OrganizationCertificateForm ref="formRef" :key="formKey" @update:data="setParams" />

    <div class="col-span-4 button-wrapper create-form-actions">
      <button type="button" @click.prevent="saveAndNew" class="btn btn-secondary">
        {{ $t('save and new') }}
      </button>
      <button type="submit" class="btn btn-primary">
        {{ route.path.includes('project-progress') ? $t('save and next step') : $t('save') }}
      </button>
    </div>
  </form>
</template>

<style scoped>
.button-wrapper {
  display: flex;
  gap: 1rem;
  flex-direction: row !important;
  width: 100% !important;
  button {
    width: 50%;
    &.w-full {
      width: 100%;
    }
    &.w-1\/2 {
      width: 50%;
    }
  }
}
</style>
