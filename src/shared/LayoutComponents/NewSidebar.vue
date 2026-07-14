<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'
import OrganizationSidebar from './OrganizationSidebar.vue'
import AdminSidebar from './AdminSidebar.vue'
import { EmployeeStatusEnum } from '@/features/Organization/OrganizationEmployee/Core/Enum/EmployeeStatus.ts'
import SidebarUnicon from '@/shared/icons/SidebarUnicon.vue'
import { useThemeMode } from '@/composables/useThemeMode'

const props = defineProps<{ open: boolean }>()

const user = useUserStore()
const route = useRoute()
const sidebarRef = ref<HTMLElement | null>(null)
const isMobileSidebar = ref(false)
const { isDarkMode } = useThemeMode()
const isOrganizationSidebar = computed(() => user.user?.type === OrganizationTypeEnum.ORGANIZATION)
const shouldRenderCompactRail = computed(() => isOrganizationSidebar.value || isMobileSidebar.value)
const sidebarDisplayState = computed(() =>
  shouldRenderCompactRail.value ? 'close' : props.open ? 'open' : 'close',
)

const syncSidebarViewport = () => {
  isMobileSidebar.value = window.innerWidth <= 768
}

const scrollClosedSidebarToActiveRoute = async () => {
  if (props.open && !isOrganizationSidebar.value && !isMobileSidebar.value) return

  await nextTick()
  requestAnimationFrame(() => {
    const sidebar = sidebarRef.value
    const activeRoute = sidebar?.querySelector<HTMLElement>(
      '.icon-strip .router-link-exact-active, .icon-strip .router-link-active',
    )

    if (!activeRoute) return

    const scrollContainer =
      activeRoute.closest<HTMLElement>('.icon-strip') || activeRoute.closest<HTMLElement>('.links')

    if (!scrollContainer) return

    const containerRect = scrollContainer.getBoundingClientRect()
    const activeRect = activeRoute.getBoundingClientRect()
    const centeredTop =
      activeRect.top -
      containerRect.top +
      scrollContainer.scrollTop -
      scrollContainer.clientHeight / 2 +
      activeRoute.offsetHeight / 2

    scrollContainer.scrollTo({
      top: Math.max(centeredTop, 0),
      behavior: 'smooth',
    })
  })
}

watch(
  () => [props.open, route.fullPath, isMobileSidebar.value],
  () => {
    scrollClosedSidebarToActiveRoute()
  },
  { immediate: true },
)

onMounted(() => {
  syncSidebarViewport()
  window.addEventListener('resize', syncSidebarViewport)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', syncSidebarViewport)
})

const logout = () => {
  if (user.user?.type == OrganizationTypeEnum.ADMIN) {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    localStorage.removeItem('ProjectSelect')
    window.location.href = '/login/admin'
  } else if (user.user?.type == OrganizationTypeEnum.ORGANIZATION) {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    localStorage.removeItem('ProjectSelect')
    window.location.href = '/login/organization'
  }
}
</script>

