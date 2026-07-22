<script lang="ts" setup>
import { computed, markRaw, onBeforeUnmount, onMounted, ref, watch } from 'vue'
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
import { useSystemIdentity } from '@/composables/useSystemIdentity'
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
import RefreshNotificationParams from '@/features/notification/Core/params/RefreshNotificationParams.ts'
import RefreshNotificationTokenController from '@/features/notification/Presentation/controllers/RefreshNotificationTokenController.ts'
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
  <header :class="['header minmize', { 'is-dark': isDarkMode }]">
    <nav class="nav">
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
              : user?.employeeType == EmployeeStatusEnum.Employee
                ? '/organization/employee-interface'
                : '/organization'
          "
        >
          <img :src="brandLogo" :alt="$t('brand_logo', { brand: brandName })" />
          <p class="logo">{{ brandName }}</p>
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
        <Notifications class="notifications-control"  />
        <!-- {{ wsConnected }} -->
        <!-- <div class="notification cursor-pointer" @click="toggleFullScreen">
          <Notification />
        </div> -->

        <div
          ref="userMenuRef"
          class="user cursor-pointer dropdown-trigger header-user-menu"
          @click.stop="toggleDropMenu"
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

        <!-- <Teleport to="body">
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
        </Teleport> -->

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
    radial-gradient(
      circle at 18% 0%,
      color-mix(in srgb, var(--surface-1) 20%, transparent) 0 18%,
      transparent 34%
    ),
    radial-gradient(
      circle at 82% 18%,
      color-mix(in srgb, var(--brand-primary-300) 18%, transparent) 0 16%,
      transparent 34%
    ),
    linear-gradient(
      155deg,
      var(--brand-primary-500) 0%,
      var(--brand-primary-600) 44%,
      var(--brand-primary-700) 100%
    ) !important;
  border-bottom-left-radius: 22px;
  border-bottom-right-radius: 22px;
  border-top-left-radius: 22px;

  border-top-right-radius: 22px;

  box-shadow:
    0 4px 10px color-mix(in srgb, var(--brand-primary-700) 22%, transparent),
    inset 0 -1px 0 color-mix(in srgb, var(--shadow-color) 18%, transparent);
}

.header.is-dark {
  background:
    radial-gradient(
      circle at 18% 0%,
      color-mix(in srgb, var(--brand-primary-300) 16%, transparent) 0 18%,
      transparent 34%
    ),
    radial-gradient(
      circle at 82% 18%,
      color-mix(in srgb, var(--status-success) 12%, transparent) 0 16%,
      transparent 34%
    ),
    linear-gradient(
      155deg,
      var(--brand-primary-900) 0%,
      var(--brand-primary-900) 52%,
      var(--brand-primary-900) 100%
    ) !important;
  border: 1px solid color-mix(in srgb, var(--brand-primary-400) 14%, transparent);
  border-top: 0;
  box-shadow:
    0 4px 18px color-mix(in srgb, var(--shadow-color) 32%, transparent),
    inset 0 -1px 0 color-mix(in srgb, var(--brand-primary-400) 16%, transparent);
}

.header::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  background:
    linear-gradient(
      90deg,
      transparent,
      color-mix(in srgb, var(--surface-1) 16%, transparent),
      transparent
    ),
    repeating-linear-gradient(
      135deg,
      color-mix(in srgb, var(--surface-1) 4.5%, transparent) 0 1px,
      transparent 1px 18px
    );
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
  background: linear-gradient(
    90deg,
    transparent,
    var(--brand-primary-200),
    var(--surface-1),
    transparent
  );
  opacity: 0.75;
}

.header.is-dark::before {
  background:
    linear-gradient(
      90deg,
      transparent,
      color-mix(in srgb, var(--brand-primary-300) 10%, transparent),
      transparent
    ),
    repeating-linear-gradient(
      135deg,
      color-mix(in srgb, var(--brand-primary-400) 4%, transparent) 0 1px,
      transparent 1px 18px
    );
  opacity: 0.7;
}

