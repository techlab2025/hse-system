<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// import PrimaryButton from "@/components/HelpersComponents/PrimaryButton.vue";
import type Params from '@/base/core/params/params'
import ContractorForm from './ContractorForm.vue'
import AddContractorController from '../controllers/addContractorController'
import type AddContractorParams from '../../Core/params/addContractorParams'

const emit = defineEmits(['update:data'])
const router = useRouter()
const params = ref<Params | null>(null)
const formRef = ref<InstanceType<typeof ContractorForm> | null>(null)

const addContractorController = AddContractorController.getInstance()
const loading = ref(false)

const addContractor = async () => {
  if (!(await formRef.value?.validateRequiredFields())) return
  loading.value = true

  try {
    await addContractorController.addContractor(
      params.value as AddContractorParams,
      router,
    )

    // The parent dialog must stay open on API/validation failure so the user
    // can correct the existing values without losing their work.
    if (addContractorController.isDataSuccess()) {
      emit('update:data')
    }
  } finally {
    loading.value = false
  }
}
const setParams = (data: Params) => {
  params.value = data
}
</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-4 gap-8" @submit.prevent="addContractor">
    <ContractorForm ref="formRef" @update:data="setParams" />

    <div class="col-span-4 button-wrapper">
      <button type="submit" class="btn btn-primary w-full" :disabled="loading">
        {{ $t('save') }}
      </button>
    </div>
  </form>
</template>

<style scoped></style>
