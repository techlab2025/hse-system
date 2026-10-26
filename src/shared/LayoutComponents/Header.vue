<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
// import IconFullScreen from '@/shared/icons/IconFullScreen.vue'
import IconMenu from '@/shared/icons/IconMenu.vue'
// import { setDefaultImage } from "@/base/Presentation/utils/set_default_image";
// import { useUserStore } from "@/stores/user";
// import defaultImage from "@/assets/images/user.png";
import ChangeLanguage from './ChangeLanguage.vue'
import { useUserStore } from '@/stores/user'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'
import defaultLogo from '@/assets/images/logo.svg'
import IdentityHeaderLayout from '@/features/SystemIdentity/components/IdentityHeaderLayout.vue'
import { useSystemIdentity } from '@/composables/useSystemIdentity'
import CustomSelectInput from '../FormInputs/CustomSelectInput.vue'
import TitleInterface from '@/base/Data/Models/title_interface'
import { useProjectSelectStore } from '@/stores/ProjectSelect'
import { routeProjectId } from '@/shared/utils/headerProjectRoutes'
import { applyHeaderProjectSelection } from '@/composables/useHeaderProjectSelection'
import OrganizationEmployeeDefaultProjectRepoController from '@/features/auth/presentation/controllers/OrganizationEmployeeDefaultProjectRepoController'
import OrganizationEmployeeDefaultProjectParams from '@/features/auth/Core/Params/OrganizationEmployeeDefaultProjectParams'
import FetchMyProjectsController from '@/features/Organization/ObservationFactory/Presentation/controllers/FetchMyProjectsController'
import FetchMyProjectsParams from '@/features/Organization/ObservationFactory/Core/params/fetchMyProjectsParams'
import Notifications from './Notifications.vue'
import { useThemeMode } from '@/composables/useThemeMode'
import ConditionHandler from '@/base/Presentation/utils/condition_handler'
import SidebarUnicon from '@/shared/icons/SidebarUnicon.vue'
// import { NOTIFICATION_SOUND_BASE64 } from '@/base/Presentation/utils/notification_ring.ts'

defineOptions({ name: 'AppHeader' })

const route = useRoute()
const conditionHandler = ConditionHandler.getInstance()
// console.log(route.name)
// defineEmits(["open"]);

