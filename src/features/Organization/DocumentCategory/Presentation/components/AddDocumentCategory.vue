<script lang="ts" setup>
import PermissionBuilder from '@/shared/HelpersComponents/PermissionBuilder.vue'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
import { createStayOnPageRouter } from '@/shared/utils/createStayOnPageRouter'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// import PrimaryButton from "@/components/HelpersComponents/PrimaryButton.vue";
import type Params from '@/base/core/params/params'
import DocumentCategoryForm from './DocumentCategoryForm.vue'
import AddDocumentCategoryController from '../controllers/addDocumentCategoryController'
import type AddDocumentCategoryParams from '../../Core/params/addDocumentCategoryParams'

const router = useRouter()
const stayOnPageRouter = createStayOnPageRouter(router)
const params = ref<Params | null>(null)
const formKey = ref(0)
const formRef = ref<InstanceType<typeof DocumentCategoryForm> | null>(null)
const emit = defineEmits(['update:data'])

const addDocumentCategoryController = AddDocumentCategoryController.getInstance()

const addDocumentCategory = async () => {
  if (!(await formRef.value?.validateRequiredFields())) return
  await addDocumentCategoryController.addDocumentCategory(
    params.value as AddDocumentCategoryParams,
    router,
  )
  emit('update:data')
}

const saveAndNew = async () => {
  if (!(await formRef.value?.validateRequiredFields())) return
  addDocumentCategoryController.setLoading()
  await addDocumentCategoryController.addDocumentCategory(
    params.value as AddDocumentCategoryParams,
    stayOnPageRouter,
  )
  if (addDocumentCategoryController.isDataSuccess()) {
    params.value = null
    formKey.value++
  }
}
const setParams = (data: Params) => {
  params.value = data
}

const allowedPermissions = [
  PermissionsEnum.ADMIN,
  PermissionsEnum.DOCUMENT_CATEGORY_ALL,
  PermissionsEnum.DOCUMENT_CATEGORY_CREATE,
  PermissionsEnum.ORG_DOCUMENT_CATEGORY_ALL,
  PermissionsEnum.ORG_DOCUMENT_CATEGORY_CREATE,
]
</script>

<template>
  <PermissionBuilder :code="allowedPermissions">
    <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="addDocumentCategory">
      <DocumentCategoryForm :key="formKey" ref="formRef" @update:data="setParams" />

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
