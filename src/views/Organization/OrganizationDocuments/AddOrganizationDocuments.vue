<script setup lang="ts">
import PermissionBuilder from '@/shared/HelpersComponents/PermissionBuilder.vue'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
import AddOrganizationDocuments from '@/features/setting/OrganizationDocuments/Presentation/components/AddOrganizationDocuments.vue'
</script>

<template>
  <PermissionBuilder
    :code="[
      PermissionsEnum.ORGANIZATION_DOCUMENTS_ALL,
      PermissionsEnum.ORGANIZATION_DOCUMENTS_CREATE,
    ]"
  >
    <AddOrganizationDocuments />
  </PermissionBuilder>
</template>
