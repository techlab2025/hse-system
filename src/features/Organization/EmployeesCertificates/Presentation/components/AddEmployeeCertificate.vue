<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// import PrimaryButton from "@/components/HelpersComponents/PrimaryButton.vue";
import EmployeeCertificateForm from './EmployeeCertificateForm.vue'
import type Params from '@/base/core/params/params'
import AddEmployeeCertificateController from '../controllers/addEmployeeCertificateController'
import type AddEmployeeCertificateParams from '../../Core/params/AddEmplyeeCertificateParams'

const router = useRouter()
const params = ref<Params | null>(null)

const addEmployeeCertificateController = AddEmployeeCertificateController.getInstance()

const addEmployeeCertificate = async () => {
  await addEmployeeCertificateController.addEmployeeCertificate(params.value as AddEmployeeCertificateParams, router)
}
const setParams = (data: Params) => {
  params.value = data
}
</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="addEmployeeCertificate">
    <EmployeeCertificateForm @update:data="setParams" />

    <div class="col-span-4 button-wrapper">
      <button type="submit" class="btn btn-primary">{{ $t('add') }}</button>
    </div>
  </form>
</template>

<style scoped></style>
