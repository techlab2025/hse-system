<script lang="ts" setup>
import { canOrganizationOperation } from '@/features/permission/Presentation/Helpers/organization_authorization'

import { canPolicy } from '@/features/permission/Presentation/Helpers/organization_authorization'
import { organizationApiPolicies } from '@/features/permission/Core/organizationPolicies'

import { ref } from 'vue'
import { useRouter } from 'vue-router'
import type Params from '@/base/core/params/params'
import { createStayOnPageRouter } from '@/shared/utils/createStayOnPageRouter'
import VisitThemeForm from './VisitThemeForm.vue'
import AddVisitThemeController from '../controllers/addVisitThemeController'
import type AddVisitThemeParams from '../../Core/params/addVisitThemeParams'
const router = useRouter()
const stayOnPageRouter = createStayOnPageRouter(router)
const params = ref<Params | null>(null)
const formKey = ref(0)
const formRef = ref<InstanceType<typeof VisitThemeForm> | null>(null)
const controller = AddVisitThemeController.getInstance()
const setParams = (data: Params) => {
  params.value = data
}
const addVisitTheme = async () => {
  if (!canOrganizationOperation('create_leadership_theme')) return

  if (!(await formRef.value?.validateRequiredFields()) || !params.value) return
  await controller.addVisitTheme(params.value as AddVisitThemeParams, router)
}
const saveAndNew = async () => {
  if (!canOrganizationOperation('create_leadership_theme')) return

  if (!(await formRef.value?.validateRequiredFields()) || !params.value) return
  controller.setLoading()
  await controller.addVisitTheme(params.value as AddVisitThemeParams, stayOnPageRouter, true)
  if (controller.isDataSuccess()) {
    params.value = null
    formKey.value++
  }
}
</script>
<template>
  <template v-if="canPolicy(organizationApiPolicies['create_leadership_theme'])">

  <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="addVisitTheme">
    <VisitThemeForm :key="formKey" ref="formRef" @update:data="setParams" />
    <div class="col-span-4 button-wrapper create-form-actions">
      <button v-if="canOrganizationOperation('create_leadership_theme')" type="button" class="btn btn-secondary" @click.prevent="saveAndNew">
        {{ $t('save and new') }}
      </button>
      <button v-if="canOrganizationOperation('create_leadership_theme')" type="submit" class="btn btn-primary">{{ $t('save') }}</button>
    </div>
  </form>

  </template>
</template>
