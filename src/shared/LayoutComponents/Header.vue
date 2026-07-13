<script lang="ts" setup>
import { computed, markRaw, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
// import IconFullScreen from '@/shared/icons/IconFullScreen.vue'
import IconMenu from '@/shared/icons/IconMenu.vue'
import IconLogout from '@/shared/icons/IconLogout.vue'
import IconArrowDownNav from '@/shared/icons/IconArrowDownNav.vue'
import { setDefaultImage } from '@/base/Presentation/utils/set_default_image'
// import { setDefaultImage } from "@/base/Presentation/utils/set_default_image";
// import { useUserStore } from "@/stores/user";
// import defaultImage from "@/assets/images/user.png";
import ChangeLanguage from './ChangeLanguage.vue'
import Notification from '../icons/Notification.vue'
import SearchIcon from '../icons/SearchIcon.vue'
import { useUserStore } from '@/stores/user'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'
import defaultLogo from '@/assets/images/logo.svg'
import CustomSelectInput from '../FormInputs/CustomSelectInput.vue'
import IndexProjectController from '@/features/Organization/Project/Presentation/controllers/indexProjectController'
import IndexProjectParams from '@/features/Organization/Project/Core/params/indexProjectParams'
import TitleInterface from '@/base/Data/Models/title_interface'
import { useProjectSelectStore } from '@/stores/ProjectSelect'
import OrganizationEmployeeDefaultProjectRepoController from '@/features/auth/presentation/controllers/OrganizationEmployeeDefaultProjectRepoController'
import OrganizationEmployeeDefaultProjectParams from '@/features/auth/Core/Params/OrganizationEmployeeDefaultProjectParams'
import { EmployeeStatusEnum } from '@/features/Organization/OrganizationEmployee/Core/Enum/EmployeeStatus'
import FetchMyProjectsController from '@/features/Organization/ObservationFactory/Presentation/controllers/FetchMyProjectsController'
import FetchMyProjectsParams from '@/features/Organization/ObservationFactory/Core/params/fetchMyProjectsParams'
import { useIntegratedNotifications } from '@/composables/useIntegratedNotifications'
import { useToast } from 'primevue/usetoast'
import wordSlice from '@/base/Presentation/utils/word_slice'
import Notifications from './Notifications.vue'
import Ring from '@/assets/Ring/Ring.txt'
import { useThemeMode } from '@/composables/useThemeMode'
// import { NOTIFICATION_SOUND_BASE64 } from '@/base/Presentation/utils/notification_ring.ts'

const route = useRoute()
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

// fetch user store data
const { user } = useUserStore()
const ProjectSelector = useProjectSelectStore()

const SelectProject = ref<TitleInterface>(
  new TitleInterface({
    id: ProjectSelector.getProject()?.id,
    title: ProjectSelector.getProject()?.title,
  }),
)
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

const setSelectedProject = async (project: TitleInterface) => {
  const organizationEmployeeDefaultProjectRepoController =
    OrganizationEmployeeDefaultProjectRepoController.getInstance()
  const organizationEmployeeDefaultProjectParams = new OrganizationEmployeeDefaultProjectParams(
    user?.id,
    project?.id == -1 ? null : project?.id,
  )
  await organizationEmployeeDefaultProjectRepoController.SetorganizationEmployeeDefaultProject(
    organizationEmployeeDefaultProjectParams,
    router,
  )
  // SelectProject.value = project
  ProjectSelector.setProjectId(project)
  // location.reload()
}

const showProjectSelect = ref<boolean>(false)
onMounted(() => {
  showProjectSelect.value =
    user?.type == OrganizationTypeEnum.ADMIN || user?.employeeType == EmployeeStatusEnum.Employee
})

const userStore = useUserStore()
const toast = useToast()
const NOTIFICATION_SOUND_BASE64 =
  'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIF2W56+mmUBELTKXh8bllHAU2jdXvyn0tBSh+zPLaizsKGGS46Om1XBoFM4nU8c1+LgYngM3y3I4+ChlluOvpplARC0ul4fG5ZRwFNo3V78p9LQUofszy2os7ChhluevrpVERC0yn4fG3ZBwFOI7U8ct+LQUoftDy24k7ChZluujoplARDEul4e+3ZRwGOY/V8Mp/LgYpf9Dy3Ik7CxZluejpplARDEym4fG3ZBwFOI/V8cp+LQYoftDy24o7ChZmuejpplARDEym4fG3YxwFOI/V8Ml/LgYof9Dy3Io7ChZmuujqplARDEym4fG3YxwFOI/V8Ml/LgYof9Dy3Io7ChZmuejpplARDEym4fG3YxwFOI/V8Ml/LgYof9Dy3Io7ChZmuejpplARDEym4fG3YxwFOI/V8Ml/LgYof9Dy3Io7ChZmuejpplARDEym4fG3YxwFOI/V8Ml/LgYof9Dy3Io7ChZmuejpplARDEym4fG3YxwFOI/V8Ml/LgYof9Dy3Io7ChZmuejpplARDEym4fG3YxwFOI/V8Ml/LgYof9Dy3Io7ChZmuejpplARDEym4fG3YxwFOI/V8Ml/LgYof9Dy3Io7ChZmuejpplARDEym4fG3YxwFOI/V8Ml/LgYof9Dy3Io7ChZmuejpplARDEym4fG3YxwFOI/V8Ml/LgYof9Dy3Io7ChZmuejpplARDEym4fG3YxwFOI/V8Ml/LgYof9Dy3Io7ChZmuejpplARDEym4fG3YxwFOI/V8Ml/LgYof9Dy3Io7ChZmuejpplARDEym4fG3YxwFOI/V8Ml/LgYof9Dy3Io7ChZmuejpplARDEym4fG3YxwFOI/V8Ml/LgYof9Dy3Io7ChZmuejpplARDEym4fG3YxwFOI/V8Ml/'

// Integrate new notification system
const { notifications, unreadCount, acknowledgeNotification, wsConnected } =
  useIntegratedNotifications({
    autoConnect: true,
    token: userStore.user?.WebSocketToken,
    // token: 'st_yzJJdPw8s4Dm_OSNQNVoUvt0PK8KYZzca2r1JTd9_MA',
    userId: userStore.user?.id,
    fetchNotifications: true,
    userToken: userStore.user?.apiToken,

    onNotification: (notification) => {
      console.log(notification)
      // make ring sound
      const audio = new Audio(NOTIFICATION_SOUND_BASE64)
      audio.play()

      // Show global toast
      toast.add({
        severity: 'info',
        summary: notification.title,
        detail: wordSlice(JSON.parse(notification?.body!)?.message, 35) || notification.body,
        life: 5000,
      })
    },
  })
const op = ref()

const toggle = (event: Event) => {
  op.value.toggle(event)
}
</script>

<template>
  <!-- {{ notifications }} -->
  <header :class="['header minmize', { 'is-dark': isDarkMode }]">
    <nav class="nav">
      <div class="menu flex items-center gap-3">
        <span
          class="drawer cursor-pointer flex items-center justify-center p-1"
          @click="emit('open')"
        >
          <IconMenu />
        </span>
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
              : user?.employeeType == EmployeeStatusEnum.Employee
                ? '/organization/employee-interface'
                : '/organization'
          "
        >
          <img :src="defaultLogo" alt="logo-img" />
          <p class="logo">HSE.Cloud.Ai</p>
        </router-link>
      </div>

      <div
        class="input-wrapper header-select"
        v-if="!showProjectSelect && user?.type != OrganizationTypeEnum.ADMIN"
      >
        <!-- label="Project" -->
        <CustomSelectInput
          :modelValue="SelectProject"
          class="input"
          :staticOptions="ProjectSelector.AllProjects"
          id="project"
          :placeholder="$t('select your project')"
          @update:modelValue="setSelectedProject"
          :reload="false"
          label=""
        />
      </div>
      <!-- <div class="search">
        <SearchIcon />
        <input type="serach" placeholder="Search What You Want" />
      </div> -->

      <div class="setting">
        <ChangeLanguage class="countery-icon" />
        <!-- <button
          class="theme-toggle"
          type="button"
          :aria-label="isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'"
          :title="isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'"
          @click="toggleThemeMode"
        >
          <svg
            v-if="isDarkMode"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 4V2M12 22v-2M4.93 4.93 3.52 3.52M20.48 20.48l-1.41-1.41M4 12H2M22 12h-2M4.93 19.07l-1.41 1.41M20.48 3.52l-1.41 1.41"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            />
            <path
              d="M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z"
              stroke="currentColor"
              stroke-width="2"
            />
          </svg>
          <svg
            v-else
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20.35 15.35A8.5 8.5 0 0 1 8.65 3.65 8.5 8.5 0 1 0 20.35 15.35Z"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button> -->
        <Notifications />
        <!-- {{ wsConnected }} -->
        <!-- <div class="notification cursor-pointer" @click="toggleFullScreen">
          <Notification />
        </div> -->

        <div
          ref="userMenuRef"
          class="user cursor-pointer dropdown-trigger header-user-menu"
          @click.stop="toggleDropMenu"
        >
          <IconArrowDownNav class="drop-icon" />
          <div class="profile-data">
            <span>{{ user?.name.split(' ')[0] }}</span>
            <!-- <span>{{ user?.type == OrganizationTypeEnum.ADMIN ? 'Admin' : 'Organization' }}</span> -->
            <span>{{ user?.organizationName }}</span>
          </div>

          <!-- <img alt="user" src="../../assets/images/travel.png" /> -->
          <img src="https://cyber.comolho.com/static/img/avatar.png" alt="employee" />
        </div>

        <Teleport to="body">
          <div
            class="header-dropdown-menu"
            v-if="isDropMenuOpen"
            :style="dropdownPosition"
            @click.stop
          >
            <ul>
              <li @click.stop="logout">
                <IconLogout />
                <span> {{ $t('logout') }} </span>
              </li>
            </ul>
          </div>
        </Teleport>

        <!-- <button class="notification" type="button" @click="toggle">
          <Notifacations />
          <span v-if="wsConnected" class="status-dot connected"></span>
          <span v-else class="status-dot disconnected"></span>
          <span v-if="unreadCount > 0" class="notification-count">
            {{ unreadCount }}
          </span>
        </button>
        <Popover ref="op">
          <div class="list-notifaction-body">
            <ul class="list-notifaction">
              <li v-if="notifications.length === 0" class="list-notifaction-item empty-msg">
                No new notifications
              </li>
              <li v-for="notification in notifications" :key="notification.id" class="list-notifaction-item"
                :class="{ 'new-item': notification.status === 'PENDING' }">
                <div class="notification-content-wrapper">
                  <RouterLink :to="`/daily-work/${JSON.parse(notification?.body!)?.data?.type_id}`"
                    class="notification-text">
                    <strong>{{ wordSlice(notification.title, 25) }}</strong>
                    <p>
                      {{
                        wordSlice(JSON.parse(notification?.body!)?.message, 35)
                      }}
                    </p>
                    <small v-if="notification.receivedAt">{{
                      notification.receivedAt.toLocaleTimeString()
                    }}</small>
                  </RouterLink>

                </div>
              </li>

            </ul>
          </div>
        </Popover> -->
      </div>
    </nav>
  </header>
</template>

<style scoped lang="scss">
.input-wrapper :deep(label) {
  display: none !important;
}

.header {
  position: sticky;
  top: 6px;
  z-index: 80;
  overflow: visible;
  isolation: isolate;
  padding: 14px 22px;
  min-height: 76px;
  background:
    radial-gradient(circle at 18% 0%, rgba(255, 255, 255, 0.2) 0 18%, transparent 34%),
    radial-gradient(circle at 82% 18%, rgba(125, 211, 252, 0.18) 0 16%, transparent 34%),
    linear-gradient(155deg, #1d4ed8 0%, #1e40af 44%, #0f2f80 100%) !important;
  border-bottom-left-radius: 22px;
  border-bottom-right-radius: 22px;
  border-top-left-radius: 22px;

  border-top-right-radius: 22px;

  box-shadow:
    0 4px 10px rgba(10, 54, 129, 0.22),
    inset 0 -1px 0 rgba(255, 255, 255, 0.18);
}

.header.is-dark {
  background:
    radial-gradient(circle at 18% 0%, rgba(96, 165, 250, 0.16) 0 18%, transparent 34%),
    radial-gradient(circle at 82% 18%, rgba(20, 184, 166, 0.12) 0 16%, transparent 34%),
    linear-gradient(155deg, #111827 0%, #0f172a 52%, #07111f 100%) !important;
  border: 1px solid rgba(148, 163, 184, 0.14);
  border-top: 0;
  box-shadow:
    0 4px 18px rgba(0, 0, 0, 0.32),
    inset 0 -1px 0 rgba(148, 163, 184, 0.16);
}

.header::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  background:
    linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.16), transparent),
    repeating-linear-gradient(135deg, rgba(255, 255, 255, 0.045) 0 1px, transparent 1px 18px);
  opacity: 0.78;
}

