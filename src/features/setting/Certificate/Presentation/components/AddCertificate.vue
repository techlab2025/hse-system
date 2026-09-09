<script lang="ts" setup>
import { createStayOnPageRouter } from '@/shared/utils/createStayOnPageRouter'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
// import PrimaryButton from "@/components/HelpersComponents/PrimaryButton.vue";
import CertificateForm from './CertificateForm.vue'
import type Params from '@/base/core/params/params'
import type AddCertificateParams from '../../Core/params/addCertificateParams'
import AddCertificateController from '../controllers/addCertificateController'

const router = useRouter()
const stayOnPageRouter = createStayOnPageRouter(router)
const params = ref<Params | null>(null)
const formKey = ref(0)
const formRef = ref<InstanceType<typeof CertificateForm> | null>(null)
const emit = defineEmits(['update:data'])
const addCertificateController = AddCertificateController.getInstance()

const addCertificate = async () => {
  if (!(await formRef.value?.validateRequiredFields())) return
  addCertificateController.setLoading()
  await addCertificateController.addCertificate(params.value as AddCertificateParams, router)
  if (addCertificateController.isDataSuccess()) emit('update:data')
}
const setParams = (data: Params) => {
  params.value = data
}

const saveAndNew = async () => {
  if (!(await formRef.value?.validateRequiredFields())) return
  addCertificateController.setLoading()
  await addCertificateController.addCertificate(
    params.value as AddCertificateParams,
    stayOnPageRouter,
    true,
  )
  if (addCertificateController.isDataSuccess()) {
    params.value = null
    formKey.value++
  }
}
const route = useRoute()
</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="addCertificate">
    <CertificateForm ref="formRef" :key="formKey" @update:data="setParams" />

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
