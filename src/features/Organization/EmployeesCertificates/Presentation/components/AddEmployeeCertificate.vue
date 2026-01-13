<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// import PrimaryButton from "@/components/HelpersComponents/PrimaryButton.vue";
import InjuryForm from './EmployeeCertificateForm.vue'
import type Params from '@/base/core/params/params'
import AddInjuryController from '../controllers/addEmployeeCertificateController'
import type AddInjuryParams from '../../Core/params/AddEmplyeeCertificateParams'

const router = useRouter()
const params = ref<Params | null>(null)

const addInjuryController = AddInjuryController.getInstance()

const addInjury = async () => {
  await addInjuryController.addInjury(params.value as AddInjuryParams, router)
}
const setParams = (data: Params) => {
  params.value = data
}
</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="addInjury">
    <InjuryForm @update:data="setParams" />

    <div class="col-span-4 button-wrapper">
      <button type="submit" class="btn btn-primary">{{ $t('add') }}</button>
    </div>
  </form>
</template>

<style scoped></style>
