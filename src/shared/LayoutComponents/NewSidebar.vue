<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'
import OrganizationSidebar from './OrganizationSidebar.vue'
import AdminSidebar from './AdminSidebar.vue'
import SIdebarOpenIcon from '../icons/SIdebarOpenIcon.vue'
import { EmployeeStatusEnum } from '@/features/Organization/OrganizationEmployee/Core/Enum/EmployeeStatus.ts'
import HomeProjectIcon from '../icons/HomeProjectIcon.vue'
import IconLogout from '../icons/IconLogout.vue'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ 'update:open': [value: boolean] }>()

const user = useUserStore()
const route = useRoute()
const sidebarRef = ref<HTMLElement | null>(null)

const scrollClosedSidebarToActiveRoute = async () => {
  if (props.open) return

  await nextTick()
  requestAnimationFrame(() => {
    const sidebar = sidebarRef.value
    const activeRoute = sidebar?.querySelector<HTMLElement>(
      '.icon-strip .router-link-exact-active, .icon-strip .router-link-active',
    )

    if (!activeRoute) return

    const scrollContainer =
      activeRoute.closest<HTMLElement>('.icon-strip') ||
      activeRoute.closest<HTMLElement>('.links')

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
  () => [props.open, route.fullPath],
  () => {
    scrollClosedSidebarToActiveRoute()
  },
  { immediate: true },
)

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
  <aside ref="sidebarRef" :class="['sidebar', open ? 'open' : 'close']">
    <div class="sidebar-wrapper">
      <button class="sidebar-toggle" @click="emit('update:open', !open)" title="Toggle sidebar">
        <SIdebarOpenIcon />
      </button>

      <router-link
        :to="`${Number(user.user?.type) === EmployeeStatusEnum.Admin ? '/admin' : '/organization'}`"
        class="sidebar-back"
      >
        <!-- <span class="home-icon"><HomeProjectIcon /></span> -->
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

      <button class="mobile-sidebar-logout" type="button" @click="logout">
        <IconLogout />
        <span>{{ $t('logout') }}</span>
      </button>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  padding-top: 20px;
  background: linear-gradient(155deg, #1d4ed8 0%, #1e40af 44%, #0f2f80 100%), #1d4ed8 !important;
  box-shadow:
    18px 0 38px rgba(30, 64, 175, 0.22),
    inset -1px 0 0 rgba(255, 255, 255, 0.12);
}
.sidebar.close {
  width: 92px;
}
.sidebar.open {
  background: linear-gradient(155deg, #1d4ed8 0%, #1e40af 44%, #0f2f80 100%), #1d4ed8 !important;
}
.sidebar-wrapper {
  padding-inline: 8px;
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
  color: #ffffff;
  box-shadow: none;
}
.sidebar.close .sidebar-toggle {
  color: #ffffff;
}
.sidebar-toggle :deep(svg) {
  width: 26px;
  height: 26px;
}
.sidebar-toggle :deep(path) {
  fill: currentColor !important;
}

.sidebar-toggle:hover {
  background: rgba(0, 0, 0, 0.08);
}
.sidebar.open .sidebar-toggle:hover {
  background: rgba(255, 255, 255, 0.24);
}

.sidebar-back {
  min-height: 72px;
  flex-direction: column !important;
  justify-content: center !important;
  gap: 7px !important;
  border: 1px solid #e7ecf5;
  box-shadow: 0 10px 22px rgba(15, 23, 42, 0.05);
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
  background: #eef4ff !important;
  border-color: rgba(31, 65, 187, 0.22);
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
  color: #ffffff !important;
  box-shadow: none;
}
.sidebar.close .sidebar-back {
  background: transparent !important;
  border-color: transparent;
  color: #ffffff !important;
  box-shadow: none;
}
.sidebar.close .sidebar-back:hover,
.sidebar.close .sidebar-back.router-link-active {
  background: rgba(255, 255, 255, 0.14) !important;
  border-color: transparent;
  color: #ffffff !important;
}
.sidebar.open .sidebar-back:hover,
.sidebar.open .sidebar-back.router-link-active {
  background: rgba(255, 255, 255, 0.14) !important;
  border-color: transparent;
  color: #ffffff !important;
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
  background: #ffffff;
  border: 1px solid #edf1f7;
  color: currentColor;
  box-shadow: inset 0 -1px 0 rgba(15, 23, 42, 0.04);
}
.sidebar.open .home-icon {
  background: transparent;
  border-color: transparent;
  color: #ffffff;
}
.sidebar.close .home-icon {
  background: transparent;
  border-color: transparent;
  color: #ffffff;
  box-shadow: none;
}
.home-icon :deep(svg) {
  width: 19px;
  height: 19px;
}
.links {
  padding-bottom: 18px;
}
.sidebar.open .links {
  padding-top: 2px;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.38) transparent;
}
.sidebar.open .links::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.38);
}
.sidebar.close .links {
  overflow-y: auto;
  scrollbar-width: none;
}
.sidebar.close .links::-webkit-scrollbar {
  display: none;
}
.sidebar.open :deep(.p-accordionheader) {
  margin-inline: 0 !important;
  padding: 12px 14px !important;
  border-radius: 12px !important;
  color: #ffffff !important;
  background: transparent !important;
  border: none !important;
  box-shadow: none;
  transition:
    background 0.22s ease,
    border-color 0.22s ease,
    transform 0.22s ease;
}
.sidebar.open :deep(.p-accordionheader:hover) {
  background: rgba(255, 255, 255, 0.12) !important;
  border-color: transparent !important;
  transform: none;
}
.sidebar.open :deep(.p-accordionheader) {
  margin-bottom: 4px !important;
  background: rgba(255, 255, 255, 0.16) !important;
  border-left: 3px solid #bfdbfe !important;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.08);
}
.sidebar.open :deep(.p-accordionheader:hover) {
  background: rgba(255, 255, 255, 0.22) !important;
}
.sidebar.open :deep(.links-header) {
  justify-content: flex-start;
  width: 100%;
  gap: 0;
  color: #ffffff !important;
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
  color: #dbeafe !important;
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
  background: rgba(255, 255, 255, 0.14) !important;
  border-color: transparent;
  color: #ffffff !important;
  transform: none;
  font-size: inherit !important;
  font-weight: 700;
  box-shadow: none;
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

@media (max-width: 768px) {
  .sidebar-wrapper {
    display: flex;
    flex-direction: column;
  }

  .links {
    flex: 1 1 auto;
    min-height: 0;
    overflow-y: auto;
  }

  .mobile-sidebar-logout {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 10px;
    width: calc(100% - 24px);
    min-height: 46px;
    margin: auto 12px 18px;
    padding: 10px 14px;
    border: 0;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.14);
    color: #ffffff;
    cursor: pointer;
    font-size: 14px;
    font-weight: 800;
    text-align: start;
    margin-bottom: 40px;
  }

  .mobile-sidebar-logout:hover {
    background: rgba(255, 255, 255, 0.22);
  }

  .mobile-sidebar-logout :deep(svg) {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
  }

  .mobile-sidebar-logout :deep(path) {
    fill: currentColor !important;
  }
}
</style>
