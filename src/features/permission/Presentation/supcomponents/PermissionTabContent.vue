<script setup lang="ts">
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'
import AdminPermission from '@/shared/icons/AdminPermission.vue'
import OrganizationPermission from '@/shared/icons/OrganizationPermission.vue'
import { useUserStore } from '@/stores/user'

const { user } = useUserStore()
</script>

<template>
  <div class="tab-content">
    <div class="card">
      <div class="card-header">
        <h5>x-Card</h5>
        <div class="select_all">
          <label for="selectAll">
            {{ $t('select_all') }}
          </label>
          <input type="checkbox" id="selectAll" />
        </div>
      </div>
      <hr />
      <div class="card-body">
        <label for="admin">
          <input type="checkbox" name="admin" id="admin" />
          <span> admin </span>
        </label>
      </div>
    </div>
  </div>
</template>
