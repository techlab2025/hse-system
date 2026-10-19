<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import type PermissionDetailsModel from '../../Data/models/PermissionDetailsModel'
import type { AssignedPermission } from '../../Data/models/PermissionDetailsModel'
import PermissionTabContent from '../supcomponents/PermissionTabContent.vue'
import AddPermissionParams from '../../Core/params/addPermissionParams'
import IndexPermissionParams from '../../Core/params/indexPermissionParams'
import { IndexPermissionApiService } from '../../Data/apiServices/indexPermissionApiService'
import { getOrganizationType } from '../Helpers/organization_type'
import {
  canAny,
  isKnownPermission,
  validatePermissionChanges,
} from '../Helpers/organization_permission'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'

const props = defineProps<{ data?: PermissionDetailsModel }>()
const emit = defineEmits<{ 'update:data': [params: AddPermissionParams] }>()
const route = useRoute()
const assignments = ref<AssignedPermission[]>([])
const availablePermissions = ref<string[]>()
const catalogLoading = ref(false)
const catalogUnavailable = ref(false)
const type = getOrganizationType(route.path.split('/')[1] ?? '')
function updateData(permissions: string[]) {
  const original = assignments.value.map((item) => item.permission)
  if (!validatePermissionChanges(original, permissions, availablePermissions.value)) return
  emit(
    'update:data',
    new AddPermissionParams(type, Number(route.params.id), [...new Set(permissions)]),
  )
}
watch(
  () => props.data,
  (data) => {
    assignments.value = data?.permission ? data.permission.map((item) => ({ ...item })) : []
    updateData(assignments.value.map((item) => item.permission))
  },
  { immediate: true, deep: true },
)
onMounted(async () => {
  if (!canAny([PermissionsEnum.PERMISSION_FETCH])) return
  catalogLoading.value = true
  try {
    const response = await IndexPermissionApiService.getInstance().applyService(
      new IndexPermissionParams('', 1, 10000, 0),
    )
    const data: unknown = response.data?.data?.data ?? response.data?.data
    if (!Array.isArray(data)) throw new Error('Unavailable permission catalogue')
    const codes = data.flatMap((item: unknown) =>
      typeof item === 'string'
        ? [item]
        : item &&
            typeof item === 'object' &&
            'permission' in item &&
            typeof item.permission === 'string'
          ? [item.permission]
          : item && typeof item === 'object' && 'code' in item && typeof item.code === 'string'
            ? [item.code]
            : [],
    )
    if (!codes.length || !codes.every(isKnownPermission))
      throw new Error('Unrecognized permission catalogue')
    availablePermissions.value = [...new Set(codes)]
  } catch {
    catalogUnavailable.value = true
  } finally {
    catalogLoading.value = false
  }
})
</script>

<template>
  <div class="permission">
    <p v-if="catalogLoading" role="status">{{ $t('loading') }}</p>
    <p v-if="catalogUnavailable" role="status">{{ $t('authorization.catalogUnavailable') }}</p>
    <PermissionTabContent
      :permissions="assignments"
      :available-permissions="availablePermissions"
      @update:permissions="updateData"
    />
  </div>
</template>
