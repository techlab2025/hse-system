<script lang="ts" setup>
import { canOrganizationOperation } from '@/features/permission/Presentation/Helpers/organization_authorization'

import { canPolicy } from '@/features/permission/Presentation/Helpers/organization_authorization'
import { organizationApiPolicies } from '@/features/permission/Core/organizationPolicies'

import { createStayOnPageRouter } from '@/shared/utils/createStayOnPageRouter'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// import PrimaryButton from "@/components/HelpersComponents/PrimaryButton.vue";
import type Params from '@/base/core/params/params'
import WhereHouseForm from './WhereHouseForm.vue'
import AddWhereHouseController from '../controllers/addWhereHouseController'
import type AddWhereHouseParams from '../../Core/params/addWhereHouseParams'

const router = useRouter()
const stayOnPageRouter = createStayOnPageRouter(router)
const params = ref<Params | null>(null)
const formKey = ref(0)
const formRef = ref<InstanceType<typeof WhereHouseForm> | null>(null)

const emit = defineEmits(['update:data', 'close:dialog'])
const addWhereHouseController = AddWhereHouseController.getInstance()

const addWhereHouse = async () => {
  if (!canOrganizationOperation('create_warehouse')) return

  if (!(await formRef.value?.validateRequiredFields())) return
  await addWhereHouseController.addWhereHouse(params.value as AddWhereHouseParams, router)
  emit('update:data')
  emit('close:dialog')
}

const saveAndNew = async () => {
  if (!canOrganizationOperation('create_warehouse')) return

  if (!(await formRef.value?.validateRequiredFields())) return
  addWhereHouseController.setLoading()
  await addWhereHouseController.addWhereHouse(params.value as AddWhereHouseParams, stayOnPageRouter)
  if (addWhereHouseController.isDataSuccess()) {
    params.value = null
    formKey.value++
  }
}
const setParams = (data: Params) => {
  params.value = data
}
</script>

<template>
  <template v-if="canPolicy(organizationApiPolicies['create_warehouse'])">

  <!-- form where houes -->
  <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="addWhereHouse">
    <WhereHouseForm :key="formKey" ref="formRef" @update:data="setParams" />

    <div class="col-span-4 button-wrapper create-form-actions">
      <button v-if="canOrganizationOperation('create_warehouse')" type="button" class="btn btn-secondary" @click.prevent="saveAndNew">
        {{ $t('save and new') }}
      </button>
      <button v-if="canOrganizationOperation('create_warehouse')" type="submit" class="btn btn-primary">{{ $t('save') }}</button>
    </div>
  </form>

  </template>
</template>

<style scoped></style>
