<script lang="ts" setup>
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import { onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/stores/user'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
import { ActionItemsTypeEnum } from '@/base/core/params/actions_items_type_enum'
import { HazardTypeParentEnum } from '../../Core/Enums/HazardTypeEnum'
import ActionsList from '@/shared/HelpersComponents/ActionsList.vue'
import ExportPdf from '@/shared/HelpersComponents/ExportPdf.vue'
import ExceIcon from '@/shared/icons/ExceIcon.vue'
import ActionsListAddIcon from '@/shared/icons/ActionsListAddIcon.vue'
import UploadExcelIcon from '@/shared/icons/UploadExcelIcon.vue'
import Dialog from 'primevue/dialog'
import IndexHazardTypeController from '../controllers/indexHazardTypeController'
import IndexHazardTypeParams from '../../Core/params/indexHazardTypeParams'
import UploadHazardTypeExeclSheet from './UploadHazardTypeExeclSheet.vue'

const { t } = useI18n()
const { user } = useUserStore()

const indexHazardTypeController = IndexHazardTypeController.getInstance()
const state = ref(indexHazardTypeController.state.value)

const fetchHazardType = async () => {
  const params = new IndexHazardTypeParams('', 1, 10, 1, undefined, HazardTypeParentEnum.Parent)
  await indexHazardTypeController.getData(params)
}
onMounted(fetchHazardType)

watch(
  () => indexHazardTypeController.state.value,
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
  saveAs(data, 'Hazard-type.xlsx')
}

const DownloadExample = () => {
  const worksheetData = [{ title: 'Example Hazard Type' }, { title: 'Example Hazard Type 2' }]
  const worksheet = XLSX.utils.json_to_sheet(worksheetData)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'HazardTypes')
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
  const blob = new Blob([excelBuffer], { type: 'application/octet-stream' })
  saveAs(blob, 'hazard_type_form.xlsx')
}

const actionList = () => [
  {
    text: t('export_excel'),
    icon: ExceIcon,
    action: () => exportExcel(),
    type: ActionItemsTypeEnum.Success,
    permission: [
      PermissionsEnum.HAZARD_TYPE_CREATE,
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum.HAZARD_TYPE_ALL,
    ],
  },
  {
    text: t('Add_HazardType'),
    link: `/${user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'}/hazard-type/add`,
    icon: ActionsListAddIcon,
    type: ActionItemsTypeEnum.Info,
    permission: [PermissionsEnum?.ORGANIZATION_EMPLOYEE, PermissionsEnum?.HAZARD_TYPE_CREATE],
  },
  {
    text: t('import_hazard_type'),
    type: ActionItemsTypeEnum.Warning,
    action: () => fileInputRef.value?.click(),
    icon: UploadExcelIcon,
    permission: [PermissionsEnum?.ORGANIZATION_EMPLOYEE, PermissionsEnum?.HAZARD_TYPE_CREATE],
  },
  {
    text: t('download_form_example'),
    icon: ExceIcon,
    action: () => DownloadExample(),
    type: ActionItemsTypeEnum.Success,
    permission: [PermissionsEnum?.ORGANIZATION_EMPLOYEE, PermissionsEnum?.HAZARD_TYPE_CREATE],
  },
]
</script>

<template>
  <div class="flex justify-end gap-2">
    <ActionsList :show-actions="true" :actionList="actionList()" :actionsNumber="4">
      <template #custom>
        <ExportPdf :isDropList="true" />
      </template>
    </ActionsList>
  </div>

  <Dialog
    v-model:visible="showUploadDialog"
    modal
    :dismissable-mask="true"
    :header="$t('import_hazard_type')"
    :style="{ width: '80vw', maxWidth: '900px' }"
  >
    <UploadHazardTypeExeclSheet
      :initial-file="pendingFile"
      @uploaded="
        showUploadDialog = false;
        pendingFile = null;
        fetchHazardType()
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
