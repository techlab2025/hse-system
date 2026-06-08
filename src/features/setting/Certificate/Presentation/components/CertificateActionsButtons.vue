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
import Dialog from 'primevue/dialog'
import IndexCertificateController from '../controllers/indexCertificateController'
import IndexCertificateParams from '../../Core/params/indexCertificateParams'
import UploadCertificateExeclSheet from './UploadCertificateExeclSheet.vue'

const { t } = useI18n()
const { user } = useUserStore()

const indexCertificateController = IndexCertificateController.getInstance()
const state = ref(indexCertificateController.state.value)

const fetchCertificate = async () => {
  const params = new IndexCertificateParams('', 1, 10, 1)
  await indexCertificateController.getData(params)
}
onMounted(fetchCertificate)

watch(
  () => indexCertificateController.state.value,
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
    { title: 'NEBOSH', require_expired_date: 'Yes' },
    { title: 'OSHA', require_expired_date: 'Yes' },
  ]
  const worksheet = XLSX.utils.json_to_sheet(worksheetData)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Certificates')
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
  const blob = new Blob([excelBuffer], { type: 'application/octet-stream' })
  saveAs(blob, 'certificate_form.xlsx')
}

const actionList = () => [
  {
    text: t('upload_certificate_sheet'),
    icon: ActionsListAddIcon,
    action: () => fileInputRef.value?.click(),
    type: ActionItemsTypeEnum.Info,
    permission: [PermissionsEnum?.ORG_EMPLOYEE_CREATE, PermissionsEnum?.ADMIN],
  },
  {
    text: t('download_form_example'),
    icon: ExceIcon,
    action: () => DownloadExample(),
    type: ActionItemsTypeEnum.Success,
    permission: [PermissionsEnum.CERTIFICATE_FETCH, PermissionsEnum.ORGANIZATION_EMPLOYEE],
  },
]
</script>

<template>
  <div class="flex justify-end gap-2">
    <ActionsList
      :show-actions="true"
      :actionList="actionList()"
      :actionsNumber="2"
      buttonTitle="certificate_sheet"
    >
    </ActionsList>
  </div>

  <Dialog
    v-model:visible="showUploadDialog"
    modal
    :dismissable-mask="true"
    :header="$t('upload_certificate_sheet')"
    :style="{ width: '80vw', maxWidth: '900px' }"
  >
    <UploadCertificateExeclSheet
      :initial-file="pendingFile"
      @uploaded="
        showUploadDialog = false;
        pendingFile = null;
        fetchCertificate()
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
