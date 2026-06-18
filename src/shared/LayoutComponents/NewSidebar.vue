<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'
import OrganizationSidebar from './OrganizationSidebar.vue'
import AdminSidebar from './AdminSidebar.vue'
import BackIcon from '../icons/BackIcon.vue'
import { useRouter } from 'vue-router'
import SIdebarOpenIcon from '../icons/SIdebarOpenIcon.vue'
import { EmployeeStatusEnum } from '@/features/Organization/OrganizationEmployee/Core/Enum/EmployeeStatus.ts'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ 'update:open': [value: boolean] }>()

const user = useUserStore()
const router = useRouter()
const RouterBack = () => router.back()
</script>

<template>
  <aside :class="['sidebar', open ? 'open' : 'close']">
    <div class="sidebar-wrapper">
      <button class="sidebar-toggle" @click="emit('update:open', !open)" title="Toggle sidebar">
        <SIdebarOpenIcon />
      </button>

      <router-link
        :to="`${Number(user.user?.type) === EmployeeStatusEnum.Admin ? '/admin' : '/organization'}`"
        class="sidebar-back"
      >
        <BackIcon class="icon" />
        <span>Home</span>
      </router-link>

      <div class="links">
        <template v-if="user?.user?.type === OrganizationTypeEnum?.ADMIN">
          <AdminSidebar :open="open" />
        </template>
        <template v-if="user?.user?.type === OrganizationTypeEnum?.ORGANIZATION">
          <OrganizationSidebar :open="open" />
        </template>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  padding-top: 20px;
}
.close .sidebar-wrapper {
  gap: 5px;
}
.close .sidebar-toggle {
  right: 0px;
  position: relative;
}
.open .sidebar-toggle {
  rotate: 180deg;
}
.close .links {
  overflow-y: hidden;
}
.sidebar-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  color: inherit;
  border-radius: 6px;
  position: absolute;
  top: 0px;
  right: -20px;
  width: 40px;
  height: 40px;
  transition: all 0.5s ease;
}

.sidebar-toggle:hover {
  background: rgba(0, 0, 0, 0.08);
}

.sidebar.close .sidebar-back {
  display: none;
}
</style>
