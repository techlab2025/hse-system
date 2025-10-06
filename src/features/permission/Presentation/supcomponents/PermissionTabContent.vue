<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { adminPermissions, type PermissionItem } from '@/constant/adminPremission'
import type PermissionDetailsModel from '../../Data/models/PermissionDetailsModel'
import { getOrganizationType } from '../Helpers/organization_type'
import { useRoute } from 'vue-router'
import { getOrganizationPermissionLabel } from '../Helpers/organization_permission'

const emit = defineEmits<{
  (e: 'update:permissions', value: string[]): void
}>()

const route = useRoute()

const baseSegment = `${route.path.split('/')[1]}`

const type = getOrganizationPermissionLabel(baseSegment)

const permissionRoots = ref<PermissionItem>(type)

const { permissions } = defineProps<{
  permissions: PermissionDetailsModel[]
}>()

// ✅ Mark permissions as checked based on backend data
const applyCheckedPermissions = () => {
  if (!permissions || !Array.isArray(permissions)) return

  const permissionCodes = permissions.map((p) => p.permission)

  permissionRoots.value.permissions.forEach((module: any) => {
    module.permissions.forEach((group: any) => {
      group.permissions?.forEach((perm: any) => {
        perm.checked = permissionCodes.includes(perm.code)
      })
    })
  })

  emit('update:permissions', getSelectedPermissions())
}

watch(
  () => permissions,
  () => applyCheckedPermissions(),
  { deep: true },
)

// ✅ Return all selected codes
const getSelectedPermissions = (): string[] => {
  const selected: string[] = []
  permissionRoots.value.permissions.forEach((module: any) => {
    module.permissions.forEach((group: any) => {
      group.permissions?.forEach((perm: any) => {
        if (perm.checked) selected.push(perm.code)
      })
    })
  })
  return selected
}

// ✅ Helpers to detect “select all” states
const isGroupFullyChecked = (group: any) => group.permissions?.every((perm: any) => perm.checked)

const isModuleFullyChecked = (module: any) =>
  module.permissions?.every((group: any) => group.permissions?.every((perm: any) => perm.checked))

// ✅ Event handlers
const toggleGroupSelectAll = (group: any, event: Event) => {
  const isChecked = (event.target as HTMLInputElement).checked
  group.permissions.forEach((perm: any) => {
    perm.checked = isChecked
  })
  emit('update:permissions', getSelectedPermissions())
}

const toggleModuleSelectAll = (module: any, event: Event) => {
  const isChecked = (event.target as HTMLInputElement).checked
  module.permissions.forEach((group: any) => {
    group.permissions?.forEach((perm: any) => (perm.checked = isChecked))
  })
  emit('update:permissions', getSelectedPermissions())
}

const togglePermission = (perm: any, event: Event) => {
  perm.checked = (event.target as HTMLInputElement).checked
  emit('update:permissions', getSelectedPermissions())
}

onMounted(() => {
  applyCheckedPermissions()
})
</script>

<template>
  <div class="premission-cards">
    <div class="cards" v-for="item in permissionRoots.permissions" :key="item.code">
      <div class="header">
        <!-- ✅ Module Select All auto-sync -->
        <label class="select_all">
          <input
            type="checkbox"
            :checked="isModuleFullyChecked(item)"
            @change="toggleModuleSelectAll(item, $event)"
          />
          <span class="checkmark"></span>
          <span>{{ item.label }}</span>
        </label>
      </div>

      <div class="tab-content">
        <div class="card" v-for="prem in item.permissions" :key="prem.code">
          <div class="card-header">
            <h5>{{ prem.label }}</h5>

            <!-- ✅ Group Select All auto-sync -->
            <label class="select_all">
              <input
                type="checkbox"
                :checked="isGroupFullyChecked(prem)"
                @change="toggleGroupSelectAll(prem, $event)"
              />
              <span class="checkmark"></span>
              <span>{{ $t('select_all') }}</span>
            </label>
          </div>

          <hr />

          <div class="card-body">
            <label
              v-for="premAction in prem.permissions"
              :key="premAction.code"
              class="permission-item"
            >
              <input
                type="checkbox"
                v-model="premAction.checked"
                @change="togglePermission(premAction, $event)"
              />
              <span>{{ premAction.label }}</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
