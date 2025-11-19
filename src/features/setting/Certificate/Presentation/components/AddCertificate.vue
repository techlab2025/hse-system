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

const addCertificateController = AddCertificateController.getInstance()

const addCertificate = async () => {
  await addCertificateController.addCertificate(params.value as AddCertificateParams, router)
}
const setParams = (data: Params) => {
  params.value = data
}
</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="addCertificate">
    <CertificateForm @update:data="setParams" />

    <div class="col-span-4 button-wrapper">
      <button type="submit" class="btn btn-primary">Add</button>
    </div>
  </form>
</template>

<style scoped></style>
