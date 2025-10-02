<script setup lang="ts">
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'
import AdminPermission from '@/shared/icons/AdminPermission.vue'
import OrganizationPermission from '@/shared/icons/OrganizationPermission.vue'
import { useUserStore } from '@/stores/user'
// import SuperPermission from '@/shared/icons/superPermission.vue'

const { user } = useUserStore()

const emit = defineEmits(['update:type'])
</script>

<template>
  <div class="tabs">
    <!--
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
    -->

    <button
      class="tab"
      v-if="user?.type === OrganizationTypeEnum?.ADMIN"
      @click="emit('update:type', true)"
    >
      <input type="radio" id="admin" name="tab-control" />
      <label for="admin">
        <h4>{{ $t('admin') }}</h4>
        <AdminPermission />
      </label>
    </button>

    <button
      class="tab"
      v-if="user?.type == OrganizationTypeEnum?.ORGANIZATION"
      @click="emit('update:type', true)"
    >
      <input type="radio" id="organization" name="tab-control" />
      <label for="organization">
        <h4>{{ $t('organization') }}</h4>
        <OrganizationPermission />
      </label>
    </button>
  </div>
</template>
