<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import TitleExcelImport from '@/shared/HelpersComponents/TitleExcelImport.vue'
import PermissionBuilder from '@/shared/HelpersComponents/PermissionBuilder.vue'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
import AddVisitCategoryController from '../controllers/addVisitCategoryController'

const props = defineProps<{ initialFile?: File | null }>()
const emit = defineEmits<{ uploaded: [] }>()
const router = useRouter()
const { t } = useI18n()
const submitting = ref(false)
const errorMessage = ref('')
const createPermissions = [
  PermissionsEnum.ADMIN,
  PermissionsEnum.ORGANIZATION_EMPLOYEE,
  PermissionsEnum.VISIT_CATEGORY_ALL,
  PermissionsEnum.VISIT_CATEGORY_CREATE,
  PermissionsEnum.ORG_VISIT_CATEGORY_ALL,
  PermissionsEnum.ORG_VISIT_CATEGORY_CREATE,
]
const submit = async (titles: string[]) => {
  if (submitting.value) return
  submitting.value = true
  errorMessage.value = ''
  try {
    const controller = AddVisitCategoryController.getInstance()
    await controller.importVisitCategories(titles, router)
    if (controller.isDataSuccess()) emit('uploaded')
    else errorMessage.value = controller.state.value.error?.title ?? t('error_occurred')
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : t('error_occurred')
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <PermissionBuilder :code="createPermissions">
    <p v-if="errorMessage" class="text-red-500" role="alert">{{ errorMessage }}</p>
    <TitleExcelImport :initial-file="props.initialFile" :submitting="submitting" @imported="submit" />
  </PermissionBuilder>
</template>