<template>
  <aside
    ref="sidebarRef"
    :class="[
      'sidebar',
      sidebarDisplayState,
      {
        'is-dark': isDarkMode,
        'organization-modern': isOrganizationSidebar,
      },
    ]"
  >
    <div class="sidebar-wrapper">
      <router-link
        :to="`${Number(user.user?.type) === EmployeeStatusEnum.Admin ? '/admin' : '/organization'}`"
        class="sidebar-back"
      >
        <span class="home-icon"><SidebarUnicon name="home" /></span>
        <span>Home</span>
      </router-link>

      <div class="links">
        <template v-if="user?.user?.type === OrganizationTypeEnum?.ADMIN">
          <AdminSidebar :open="open && !isMobileSidebar" />
        </template>
        <template v-if="isOrganizationSidebar">
          <OrganizationSidebar :open="open" />
        </template>
      </div>

      <button class="mobile-sidebar-logout" type="button" @click="logout">
        <SidebarUnicon name="signout" />
        <span>{{ $t('logout') }}</span>
      </button>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  padding-top: 20px;
  overscroll-behavior-x: none;
  background:
    radial-gradient(circle at 18% 0%, color-mix(in srgb, var(--surface-1) 10%, transparent) 0 18%, transparent 34%),
    radial-gradient(circle at 82% 18%, color-mix(in srgb, var(--brand-primary-300) 9%, transparent) 0 16%, transparent 34%),
    linear-gradient(155deg, var(--brand-primary-600) 0%, var(--brand-primary-700) 44%, var(--brand-primary-800) 100%) !important;
  box-shadow:
    18px 0 38px color-mix(in srgb, var(--brand-primary-600) 22%, transparent),
    inset -1px 0 0 color-mix(in srgb, var(--shadow-color) 12%, transparent);
}
.sidebar.close {
  width: 92px;
}
.sidebar.open {
  background:
    radial-gradient(circle at 18% 0%, color-mix(in srgb, var(--surface-1) 10%, transparent) 0 18%, transparent 34%),
    radial-gradient(circle at 82% 18%, color-mix(in srgb, var(--brand-primary-300) 9%, transparent) 0 16%, transparent 34%),
    linear-gradient(155deg, var(--brand-primary-600) 0%, var(--brand-primary-700) 44%, var(--brand-primary-800) 100%) !important;
}

.sidebar.is-dark,
.sidebar.is-dark.open {
  background:
    radial-gradient(circle at 0% 0%, color-mix(in srgb, var(--brand-primary-300) 16%, transparent), transparent 34%),
    linear-gradient(155deg, var(--brand-primary-900) 0%, var(--brand-primary-900) 54%, var(--brand-primary-900) 100%) !important;
  box-shadow:
    18px 0 38px color-mix(in srgb, var(--shadow-color) 32%, transparent),
    inset -1px 0 0 color-mix(in srgb, var(--brand-primary-400) 14%, transparent);
}

