<script setup lang="ts">
import SuperPermission from '@/shared/icons/superPermission.vue'
</script>

<template>
  <div class="tabs">
    <div class="card">
      <input type="radio" id="super" name="tab-control" />
      <label for="super">
        <div class="card-content">
          <h4>{{ $t('super') }}</h4>
          <p>{{ $t('all_permissions') }}</p>
        </div>
        <SuperPermission />
      </label>
    </div>

    <div class="card">
      <input type="radio" id="admin" name="tab-control" />
      <label for="admin">
        <h4>{{ $t('admin') }}</h4>
        <SuperPermission />
      </label>
    </div>

    <div class="card">
      <input type="radio" id="organization" name="tab-control" />
      <label for="organization">
        <h4>{{ $t('organization') }}</h4>
        <SuperPermission />
      </label>
    </div>
  </div>
</template>
