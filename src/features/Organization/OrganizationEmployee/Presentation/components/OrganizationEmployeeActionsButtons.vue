<script lang="ts" setup>
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import { onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/stores/user'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
import { ActionItemsTypeEnum } from '@/base/core/params/actions_items_type_enum'
import ActionsList from '@/shared/HelpersComponents/ActionsList.vue'
import ExportPdf from '@/shared/HelpersComponents/ExportPdf.vue'
import ExceIcon from '@/shared/icons/ExceIcon.vue'
import ActionsListAddIcon from '@/shared/icons/ActionsListAddIcon.vue'
import UploadExcelIcon from '@/shared/icons/UploadExcelIcon.vue'
import Dialog from 'primevue/dialog'
import IndexOrganizatoinEmployeeController from '../controllers/indexOrganizatoinEmployeeController'
import IndexOrganizatoinEmployeeParams from '../../Core/params/indexOrganizatoinEmployeeParams'
import UploadOrganizationEmployee from './UploadOrganizationEmployee.vue'

const { t } = useI18n()
const { user } = useUserStore()

const indexOrganizatoinEmployeeController = IndexOrganizatoinEmployeeController.getInstance()
const state = ref(indexOrganizatoinEmployeeController.state.value)

const fetchOrganizatoinEmployee = async () => {
  const params = new IndexOrganizatoinEmployeeParams('', 1, 10, 1, null, null, null, null, null, false)
  await indexOrganizatoinEmployeeController.getData(params)
}
onMounted(fetchOrganizatoinEmployee)

watch(
  () => indexOrganizatoinEmployeeController.state.value,
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
      name: it.name || 'N/A',
      email: it.email || null,
      phone: it.phone || null,
      password: '',
    }
  })
  const worksheet = XLSX.utils.json_to_sheet(worksheetData)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Invoices')
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
  const data = new Blob([excelBuffer], { type: 'application/octet-stream' })
  saveAs(data, 'Employees.xlsx')
}

const DownloadExample = () => {
  const worksheetData = [
    {
      name: 'Example Employee',
      email: 'employpee@example.com',
      phone: '01005500450',
      password: '123123123',
    },
    {
      name: 'Example Employee 2',
      email: 'employepe2@example.com',
      phone: '010066056401',
      password: '123123123',
    },
  ]
  const worksheet = XLSX.utils.json_to_sheet(worksheetData)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Employees')
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
  const blob = new Blob([excelBuffer], { type: 'application/octet-stream' })
  saveAs(blob, 'employee_form.xlsx')
}

const actionList = () => [

  {
    text: t('upload_excel'),
    type: ActionItemsTypeEnum.Warning,
    action: () => fileInputRef.value?.click(),
    icon: UploadExcelIcon,
    permission: [PermissionsEnum?.ORG_EMPLOYEE_CREATE, PermissionsEnum?.ADMIN],
  },
  {
    text: t('download_form_example'),
    icon: ExceIcon,
    action: () => DownloadExample(),
    type: ActionItemsTypeEnum.Success,
    permission: [PermissionsEnum?.ORG_EMPLOYEE_CREATE, PermissionsEnum?.ADMIN],
  },
]
</script>

<template>
  <div class="flex justify-end gap-2">
    <ActionsList :show-actions="true" :actionList="actionList()" :actionsNumber="2">

    </ActionsList>
  </div>

  <Dialog
    v-model:visible="showUploadDialog"
    modal
    :dismissable-mask="true"
    :header="$t('upload_excel')"
    :style="{ width: '80vw', maxWidth: '900px' }"
  >
    <UploadOrganizationEmployee
      :initial-file="pendingFile"
      @uploaded="
        showUploadDialog = false;
        pendingFile = null;
        fetchOrganizatoinEmployee()
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
