<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// import PrimaryButton from "@/components/HelpersComponents/PrimaryButton.vue";
import CertificateForm from './CertificateForm.vue'
import type Params from '@/base/core/params/params'
import type AddCertificateParams from '../../Core/params/addCertificateParams'
import AddCertificateController from '../controllers/addCertificateController'

const router = useRouter()
const params = ref<Params | null>(null)
const formKey = ref(0)
const emit = defineEmits(['update:data'])
const addCertificateController = AddCertificateController.getInstance()

const addCertificate = async () => {
  await addCertificateController.addCertificate(params.value as AddCertificateParams, router)
  emit('update:data')
}
const setParams = (data: Params) => {
  params.value = data
}

const addcertificate = async () => {
  const state = await addCertificateController.addCertificate(params.value as AddCertificateParams, router, true)
  if (!state.value.error) {
    params.value = null
    formKey.value++
  }
}
</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="addCertificate">
    <CertificateForm :key="formKey" @update:data="setParams" />

    <div class="col-span-4 button-wrapper">
      <button type="submit" class="btn btn-primary">{{ $t('save') }}</button>
      <button @click.prevent="addcertificate" class="btn btn-primary">{{ $t('save and add  ') }}</button>
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
  }
}
</style>
