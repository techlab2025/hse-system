<script setup lang="ts">
import LookupIndustryScope from '@/shared/HelpersComponents/LookupIndustryScope.vue'
import { useLookupIndustryScope } from '@/composables/useLookupIndustryScope'

import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import ExcelRowsImport, {
  type ExcelImportRow,
} from '@/shared/HelpersComponents/ExcelRowsImport.vue'
import PermissionBuilder from '@/shared/HelpersComponents/PermissionBuilder.vue'
import UpdatedCustomInputSelect from '@/shared/FormInputs/UpdatedCustomInputSelect.vue'
import type TitleInterface from '@/base/Data/Models/title_interface'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
import IndexFactoryController from '@/features/setting/Factory/Presentation/controllers/indexFactoryController'
import IndexFactoryParams from '@/features/setting/Factory/Core/params/indexFactoryParams'
import ImportFactoryItemController from '../controllers/importFactoryItemController'

const props = defineProps<{ initialFile?: File | null }>()
const emit = defineEmits<{ uploaded: []; busy: [value: boolean] }>()
const { t } = useI18n()
const busy = ref(false)
const error = ref('')
const factor = ref<TitleInterface | null>(null)
const factoryController = IndexFactoryController.getInstance()
const factoryParams = new IndexFactoryParams('', 1, 100, 0)
const controller = new ImportFactoryItemController()
const columns = computed(() => [{ key: 'title', label: t('title'), required: true }])
const createPermissions = [
  PermissionsEnum.ADMIN,
  PermissionsEnum.FACTORY_ITEM_ALL,
  PermissionsEnum.FACTORY_ITEM_CREATE,
  PermissionsEnum.ORG_FACTORY_ITEM_ALL,
  PermissionsEnum.ORG_FACTORY_ITEM_CREATE,
]
const setFactor = (value: TitleInterface | TitleInterface[] | null) => {
  factor.value = Array.isArray(value) ? null : value
  error.value = ''
}
const submit = async (rows: ExcelImportRow[]) => {
  if (!validateIndustryScope()) return
  if (busy.value) return
  error.value = ''
  const factoryId = Number(factor.value?.id)
  if (!Number.isSafeInteger(factoryId) || factoryId <= 0) {
    error.value = t('factor_item_excel_select_factor')
    return
  }
  busy.value = true
  emit('busy', true)
  try {
    await controller.importRows(
      rows.map((row) => ({ title: row.title.trim(), factory_id: factoryId })),
      getIndustryScope(),
    )
    if (controller.isDataSuccess()) emit('uploaded')
    else error.value = controller.state.value.error?.title || t('error_occurred')
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
    >
      <template #before-preview>
        <div class="factor-item-import-factor" :inert="busy">
          <UpdatedCustomInputSelect
            :model-value="factor"
            :required="true"
            :controller="factoryController"
            :params="factoryParams"
            label="factor"
            id="factory-item-import-factor"
            :placeholder="t('factor_item_excel_select_factor')"
            :type="1"
            @update:model-value="setFactor"
          />
          <p class="factor-item-import-hint">{{ t('factor_item_excel_hint') }}</p>
        </div>
      </template>
    </ExcelRowsImport>
  </PermissionBuilder>
</template>
<style scoped>
.factor-item-import-factor {
  width: 100%;
}
.factor-item-import-hint {
  margin-top: 10px;
  color: var(--text-soft);
  font-size: 13px;
}
</style>
