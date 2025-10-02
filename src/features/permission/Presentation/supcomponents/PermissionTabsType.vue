<script setup lang="ts">
import AdminPermission from '@/shared/icons/AdminPermission.vue'
import OrganizationPermission from '@/shared/icons/OrganizationPermission.vue'
import SuperPermission from '@/shared/icons/superPermission.vue'
</script>

<template>
  <div class="tabs">
    <div class="tab">
      <input type="radio" id="super" name="tab-control" />
      <label for="super">
        <div class="card-content">
          <h4>{{ $t('super') }}</h4>
          <p>{{ $t('all_permissions') }}</p>
        </div>
        <SuperPermission />
      </label>
    </div>

    <div class="tab">
      <input type="radio" id="admin" name="tab-control" />
      <label for="admin">
        <h4>{{ $t('admin') }}</h4>
        <AdminPermission />
      </label>
    </div>

    <div class="tab">
      <input type="radio" id="organization" name="tab-control" />
      <label for="organization">
        <h4>{{ $t('organization') }}</h4>
        <OrganizationPermission />
      </label>
    </div>
  </div>
</template>
