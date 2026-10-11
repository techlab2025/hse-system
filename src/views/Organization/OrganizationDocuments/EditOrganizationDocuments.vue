<script setup lang="ts">
import PermissionBuilder from '@/shared/HelpersComponents/PermissionBuilder.vue'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
import EditOrganizationDocuments from '@/features/setting/OrganizationDocuments/Presentation/components/EditOrganizationDocuments.vue'
</script>

<template>
  <PermissionBuilder
    :code="[
      PermissionsEnum.ORGANIZATION_DOCUMENTS_ALL,
      PermissionsEnum.ORGANIZATION_DOCUMENTS_UPDATE,
    ]"
  >
    <EditOrganizationDocuments />
  </PermissionBuilder>
</template>
