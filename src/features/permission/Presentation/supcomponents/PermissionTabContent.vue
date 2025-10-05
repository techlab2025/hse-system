<script setup lang="ts">
import { ref } from 'vue'
import { adminPermissions, type PermissionItem } from '@/constant/adminPremission'

const emit = defineEmits<{
  (e: 'update:permissions', value: string[]): void
}>()

const permissionRoots = ref<PermissionItem>(adminPermissions)

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

const toggleSelectAll = (group: any, event: Event) => {
  const isChecked = (event.target as HTMLInputElement).checked

  group.permissions.forEach((perm: any) => {
    perm.checked = isChecked
    perm.permissions?.forEach((sub: any) => (sub.checked = isChecked))
  })

  emit('update:permissions', getSelectedPermissions())
}

const togglePermission = (perm: any, event: Event) => {
  perm.checked = (event.target as HTMLInputElement).checked
  emit('update:permissions', getSelectedPermissions())
}

// console.log(permissionRoots.value)
</script>

<template>
  <div class="premission-cards">
    <div class="cards" v-for="item in permissionRoots.permissions" :key="item.code">
      <div class="header">
        <span>{{ item.label }}</span>

        <label class="select_all">
          <input type="checkbox" @change="toggleSelectAll(item, $event)" />
          <span class="checkmark"></span>
          <span>{{ $t('select_all') }}</span>
        </label>
      </div>

      <div class="tab-content">
        <div class="card" v-for="prem in item.permissions" :key="prem.code">
          <div class="card-header">
            <h5>{{ prem.label }}</h5>

            <label class="select_all">
              <input type="checkbox" @change="toggleSelectAll(prem, $event)" />
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