.header::after {
  content: '';
  position: absolute;
  right: 26%;
  bottom: -1px;
  width: 220px;
  height: 3px;
  border-radius: 999px;
  background: linear-gradient(90deg, transparent, #93c5fd, #ffffff, transparent);
  opacity: 0.75;
}

.header.is-dark::before {
  background:
    linear-gradient(90deg, transparent, rgba(96, 165, 250, 0.1), transparent),
    repeating-linear-gradient(135deg, rgba(148, 163, 184, 0.04) 0 1px, transparent 1px 18px);
  opacity: 0.7;
}

.header.is-dark::after {
  background: linear-gradient(90deg, transparent, #334155, #60a5fa, transparent);
  opacity: 0.65;
}

.nav {
  position: relative;
  gap: 16px;
}

.brand-link {
  min-height: 48px;
  padding: 7px 12px 7px 8px;
  border-radius: 18px;
  color: #ffffff;
  // background: rgba(255, 255, 255, 0.11);
  // border: 1px solid rgba(255, 255, 255, 0.16);
  // box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.16);
  transition:
    transform 0.2s ease,
    background 0.2s ease,
    border-color 0.2s ease;
}

.header.is-dark .brand-link,
.header.is-dark .countery-icon,
.header.is-dark .notification,
.header.is-dark .theme-toggle,
.header.is-dark .drawer,
.header.is-dark .user {
  // background: rgba(30, 41, 59, 0.86) !important;
  border-color: rgba(148, 163, 184, 0.2) !important;
  // box-shadow:
  //   inset 0 1px 0 rgba(255, 255, 255, 0.06),
  //   0 10px 24px rgba(0, 0, 0, 0.16);
}

.header.is-dark .brand-link:hover,
.header.is-dark .countery-icon:hover,
.header.is-dark .notification:hover,
.header.is-dark .theme-toggle:hover,
.header.is-dark .drawer:hover,
.header.is-dark .user:hover {
  background: rgba(51, 65, 85, 0.94) !important;
  border-color: rgba(96, 165, 250, 0.34) !important;
}

.brand-link:hover {
  transform: translateY(-1px);
  background: rgba(255, 255, 255, 0.17);
  border-color: rgba(255, 255, 255, 0.26);
}

.brand-link img {
  width: 34px;
  height: 34px;
  padding: 6px;
  border-radius: 12px;
  // background: #ffffff;
  // box-shadow: 0 10px 20px rgba(15, 23, 42, 0.18);
}

.header.is-dark .brand-link img {
  // background: #e2e8f0;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.28);
}

.logo {
  color: #ffffff !important;
  font-size: 18px !important;
  line-height: 1;
  letter-spacing: 0;
  text-shadow: 0 1px 10px rgba(15, 23, 42, 0.18);
}

.input-wrapper {
  width: min(400px, 34vw);
  padding-inline: 0;

  :deep(.input),
  :deep(.p-select),
  :deep(.p-multiselect),
  :deep(input) {
    min-height: 46px;
    border-color: rgba(255, 255, 255, 0.24) !important;
    background: rgba(255, 255, 255, 0.14) !important;
    color: #ffffff !important;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.12);
    backdrop-filter: blur(10px);
  }

  :deep(input::placeholder),
  :deep(.p-placeholder) {
    color: rgba(255, 255, 255, 0.78) !important;
  }

  :deep(.p-select-label),
  :deep(.p-multiselect-label) {
    color: #ffffff !important;
  }

  @media (max-width: 1000px) {
    width: 220px;
  }

  @media (max-width: 768px) {
    display: none;
  }
}

.setting {
  gap: 12px !important;
}

.setting :deep(svg path) {
  transition: fill 0.2s ease;
}

.countery-icon,
.notification,
.theme-toggle {
  display: flex !important;
  align-items: center;
  justify-content: center;
  width: 46px !important;
  height: 46px !important;
  padding: 10px !important;
  border-radius: 16px !important;
  background: rgba(255, 255, 255, 0.14) !important;
  border: 1px solid rgba(255, 255, 255, 0.18);
  color: #ffffff;
  appearance: none;
  cursor: pointer;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.14);
  backdrop-filter: blur(10px);
  transition:
    transform 0.2s ease,
    background 0.2s ease,
    border-color 0.2s ease;
}

.countery-icon:hover,
.notification:hover,
.theme-toggle:hover {
  transform: translateY(-1px);
  background: rgba(255, 255, 255, 0.22) !important;
  border-color: rgba(255, 255, 255, 0.3);
}

.countery-icon :deep(svg),
.notification :deep(svg),
.theme-toggle svg {
  width: 22px;
  height: 22px;
}

.notification :deep(path),
.drawer :deep(path),
.drop-icon :deep(path) {
  fill: #ffffff !important;
}

.theme-toggle path {
  stroke: currentColor;
}

.drawer {
  width: 42px;
  height: 42px;
  border-radius: 14px;
  color: #ffffff;
  background: rgba(255, 255, 255, 0.14);
  border: 1px solid rgba(255, 255, 255, 0.18);
  transition:
    transform 0.2s ease,
    background 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    background: rgba(255, 255, 255, 0.22);
  }

  @media (min-width: 768px) {
    display: none;
  }
}

