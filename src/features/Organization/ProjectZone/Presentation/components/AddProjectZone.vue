<script lang="ts" setup>
import { canOrganizationOperation } from '@/features/permission/Presentation/Helpers/organization_authorization'

import { canPolicy } from '@/features/permission/Presentation/Helpers/organization_authorization'
import { organizationApiPolicies } from '@/features/permission/Core/organizationPolicies'

import { createStayOnPageRouter } from '@/shared/utils/createStayOnPageRouter'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type Params from '@/base/core/params/params'
import AddProjectZoneController from '../controllers/addProjectZoneController'
import type AddProjectZoneParams from '../../Core/params/addProjectZoneParams'
import ProjectZoneForm from './ProjectZoneForm.vue'

const router = useRouter()
const stayOnPageRouter = createStayOnPageRouter(router)
const route = useRoute()
const params = ref<Params | null>(null)
const formKey = ref(0)
const emit = defineEmits(['update:data'])

const addProjectZoneController = AddProjectZoneController.getInstance()

const addProjectZone = async () => {
  if (!canOrganizationOperation('create_zoon')) return

  const isSuccess = await addProjectZoneController.addProjectZone(
    params.value as AddProjectZoneParams,
    router,
  )
  if (isSuccess) emit('update:data')
}

const saveAndNew = async () => {
  if (!canOrganizationOperation('create_zoon')) return

  const isSuccess = addProjectZoneController.setLoading()
  await addProjectZoneController.addProjectZone(
    params.value as AddProjectZoneParams,
    stayOnPageRouter,
    true,
  )
  if (isSuccess) {
    params.value = null
    formKey.value++
  }
}

const setParams = (data: Params) => {
  params.value = data
}
</script>

<template>
  <template v-if="canPolicy(organizationApiPolicies['create_zoon'])">

  <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="addProjectZone">
    <ProjectZoneForm :key="formKey" @update:data="setParams" />

    <div class="col-span-4 button-wrapper create-form-actions">
      <button v-if="canOrganizationOperation('create_zoon')" type="button" @click.prevent="saveAndNew" class="btn btn-secondary">
        {{ $t('save and new') }}
      </button>
      <button v-if="canOrganizationOperation('create_zoon')" type="submit" class="btn btn-primary">
        {{ route.path.includes('project-progress') ? $t('save and next step') : $t('save') }}
      </button>
    </div>
  </form>

  </template>
</template>

<style scoped>
.button-wrapper {
  display: flex;
  gap: 1rem;
  flex-direction: row !important;
  width: 100% !important;
  button {
    &.w-full {
      width: 100%;
    }
    &.w-1\/2 {
      width: 50%;
    }
  }
}
</style>