.sidebar.is-dark .sidebar-wrapper {
  background: transparent !important;
}
.sidebar-wrapper {
  padding-inline: 8px;
  overflow-x: hidden;
}
.sidebar-wrapper {
  background: transparent !important;
}
.mobile-sidebar-logout {
  display: none;
}
.sidebar.open .sidebar-wrapper {
  padding-inline: 12px;
}
.close .sidebar-wrapper {
  gap: 8px;
}
.close .sidebar-toggle {
  right: -16px;
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
.sidebar.open .sidebar-toggle {
  background: transparent;
  border: none;
  color: var(--text-on-brand);
  box-shadow: none;
}
.sidebar.close .sidebar-toggle {
  color: var(--text-on-brand);
}
.sidebar-toggle :deep(svg) {
  width: 26px;
  height: 26px;
}
.sidebar-toggle :deep(path) {
  fill: currentColor !important;
}

.sidebar-toggle:hover {
  background: color-mix(in srgb, var(--text-strong) 8%, transparent);
}
.sidebar.open .sidebar-toggle:hover {
  background: color-mix(in srgb, var(--surface-1) 24%, transparent);
}

.sidebar-back {
  min-height: 72px;
  flex-direction: column !important;
  justify-content: center !important;
  gap: 7px !important;
  border: 1px solid var(--brand-primary-100);
  box-shadow: 0 10px 22px color-mix(in srgb, var(--brand-primary-900) 5%, transparent);
  transition:
    background 0.22s ease,
    border-color 0.22s ease,
    color 0.22s ease,
    transform 0.22s ease;
  text-align: center !important;
  margin-inline: auto !important;
  align-items: center !important;
  width: 100% !important;
}
.sidebar-back:hover,
.sidebar-back.router-link-active {
  background: var(--brand-primary-50) !important;
  border-color: color-mix(in srgb, var(--brand-primary-600) 22%, transparent);
  color: var(--PrimaryColor) !important;
  transform: translateY(-1px);
}
.sidebar.open .sidebar-back {
  width: calc(100% - 20px) !important;
  margin-top: 30px !important;
  flex-direction: row !important;
  justify-content: flex-start !important;
  min-height: 46px;
  padding: 8px 12px !important;
  background: transparent !important;
  border-color: transparent;
  color: var(--text-on-brand) !important;
  box-shadow: none;
}
.sidebar.close .sidebar-back {
  background: transparent !important;
  border-color: transparent;
  color: var(--text-on-brand) !important;
  box-shadow: none;
}
.sidebar.close .sidebar-back:hover,
.sidebar.close .sidebar-back.router-link-active {
  background: color-mix(in srgb, var(--surface-1) 14%, transparent) !important;
  border-color: transparent;
  color: var(--text-on-brand) !important;
}

.sidebar.is-dark .sidebar-back,
.sidebar.is-dark.open .sidebar-back,
.sidebar.is-dark.close .sidebar-back {
  color: var(--brand-primary-50) !important;
  background: color-mix(in srgb, var(--brand-primary-800) 66%, transparent) !important;
  border-color: color-mix(in srgb, var(--brand-primary-400) 16%, transparent) !important;
}

.sidebar.is-dark .sidebar-back:hover,
.sidebar.is-dark .sidebar-back.router-link-active,
.sidebar.is-dark.open .sidebar-back:hover,
.sidebar.is-dark.open .sidebar-back.router-link-active,
.sidebar.is-dark.close .sidebar-back:hover,
.sidebar.is-dark.close .sidebar-back.router-link-active {
  background: color-mix(in srgb, var(--brand-primary-300) 16%, transparent) !important;
  border-color: color-mix(in srgb, var(--brand-primary-300) 28%, transparent) !important;
  color: var(--text-on-brand) !important;
}
.sidebar.open .sidebar-back:hover,
.sidebar.open .sidebar-back.router-link-active {
  background: color-mix(in srgb, var(--surface-1) 14%, transparent) !important;
  border-color: transparent;
  color: var(--text-on-brand) !important;
}
.sidebar.close .sidebar-back {
  width: 72px !important;
  min-height: 68px;
  margin-top: 18px !important;
  margin-bottom: 0 !important;
  padding: 8px 4px !important;
}
.sidebar-back span {
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}
.sidebar-back > span:not(.home-icon) {
  max-width: 70px;
  padding: 0;
  color: inherit;
  font-size: 11px;
  line-height: 1.15;
  font-weight: 700;
}
.home-icon {
  width: 34px;
  height: 34px;
  border-radius: 13px;
  background: var(--surface-1);
  border: 1px solid var(--brand-primary-50);
  color: currentColor;
  box-shadow: inset 0 -1px 0 color-mix(in srgb, var(--brand-primary-900) 4%, transparent);
}
.sidebar.open .home-icon {
  background: transparent;
  border-color: transparent;
  color: var(--text-on-brand);
}
.sidebar.close .home-icon {
  background: transparent;
  border-color: transparent;
  color: var(--text-on-brand);
  box-shadow: none;
}
.home-icon :deep(svg),
.home-icon :deep(.sidebar-unicon) {
  width: 19px;
  height: 19px;
}
.links {
  padding-bottom: 18px;
  overflow-x: hidden;
  overscroll-behavior-x: none;
}
.sidebar.open .links {
  padding-top: 2px;
  scrollbar-width: thin;
  scrollbar-color: color-mix(in srgb, var(--surface-1) 38%, transparent) transparent;
}
.sidebar.open .links::-webkit-scrollbar-thumb {
  background: color-mix(in srgb, var(--surface-1) 38%, transparent);
}
.sidebar.close .links {
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: none;
}
.sidebar.close .links::-webkit-scrollbar {
  display: none;
}
.sidebar.close :deep(.strip-icon) {
  width: 34px !important;
  height: 34px !important;
  padding: 7px;
  border-radius: 12px;
  background: var(--surface-1);
  color: var(--brand-primary-500);
  box-shadow: 0 8px 18px color-mix(in srgb, var(--brand-primary-900) 14%, transparent);
}

.sidebar.is-dark.close :deep(.strip-icon) {
  background: var(--brand-primary-800) !important;
  color: var(--brand-primary-300) !important;
  box-shadow: 0 8px 18px color-mix(in srgb, var(--text-strong) 24%, transparent);
}
.sidebar.close :deep(.icon-item.router-link-active .strip-icon),
.sidebar.close :deep(.icon-item:hover .strip-icon) {
  color: var(--brand-primary-700);
  box-shadow: 0 10px 22px color-mix(in srgb, var(--brand-primary-900) 20%, transparent);
}
.sidebar.open :deep(.p-accordionheader) {
  margin-inline: 0 !important;
  padding: 12px 14px !important;
  border-radius: 12px !important;
  color: var(--text-on-brand) !important;
  background: transparent !important;
  border: none !important;
  box-shadow: none;
  transition:
    background 0.22s ease,
    border-color 0.22s ease,
    transform 0.22s ease;
}

.sidebar.is-dark.open :deep(.p-accordionheader) {
  background: color-mix(in srgb, var(--brand-primary-800) 82%, transparent) !important;
  border-left-color: var(--brand-primary-300) !important;
  color: var(--brand-primary-50) !important;
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--brand-primary-400) 10%, transparent);
}

