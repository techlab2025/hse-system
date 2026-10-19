<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import type { PermissionItem } from '@/constant/adminPremission'
import {
  getOrganizationPermissionLabel,
  can,
  isKnownPermission,
} from '../Helpers/organization_permission'
import type { AssignedPermission } from '../../Data/models/PermissionDetailsModel'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'

const props = defineProps<{
  permissions: readonly AssignedPermission[]
  availablePermissions?: readonly string[]
}>()
const emit = defineEmits<{ 'update:permissions': [permissions: string[]] }>()
const route = useRoute()
const roots = getOrganizationPermissionLabel(route.path.split('/')[1] ?? '')
const query = ref('')
const selected = ref<string[]>([])
const permissionNames = Object.entries(PermissionsEnum)
const knownLabels = new Map(permissionNames.map(([name, code]) => [code as string, name]))
const leaves = (item: PermissionItem): PermissionItem[] =>
  item.permissions?.flatMap(leaves) ?? [item]
const selectedSet = computed(() => new Set(selected.value))
const groups = computed(() => {
  const seen = new Set<string>()
  const modules = (roots.permissions ?? []).map((module) => ({
    ...module,
    permissions: (module.permissions ?? [])
      .map((group) => ({
        ...group,
        permissions: (group.permissions ?? []).filter((item) => {
          if (!isKnownPermission(item.code) || seen.has(item.code)) return false
          seen.add(item.code)
          return (
            !props.availablePermissions?.length ||
            props.availablePermissions.includes(item.code) ||
            selectedSet.value.has(item.code)
          )
        }),
      }))
      .filter((group) => group.permissions.length),
  }))
  const additional = (props.availablePermissions ?? []).filter(
    (code) => isKnownPermission(code) && !seen.has(code),
  )
  if (additional.length)
    modules.push({
      key: PermissionsEnum.ORGANIZATION_EMPLOYEE,
      code: PermissionsEnum.ORGANIZATION_EMPLOYEE,
      label: 'Additional backend permissions',
      permissions: [
        {
          key: PermissionsEnum.ORGANIZATION_EMPLOYEE,
          code: PermissionsEnum.ORGANIZATION_EMPLOYEE,
          label: 'Backend catalogue',
          permissions: additional
            .filter(isKnownPermission)
            .map((code) => ({
              key: code,
              code,
              label: knownLabels.get(code)?.replace(/_/g, ' ') ?? code,
            })),
        },
      ],
    })
  return modules
})
const visibleGroups = computed(() => {
  const term = query.value.trim().toLocaleLowerCase()
  return groups.value
    .map((module) => ({
      ...module,
      permissions: module.permissions.filter(
        (group) =>
          !term ||
          `${module.label} ${group.label} ${group.permissions.map((item) => `${item.label} ${item.code}`).join(' ')}`
            .toLocaleLowerCase()
            .includes(term),
      ),
    }))
    .filter((module) => module.permissions.length)
})
const represented = computed(
  () => new Set(groups.value.flatMap(leaves).map((permission) => permission.code as string)),
)
const preserved = computed(() => selected.value.filter((code) => !represented.value.has(code)))
const writable = (permission: PermissionItem) => can(permission.code)
const groupSelected = (group: PermissionItem) =>
  leaves(group).every((permission) => selectedSet.value.has(permission.code))
const groupMixed = (group: PermissionItem) =>
  !groupSelected(group) &&
  leaves(group).some((permission) => selectedSet.value.has(permission.code))
const publish = () => emit('update:permissions', [...new Set(selected.value)])

watch(
  () => props.permissions,
  (assignments) => {
    selected.value = [
      ...new Set(
        assignments.map((item) => item.permission).filter((code) => typeof code === 'string'),
      ),
    ]
    publish()
  },
  { immediate: true, deep: true },
)

