<script lang="ts" setup>
import { canOrganizationOperation } from '@/features/permission/Presentation/Helpers/organization_authorization'

import { canPolicy } from '@/features/permission/Presentation/Helpers/organization_authorization'
import { organizationApiPolicies } from '@/features/permission/Core/organizationPolicies'

import { createStayOnPageRouter } from '@/shared/utils/createStayOnPageRouter'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// import PrimaryButton from "@/components/HelpersComponents/PrimaryButton.vue";
import OrganizationLocationForm from './OrganizationLocationForm.vue'
import type Params from '@/base/core/params/params'
import AddOrganizationLocationController from '../controllers/addOrganizationLocationController'
import type AddOrganizationLocationParams from '../../Core/params/addOrganizationLocationParams'

const router = useRouter()
const stayOnPageRouter = createStayOnPageRouter(router)
const params = ref<Params | null>(null)
const formKey = ref(0)

const addOrganizationLocationController = AddOrganizationLocationController.getInstance()

const addOrganizationLocation = async () => {
  if (!canOrganizationOperation('create_organization_location')) return

  await addOrganizationLocationController.addOrganizationLocation(
    params.value as AddOrganizationLocationParams,
    router,
  )
}

const saveAndNew = async () => {
  if (!canOrganizationOperation('create_organization_location')) return

  addOrganizationLocationController.setLoading()
  await addOrganizationLocationController.addOrganizationLocation(
    params.value as AddOrganizationLocationParams,
    stayOnPageRouter,
  )
  if (addOrganizationLocationController.isDataSuccess()) {
    params.value = null
    formKey.value++
  }
}
const setParams = (data: Params) => {
  params.value = data
}
</script>

<template>
  <template v-if="canPolicy(organizationApiPolicies['create_organization_location'])">

  <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="addOrganizationLocation">
    <OrganizationLocationForm :key="formKey" @update:data="setParams" />

    <div class="col-span-4 button-wrapper create-form-actions">
      <button v-if="canOrganizationOperation('create_organization_location')" type="button" class="btn btn-secondary" @click.prevent="saveAndNew">
        {{ $t('save and new') }}
      </button>
      <button v-if="canOrganizationOperation('create_organization_location')" type="submit" class="btn btn-primary">{{ $t('save') }}</button>
    </div>
  </form>

  </template>
</template>

<style scoped></style>
