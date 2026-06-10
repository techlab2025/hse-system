<script lang="ts" setup>
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import { onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/stores/user'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
import { ActionItemsTypeEnum } from '@/base/core/params/actions_items_type_enum'
import ActionsList from '@/shared/HelpersComponents/ActionsList.vue'
import ExportPdf from '@/shared/HelpersComponents/ExportPdf.vue'
import ExceIcon from '@/shared/icons/ExceIcon.vue'
import ActionsListAddIcon from '@/shared/icons/ActionsListAddIcon.vue'
import UploadExcelIcon from '@/shared/icons/UploadExcelIcon.vue'
import Dialog from 'primevue/dialog'
import IndexEquipmentController from '../controllers/indexEquipmentController'
import IndexEquipmentParams from '../../Core/params/indexEquipmentParams'
import UploadEquipmentExeclSheet from './UploadEquipmentExeclSheet.vue'

const { t } = useI18n()
const { user } = useUserStore()

const indexEquipmentController = IndexEquipmentController.getInstance()
const state = ref(indexEquipmentController.state.value)

const fetchEquipment = async () => {
  const params = new IndexEquipmentParams('', 1, 10, 1)
  await indexEquipmentController.getData(params)
}
onMounted(fetchEquipment)

watch(
  () => indexEquipmentController.state.value,
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

const DownloadExample = () => {
  const worksheetData = [
    {
      'Equipment name': 'Example Equipment',
      'Certificate Expiry date': '2026-12-31',
      'License plate number': '1234 ABC',
      'Equipment image': '*',
      'Certificate image': '*',
      'Rent Start date': '2026-06-01',
      'Rent End date': '2026-06-30',
      'Rent Period type': '3',
      'Rent Period': '1',
      'Status': '1',
    }
  ]
  const worksheet = XLSX.utils.json_to_sheet(worksheetData)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Equipment')
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
  const blob = new Blob([excelBuffer], { type: 'application/octet-stream' })
  saveAs(blob, 'EquipmentForm.xlsx')
}

const actionList = () => [
  {
    text: t('import_equipment'),
    type: ActionItemsTypeEnum.Warning,
    action: () => fileInputRef.value?.click(),
    icon: UploadExcelIcon,
    permission: [
      PermissionsEnum?.ORGANIZATION_EMPLOYEE,
      PermissionsEnum?.EQUIPMENT_CREATE,
      PermissionsEnum?.ORG_EQUIPMENT_CREATE,
    ],
  },
  {
    text: t('download_form_example'),
    icon: ExceIcon,
    action: () => DownloadExample(),
    type: ActionItemsTypeEnum.Success,
    permission: [
      PermissionsEnum?.ORGANIZATION_EMPLOYEE,
      PermissionsEnum?.EQUIPMENT_CREATE,
      PermissionsEnum?.ORG_EQUIPMENT_CREATE,
    ],
  },
]
</script>

<template>
  <div class="flex justify-end gap-2">
    <ActionsList :show-actions="true" :actionList="actionList()" :actionsNumber="2" />
  </div>

  <Dialog
    v-model:visible="showUploadDialog"
    modal
    :dismissable-mask="true"
    :header="$t('import_equipment')"
    :style="{ width: '80vw', maxWidth: '900px' }"
  >
    <UploadEquipmentExeclSheet
      :initial-file="pendingFile"
      @uploaded="
        showUploadDialog = false;
        pendingFile = null;
        fetchEquipment()
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
