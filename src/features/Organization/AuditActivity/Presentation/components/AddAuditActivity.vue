<script lang="ts" setup>
import PermissionBuilder from '@/shared/HelpersComponents/PermissionBuilder.vue'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
import { createStayOnPageRouter } from '@/shared/utils/createStayOnPageRouter'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// import PrimaryButton from "@/components/HelpersComponents/PrimaryButton.vue";
import type Params from '@/base/core/params/params'
import AuditActivityForm from './AuditActivityForm.vue'
import AddAuditActivityController from '../controllers/addAuditActivityController'
import type AddAuditActivityParams from '../../Core/params/addAuditActivityParams'

const router = useRouter()
const stayOnPageRouter = createStayOnPageRouter(router)
const params = ref<Params | null>(null)
const formKey = ref(0)
const formRef = ref<InstanceType<typeof AuditActivityForm> | null>(null)
const emit = defineEmits(['update:data'])

const addAuditActivityController = AddAuditActivityController.getInstance()

const addAuditActivity = async () => {
  if (!(await formRef.value?.validateRequiredFields())) return
  await addAuditActivityController.addAuditActivity(params.value as AddAuditActivityParams, router)
  emit('update:data')
}

const saveAndNew = async () => {
  if (!(await formRef.value?.validateRequiredFields())) return
  addAuditActivityController.setLoading()
  await addAuditActivityController.addAuditActivity(
    params.value as AddAuditActivityParams,
    stayOnPageRouter,
  )
  if (addAuditActivityController.isDataSuccess()) {
    params.value = null
    formKey.value++
  }
}
const setParams = (data: Params) => {
  params.value = data
}

const allowedPermissions = [
  PermissionsEnum.ADMIN,
  PermissionsEnum.AUDIT_ACTIVITIES_ALL,
  PermissionsEnum.AUDIT_ACTIVITIES_CREATE,
  PermissionsEnum.ORG_AUDIT_ACTIVITIES_ALL,
  PermissionsEnum.ORG_AUDIT_ACTIVITIES_CREATE,
]
</script>

<template>
  <PermissionBuilder :code="allowedPermissions">
    <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="addAuditActivity">
      <AuditActivityForm :key="formKey" ref="formRef" @update:data="setParams" />

      <div class="col-span-4 button-wrapper create-form-actions">
        <button type="button" class="btn btn-secondary" @click.prevent="saveAndNew">
          {{ $t('save and new') }}
        </button>
        <button type="submit" class="btn btn-primary">{{ $t('save') }}</button>
      </div>
    </form>
  </PermissionBuilder>
</template>

<style scoped></style>
