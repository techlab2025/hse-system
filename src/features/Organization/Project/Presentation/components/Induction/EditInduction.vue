<script setup lang="ts">
import { canPolicy } from '@/features/permission/Presentation/Helpers/organization_authorization'
import { organizationApiPolicies } from '@/features/permission/Core/organizationPolicies'

import { vProjectPanels } from '../../composables/projectPanels'

import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import FormLoader from '@/shared/DataStatues/FormLoader.vue'
import type Params from '@/base/core/params/params'
import InductionForm from './InductionForm.vue'
import ShowInductionController from '../../controllers/Induction/showInductionController'
import EditInductionController from '../../controllers/Induction/editInductionController'
import ShowInductionParams from '../../../Core/params/induction/showInductionParams'
import type EditInductionParams from '../../../Core/params/induction/editInductionParams'
import PermissionBuilder from '@/shared/HelpersComponents/PermissionBuilder.vue'
import DataFailed from '@/shared/DataStatues/DataFailed.vue'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
import PermissionHandler from '@/base/Presentation/utils/permission_handler'

const route = useRoute()
const router = useRouter()
const id = route.params.id
const params = ref<Params | null>(null)
const formRef = ref<InstanceType<typeof InductionForm> | null>(null)
const showInductionController = ShowInductionController.getInstance()
const state = ref(showInductionController.state.value)
const viewPermissions = [
  PermissionsEnum.ADMIN,
  PermissionsEnum.inductions_ALL,
  PermissionsEnum.inductions_DETAILS,
  PermissionsEnum.inductions_UPDATE,
]
const updatePermissions = [
  PermissionsEnum.ADMIN,
  PermissionsEnum.inductions_ALL,
  PermissionsEnum.inductions_UPDATE,
]

const fetchInductionDetails = async () => {
  if (!PermissionHandler.Instance.handle(viewPermissions)) return
  await showInductionController.showInduction(new ShowInductionParams(Number(id)))
}

const editInduction = async () => {
  if (!PermissionHandler.Instance.handle(updatePermissions)) return
  if (!(await formRef.value?.validateRequiredFields())) return
  await EditInductionController.getInstance().editInduction(
    params.value as EditInductionParams,
    router,
  )
}

watch(
  () => showInductionController.state.value,
  (newState) => {
    if (newState) state.value = newState
  },
)

const setParams = (data: Params) => {
  params.value = data
}

onMounted(fetchInductionDetails)
</script>

<template>
  <template v-if="canPolicy(organizationApiPolicies['update_induction'])">

  <PermissionBuilder :code="viewPermissions">
    <div data-hse-project v-project-panels class="hse-project-root hse-project-state-host">
      <DataStatus :controller="state">
        <template #success>
          <form
            data-hse-project
            v-project-panels
            class="hse-project-root hse-project-page grid grid-cols-1 md:grid-cols-4 gap-4 induction-entry-form"
            @submit.prevent="editInduction"
          >
            <InductionForm ref="formRef" :data="state.data!" @update:data="setParams" />
            <div class="hse-project-form-footer col-span-4 induction-form-actions">
              <PermissionBuilder :code="updatePermissions">
                <button
                  type="submit"
                  class="hse-project-button hse-project-button--primary btn btn-primary induction-action induction-action--primary"
                >
                  <Icon icon="uil:check-circle" />
                  {{ $t('save') }}
                </button>
              </PermissionBuilder>
            </div>
          </form>
        </template>
        <template #loader>
          <FormLoader :inputsCount="5" />
        </template>
      </DataStatus>
    </div>
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
</template>

<style scoped>
.induction-entry-form {
  align-items: start;
}

.induction-form-actions {
  display: flex;
  justify-content: flex-end;
  padding-top: 2px;
}

.induction-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-width: min(260px, 100%);
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
    justify-content: stretch;
  }

  .induction-action {
    width: 100%;
  }
}
</style>
