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
import UploadExcelIcon from '@/shared/icons/UploadExcelIcon.vue'
import Dialog from 'primevue/dialog'
import IndexHerikalyController from '../controllers/indexHerikalyController'
import IndexHerikalyParams from '../../Core/params/indexHerikalyParams'
import UploadHierarachyExeclSheet from './UploadHierarachyExeclSheet.vue'

const { t } = useI18n()
const { user } = useUserStore()

const indexHerikalyController = IndexHerikalyController.getInstance()
const state = ref(indexHerikalyController.state.value)

const fetchHerikaly = async () => {
  const params = new IndexHerikalyParams('', 1, 10, 1, true, null)
  await indexHerikalyController.getData(params)
}
onMounted(fetchHerikaly)

watch(
  () => indexHerikalyController.state.value,
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
  const worksheetData = [{ title: 'Example Position' }, { title: 'Example Position 2' }]
  const worksheet = XLSX.utils.json_to_sheet(worksheetData)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Positions')
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
  const blob = new Blob([excelBuffer], { type: 'application/octet-stream' })
  saveAs(blob, 'position_form.xlsx')
}

const actionList = () => [

  {
    text: t('download_form_example'),
    icon: ExceIcon,
    action: () => DownloadExample(),
    type: ActionItemsTypeEnum.Success,
    permission: [PermissionsEnum?.ORGANIZATION_EMPLOYEE, PermissionsEnum?.HERIKALY_CREATE],
  },
  {
    text: t('import_position'),
    icon: UploadExcelIcon,
    action: () => fileInputRef.value?.click(),
    type: ActionItemsTypeEnum.Warning,
    permission: [PermissionsEnum?.ORGANIZATION_EMPLOYEE, PermissionsEnum?.HERIKALY_CREATE],
  },
]
</script>

<template>
  <div class="flex justify-end gap-2">
    <ActionsList
      :show-actions="true"
      :actionList="actionList()"
      :actionsNumber="2"
      buttonTitle="position_sheet"
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
    <UploadHierarachyExeclSheet
      :initial-file="pendingFile"
      @uploaded="
        showUploadDialog = false;
        pendingFile = null;
        fetchHerikaly()
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
