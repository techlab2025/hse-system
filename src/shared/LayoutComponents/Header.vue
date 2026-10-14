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
import OrganizationEmployeeDefaultProjectRepoController from '@/features/auth/presentation/controllers/OrganizationEmployeeDefaultProjectRepoController'
import OrganizationEmployeeDefaultProjectParams from '@/features/auth/Core/Params/OrganizationEmployeeDefaultProjectParams'
import FetchMyProjectsController from '@/features/Organization/ObservationFactory/Presentation/controllers/FetchMyProjectsController'
import FetchMyProjectsParams from '@/features/Organization/ObservationFactory/Core/params/fetchMyProjectsParams'
import { useToast } from 'primevue/usetoast'
import Notifications from './Notifications.vue'
import { useThemeMode } from '@/composables/useThemeMode'
import ConditionHandler from '@/base/Presentation/utils/condition_handler'
// import { NOTIFICATION_SOUND_BASE64 } from '@/base/Presentation/utils/notification_ring.ts'

const route = useRoute()
const conditionHandler = ConditionHandler.getInstance()
// console.log(route.name)
// defineEmits(["open"]);

const props = defineProps({
  open: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['open'])

const language = ref<string>('')
const { isDarkMode, initThemeMode, toggleThemeMode } = useThemeMode()
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
const dropdownPosition = ref<Record<string, string>>({})

const updateDropdownPosition = () => {
  const rect = userMenuRef.value?.getBoundingClientRect()
  if (!rect) return

  const isRtl = document.documentElement.dir === 'rtl'
  dropdownPosition.value = {
    top: `${rect.bottom + 12}px`,
    ...(isRtl ? { left: `${rect.left}px` } : { right: `${window.innerWidth - rect.right}px` }),
  }
}

const toggleDropMenu = () => {
  if (!isDropMenuOpen.value) {
    updateDropdownPosition()
  }
  isDropMenuOpen.value = !isDropMenuOpen.value
}

const openUserProfile = () => {
  const currentUser = useUserStore().user
  if (currentUser?.type !== OrganizationTypeEnum.ORGANIZATION || !currentUser.id) {
    toggleDropMenu()
    return
  }

  isDropMenuOpen.value = false
  router.push({ name: 'Show Organization Employee', params: { id: currentUser.id } })
}

// fetch user store data
const { user } = useUserStore()
const ProjectSelector = useProjectSelectStore()

const SelectProject = computed(() => {
  const routeProjectId = Number(route.query.project_id)
  if (routeProjectId > 0) {
    return (
      ProjectSelector.AllProjects.find((project) => project.id === routeProjectId) ??
      new TitleInterface({ id: routeProjectId, title: `Project #${routeProjectId}` })
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
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateDropdownPosition)
  window.removeEventListener('scroll', updateDropdownPosition, true)
})

const setSelectedProject = async (project: TitleInterface | null) => {
  const organizationEmployeeDefaultProjectRepoController =
    OrganizationEmployeeDefaultProjectRepoController.getInstance()
  const organizationEmployeeDefaultProjectParams = new OrganizationEmployeeDefaultProjectParams(
    user?.id,
    project?.id === -1 || !project ? null : project.id,
  )
  await organizationEmployeeDefaultProjectRepoController.SetorganizationEmployeeDefaultProject(
    organizationEmployeeDefaultProjectParams,
    router,
  )
  // SelectProject.value = project
  if (project?.id === -1 || !project) {
    ProjectSelector.clearProject()
  } else {
    ProjectSelector.setProjectId(project)
  }
  // location.reload()
}

const showProjectSelect = ref<boolean>(false)
onMounted(() => {
  showProjectSelect.value =
    user?.type == OrganizationTypeEnum.ADMIN || conditionHandler.shouldUseEmployeeInterface()
})

const userStore = useUserStore()
const toast = useToast()
// const NOTIFICATION_SOUND_BASE64 =
//   'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIF2W56+mmUBELTKXh8bllHAU2jdXvyn0tBSh+zPLaizsKGGS46Om1XBoFM4nU8c1+LgYngM3y3I4+ChlluOvpplARC0ul4fG5ZRwFNo3V78p9LQUofszy2os7ChhluevrpVERC0yn4fG3ZBwFOI7U8ct+LQUoftDy24k7ChZluujoplARDEul4e+3ZRwGOY/V8Mp/LgYpf9Dy3Ik7CxZluejpplARDEym4fG3ZBwFOI/V8cp+LQYoftDy24o7ChZmuejpplARDEym4fG3YxwFOI/V8Ml/LgYof9Dy3Io7ChZmuujqplARDEym4fG3YxwFOI/V8Ml/LgYof9Dy3Io7ChZmuejpplARDEym4fG3YxwFOI/V8Ml/LgYof9Dy3Io7ChZmuejpplARDEym4fG3YxwFOI/V8Ml/LgYof9Dy3Io7ChZmuejpplARDEym4fG3YxwFOI/V8Ml/LgYof9Dy3Io7ChZmuejpplARDEym4fG3YxwFOI/V8Ml/LgYof9Dy3Io7ChZmuejpplARDEym4fG3YxwFOI/V8Ml/LgYof9Dy3Io7ChZmuejpplARDEym4fG3YxwFOI/V8Ml/LgYof9Dy3Io7ChZmuejpplARDEym4fG3YxwFOI/V8Ml/LgYof9Dy3Io7ChZmuejpplARDEym4fG3YxwFOI/V8Ml/LgYof9Dy3Io7ChZmuejpplARDEym4fG3YxwFOI/V8Ml/LgYof9Dy3Io7ChZmuejpplARDEym4fG3YxwFOI/V8Ml/LgYof9Dy3Io7ChZmuejpplARDEym4fG3YxwFOI/V8Ml/LgYof9Dy3Io7ChZmuejpplARDEym4fG3YxwFOI/V8Ml/LgYof9Dy3Io7ChZmuejpplARDEym4fG3YxwFOI/V8Ml/'

// Integrate new notification system
// const { notifications, unreadCount, acknowledgeNotification, wsConnected } =
// useIntegratedNotifications({
//   autoConnect: true,
//   token: userStore.user?.WebSocketToken,
//   // token: 'st_yzJJdPw8s4Dm_OSNQNVoUvt0PK8KYZzca2r1JTd9_MA',
//   userId: userStore.user?.id,
//   fetchNotifications: true,
//   userToken: userStore.user?.apiToken,

//   onNotification: (notification) => {
//     console.log(notification)
//     // make ring sound
//     const audio = new Audio(NOTIFICATION_SOUND_BASE64)
//     audio.play()

//     // Show global toast
//     toast.add({
//       severity: 'info',
//       summary: notification.title,
//       detail: wordSlice(JSON.parse(notification?.body!)?.message, 35) || notification.body,
//       life: 5000,
//     })
//   },
// })
const op = ref()

const toggle = (event: Event) => {
  op.value.toggle(event)
}

// const refreshNotificationTokenController = RefreshNotificationTokenController.getInstance();
// watch(()=>wsConnected , async (newvalue)=>{
//   console.log(wsConnected , "wsConnected");
//   if(!newvalue){
//     const params = new RefreshNotificationParams()
//    const result = await refreshNotificationTokenController.RefreshToken(params);
//   }
// })
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
        <template #notifications><Notifications class="notifications-control" /></template>
        <template #profile>
          <div
            ref="userMenuRef"
            class="user cursor-pointer dropdown-trigger header-user-menu"
            role="link"
            tabindex="0"
            @click.stop="openUserProfile"
            @keydown.enter.stop="openUserProfile"
          >
            <!--  <IconArrowDownNav class="drop-icon" /> -->
            <div class="profile-data">
              <span>{{ user?.name.split(' ')[0] }}</span>
              <!-- <span>{{ user?.type == OrganizationTypeEnum.ADMIN ? 'Admin' : 'Organization' }}</span> -->
              <span>{{ user?.organizationName }}</span>
            </div>

            <!-- <img alt="user" src="../../assets/images/travel.png" /> -->
            <img src="https://cyber.comolho.com/static/img/avatar.png" :alt="$t('employee')" />
          </div>
        </template>
      </IdentityHeaderLayout>
    </nav>
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
.notifications-control :deep(.image-refresh) {
  width: 32px;
  height: 32px;
  margin: 0;
  border-radius: 9px;
  background: var(--hse-project-navy);
}
.user {
  gap: 10px;
  min-width: 0;
  padding: 0 0 0 10px;
  border: 0;
  border-inline-start: 1px solid var(--hse-project-line);
  border-radius: 0;
  color: var(--hse-project-ink);
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
    display: none;
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
}
</style>
