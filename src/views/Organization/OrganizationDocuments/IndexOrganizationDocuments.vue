<script setup lang="ts">
import PermissionBuilder from '@/shared/HelpersComponents/PermissionBuilder.vue'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
import IndexOrganizationDocuments from '@/features/setting/OrganizationDocuments/Presentation/components/IndexOrganizationDocuments.vue'
</script>

<template>
  <PermissionBuilder
    :code="[
      PermissionsEnum.ORGANIZATION_DOCUMENTS_ALL,
      PermissionsEnum.ORGANIZATION_DOCUMENTS_FETCH,
    ]"
  >
    <IndexOrganizationDocuments />
  </PermissionBuilder>
</template>
