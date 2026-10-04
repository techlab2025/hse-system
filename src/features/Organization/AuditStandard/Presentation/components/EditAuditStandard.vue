<script lang="ts" setup>
import PermissionBuilder from '@/shared/HelpersComponents/PermissionBuilder.vue'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import FormLoader from '@/shared/DataStatues/FormLoader.vue'
import AuditStandardForm from '@/features/Organization/AuditStandard/Presentation/components/AuditStandardForm.vue'
import type Params from '@/base/core/params/params'
import ShowAuditStandardController from '../controllers/showAuditStandardController'
import ShowAuditStandardParams from '../../Core/params/showAuditStandardParams'
import EditAuditStandardController from '../controllers/editAuditStandardController'

const route = useRoute()
const router = useRouter()
const id = route.params.id
const params = ref<Params | null>(null)
const formRef = ref<InstanceType<typeof AuditStandardForm> | null>(null)

const showAuditStandardController = ShowAuditStandardController.getInstance()
const state = ref(showAuditStandardController.state.value)
const fetchAuditStandardDetails = async () => {
  const AuditStandardParams = new ShowAuditStandardParams(Number(id))

  await showAuditStandardController.showAuditStandard(AuditStandardParams)
}

onMounted(() => {
  fetchAuditStandardDetails()
})

const editAuditStandard = async () => {
  if (!(await formRef.value?.validateRequiredFields())) return
  await EditAuditStandardController.getInstance().editAuditStandard(params.value!, router)
}

watch(
  () => showAuditStandardController.state.value,
  (newState) => {
    if (newState) {
      state.value = newState
    }
  },
)

const setParams = (data: Params) => {
  params.value = data
}

const allowedPermissions = [
  PermissionsEnum.ADMIN,
  PermissionsEnum.AUDIT_STANDARDS_ALL,
  PermissionsEnum.AUDIT_STANDARDS_DETAILS,
  PermissionsEnum.AUDIT_STANDARDS_UPDATE,
  PermissionsEnum.ORG_AUDIT_STANDARDS_ALL,
  PermissionsEnum.ORG_AUDIT_STANDARDS_DETAILS,
  PermissionsEnum.ORG_AUDIT_STANDARDS_UPDATE,
]
</script>

<template>
  <PermissionBuilder :code="allowedPermissions">
    <DataStatus :controller="state">
      <template #success>
        <!--      <pre>-->
        <!--              {{ state.data?.titles }}-->

        <!--      </pre>-->
        <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="editAuditStandard">
          <AuditStandardForm ref="formRef" @update:data="setParams" :data="state.data!" />
          <div class="col-span-4 button-wrapper">
            <button type="submit" class="btn btn-primary">{{ $t('save') }}</button>
          </div>
        </form>
      </template>
      <template #loader>
        <FormLoader :inputsCount="5" />
      </template>
    </DataStatus>
  </PermissionBuilder>
</template>

<style scoped></style>
