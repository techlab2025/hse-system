<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRoute } from 'vue-router'
import Header from '@/shared/LayoutComponents/Header.vue'
import { useUserStore } from '@/stores/user'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'
import NewSidebar from '../LayoutComponents/NewSidebar.vue'
import BreadCrumb from '../LayoutComponents/BreadCrumb.vue'
import { EmployeeStatusEnum } from '@/features/Organization/OrganizationEmployee/Core/Enum/EmployeeStatus'

const { user } = useUserStore()
const route = useRoute()

const isSidebarOpen = ref(true)

const checkScreenSize = () => {
  if (window.innerWidth <= 768) {
    isSidebarOpen.value = false
  } else {
    isSidebarOpen.value = true
  }
}

onMounted(() => {
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkScreenSize)
})

// Close sidebar automatically on mobile when route changes
watch(
  () => route.fullPath,
  () => {
    if (window.innerWidth <= 768) {
      isSidebarOpen.value = false
    }
  },
)

const showSidebar = computed(() => {
  if (!user) return false
  return user.type === OrganizationTypeEnum.ADMIN || user.employeeType == EmployeeStatusEnum.Admin
})
</script>

<template>
  <main class="content">
    <div class="sidebar-container" :class="{ 'sidebar-open': isSidebarOpen }">
      <NewSidebar v-if="showSidebar" v-model:open="isSidebarOpen" />
      <div v-if="isSidebarOpen && showSidebar" class="sidebar-backdrop" @click="isSidebarOpen = false"></div>
    </div>
    <section class="content-wrapper">
      <Header @open="isSidebarOpen = !isSidebarOpen" />
      <div class="main-content minmize">
        <BreadCrumb v-if="!route.fullPath.includes('project-progress')" />
        <slot />
      </div>
    </section>
  </main>
</template>

<style scoped lang="scss">
@media (max-width: 768px) {
  .sidebar-container {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999;
    height: 100vh;
    pointer-events: none;

    &.sidebar-open {
      pointer-events: auto;
    }

    .sidebar-backdrop {
      position: fixed;
      inset: 0;
      background-color: rgba(0, 0, 0, 0.4);
      z-index: 9998;
    }
  }
}
</style>
