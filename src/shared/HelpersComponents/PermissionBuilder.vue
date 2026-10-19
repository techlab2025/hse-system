<script lang="ts" setup>
import PermissionHandler from '@/base/Presentation/utils/permission_handler'
import type { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
import { computed } from 'vue'
import { canAll } from '@/features/permission/Presentation/Helpers/organization_permission'

// import PermissionHandler from "@/base/Presentation/utils/permission_handler";
// import { PermissionsEnum } from "@/features/users/employee/Core/Enum/permission_enum";

const props = defineProps<{ code: readonly PermissionsEnum[]; mode?: 'any' | 'all' }>()
const allowed = computed(() =>
  props.mode === 'all' ? canAll(props.code) : PermissionHandler.Instance.handle(props.code),
)
</script>

<template>
  <slot v-if="allowed" />
  <slot v-else name="notPermitted" />
</template>

<style scoped></style>
