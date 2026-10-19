<script lang="ts" setup>
import { canOrganizationOperation } from '@/features/permission/Presentation/Helpers/organization_authorization'

import { canPolicy } from '@/features/permission/Presentation/Helpers/organization_authorization'
import { organizationApiPolicies } from '@/features/permission/Core/organizationPolicies'

import { createStayOnPageRouter } from '@/shared/utils/createStayOnPageRouter'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// import PrimaryButton from "@/components/HelpersComponents/PrimaryButton.vue";
import type Params from '@/base/core/params/params'
import PpeItemForm from './PpeItemForm.vue'
import AddPpeItemController from '../controllers/addPpeItemController'
import type AddPpeItemParams from '../../Core/params/addPpeItemParams'

const router = useRouter()
const stayOnPageRouter = createStayOnPageRouter(router)
const params = ref<Params | null>(null)
const formKey = ref(0)
const formRef = ref<InstanceType<typeof PpeItemForm> | null>(null)
const emit = defineEmits(['update:data'])

const addPpeItemController = AddPpeItemController.getInstance()

const addPpeItem = async () => {
  if (!canOrganizationOperation('create_ppe_item')) return

  if (!(await formRef.value?.validateRequiredFields())) return
  await addPpeItemController.addPpeItem(
    params.value as AddPpeItemParams,
    router,
  )
  emit('update:data')
}

const saveAndNew = async () => {
  if (!canOrganizationOperation('create_ppe_item')) return

  if (!(await formRef.value?.validateRequiredFields())) return
  addPpeItemController.setLoading()
  await addPpeItemController.addPpeItem(
    params.value as AddPpeItemParams,
    stayOnPageRouter,
  )
  if (addPpeItemController.isDataSuccess()) {
    params.value = null
    formKey.value++
  }
}
const setParams = (data: Params) => {
  params.value = data
}
</script>

<template>
  <template v-if="canPolicy(organizationApiPolicies['create_ppe_item'])">

  <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="addPpeItem">
    <PpeItemForm :key="formKey" ref="formRef" @update:data="setParams" />

    <div class="col-span-4 button-wrapper create-form-actions">
      <button v-if="canOrganizationOperation('create_ppe_item')" type="button" class="btn btn-secondary" @click.prevent="saveAndNew">
        {{ $t('save and new') }}
      </button>
      <button v-if="canOrganizationOperation('create_ppe_item')" type="submit" class="btn btn-primary">{{ $t('save') }}</button>
    </div>
  </form>

  </template>
</template>

<style scoped></style>
