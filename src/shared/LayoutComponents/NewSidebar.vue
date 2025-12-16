<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'
import OrganizationSidebar from './OrganizationSidebar.vue'
import AdminSidebar from './AdminSidebar.vue'
import BackIcon from '../icons/BackIcon.vue'

const isOpen = ref(true)

const toggleSidebar = () => {
  isOpen.value = !isOpen.value
}

const active = ref('0')
const user = useUserStore()
</script>

<template>
  <aside :class="['sidebar', isOpen ? 'open' : 'close']">
    <div class="sidebar-wrapper">
      <!-- <div class="logo">
        <img src="@/assets/images/logo.svg" alt="logo" />
        <h2>HSE.Cloud.Ai</h2>
      </div>
      <button class="close-sidebar" @click="toggleSidebar">
        <CloseSidebar />
      </button> -->
      <button class="sidebar-back">
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

<style scoped></style>
