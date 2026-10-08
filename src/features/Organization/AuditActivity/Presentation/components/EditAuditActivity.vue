<script lang="ts" setup>
import PermissionBuilder from '@/shared/HelpersComponents/PermissionBuilder.vue'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import FormLoader from '@/shared/DataStatues/FormLoader.vue'
import AuditActivityForm from '@/features/Organization/AuditActivity/Presentation/components/AuditActivityForm.vue'
import type Params from '@/base/core/params/params'
import ShowAuditActivityController from '../controllers/showAuditActivityController'
import ShowAuditActivityParams from '../../Core/params/showAuditActivityParams'
import EditAuditActivityController from '../controllers/editAuditActivityController'

const route = useRoute()
const router = useRouter()
const id = route.params.id
const params = ref<Params | null>(null)
const formRef = ref<InstanceType<typeof AuditActivityForm> | null>(null)

const showAuditActivityController = ShowAuditActivityController.getInstance()
const state = ref(showAuditActivityController.state.value)
const fetchAuditActivityDetails = async () => {
  const AuditActivityParams = new ShowAuditActivityParams(Number(id))

  await showAuditActivityController.showAuditActivity(AuditActivityParams)
}

onMounted(() => {
  fetchAuditActivityDetails()
})

const editAuditActivity = async () => {
  if (!(await formRef.value?.validateRequiredFields())) return
  await EditAuditActivityController.getInstance().editAuditActivity(params.value!, router)
}

watch(
  () => showAuditActivityController.state.value,
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
  PermissionsEnum.AUDIT_ACTIVITIES_ALL,
  PermissionsEnum.AUDIT_ACTIVITIES_DETAILS,
  PermissionsEnum.AUDIT_ACTIVITIES_UPDATE,
  PermissionsEnum.ORG_AUDIT_ACTIVITIES_ALL,
  PermissionsEnum.ORG_AUDIT_ACTIVITIES_DETAILS,
  PermissionsEnum.ORG_AUDIT_ACTIVITIES_UPDATE,
]
</script>

<template>
  <PermissionBuilder :code="allowedPermissions">
    <DataStatus :controller="state">
      <template #success>
        <!--      <pre>-->
        <!--              {{ state.data?.titles }}-->

        <!--      </pre>-->
        <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="editAuditActivity">
          <AuditActivityForm ref="formRef" @update:data="setParams" :data="state.data!" />
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
