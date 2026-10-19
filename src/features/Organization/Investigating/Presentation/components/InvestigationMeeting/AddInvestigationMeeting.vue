<script lang="ts" setup>
import { canOrganizationOperation } from '@/features/permission/Presentation/Helpers/organization_authorization'

import { canPolicy } from '@/features/permission/Presentation/Helpers/organization_authorization'
import { organizationApiPolicies } from '@/features/permission/Core/organizationPolicies'

import { ref } from 'vue'
import { useRouter } from 'vue-router'
import type Params from '@/base/core/params/params'
import InvestigationMeetingForm from './InvestigationMeetingForm.vue'
import AddInvestigatingController from '../../controllers/addInvestigatingController'
import type AddInvestigatingParams from '../../../Core/params/addInvestigatingParams'
import { createStayOnPageRouter } from '@/shared/utils/createStayOnPageRouter'

const router = useRouter()
const stayOnPageRouter = createStayOnPageRouter(router)
const params = ref<Params | null>(null)
const formKey = ref(0)

const addInvestigatingController = AddInvestigatingController.getInstance()

const addInvestigating = async () => {
  if (!canOrganizationOperation('create_full_investigation')) return

  console.log(params.value, 'params')
  await addInvestigatingController.addInvestigating(params.value as AddInvestigatingParams, router)
}

const saveAndNew = async () => {
  if (!canOrganizationOperation('create_full_investigation')) return

  addInvestigatingController.setLoading()
  await addInvestigatingController.addInvestigating(
    params.value as AddInvestigatingParams,
    stayOnPageRouter,
  )
  if (addInvestigatingController.isDataSuccess()) {
    params.value = null
    formKey.value++
  }
}
const setParams = (data: Params) => {
  // console.log(data, 'data')
  params.value = data
}
</script>

<template>
  <template v-if="canPolicy(organizationApiPolicies['create_full_investigation'])">

  <form class="grid grid-cols-1 md:grid-cols-6 gap-4" @submit.prevent="addInvestigating">
    <InvestigationMeetingForm :key="formKey" @update:data="setParams" />

    <div class="col-span-6 button-wrapper create-form-actions">
      <button v-if="canOrganizationOperation('create_full_investigation')" type="button" class="btn btn-secondary" @click.prevent="saveAndNew">
        {{ $t('save and new') }}
      </button>
      <button v-if="canOrganizationOperation('create_full_investigation')" type="submit" class="btn btn-primary w-full">{{ $t('save') }}</button>
    </div>
  </form>

  </template>
</template>

<style scoped></style>
