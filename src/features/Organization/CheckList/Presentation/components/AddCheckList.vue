<script lang="ts" setup>
import { canOrganizationOperation } from '@/features/permission/Presentation/Helpers/organization_authorization'

import { canPolicy } from '@/features/permission/Presentation/Helpers/organization_authorization'
import { organizationApiPolicies } from '@/features/permission/Core/organizationPolicies'

import { createStayOnPageRouter } from '@/shared/utils/createStayOnPageRouter'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// import PrimaryButton from "@/components/HelpersComponents/PrimaryButton.vue";
import type Params from '@/base/core/params/params'
import CheckListForm from './CheckListForm.vue'
import AddCheckListController from '../controllers/addCheckListController'
import type AddCheckListParams from '../../Core/params/addCheckListParams'

const router = useRouter()
const stayOnPageRouter = createStayOnPageRouter(router)
const params = ref<Params | null>(null)
const formKey = ref(0)
const emit = defineEmits(['update:data'])

const addCheckListController = AddCheckListController.getInstance()

const addCheckList = async () => {
  if (!canOrganizationOperation('create_checklist')) return

  await addCheckListController.addCheckList(params.value as AddCheckListParams, router)
  emit('update:data')
}

const saveAndNew = async () => {
  if (!canOrganizationOperation('create_checklist')) return

  addCheckListController.setLoading()
  await addCheckListController.addCheckList(params.value as AddCheckListParams, stayOnPageRouter)
  if (addCheckListController.isDataSuccess()) {
    params.value = null
    formKey.value++
  }
}
const setParams = (data: Params) => {
  params.value = data
}
</script>

<template>
  <template v-if="canPolicy(organizationApiPolicies['create_checklist'])">

  <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="addCheckList">
    <CheckListForm :key="formKey" @update:data="setParams" />

    <div class="col-span-4 button-wrapper create-form-actions">
      <button v-if="canOrganizationOperation('create_checklist')" type="button" class="btn btn-secondary" @click.prevent="saveAndNew">
        {{ $t('save and new') }}
      </button>
      <button v-if="canOrganizationOperation('create_checklist')" type="submit" class="btn btn-primary">{{ $t('save') }}</button>
    </div>
  </form>

  </template>
</template>

<style scoped></style>
