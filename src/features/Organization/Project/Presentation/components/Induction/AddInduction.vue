<script setup lang="ts">
import { vProjectPanels } from '../../composables/projectPanels'

import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { createStayOnPageRouter } from '@/shared/utils/createStayOnPageRouter'
import type Params from '@/base/core/params/params'
import InductionForm from './InductionForm.vue'
import AddInductionController from '../../controllers/Induction/addInductionController'
import type AddInductionParams from '../../../Core/params/induction/addInductionParams'
import PermissionBuilder from '@/shared/HelpersComponents/PermissionBuilder.vue'
import DataFailed from '@/shared/DataStatues/DataFailed.vue'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'

const router = useRouter()
const stayOnPageRouter = createStayOnPageRouter(router)
const params = ref<Params | null>(null)
const formKey = ref(0)
const formRef = ref<InstanceType<typeof InductionForm> | null>(null)
const emit = defineEmits(['update:data'])
const addInductionController = AddInductionController.getInstance()
const createPermissions = [
  PermissionsEnum.ADMIN,
  PermissionsEnum.inductions_ALL,
  PermissionsEnum.inductions_CREATE,
]

const addInduction = async () => {
  if (!(await formRef.value?.validateRequiredFields())) return
  await addInductionController.addInduction(params.value as AddInductionParams, router)
  if (addInductionController.isDataSuccess()) emit('update:data')
}

const saveAndNew = async () => {
  if (!(await formRef.value?.validateRequiredFields())) return
  await addInductionController.addInduction(
    params.value as AddInductionParams,
    stayOnPageRouter,
    true,
  )
  if (addInductionController.isDataSuccess()) {
    params.value = null
    formKey.value++
  }
}

const setParams = (data: Params) => {
  params.value = data
}
</script>

<template>
  <PermissionBuilder :code="createPermissions">
    <form
      data-hse-project
      v-project-panels
      class="hse-project-root hse-project-page grid grid-cols-1 md:grid-cols-4 gap-4 induction-entry-form"
      @submit.prevent="addInduction"
    >
      <InductionForm :key="formKey" ref="formRef" @update:data="setParams" />

      <div class="hse-project-form-footer col-span-4 induction-form-actions create-form-actions">
        <button
          type="button"
          class="hse-project-button btn btn-secondary induction-action"
          @click.prevent="saveAndNew"
        >
          <Icon icon="uil:plus-circle" />
          {{ $t('save and new') }}
        </button>
        <button
          type="submit"
          class="hse-project-button hse-project-button--primary btn btn-primary induction-action induction-action--primary"
        >
          <Icon icon="uil:check-circle" />
          {{ $t('save') }}
        </button>
      </div>
    </form>
    <template #notPermitted>
      <DataFailed
        :title="$t('have_not_permission')"
        :description="$t('permission_denied_description')"
        link=""
        :withbtn="false"
      />
    </template>
  </PermissionBuilder>
</template>

<style scoped>
.induction-entry-form {
  align-items: start;
}

.induction-form-actions {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 12px;
  padding-top: 2px;
}

.induction-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 44px;
  border-radius: 999px;
  font-weight: 800;
}

.induction-action svg {
  width: 18px;
  height: 18px;
}

.induction-action--primary {
  box-shadow: 0 12px 24px color-mix(in srgb, var(--PrimaryColor) 18%, transparent);
}

@media (max-width: 720px) {
  .induction-form-actions {
    grid-template-columns: 1fr;
  }
}
</style>
