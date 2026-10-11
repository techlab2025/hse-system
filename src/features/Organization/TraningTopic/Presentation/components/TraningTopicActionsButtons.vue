<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Dialog from 'primevue/dialog'
import ActionsList from '@/shared/HelpersComponents/ActionsList.vue'
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

const fetchPermissions = [
  PermissionsEnum.ADMIN,
  PermissionsEnum.ORGANIZATION_EMPLOYEE,
  PermissionsEnum.TRANING_TOPIC_ALL,
  PermissionsEnum.TRANING_TOPIC_FETCH,
  PermissionsEnum.ORG_TRANING_TOPIC_ALL,
  PermissionsEnum.ORG_TRANING_TOPIC_FETCH,
]

const createPermissions = [
  PermissionsEnum.ADMIN,
  PermissionsEnum.ORGANIZATION_EMPLOYEE,
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
    action: () => (showUploadDialog.value = true),
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
    :actionList="actionList()"
    :actionsNumber="4"
  >
    <template #custom>
      <slot name="custom" />
    </template>
  </ActionsList>

  <Dialog v-model:visible="showUploadDialog" modal :header="$t('import_traning_topics')">
    <UploadTraningTopicExcelSheet @uploaded="handleUploaded" />
  </Dialog>
</template>