.header.is-dark::after {
  background: linear-gradient(
    90deg,
    transparent,
    var(--brand-primary-700),
    var(--brand-primary-300),
    transparent
  );
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
  color: var(--text-on-brand);
  // background: color-mix(in srgb, var(--surface-1) 11%, transparent);
  // border: 1px solid color-mix(in srgb, var(--surface-1) 16%, transparent);
  // box-shadow: inset 0 1px 0 color-mix(in srgb, var(--surface-1) 16%, transparent);
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
  // background: color-mix(in srgb, var(--brand-primary-800) 86%, transparent) !important;
  border-color: color-mix(in srgb, var(--brand-primary-400) 20%, transparent) !important;
  // box-shadow:
  //   inset 0 1px 0 color-mix(in srgb, var(--shadow-color) 6%, transparent),
  //   0 10px 24px color-mix(in srgb, var(--shadow-color) 16%, transparent);
}

.header.is-dark .brand-link:hover,
.header.is-dark .countery-icon:hover,
.header.is-dark .notification:hover,
.header.is-dark .theme-toggle:hover,
.header.is-dark .drawer:hover,
.header.is-dark .user:hover {
  background: color-mix(in srgb, var(--brand-primary-700) 94%, transparent) !important;
  border-color: color-mix(in srgb, var(--brand-primary-300) 34%, transparent) !important;
}

.brand-link:hover {
  transform: translateY(-1px);
  background: color-mix(in srgb, var(--surface-1) 17%, transparent);
  border-color: color-mix(in srgb, var(--surface-1) 26%, transparent);
}

.brand-link img {
  width: 50px;
  height: 50px;
  padding: 6px;
  border-radius: 12px;
  // background: var(--surface-1);
  // box-shadow: 0 10px 20px color-mix(in srgb, var(--brand-primary-900) 18%, transparent);
}

.header.is-dark .brand-link img {
  // background: var(--brand-primary-100);
  box-shadow: 0 10px 20px color-mix(in srgb, var(--text-strong) 28%, transparent);
}

.logo {
  color: var(--text-on-brand) !important;
  font-size: 18px !important;
  line-height: 1;
  letter-spacing: 0;
  text-shadow: 0 1px 10px color-mix(in srgb, var(--brand-primary-900) 18%, transparent);
}

.input-wrapper {
  width: min(400px, 34vw);
  padding-inline: 0;

  :deep(.input),
  :deep(.p-select),
  :deep(.p-multiselect),
  :deep(input) {
    min-height: 46px;
    border-color: color-mix(in srgb, var(--surface-1) 24%, transparent) !important;
    background: color-mix(in srgb, var(--surface-1) 14%, transparent) !important;
    color: var(--text-on-brand) !important;
    box-shadow: inset 0 1px 0 color-mix(in srgb, var(--surface-1) 12%, transparent);
    backdrop-filter: blur(10px);
  }

  :deep(input::placeholder),
  :deep(.p-placeholder) {
    color: color-mix(in srgb, var(--surface-1) 78%, transparent) !important;
  }

  :deep(.p-select-label),
  :deep(.p-multiselect-label) {
    color: var(--text-on-brand) !important;
  }

  @media (max-width: 1000px) {
    width: 220px;
  }

  @media (max-width: 768px) {
    display: none;
  }
}

.setting {
  position: relative;
  gap: 8px !important;
  padding: 5px;
  border: 1px solid color-mix(in srgb, var(--surface-1) 18%, transparent);
  border-radius: 21px;
  background: color-mix(in srgb, var(--brand-primary-900) 12%, transparent);
  box-shadow:
    inset 0 1px 0 color-mix(in srgb, var(--surface-1) 13%, transparent),
    0 10px 30px color-mix(in srgb, var(--brand-primary-900) 10%, transparent);
  backdrop-filter: blur(14px);
}

.setting :deep(svg path) {
  transition: fill 0.2s ease;
}

.countery-icon,
.theme-toggle {
  display: flex !important;
  align-items: center;
  justify-content: center;
  width: 46px !important;
  height: 46px !important;
  padding: 10px !important;
  border-radius: 16px !important;
  background: color-mix(in srgb, var(--surface-1) 14%, transparent) !important;
  border: 1px solid color-mix(in srgb, var(--surface-1) 18%, transparent);
  color: var(--text-on-brand);
  appearance: none;
  cursor: pointer;
  box-shadow: inset 0 1px 0 color-mix(in srgb, var(--surface-1) 14%, transparent);
  backdrop-filter: blur(10px);
  transition:
    transform 0.2s ease,
    background 0.2s ease,
    border-color 0.2s ease;
}

