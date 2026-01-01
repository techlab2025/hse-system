<script lang="ts" setup>
import { useUserStore } from '@/stores/user';
import OragnizationHome from './OragnizationHome.vue';
import AdminHome from './AdminHome.vue';
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type';
const { user } = useUserStore();
</script>
<template>
  <OragnizationHome v-if="user?.type === OrganizationTypeEnum?.ORGANIZATION" />
  <AdminHome v-else />
</template>
