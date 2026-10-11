<script setup lang="ts">
import PermissionBuilder from '@/shared/HelpersComponents/PermissionBuilder.vue'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
import IndexMyInternalAudit from '@/features/Organization/InternalAudit/Presentation/components/my/IndexMyInternalAudit.vue'
</script>

<template>
  <PermissionBuilder
    :code="[
      PermissionsEnum.ADMIN,
      PermissionsEnum.MY_INTERNAL_AUDIT_ALL,
      PermissionsEnum.MY_INTERNAL_AUDIT_FETCH,
    ]"
  >
    <IndexMyInternalAudit />
  </PermissionBuilder>
</template>
