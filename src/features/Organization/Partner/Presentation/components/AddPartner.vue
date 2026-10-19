<script lang="ts" setup>
import { canOrganizationOperation } from '@/features/permission/Presentation/Helpers/organization_authorization'

import { canPolicy } from '@/features/permission/Presentation/Helpers/organization_authorization'
import { organizationApiPolicies } from '@/features/permission/Core/organizationPolicies'

import { createStayOnPageRouter } from '@/shared/utils/createStayOnPageRouter'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// import PrimaryButton from "@/components/HelpersComponents/PrimaryButton.vue";
import PartnerForm from './PartnerForm.vue'
import type Params from '@/base/core/params/params'
import AddPartnerController from '../controllers/addPartnerController'
import type AddPartnerParams from '../../Core/params/addPartnerParams'

const router = useRouter()
const stayOnPageRouter = createStayOnPageRouter(router)
const params = ref<Params | null>(null)
const formKey = ref(0)

const addPartnerController = AddPartnerController.getInstance()

const addPartner = async () => {
  if (!canOrganizationOperation('create_partner')) return

  await addPartnerController.addPartner(params.value as AddPartnerParams, router)
}

const saveAndNew = async () => {
  if (!canOrganizationOperation('create_partner')) return

  addPartnerController.setLoading()
  await addPartnerController.addPartner(params.value as AddPartnerParams, stayOnPageRouter)
  if (addPartnerController.isDataSuccess()) {
    params.value = null
    formKey.value++
  }
}
const setParams = (data: Params) => {
  params.value = data
}
</script>

<template>
  <template v-if="canPolicy(organizationApiPolicies['create_partner'])">

  <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="addPartner">
    <PartnerForm :key="formKey" @update:data="setParams" />

    <div class="col-span-4 button-wrapper create-form-actions">
      <button v-if="canOrganizationOperation('create_partner')" type="button" class="btn btn-secondary" @click.prevent="saveAndNew">
        {{ $t('save and new') }}
      </button>
      <button v-if="canOrganizationOperation('create_partner')" type="submit" class="btn btn-primary">{{ $t('save') }}</button>
    </div>
  </form>

  </template>
</template>

<style scoped></style>
