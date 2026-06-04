<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'
import OrganizationSidebar from './OrganizationSidebar.vue'
import AdminSidebar from './AdminSidebar.vue'
import BackIcon from '../icons/BackIcon.vue'
import { useRouter } from 'vue-router'
import SIdebarOpenIcon from '../icons/SIdebarOpenIcon.vue'

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

      <button class="sidebar-back" @click="RouterBack">
        <BackIcon class="icon" />
        <span>back</span>
      </button>

      <div class="links">
        <template v-if="user?.user?.type === OrganizationTypeEnum?.ADMIN">
          <AdminSidebar />
        </template>
        <template v-if="user?.user?.type === OrganizationTypeEnum?.ORGANIZATION">
          <OrganizationSidebar />
        </template>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.close .sidebar-toggle {
  right: 0px;
}
.open .sidebar-toggle {
  rotate: 180deg;
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

.sidebar.close .sidebar-back,
.sidebar.close .links {
  display: none;
}
</style>
