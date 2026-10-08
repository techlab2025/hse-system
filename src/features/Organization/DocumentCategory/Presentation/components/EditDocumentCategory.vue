<script lang="ts" setup>
import PermissionBuilder from '@/shared/HelpersComponents/PermissionBuilder.vue'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import FormLoader from '@/shared/DataStatues/FormLoader.vue'
import DocumentCategoryForm from '@/features/Organization/DocumentCategory/Presentation/components/DocumentCategoryForm.vue'
import type Params from '@/base/core/params/params'
import ShowDocumentCategoryController from '../controllers/showDocumentCategoryController'
import ShowDocumentCategoryParams from '../../Core/params/showDocumentCategoryParams'
import EditDocumentCategoryController from '../controllers/editDocumentCategoryController'

const route = useRoute()
const router = useRouter()
const id = route.params.id
const params = ref<Params | null>(null)
const formRef = ref<InstanceType<typeof DocumentCategoryForm> | null>(null)

const showDocumentCategoryController = ShowDocumentCategoryController.getInstance()
const state = ref(showDocumentCategoryController.state.value)
const fetchDocumentCategoryDetails = async () => {
  const DocumentCategoryParams = new ShowDocumentCategoryParams(Number(id))

  await showDocumentCategoryController.showDocumentCategory(DocumentCategoryParams)
}

onMounted(() => {
  fetchDocumentCategoryDetails()
})

const editDocumentCategory = async () => {
  if (!(await formRef.value?.validateRequiredFields())) return
  await EditDocumentCategoryController.getInstance().editDocumentCategory(params.value!, router)
}

watch(
  () => showDocumentCategoryController.state.value,
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
  PermissionsEnum.DOCUMENT_CATEGORY_ALL,
  PermissionsEnum.DOCUMENT_CATEGORY_DETAILS,
  PermissionsEnum.DOCUMENT_CATEGORY_UPDATE,
  PermissionsEnum.ORG_DOCUMENT_CATEGORY_ALL,
  PermissionsEnum.ORG_DOCUMENT_CATEGORY_DETAILS,
  PermissionsEnum.ORG_DOCUMENT_CATEGORY_UPDATE,
]
</script>

<template>
  <PermissionBuilder :code="allowedPermissions">
    <DataStatus :controller="state">
      <template #success>
        <!--      <pre>-->
        <!--              {{ state.data?.titles }}-->

        <!--      </pre>-->
        <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="editDocumentCategory">
          <DocumentCategoryForm ref="formRef" @update:data="setParams" :data="state.data!" />
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