.countery-icon:hover,
.theme-toggle:hover {
  transform: translateY(-1px);
  background: color-mix(in srgb, var(--surface-1) 22%, transparent) !important;
  border-color: color-mix(in srgb, var(--surface-1) 30%, transparent);
}

.countery-icon :deep(svg),
.theme-toggle svg {
  width: 22px;
  height: 22px;
}

.drawer :deep(path),
.drop-icon :deep(path) {
  fill: var(--text-on-brand) !important;
}

.notifications-control {
  display: inline-flex;
  flex: none;
}

.notifications-control :deep(.notification) {
  border-color: color-mix(in srgb, var(--surface-1) 18%, transparent);
}

.notifications-control :deep(.circle-icon path) {
  fill: none !important;
  stroke: var(--text-on-brand) !important;
}

.theme-toggle path {
  stroke: currentColor;
}

.drawer {
  width: 42px;
  height: 42px;
  border-radius: 14px;
  color: var(--text-on-brand);
  background: color-mix(in srgb, var(--surface-1) 14%, transparent);
  border: 1px solid color-mix(in srgb, var(--surface-1) 18%, transparent);
  appearance: none;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    background 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    background: color-mix(in srgb, var(--surface-1) 22%, transparent);
  }

  @media (min-width: 769px) {
    display: none;
  }
}

.user {
  position: relative;
  min-height: 54px;
  padding: 7px 8px 7px 14px;
  border-radius: 20px;
  color: var(--text-on-brand);
  background: color-mix(in srgb, var(--surface-1) 14%, transparent);
  border: 1px solid color-mix(in srgb, var(--surface-1) 18%, transparent);
  box-shadow: inset 0 1px 0 color-mix(in srgb, var(--surface-1) 14%, transparent);
  backdrop-filter: blur(10px);
  transition:
    transform 0.2s ease,
    background 0.2s ease,
    border-color 0.2s ease;
}

.user:hover {
  transform: translateY(-1px);
  background: color-mix(in srgb, var(--surface-1) 20%, transparent);
  border-color: color-mix(in srgb, var(--surface-1) 28%, transparent);
}

.user img {
  width: 42px !important;
  height: 42px;
  object-fit: cover;
  border: 2px solid color-mix(in srgb, var(--surface-1) 78%, transparent);
  box-shadow: 0 10px 22px color-mix(in srgb, var(--brand-primary-900) 20%, transparent);
}

.profile-data {
  min-width: 116px;
}

.profile-data span:first-child {
  color: var(--text-on-brand) !important;
  min-width: 0 !important;
  font-size: 14px;
  font-weight: 800;
}

.profile-data span:last-child {
  color: color-mix(in srgb, var(--brand-primary-100) 82%, transparent) !important;
  margin-left: auto !important;
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
  background: var(--surface-1) !important;
  border: 1px solid color-mix(in srgb, var(--brand-primary-600) 10%, transparent);
  box-shadow: 0 22px 48px color-mix(in srgb, var(--brand-primary-900) 18%, transparent) !important;
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
  color: var(--brand-primary-700) !important;
  cursor: pointer;
  transition:
    color 0.2s ease,
    background 0.2s ease;
}

:global(.header-dropdown-menu li:hover) {
  background: var(--brand-primary-50) !important;
  color: var(--brand-primary-500) !important;
}

:global(.header-dropdown-menu li:hover svg path) {
  fill: var(--brand-primary-500) !important;
}

:global([data-theme='dark'] .header-dropdown-menu) {
  background: var(--brand-primary-900) !important;
  border-color: var(--brand-primary-700) !important;
}

:global([data-theme='dark'] .header-dropdown-menu li) {
  color: var(--brand-primary-50) !important;
}

:global([data-theme='dark'] .header-dropdown-menu li:hover) {
  background: var(--brand-primary-800) !important;
  color: var(--brand-primary-300) !important;
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

  .setting {
    gap: 5px !important;
    padding: 4px;
    border-radius: 18px;
  }

  .countery-icon,
  .notifications-control :deep(.notification) {
    width: 42px !important;
    height: 42px !important;
    border-radius: 14px !important;
  }
}
</style>
