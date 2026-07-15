<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRoute } from 'vue-router'
import Header from '@/shared/LayoutComponents/Header.vue'
import { useUserStore } from '@/stores/user'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'
import NewSidebar from '../LayoutComponents/NewSidebar.vue'
import BreadCrumb from '../LayoutComponents/BreadCrumb.vue'
import { EmployeeStatusEnum } from '@/features/Organization/OrganizationEmployee/Core/Enum/EmployeeStatus'
import { useThemeMode } from '@/composables/useThemeMode'

const { user } = useUserStore()
const route = useRoute()
const { isDarkMode } = useThemeMode()

const isSidebarOpen = ref(true)
const isMobileScreen = ref(false)
const isOrganizationSidebar = computed(() => user?.type === OrganizationTypeEnum.ORGANIZATION)

const checkScreenSize = () => {
  isMobileScreen.value = window.innerWidth <= 768

  if (isOrganizationSidebar.value || isMobileScreen.value) {
    isSidebarOpen.value = false
  } else {
    isSidebarOpen.value = true
  }
}

const toggleSidebar = () => {
  if (isOrganizationSidebar.value && !isMobileScreen.value) {
    isSidebarOpen.value = false
    return
  }

  isSidebarOpen.value = !isSidebarOpen.value
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

watch(isOrganizationSidebar, () => {
  checkScreenSize()
})

const showSidebar = computed(() => {
  if (!user) return false
  return user.type === OrganizationTypeEnum.ADMIN || user.employeeType == EmployeeStatusEnum.Admin
})
</script>

<template>
  <main :class="['content', { 'is-dark': isDarkMode }]">
    <div
      class="sidebar-container"
      :class="{
        'sidebar-open': isSidebarOpen,
        'organization-sidebar-container': isOrganizationSidebar,
      }"
    >
      <NewSidebar v-if="showSidebar" v-model:open="isSidebarOpen" />
      <div
        v-if="isSidebarOpen && showSidebar"
        class="sidebar-backdrop"
        @click="isSidebarOpen = false"
      ></div>
    </div>
    <section class="content-wrapper">
      <Header @open="toggleSidebar" />
      <div class="main-content minmize">
        <BreadCrumb v-if="!route.fullPath.includes('project-progress')" />
        <slot />
      </div>
    </section>
  </main>
  <footer :class="['footer bottom-0 left-0 right-0 z-50', { 'is-dark': isDarkMode }]">
    <div class="footer-shell">
      <div class="footer-brand">
        <p class="footer-copy">© 2026 HSE.Cloud.Ai. All rights reserved.</p>
        <!-- <span class="footer-mark">HSE</span>
        <span class="footer-title">HSE.Cloud.Ai</span>
        <span class="footer-divider"></span> -->
        <span class="footer-powered">Powered by <strong>TechLab</strong></span>
      </div>
    </div>
  </footer>
</template>

<style scoped lang="scss">
.content {
  // padding-bottom: 74px;
}

.footer {
  display: flex;
  justify-content: center;
  padding: 0;
  border-top: 1px solid color-mix(in srgb, var(--brand-primary-500) 14%, transparent);
  background: transparent;
  box-shadow: none;
  backdrop-filter: none;
}

.footer-shell {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 30px;
  width: 100%;
  min-height: 48px;
  padding: 10px 22px;
}

.footer-brand {
  display: flex;
  align-items: center;
  min-width: 0;
  gap: 10px;
  color: var(--brand-primary-700);
  font-size: 12px;
  font-weight: 800;
  line-height: 1.2;
}

.footer-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 26px;
  flex-shrink: 0;
  border-radius: 10px;
  background: linear-gradient(
    155deg,
    var(--brand-primary-600) 0%,
    var(--brand-primary-700) 55%,
    var(--brand-primary-800) 100%
  );
  color: var(--text-on-brand);
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 0;
  box-shadow: 0 8px 18px color-mix(in srgb, var(--brand-primary-600) 24%, transparent);
}

.footer-title,
.footer-powered {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.footer-divider {
  width: 1px;
  height: 18px;
  flex-shrink: 0;
  background: color-mix(in srgb, var(--brand-primary-500) 18%, transparent);
}

.footer-powered {
  color: var(--brand-primary-500);
  font-weight: 700;

  strong {
    color: var(--brand-primary-500);
    font-weight: 900;
  }
}

.footer-copy {
  margin: 0;
  flex-shrink: 0;
  color: var(--brand-primary-500);
  font-size: 12px;
  font-weight: 700;
  line-height: 1.2;
  white-space: nowrap;
}

.footer.is-dark .footer-shell {
  background: transparent;
  box-shadow: none;
}

.footer.is-dark {
  border-top-color: color-mix(in srgb, var(--brand-primary-400) 16%, transparent);
  background: transparent;
  box-shadow: none;
}

.footer.is-dark .footer-brand {
  color: var(--brand-primary-50);
}

.footer.is-dark .footer-divider {
  background: color-mix(in srgb, var(--brand-primary-400) 22%, transparent);
}

.footer.is-dark .footer-powered,
.footer.is-dark .footer-copy {
  color: var(--brand-primary-400);
}

.footer.is-dark .footer-powered strong {
  color: var(--brand-primary-300);
}

.content.is-dark,
.content.is-dark .content-wrapper,
.content.is-dark .main-content {
  background-color: var(--app-bg) !important;
  color: var(--text-strong) !important;
}

.content.is-dark .main-content {
  border: 1px solid color-mix(in srgb, var(--brand-primary-400) 14%, transparent);
  box-shadow: inset 0 1px 0 color-mix(in srgb, var(--surface-1) 3%, transparent);
}

@media (max-width: 768px) {
  .content {
    padding-bottom: 92px;
  }

  .footer {
    padding: 0;
  }

  .footer-shell {
    align-items: center;
    flex-direction: column;
    gap: 5px;
    min-height: 0;
    padding: 9px 12px;
  }

  .footer-brand {
    justify-content: center;
    width: 100%;
    gap: 8px;
  }

  .footer-copy {
    width: 100%;
    font-size: 11px;
    text-align: center;
    white-space: normal;
  }

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

    &.sidebar-open :deep(.sidebar.close),
    &.sidebar-open :deep(.sidebar.organization-modern) {
      left: 0 !important;
      width: 90px !important;
    }

    .sidebar-backdrop {
      position: fixed;
      inset: 0;
      background-color: color-mix(in srgb, var(--text-strong) 40%, transparent);
      z-index: 9998;
    }
  }
}
</style>