.sidebar.is-dark.open :deep(.p-accordionheader:hover) {
  background: color-mix(in srgb, var(--brand-primary-700) 92%, transparent) !important;
}
.sidebar.open :deep(.p-accordionheader:hover) {
  background: color-mix(in srgb, var(--surface-1) 12%, transparent) !important;
  border-color: transparent !important;
  transform: none;
}
.sidebar.open :deep(.p-accordionheader) {
  margin-bottom: 4px !important;
  background: color-mix(in srgb, var(--surface-1) 16%, transparent) !important;
  border-left: 3px solid var(--brand-primary-100) !important;
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--surface-1) 8%, transparent);
}
.sidebar.open :deep(.p-accordionheader:hover) {
  background: color-mix(in srgb, var(--surface-1) 22%, transparent) !important;
}
.sidebar.open :deep(.links-header) {
  justify-content: flex-start;
  width: 100%;
  gap: 0;
  color: var(--text-on-brand) !important;
  font-size: 14px;
  font-weight: 800;
  letter-spacing: 0;
}
.sidebar.open :deep(.links-header svg) {
  display: none !important;
}
.sidebar.open :deep(.p-accordioncontent-content) {
  padding: 0 !important;
}
.sidebar.open :deep(.p-accordioncontent-content ul) {
  display: flex !important;
  flex-direction: column;
  align-items: flex-start;
  gap: 3px;
  margin: 0 0 12px;
  padding: 0 0 0 18px !important;
  background: transparent !important;
  border: none !important;
  border-radius: 0;
  box-shadow: none;
}
.sidebar.open :deep(.p-accordioncontent-content li) {
  display: block !important;
  min-width: 0;
  width: 100%;
  color: var(--brand-primary-100) !important;
}
.sidebar.open :deep(.p-accordioncontent-content li a) {
  display: flex !important;
  flex-direction: row;
  align-items: center !important;
  justify-content: flex-start;
  gap: 0 !important;
  min-height: 44px;
  width: 100%;
  padding: 9px 12px !important;
  border-radius: 12px;
  text-align: start;
  color: inherit;
  background: transparent;
  border: none;
  box-shadow: none;
  transition:
    background 0.22s ease,
    border-color 0.22s ease,
    color 0.22s ease,
    transform 0.22s ease;
}
.sidebar.open :deep(.p-accordioncontent-content li a:hover),
.sidebar.open :deep(.p-accordioncontent-content li a.router-link-active),
.sidebar.open :deep(.p-accordioncontent-content li a.active-link) {
  background: color-mix(in srgb, var(--surface-1) 14%, transparent) !important;
  border-color: transparent;
  color: var(--text-on-brand) !important;
  transform: none;
  font-size: inherit !important;
  font-weight: 700;
  box-shadow: none;
}