.user {
  position: relative;
  min-height: 54px;
  padding: 7px 8px 7px 14px;
  border-radius: 20px;
  color: #ffffff;
  background: rgba(255, 255, 255, 0.14);
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.14);
  backdrop-filter: blur(10px);
  transition:
    transform 0.2s ease,
    background 0.2s ease,
    border-color 0.2s ease;
}

.user:hover {
  transform: translateY(-1px);
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.28);
}

.user img {
  width: 42px !important;
  height: 42px;
  object-fit: cover;
  border: 2px solid rgba(255, 255, 255, 0.78);
  box-shadow: 0 10px 22px rgba(15, 23, 42, 0.2);
}

.profile-data {
  min-width: 116px;
}

.profile-data span:first-child {
  color: #ffffff !important;
  min-width: 0 !important;
  font-size: 14px;
  font-weight: 800;
}

.profile-data span:last-child {
  color: rgba(226, 232, 240, 0.82) !important;
  margin-left: 0 !important;
  font-size: 12px;
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.drop-icon {
  order: 3;
  width: 18px;
  height: 18px;
  opacity: 0.9;
}

:global(.header-dropdown-menu) {
  position: fixed;
  z-index: 10000;
  min-width: 178px !important;
  overflow: hidden;
  padding: 6px;
  border-radius: 16px !important;
  background: #ffffff !important;
  border: 1px solid rgba(30, 64, 175, 0.1);
  box-shadow: 0 22px 48px rgba(15, 23, 42, 0.18) !important;
}

:global(.header-dropdown-menu ul) {
  margin: 0;
  padding: 0;
  list-style: none;
}

:global(.header-dropdown-menu li) {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 12px !important;
  color: #334155 !important;
  cursor: pointer;
  transition:
    color 0.2s ease,
    background 0.2s ease;
}

:global(.header-dropdown-menu li:hover) {
  background: #eef4ff !important;
  color: #1d4ed8 !important;
}

:global(.header-dropdown-menu li:hover svg path) {
  fill: #1d4ed8 !important;
}

:global([data-theme='dark'] .header-dropdown-menu) {
  background: #111827 !important;
  border-color: #334155 !important;
}

:global([data-theme='dark'] .header-dropdown-menu li) {
  color: #f8fafc !important;
}

:global([data-theme='dark'] .header-dropdown-menu li:hover) {
  background: #1e293b !important;
  color: #60a5fa !important;
}

.header-user-menu {
  @media (max-width: 768px) {
    display: none !important;
  }
}

@media (max-width: 768px) {
  .header {
    min-height: 66px;
    padding: 10px 14px;
    border-bottom-left-radius: 18px;
    border-bottom-right-radius: 18px;
  }

  .brand-link {
    min-height: 44px;
    padding: 6px 10px 6px 7px;
  }

  .brand-link img {
    width: 30px;
    height: 30px;
  }

  .logo {
    font-size: 16px !important;
  }
}
</style>
