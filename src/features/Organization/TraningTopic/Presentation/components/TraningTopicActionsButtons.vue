<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import Dialog from 'primevue/dialog'
import ActionsList from '@/shared/HelpersComponents/ActionsList.vue'
import ExportPdf from '@/shared/HelpersComponents/ExportPdf.vue'
import ExceIcon from '@/shared/icons/ExceIcon.vue'
import ActionsListAddIcon from '@/shared/icons/ActionsListAddIcon.vue'
import UploadExcelIcon from '@/shared/icons/UploadExcelIcon.vue'
import { ActionItemsTypeEnum } from '@/base/core/params/actions_items_type_enum'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
import { useUserStore } from '@/stores/user'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'
import UploadTraningTopicExcelSheet from './UploadTraningTopicExcelSheet.vue'

const emit = defineEmits<{
  export: []
  downloadTemplate: []
  uploaded: []
}>()

const { t } = useI18n()
const { user } = useUserStore()
const showUploadDialog = ref(false)
const pendingFile = ref<File | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)
const busy = ref(false)
const onFileSelected = (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  pendingFile.value = file
  showUploadDialog.value = true
  input.value = ''
}
watch(showUploadDialog, (visible) => {
  if (!visible) pendingFile.value = null
})

const fetchPermissions = [
  PermissionsEnum.ADMIN,
  PermissionsEnum.TRANING_TOPIC_ALL,
  PermissionsEnum.TRANING_TOPIC_FETCH,
  PermissionsEnum.ORG_TRANING_TOPIC_ALL,
  PermissionsEnum.ORG_TRANING_TOPIC_FETCH,
]

const createPermissions = [
  PermissionsEnum.ADMIN,
  PermissionsEnum.TRANING_TOPIC_ALL,
  PermissionsEnum.TRANING_TOPIC_CREATE,
  PermissionsEnum.ORG_TRANING_TOPIC_ALL,
  PermissionsEnum.ORG_TRANING_TOPIC_CREATE,
]

const actionList = () => [
  {
    text: t('export_to_excel'),
    icon: ExceIcon,
    action: () => emit('export'),
    type: ActionItemsTypeEnum.Success,
    permission: fetchPermissions,
  },
  {
    text: t('add_traning_topic'),
    link: `/${user?.type === OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'}/traning-topics/add`,
    icon: ActionsListAddIcon,
    primary: true,
    type: ActionItemsTypeEnum.Info,
    permission: createPermissions,
  },
  {
    text: t('upload_complated_template'),
    action: () => fileInputRef.value?.click(),
    icon: UploadExcelIcon,
    type: ActionItemsTypeEnum.Warning,
    permission: createPermissions,
  },
  {
    text: t('download_excel_template'),
    icon: ExceIcon,
    action: () => emit('downloadTemplate'),
    type: ActionItemsTypeEnum.Success,
    permission: createPermissions,
  },
]

const handleUploaded = () => {
  showUploadDialog.value = false
  emit('uploaded')
}
</script>

<template>
  <ActionsList
    feature-name="action_feature_traning_topics"
    :show-actions="true"
    :action-list="actionList()"
    :actions-number="5"
  >
    <template #custom>
      <slot name="custom"><ExportPdf :is-drop-list="true" /></slot>
    </template>
  </ActionsList>

  <Dialog
    v-model:visible="showUploadDialog"
    modal
    :header="$t('import_traning_topics')"
    :dismissable-mask="!busy"
    :closable="!busy"
    :close-on-escape="!busy"
    :style="{ width: '80vw', maxWidth: '900px' }"
  >
    <UploadTraningTopicExcelSheet
      v-if="showUploadDialog"
      :initial-file="pendingFile"
      @uploaded="handleUploaded"
      @busy="busy = $event"
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
