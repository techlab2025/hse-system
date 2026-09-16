<script lang="ts" setup>
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import { onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/stores/user'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
import { ActionItemsTypeEnum } from '@/base/core/params/actions_items_type_enum'
import ActionsList from '@/shared/HelpersComponents/ActionsList.vue'
import ExceIcon from '@/shared/icons/ExceIcon.vue'
import UploadExcelIcon from '@/shared/icons/UploadExcelIcon.vue'
import Dialog from 'primevue/dialog'

import IndexFactoryController from '../controllers/indexFactoryController.ts'
import IndexFactoryParams from '../../Core/params/indexFactoryParams.ts'
import UploaFactorExeclSheet from './UploaFactorExeclSheet.vue'

const { t } = useI18n()
const { user } = useUserStore()

const indexFactoryController = IndexFactoryController.getInstance()
const state = ref(indexFactoryController.state.value)

const fetchFactors = async () => {
  const params = new IndexFactoryParams('', 1, 10, 1, true)
  await indexFactoryController.getData(params)
}
onMounted(fetchFactors)

watch(
  () => indexFactoryController.state.value,
  (newState) => {
    if (newState) state.value = newState
  },
  { deep: true },
)

const showUploadDialog = ref(false)
const pendingFile = ref<File | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)

const onFileSelected = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  pendingFile.value = file
  showUploadDialog.value = true
  ;(e.target as HTMLInputElement).value = ''
}

const exportExcel = () => {
  if (!state.value.data || state.value.data.length === 0) {
    alert('No data available to export')
    return
  }
  const worksheetData = state.value.data.map((item: Record<string, unknown>) => {
    const it = item as any
    return {
      title: it.title || 'N/A',
    }
  })
  const worksheet = XLSX.utils.json_to_sheet(worksheetData)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Invoices')
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
  const data = new Blob([excelBuffer], { type: 'application/octet-stream' })
  saveAs(data, 'hierarchy.xlsx')
}

const DownloadExample = () => {
  const worksheetData = [{ title: 'Example Factor' }, { title: 'Example Factor 2' }]
  const worksheet = XLSX.utils.json_to_sheet(worksheetData)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Positions')
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
  const blob = new Blob([excelBuffer], { type: 'application/octet-stream' })
  saveAs(blob, 'factors_form.xlsx')
}

const actionList = () => [
  {
    text: t('download_excel_template'),
    icon: ExceIcon,
    action: () => DownloadExample(),
    type: ActionItemsTypeEnum.Success,
    permission: [PermissionsEnum?.ORGANIZATION_EMPLOYEE, PermissionsEnum?.FACTORY_ALL],
  },
  {
    text: t('upload_complated_template'),
    icon: UploadExcelIcon,
    action: () => fileInputRef.value?.click(),
    type: ActionItemsTypeEnum.Warning,
    permission: [PermissionsEnum?.ORGANIZATION_EMPLOYEE, PermissionsEnum?.FACTORY_ALL],
  },
]
</script>

<template>
  <div class="flex justify-end gap-2">
    <ActionsList
      feature-name="action_feature_positions"
      :show-actions="true"
      :actionList="actionList()"
      :actionsNumber="2"
    >
    </ActionsList>
  </div>

  <Dialog
    v-model:visible="showUploadDialog"
    modal
    :dismissable-mask="true"
    :header="$t('import_position')"
    :style="{ width: '80vw', maxWidth: '900px' }"
  >
    <UploaFactorExeclSheet
      :initial-file="pendingFile"
      @uploaded="
        showUploadDialog = false;
        pendingFile = null;
        fetchFactors();
      "
    />
  </Dialog>

  <input
    ref="fileInputRef"
    type="file"
    accept=".xls,.xlsx"
    style="display: none"
    @change="onFileSelected"
  />
</template>
