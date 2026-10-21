<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import ExcelRowsImport, {
  type ExcelImportRow,
} from '@/shared/HelpersComponents/ExcelRowsImport.vue'
import PermissionBuilder from '@/shared/HelpersComponents/PermissionBuilder.vue'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
import AddFactoryController from '../controllers/addFactoryController'
import AddFactorExcelParams from '../../Core/params/addFactorExcelParams'

const props = defineProps<{ initialFile?: File | null }>()
const emit = defineEmits<{ uploaded: []; busy: [value: boolean] }>()
const { t } = useI18n()
const router = useRouter()
const busy = ref(false)
const error = ref('')
const columns = computed(() => [{ key: 'title', label: t('title'), required: true }])
const createPermissions = [
  PermissionsEnum.ADMIN,
  PermissionsEnum.FACTORY_ALL,
  PermissionsEnum.FACTORY_CREATE,
  PermissionsEnum.ORG_FACTORY_ALL,
  PermissionsEnum.ORG_FACTORY_CREATE,
]
const submit = async (rows: ExcelImportRow[]) => {
  if (busy.value) return
  busy.value = true
  emit('busy', true)
  error.value = ''
  try {
    const controller = AddFactoryController.getInstance()
    await controller.addFactory(
      new AddFactorExcelParams({ data: rows.map((row) => ({ title: row.title.trim() })) }),
      router,
      true,
    )
    if (controller.isDataSuccess()) emit('uploaded')
    else error.value = controller.state.value.error?.title || t('error_occurred')
  } finally {
    busy.value = false
    emit('busy', false)
  }
}
</script>
<template>
  <PermissionBuilder :code="createPermissions">
    <ExcelRowsImport
      :initial-file="props.initialFile"
      :columns="columns"
      :busy="busy"
      :error="error"
      @submit="submit"
    />
  </PermissionBuilder>
</template>