function toggle(permission: PermissionItem, checked: boolean) {
  if (!writable(permission)) return
  const next = new Set(selected.value)
  if (checked) next.add(permission.code)
  else {
    next.delete(permission.code)
    // Removing a granular grant must not leave the same feature's explicit All grant in force.
    const name = knownLabels.get(permission.code) ?? ''
    const family = name.replace(/_(FETCH|DETAILS|CREATE|UPDATE|DELETE|CRAETE|CAREATE)$/, '')
    const all = permissionNames.find(([key]) => key === `${family}_ALL`)?.[1]
    if (all) next.delete(all)
  }
  selected.value = [...next]
  publish()
}
function toggleGroup(group: PermissionItem, checked: boolean) {
  const next = new Set(selected.value)
  for (const item of leaves(group))
    if (writable(item)) {
      if (checked) next.add(item.code)
      else next.delete(item.code)
    }
  selected.value = [...next]
  publish()
}
</script>

<template>
  <section class="permission-editor">
    <div class="permission-toolbar">
      <label for="permission-search">{{ $t('authorization.searchPermissions') }}</label>
      <input
        id="permission-search"
        v-model="query"
        type="search"
        class="input"
        :placeholder="$t('authorization.searchPermissions')"
      />
      <p role="status">{{ $t('authorization.selectedCount', { count: selected.length }) }}</p>
    </div>
    <section
      v-for="module in visibleGroups"
      :key="`${module.code}-${module.label}`"
      class="permission-module"
    >
      <header class="permission-module-header">
        <h2>{{ module.label }}</h2>
        <label class="permission-check">
          <input
            type="checkbox"
            :disabled="!leaves(module).some(writable)"
            :checked="groupSelected(module)"
            :indeterminate="groupMixed(module)"
            @change="toggleGroup(module, ($event.target as HTMLInputElement).checked)"
          />
          {{ $t('select_all') }}
        </label>
      </header>
      <div class="permission-group-grid">
        <article v-for="group in module.permissions" :key="group.code" class="permission-group">
          <header>
            <h3>{{ group.label }}</h3>
            <label class="permission-check">
              <input
                type="checkbox"
                :disabled="!leaves(group).some(writable)"
                :checked="groupSelected(group)"
                :indeterminate="groupMixed(group)"
                @change="toggleGroup(group, ($event.target as HTMLInputElement).checked)"
              />
              {{ $t('select_all') }}
            </label>
          </header>
          <label
            v-for="permission in group.permissions"
            :key="permission.code"
            class="permission-item permission-check"
          >
            <input
              type="checkbox"
              :data-permission="permission.code"
              :checked="selectedSet.has(permission.code)"
              :disabled="!writable(permission)"
              @change="toggle(permission, ($event.target as HTMLInputElement).checked)"
            />
            <span>{{
              permission.label === 'Table' || permission.label === 'Fetch'
                ? $t('authorization.viewList')
                : permission.label
            }}</span>
          </label>
        </article>
      </div>
    </section>
    <p v-if="!visibleGroups.length" role="status">
      {{ $t('authorization.noMatchingPermissions') }}
    </p>
    <p v-if="preserved.length" class="permission-preserved" role="note">
      {{ $t('authorization.preservedCount', { count: preserved.length }) }}
    </p>
  </section>
</template>

<style scoped>
.permission-editor {
  display: grid;
  gap: 24px;
}
.permission-toolbar {
  display: grid;
  gap: 10px;
  padding: 20px;
  border: 1px solid var(--main-border);
  border-radius: 16px;
  background: var(--surface-1);
}
.permission-toolbar input {
  width: 100%;
}
.permission-module-header,
.permission-group header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  margin-block-end: 16px;
}
.permission-module h2 {
  font-size: 20px;
  font-weight: 700;
}
.permission-group-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 260px), 1fr));
  gap: 16px;
}
.permission-group {
  padding: 20px;
  border: 1px solid var(--main-border);
  border-radius: 16px;
  background: var(--surface-1);
}
.permission-group h3 {
  font-weight: 700;
  color: var(--text-strong);
}
.permission-check {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 36px;
}
.permission-check input {
  flex: none;
  width: 18px;
  height: 18px;
  accent-color: var(--PrimaryColor);
}
.permission-item:has(input:disabled) {
  opacity: 0.65;
}
.permission-preserved {
  color: var(--text-soft);
}
</style>