.sidebar.is-dark.open :deep(.p-accordioncontent-content li) {
  color: var(--brand-primary-200) !important;
}

.sidebar.is-dark.open :deep(.p-accordioncontent-content li a:hover),
.sidebar.is-dark.open :deep(.p-accordioncontent-content li a.router-link-active),
.sidebar.is-dark.open :deep(.p-accordioncontent-content li a.active-link) {
  background: color-mix(in srgb, var(--brand-primary-300) 16%, transparent) !important;
  color: var(--text-on-brand) !important;
}
.sidebar.open :deep(.p-accordioncontent-content li a.router-link-active::before),
.sidebar.open :deep(.p-accordioncontent-content li a.router-link-active::after),
.sidebar.open :deep(.p-accordioncontent-content li a.active-link::before),
.sidebar.open :deep(.p-accordioncontent-content li a.active-link::after) {
  display: none !important;
}
.sidebar.open :deep(.route-icon) {
  display: none !important;
}
.sidebar.open :deep(.p-accordioncontent-content li a span) {
  width: 100% !important;
  max-width: none;
  padding: 0 !important;
  font-size: 12px;
  line-height: 1.25;
  font-weight: 700;
  text-align: start;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

.sidebar.organization-modern {
  width: 90px;
  padding-top: 0;
  overflow: visible;
  border-radius: 0;
  background:
    radial-gradient(circle at 18% 0%, color-mix(in srgb, var(--surface-1) 10%, transparent) 0 18%, transparent 34%),
    radial-gradient(circle at 82% 18%, color-mix(in srgb, var(--brand-primary-300) 9%, transparent) 0 16%, transparent 34%),
    linear-gradient(155deg, var(--brand-primary-600) 0%, var(--brand-primary-700) 44%, var(--brand-primary-800) 100%) !important;
  box-shadow:
    14px 0 32px color-mix(in srgb, var(--brand-primary-600) 22%, transparent),
    inset -1px 0 0 color-mix(in srgb, var(--shadow-color) 12%, transparent);
  z-index: 10040;
  transition:
    width 0.24s ease,
    background 0.24s ease;
}

.sidebar.organization-modern.open {
  width: 90px;
  background:
    radial-gradient(circle at 18% 0%, color-mix(in srgb, var(--surface-1) 10%, transparent) 0 18%, transparent 34%),
    radial-gradient(circle at 82% 18%, color-mix(in srgb, var(--brand-primary-300) 9%, transparent) 0 16%, transparent 34%),
    linear-gradient(155deg, var(--brand-primary-600) 0%, var(--brand-primary-700) 44%, var(--brand-primary-800) 100%) !important;
}

.sidebar.organization-modern.close {
  width: 90px;
}

.sidebar.organization-modern .sidebar-wrapper {
  position: relative;
  gap: 8px;
  padding-inline: 8px;
  overflow: visible;
  overscroll-behavior-x: none;
  background: transparent !important;
}

.sidebar.organization-modern .sidebar-toggle {
  display: none;
}

.sidebar.organization-modern .sidebar-back {
  display: flex;
  width: 74px !important;
  min-height: 62px;
  margin: 10px auto 4px !important;
  padding: 8px 4px !important;
  flex-direction: column !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 6px !important;
  border: 0;
  border-radius: 16px;
  background: transparent !important;
  box-shadow: none;
  color: var(--brand-primary-100) !important;
}

.sidebar.organization-modern.open .sidebar-back,
.sidebar.organization-modern.close .sidebar-back {
  width: 74px !important;
  margin-top: 10px !important;
  background: transparent !important;
  color: var(--brand-primary-100) !important;
}

.sidebar.organization-modern .sidebar-back:hover,
.sidebar.organization-modern .sidebar-back.router-link-active {
  background: color-mix(in srgb, var(--surface-1) 14%, transparent) !important;
  color: var(--text-on-brand) !important;
  box-shadow:
    inset 0 0 0 1px color-mix(in srgb, var(--shadow-color) 12%, transparent),
    0 12px 24px color-mix(in srgb, var(--brand-primary-700) 18%, transparent);
  transform: translateY(-1px);
}

.sidebar.organization-modern .home-icon {
  width: 24px;
  height: 24px;
  border: 0;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
  color: currentColor;
}

.sidebar.organization-modern .home-icon :deep(svg) {
  width: 20px;
  height: 20px;
}

.sidebar.organization-modern .sidebar-back > span:not(.home-icon) {
  max-width: 62px;
  font-size: 10px;
  font-weight: 800;
  line-height: 1.15;
  white-space: nowrap;
}

.sidebar.organization-modern .links {
  position: static;
  min-height: 0;
  flex: 1 1 auto;
  padding: 0 0 12px;
  overflow: visible;
  overscroll-behavior-x: none;
}

.sidebar.organization-modern.open .links,
.sidebar.organization-modern.close .links {
  overflow: visible;
}

.sidebar.organization-modern :deep(.strip-icon) {
  width: 20px !important;
  height: 20px !important;
  padding: 0;
  border-radius: 0;
  background: transparent !important;
  box-shadow: none !important;
  color: currentColor !important;
}

.sidebar.organization-modern.is-dark,
.sidebar.organization-modern.is-dark.open {
  background: var(--brand-primary-900) !important;
}

.sidebar.close .mobile-sidebar-logout,
.sidebar.organization-modern .mobile-sidebar-logout {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 6px;
  width: 72px;
  min-height: 58px;
  margin: auto auto 14px;
  padding: 7px 6px;
  border: 0;
  border-radius: 18px;
  background: transparent;
  color: var(--brand-primary-100);
  cursor: pointer;
  font-size: 10px;
  font-weight: 800;
  line-height: 1.15;
  text-align: center;
  transition:
    background 0.18s ease,
    color 0.18s ease,
    transform 0.18s ease;
}

.sidebar.close .mobile-sidebar-logout:hover,
.sidebar.organization-modern .mobile-sidebar-logout:hover {
  background: color-mix(in srgb, var(--surface-1) 14%, transparent);
  box-shadow:
    inset 0 0 0 1px color-mix(in srgb, var(--shadow-color) 12%, transparent),
    0 12px 24px color-mix(in srgb, var(--brand-primary-700) 18%, transparent);
  color: var(--text-on-brand);
  transform: translateY(-1px);
}

.sidebar.close .mobile-sidebar-logout :deep(svg),
.sidebar.close .mobile-sidebar-logout :deep(.sidebar-unicon),
.sidebar.organization-modern .mobile-sidebar-logout :deep(svg),
.sidebar.organization-modern .mobile-sidebar-logout :deep(.sidebar-unicon) {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.sidebar.close .mobile-sidebar-logout span,
.sidebar.organization-modern .mobile-sidebar-logout span {
  max-width: 62px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (max-width: 768px) {
  .sidebar.close,
  .sidebar.organization-modern {
    width: 90px !important;
    overflow: visible;
  }

  .sidebar-wrapper {
    display: flex;
    flex-direction: column;
  }

  .links {
    flex: 1 1 auto;
    min-height: 0;
    overflow-y: auto;
    overflow-x: hidden;
    overscroll-behavior-x: none;
  }

  .mobile-sidebar-logout :deep(path) {
    fill: currentColor !important;
  }

  .sidebar.organization-modern.open {
    width: 90px !important;
  }

  .sidebar.organization-modern.close {
    width: 90px !important;
  }
}
</style>