defineProps({
  open: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['open'])

const { isDarkMode, initThemeMode } = useThemeMode()
const { identity: systemIdentity } = useSystemIdentity()
const brandLogo = computed(() =>
  systemIdentity.value.isActive && systemIdentity.value.logo
    ? systemIdentity.value.logo
    : defaultLogo,
)
const brandName = computed(() =>
  systemIdentity.value.isActive && systemIdentity.value.name
    ? systemIdentity.value.name
    : 'HSE.Cloud.Ai',
)

const router = useRouter()
// const userStore = useUserStore();

const logout = () => {
  closeDropMenu()
  if (user?.type == OrganizationTypeEnum.ADMIN) {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    localStorage.removeItem('ProjectSelect')
    window.location.href = '/login/admin'
  } else if (user?.type == OrganizationTypeEnum.ORGANIZATION) {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    localStorage.removeItem('ProjectSelect')
    window.location.href = '/login/organization'
  }
  // router.push("/login");
}

const isDropMenuOpen = ref(false)
const userMenuRef = ref<HTMLElement | null>(null)
const userMenuPanelRef = ref<HTMLElement | null>(null)
const dropdownPosition = ref<Record<string, string>>({})

const updateDropdownPosition = () => {
  const rect = userMenuRef.value?.getBoundingClientRect()
  if (!rect) return

  const isRtl = document.documentElement.dir === 'rtl'
  const menuWidth = 264
  const viewportPadding = 12
  const preferredLeft = isRtl ? rect.left : rect.right - menuWidth
  const left = Math.min(
    Math.max(preferredLeft, viewportPadding),
    Math.max(viewportPadding, window.innerWidth - menuWidth - viewportPadding),
  )

  dropdownPosition.value = {
    top: `${rect.bottom + 12}px`,
    left: `${left}px`,
  }
}

const closeDropMenu = () => {
  isDropMenuOpen.value = false
}

const toggleDropMenu = () => {
  if (!isDropMenuOpen.value) {
    updateDropdownPosition()
  }
  isDropMenuOpen.value = !isDropMenuOpen.value
}

const openUserProfile = async () => {
  const currentUser = useUserStore().user
  if (!currentUser?.id) return

  closeDropMenu()

  await router.push(
    currentUser.type === OrganizationTypeEnum.ADMIN
      ? { name: 'Edit admin', params: { id: currentUser.id } }
      : { name: 'Show Organization Employee', params: { id: currentUser.id } },
  )
}

const handleOutsideMenuClick = (event: PointerEvent) => {
  const target = event.target as Node
  if (userMenuRef.value?.contains(target) || userMenuPanelRef.value?.contains(target)) return
  closeDropMenu()
}

const handleMenuKeydown = (event: KeyboardEvent) => {
  if (event.key !== 'Escape' || !isDropMenuOpen.value) return
  closeDropMenu()
  userMenuRef.value?.focus()
}

// fetch user store data
const { user } = useUserStore()
const ProjectSelector = useProjectSelectStore()

const SelectProject = computed(() => {
  const currentProjectId = routeProjectId(route)
  if (currentProjectId) {
    return (
      ProjectSelector.AllProjects.find((project) => project.id === currentProjectId) ??
      new TitleInterface({ id: currentProjectId, title: `Project #${currentProjectId}` })
    )
  }
  return ProjectSelector.getProject()
})

const indexProjectController = FetchMyProjectsController.getInstance()

const GetAllProjects = async () => {
  const indexProjectParams = new FetchMyProjectsParams(true)
  const response = await indexProjectController.fetch(indexProjectParams)
  if (response) {
    ProjectSelector.setAllProjects(response)
    // console.log(response, "response.value.data");
  }
}
onMounted(() => {
  initThemeMode()
  if (user?.type == OrganizationTypeEnum.ORGANIZATION) {
    GetAllProjects()
  }
  window.addEventListener('resize', updateDropdownPosition)
  window.addEventListener('scroll', updateDropdownPosition, true)
  document.addEventListener('pointerdown', handleOutsideMenuClick)
  document.addEventListener('keydown', handleMenuKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateDropdownPosition)
  window.removeEventListener('scroll', updateDropdownPosition, true)
  document.removeEventListener('pointerdown', handleOutsideMenuClick)
  document.removeEventListener('keydown', handleMenuKeydown)
})

const isChangingProject = ref(false)
const setSelectedProject = async (project: TitleInterface | null) => {
  if (isChangingProject.value || !user?.id) return
  isChangingProject.value = true
  try {
    const controller = OrganizationEmployeeDefaultProjectRepoController.getInstance()
    const params = new OrganizationEmployeeDefaultProjectParams(
      user?.id,
      project && project.id > 0 ? project.id : null,
    )
    await controller.SetorganizationEmployeeDefaultProject(params, router)
    if (!controller.isDataSuccess()) return
    await applyHeaderProjectSelection(router, route, project)
  } finally {
    isChangingProject.value = false
  }
}

const showProjectSelect = ref<boolean>(false)
onMounted(() => {
  showProjectSelect.value =
    user?.type == OrganizationTypeEnum.ADMIN || conditionHandler.shouldUseEmployeeInterface()
})
</script>

<template>
  <!-- {{ notifications }} -->
  <header :class="['hse-identity hse-app-header', { 'is-dark': isDarkMode }]">
    <nav
      class="nav"
      :data-custom-layout="
        systemIdentity.isActive &&
        systemIdentity.appearance.headerOrder.join() !== 'brand,project,actions'
      "
    >
      <IdentityHeaderLayout>
        <template #brand>
          <div class="menu flex items-center gap-3">
            <button
              type="button"
              class="drawer cursor-pointer flex items-center justify-center p-1"
              :aria-label="$t('open menu') || 'Open menu'"
              @click="emit('open')"
            >
              <IconMenu />
            </button>
            <!-- <div class="header-link flex gap-sm items-center">
          <h1>
            <router-link to="/">{{ $t('home') }} </router-link>
          </h1>
          <p class="route-name">{{ $t(typeof route?.name === 'string' ? route.name : '') }} /</p>
        </div> -->
            <router-link
              class="brand-link flex items-center gap-2"
              :to="
                user?.type == OrganizationTypeEnum?.ADMIN
                  ? '/admin'
                  : conditionHandler.shouldUseEmployeeInterface()
                    ? '/organization/employee-interface'
                    : '/organization'
              "
            >
              <img :src="brandLogo" :alt="$t('brand_logo', { brand: brandName })" />
              <p class="logo">{{ brandName }}</p>
            </router-link>
          </div>
        </template>
        <template #project>
          <div
            class="input-wrapper header-select"
            v-if="
              !showProjectSelect &&
              user?.type != OrganizationTypeEnum.ADMIN &&
              route.fullPath !== `/organization/projects`
            "
          >
            <!-- label="Project" -->
            <CustomSelectInput
              :modelValue="SelectProject"
              :disabled="isChangingProject"
              class="hse-identity hse-control hse-select-control"
              panel-class="hse-identity hse-select-panel"
              :pt="{ overlay: { dir: $i18n.locale.startsWith('ar') ? 'rtl' : 'ltr' } }"
              :staticOptions="ProjectSelector.AllProjects"
              id="project"
              :placeholder="$t('select your project')"
              @update:modelValue="setSelectedProject"
              :reload="false"
              label=""
            />
          </div>
        </template>
        <template #language><ChangeLanguage class="countery-icon" /></template>
        <template #notifications v-if="!route.path.startsWith('/admin')">
          <Notifications class="notifications-control" />
        </template>
        <template #profile>
          <div
            ref="userMenuRef"
            class="user cursor-pointer dropdown-trigger header-user-menu"
            role="button"
            tabindex="0"
            aria-haspopup="menu"
            :aria-expanded="isDropMenuOpen"
            :aria-label="$t('profile')"
            @click.stop="toggleDropMenu"
            @keydown.enter.stop.prevent="toggleDropMenu"
            @keydown.space.stop.prevent="toggleDropMenu"
          >
            <div class="profile-data">
              <span>{{ user?.name?.split(' ')[0] }}</span>
              <span>{{ user?.organizationName }}</span>
            </div>

            <img src="https://cyber.comolho.com/static/img/avatar.png" :alt="$t('employee')" />
            <svg class="profile-chevron" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="m6 8 4 4 4-4" />
            </svg>
          </div>
        </template>
      </IdentityHeaderLayout>
    </nav>

    <Teleport to="body">
      <Transition name="profile-menu">
        <div
          v-if="isDropMenuOpen"
          ref="userMenuPanelRef"
          class="hse-identity header-profile-menu"
          :class="{ 'is-dark': isDarkMode }"
          :style="dropdownPosition"
          role="menu"
          :aria-label="$t('profile')"
          @click.stop
        >
          <div class="header-profile-menu__identity">
            <img src="https://cyber.comolho.com/static/img/avatar.png" alt="" />
            <div>
              <strong>{{ user?.name }}</strong>
              <span>{{ user?.organizationName }}</span>
            </div>
          </div>

          <div class="header-profile-menu__divider" aria-hidden="true"></div>

          <button type="button" role="menuitem" @click="openUserProfile">
            <SidebarUnicon name="user" />
            <span>{{ $t('profile') }}</span>
          </button>
          <button type="button" role="menuitem" class="header-profile-menu__logout" @click="logout">
            <SidebarUnicon name="signout" />
            <span>{{ $t('logout') }}</span>
          </button>
        </div>
      </Transition>
    </Teleport>
  </header>
</template>

<style scoped>
.hse-app-header {
  position: sticky;
  top: 0;
  z-index: 80;
  width: 100%;
  min-height: 66px;
  padding: 12px 24px;
  border-bottom: 1px solid var(--hse-project-line);
  background: var(--hse-project-surface);
  box-shadow: 0 1px 0 rgb(16 42 77 / 3%);
}
.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px 20px;
  min-width: 0;
}
.menu,
.setting,
.brand-link,
.user {
  display: flex;
  align-items: center;
}
.menu {
  gap: 10px;
  min-width: 0;
}
.brand-link {
  gap: 10px;
  color: var(--hse-project-ink);
  text-decoration: none;
}
.brand-link img {
  width: 34px;
  height: 34px;
  object-fit: contain;
}
.logo {
  margin: 0;
  font: 700 16px/1.3 var(--hse-project-font);
}
.header-select {
  flex: 0 1 340px;
  min-width: 180px;
  margin: 0;
}
.header-select :deep(.input-label) {
  display: none;
}
.setting {
  gap: 8px;
  margin-inline-start: auto;
}
.countery-icon :deep(button),
.drawer,
.notifications-control :deep(.notification) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 8px;
  border: 1px solid var(--hse-project-line);
  border-radius: 11px;
  background: var(--hse-project-surface);
  color: var(--hse-project-muted);
  box-shadow: none;
  cursor: pointer;
  transition:
    background 180ms ease,
    border-color 180ms ease;
}
.countery-icon :deep(button:hover),
.drawer:hover,
.notifications-control :deep(.notification:hover) {
  background: var(--hse-project-ice);
  border-color: var(--hse-project-blue);
  color: var(--hse-project-blue);
  transform: none;
}
.countery-icon :deep(svg),
.drawer :deep(svg) {
  width: 20px;
  height: 20px;
}
.drawer :deep(path) {
  fill: currentColor;
}
.notifications-control {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.notifications-control :deep(.notification-glow) {
  display: none;
}
.notifications-control :deep(.circle-icon path) {
  stroke: currentColor;
}

.user {
  gap: 10px;
  min-width: 0;
  padding: 0 0 0 10px;
  border: 0;
  border-inline-start: 1px solid var(--hse-project-line);
  border-radius: 0;
  color: var(--hse-project-ink);
  outline: none;
  transition: color 160ms ease;
}
.user:hover,
.user:focus-visible,
.user[aria-expanded='true'] {
  color: var(--hse-project-blue);
}
.user:dir(rtl) {
  padding: 0 10px 0 0;
}
.user img {
  width: 38px;
  height: 38px;
  border-radius: 11px;
  object-fit: cover;
  background: var(--hse-project-ice);
}
.profile-data {
  display: grid;
  gap: 2px;
  max-width: 140px;
}
.profile-data span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: var(--hse-project-font);
}
.profile-data span:first-child {
  font-size: 12px;
  font-weight: 700;
}
.profile-data span:last-child:not(:first-child) {
  font-size: 11px;
  color: var(--hse-project-muted);
}
.profile-chevron {
  width: 16px;
  height: 16px;
  flex: 0 0 auto;
  transition: transform 160ms ease;
}
.profile-chevron path {
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.user[aria-expanded='true'] .profile-chevron {
  transform: rotate(180deg);
}
.header-profile-menu {
  position: fixed;
  z-index: 1300;
  display: grid;
  width: min(264px, calc(100vw - 24px));
  padding: 8px;
  border: 1px solid var(--hse-project-line, #dce5ef);
  border-radius: var(--hse-card-radius, 14px);
  background: var(--hse-project-surface, #fff);
  color: var(--hse-project-ink, #102a4d);
  box-shadow: var(--hse-shadow-dropdown, 0 16px 38px rgb(16 42 77 / 16%));
}
.header-profile-menu__identity {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  padding: 8px;
}
.header-profile-menu__identity img {
  width: 42px;
  height: 42px;
  flex: 0 0 auto;
  border-radius: var(--hse-control-radius, 9px);
  object-fit: cover;
  background: var(--hse-project-ice, #edf5ff);
}
.header-profile-menu__identity div {
  display: grid;
  gap: 2px;
  min-width: 0;
}
.header-profile-menu__identity strong,
.header-profile-menu__identity span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.header-profile-menu__identity strong {
  font: 700 13px/1.35 var(--hse-project-font);
}
.header-profile-menu__identity span {
  color: var(--hse-project-muted, #66788e);
  font: 500 11px/1.4 var(--hse-project-font);
}
.header-profile-menu__divider {
  height: 1px;
  margin: 4px 8px;
  background: var(--hse-project-line, #dce5ef);
}
.header-profile-menu button {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  min-height: 42px;
  padding: 9px 11px;
  border: 0;
  border-radius: var(--hse-control-radius, 9px) !important;
  background: transparent;
  color: var(--hse-project-ink, #102a4d);
  font: 600 13px/1.4 var(--hse-project-font);
  text-align: start;
  cursor: pointer;
  transition:
    color 160ms ease,
    background 160ms ease;
}
.header-profile-menu button:hover,
.header-profile-menu button:focus-visible {
  background: var(--hse-project-ice, #edf5ff);
  color: var(--hse-project-blue, #1677d2);
  outline: none;
}
.header-profile-menu button :deep(.sidebar-unicon) {
  width: 19px;
  height: 19px;
  flex: 0 0 auto;
}
.header-profile-menu .header-profile-menu__logout {
  color: var(--hse-danger, #c93f4d);
}
.header-profile-menu .header-profile-menu__logout:hover,
.header-profile-menu .header-profile-menu__logout:focus-visible {
  background: color-mix(in srgb, var(--hse-danger, #c93f4d) 9%, transparent);
  color: var(--hse-danger, #c93f4d);
}
.profile-menu-enter-active,
.profile-menu-leave-active {
  transition:
    opacity 140ms ease,
    transform 140ms ease;
  transform-origin: top right;
}
.profile-menu-enter-from,
.profile-menu-leave-to {
  opacity: 0;
  transform: translateY(-5px) scale(0.98);
}
@media (min-width: 769px) {
  .drawer {
    display: none;
  }
}
@media (max-width: 1100px) {
  .profile-data {
    display: none;
  }
}
@media (max-width: 768px) {
  .hse-app-header {
    padding: 10px 12px;
  }
  .nav {
    gap: 10px;
  }
  .header-select {
    order: 3;
    flex: 1 1 100%;
  }
  .nav[data-custom-layout='true'] .header-select {
    order: 0;
  }
  .user {
    display: flex;
    gap: 0;
    padding-inline-start: 8px;
  }
  .user .profile-chevron {
    margin-inline-start: 2px;
  }
  .logo {
    font-size: 14px;
    max-width: 120px;
    overflow-wrap: anywhere;
  }
  .brand-link {
    gap: 6px;
  }
  .brand-link img {
    width: 26px;
    height: 26px;
  }
  .menu,
  .setting,
  .notifications-control {
    gap: 6px;
  }
}
@media (max-width: 400px) {
  .brand-link .logo {
    max-width: 90px;
    font-size: 12px;
  }
  .brand-link img {
    width: 22px;
    height: 22px;
  }
  .drawer,
  .countery-icon :deep(button),
  .notifications-control :deep(.notification) {
    width: 36px;
    height: 36px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .hse-app-header :deep(*) {
    transition: none;
  }
  .profile-menu-enter-active,
  .profile-menu-leave-active {
    transition: none;
  }
}
</style>
