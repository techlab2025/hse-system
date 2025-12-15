<script lang="ts" setup>
import AdminHome from './AdminHome.vue';
import OragnizationHome from './OragnizationHome.vue';
import { useUserStore } from '@/stores/user';
import { OrganizationTypeEnum } from '../auth/Core/Enum/organization_type';
const { user } = useUserStore();
</script>
<template>
  <OragnizationHome v-if="user?.type === OrganizationTypeEnum?.ORGANIZATION" />
  <AdminHome v-else />
</template>
