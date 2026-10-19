<script setup lang="ts">
import SharedPermissionBuilder from '@/shared/HelpersComponents/PermissionBuilder.vue'
import type { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'

defineProps<{ code: readonly PermissionsEnum[]; mode?: 'any' | 'all' }>()
</script>

<template>
  <SharedPermissionBuilder :code="code" :mode="mode">
    <slot />
    <template #notPermitted><slot name="notPermitted" /></template>
  </SharedPermissionBuilder>
</template>
