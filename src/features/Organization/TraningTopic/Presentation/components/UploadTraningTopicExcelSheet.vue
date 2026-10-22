<script setup lang="ts">
import LookupIndustryScope from '@/shared/HelpersComponents/LookupIndustryScope.vue'
import { useLookupIndustryScope } from '@/composables/useLookupIndustryScope'

import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import ExcelRowsImport, {
  type ExcelImportRow,
} from '@/shared/HelpersComponents/ExcelRowsImport.vue'
import PermissionBuilder from '@/shared/HelpersComponents/PermissionBuilder.vue'
import DataFailed from '@/shared/DataStatues/DataFailed.vue'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
import AddTraningTopicController from '../controllers/addTraningTopicController'
import AddTraningTopicExcelParams from '../../Core/params/addTraningTopicExcelParams'

const props = defineProps<{ initialFile?: File | null }>()
const emit = defineEmits<{ uploaded: []; busy: [value: boolean] }>()
const { t } = useI18n()
const router = useRouter()
const busy = ref(false)
const error = ref('')
const columns = computed(() => [{ key: 'title', label: t('title'), required: true }])
const createPermissions = [
  PermissionsEnum.ADMIN,
  PermissionsEnum.TRANING_TOPIC_ALL,
  PermissionsEnum.TRANING_TOPIC_CREATE,
  PermissionsEnum.ORG_TRANING_TOPIC_ALL,
  PermissionsEnum.ORG_TRANING_TOPIC_CREATE,
]
const submit = async (rows: ExcelImportRow[]) => {
  if (!validateIndustryScope()) return
  if (busy.value) return
  busy.value = true
  emit('busy', true)
  error.value = ''
  try {
    const controller = AddTraningTopicController.getInstance()
    await controller.addTraningTopic(
      new AddTraningTopicExcelParams({ data: rows.map((row) => ({ title: row.title.trim() })) }, getIndustryScope()),
      router,
      true,
    )
    if (controller.isDataSuccess()) emit('uploaded')
    else error.value = controller.state.value.error?.title || t('error_occurred')
  } catch {
    error.value = t('error_occurred')
  } finally {
    busy.value = false
    emit('busy', false)
  }
}

const { industryScope, getIndustryScope, validateIndustryScope } = useLookupIndustryScope()
</script>
<template>
  <LookupIndustryScope v-model="industryScope" />
  <PermissionBuilder :code="createPermissions">
    <ExcelRowsImport
      :initial-file="props.initialFile"
      :columns="columns"
      :busy="busy"
      :error="error"
      @submit="submit"
    />
    <template #notPermitted
      ><DataFailed :add-text="$t('permission_denied')" description="" link=""
    /></template>
  </PermissionBuilder>
</template>
