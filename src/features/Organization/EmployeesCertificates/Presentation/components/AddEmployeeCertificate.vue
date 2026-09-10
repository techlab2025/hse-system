<script lang="ts" setup>
import { createStayOnPageRouter } from '@/shared/utils/createStayOnPageRouter'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// import PrimaryButton from "@/components/HelpersComponents/PrimaryButton.vue";
import EmployeeCertificateForm from './EmployeeCertificateForm.vue'
import type Params from '@/base/core/params/params'
import AddEmployeeCertificateController from '../controllers/addEmployeeCertificateController'
import type AddEmployeeCertificateParams from '../../Core/params/AddEmplyeeCertificateParams'

const router = useRouter()
const stayOnPageRouter = createStayOnPageRouter(router)
const params = ref<Params | null>(null)
const formKey = ref(0)

const addEmployeeCertificateController = AddEmployeeCertificateController.getInstance()

const addEmployeeCertificate = async () => {
  await addEmployeeCertificateController.addEmployeeCertificate(
    params.value as AddEmployeeCertificateParams,
    router,
  )
}

const saveAndNew = async () => {
  addEmployeeCertificateController.setLoading()
  await addEmployeeCertificateController.addEmployeeCertificate(
    params.value as AddEmployeeCertificateParams,
    stayOnPageRouter,
  )
  if (addEmployeeCertificateController.isDataSuccess()) {
    params.value = null
    formKey.value++
  }
}
const setParams = (data: Params) => {
  params.value = data
}
</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="addEmployeeCertificate">
    <EmployeeCertificateForm :key="formKey" @update:data="setParams" />

    <div class="col-span-4 button-wrapper create-form-actions">
      <button type="button" class="btn btn-secondary" @click.prevent="saveAndNew">
        {{ $t('save and new') }}
      </button>
      <button type="submit" class="btn btn-primary">{{ $t('save') }}</button>
    </div>
  </form>
</template>

<style scoped></style>
