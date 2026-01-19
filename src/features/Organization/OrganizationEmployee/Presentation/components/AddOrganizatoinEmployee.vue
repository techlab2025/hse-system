<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// import PrimaryButton from "@/components/HelpersComponents/PrimaryButton.vue";
import type Params from '@/base/core/params/params'
import AddOrganizatoinEmployeeController from '../controllers/addOrganizatoinEmployeeController'
import type AddOrganizatoinEmployeeParams from '../../Core/params/addOrganizatoinEmployeeParams'
import OrganizatoinEmployeeForm from './OrganizatoinEmployeeForm.vue'

const emit = defineEmits(['update:data'])
const router = useRouter()
const params = ref<Params | null>(null)

const addOrganizatoinEmployeeController = AddOrganizatoinEmployeeController.getInstance()

const addOrganizatoinEmployee = async () => {
  if (params.value) {
    console.log(params.value, 'params value')
    await addOrganizatoinEmployeeController.addOrganizatoinEmployee(
      params.value as AddOrganizatoinEmployeeParams,
      router,
    )
  }
}
const setParams = (data: Params) => {
  params.value = data
}
</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="addOrganizatoinEmployee">
    <OrganizatoinEmployeeForm @update:data="setParams" />
    <div class="col-span-4 button-wrapper">
      <button type="submit" class="btn btn-primary w-full" @click="$emit('update:data')">
        {{ $t('add') }}
      </button>
    </div>
  </form>
</template>

<style scoped></style>
