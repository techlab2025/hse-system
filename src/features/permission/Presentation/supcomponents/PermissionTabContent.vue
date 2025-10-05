<script setup lang="ts">
import { adminPermissions, type PermissionItem } from '@/constant/adminPremission'
import { OrgPermissions } from '@/constant/organizationPremission'

const permissionRoots: PermissionItem[] = [adminPermissions, OrgPermissions]

const selectAll = (event: Event) => {
  const isChecked = (event.target as HTMLInputElement).checked
  const checkboxes = document.querySelectorAll(
    '.card-body input[type="checkbox"]',
  ) as NodeListOf<HTMLInputElement>
  checkboxes.forEach((checkbox) => {
    checkbox.checked = isChecked
  })
}

const webSitePremission = permissionRoots.find((item) => item.label === 'Website')

console.log(webSitePremission)
</script>

<template>
  <div class="premission-cards">
    <div class="cards" v-for="item in permissionRoots" :key="item.code">
      <div class="header">{{ item.label }}</div>
      <div class="tab-content">
        <div class="card">
          <div class="card-header">
            <h5>X-Card</h5>

            <label class="select_all" for="selectAll">
              <input type="checkbox" id="selectAll" @change="selectAll" />
              <span class="checkmark"></span>
              <span> {{ $t('select_all') }}</span>
            </label>
          </div>
          <hr />
          <div class="card-body">
            <label :for="index" v-for="(item, index) in 8" :key="item">
              <input type="checkbox" :name="index" :id="index" />
              <span> add </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
