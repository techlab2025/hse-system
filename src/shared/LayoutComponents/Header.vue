<script lang="ts" setup>
import { computed, markRaw, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
// import IconFullScreen from '@/shared/icons/IconFullScreen.vue'
// import IconMenu from '@/shared/icons/IconMenu.vue'
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
import { useIntegratedNotifications } from "@/composables/useIntegratedNotifications";
import { useToast } from "primevue/usetoast";
import wordSlice from '@/base/Presentation/utils/word_slice'


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

const router = useRouter()
// const userStore = useUserStore();

const logout = () => {
  if (user?.type == OrganizationTypeEnum.ADMIN) {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    localStorage.removeItem('ProjectSelect')
    window.location.href = '/login/admin'
  }
  else if (user?.type == OrganizationTypeEnum.ORGANIZATION) {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    localStorage.removeItem('ProjectSelect')
    window.location.href = '/login/organization'
  }
  // router.push("/login");
}

const isDropMenuOpen = ref(false)

const toggleDropMenu = () => {
  isDropMenuOpen.value = !isDropMenuOpen.value
}

// fetch user store data
const { user } = useUserStore()
const ProjectSelector = useProjectSelectStore()

const SelectProject = ref<TitleInterface>(new TitleInterface({ id: ProjectSelector.getProject()?.id, title: ProjectSelector.getProject()?.title }))
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
  GetAllProjects()
})


const setSelectedProject = async (project: TitleInterface) => {
  const organizationEmployeeDefaultProjectRepoController = OrganizationEmployeeDefaultProjectRepoController.getInstance()
  const organizationEmployeeDefaultProjectParams = new OrganizationEmployeeDefaultProjectParams(user?.id, project?.id == -1 ? null : project?.id)
  await organizationEmployeeDefaultProjectRepoController.SetorganizationEmployeeDefaultProject(organizationEmployeeDefaultProjectParams, router)
  // SelectProject.value = project
  ProjectSelector.setProjectId(project)
  // location.reload()
}

const showProjectSelect = ref<boolean>(false)
onMounted(() => {
  showProjectSelect.value = user?.type == OrganizationTypeEnum.ADMIN || user?.employeeType == EmployeeStatusEnum.Employee
})

const userStore = useUserStore()
const toast = useToast();
const NOTIFICATION_SOUND_BASE64 =
  "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIF2W56+mmUBELTKXh8bllHAU2jdXvyn0tBSh+zPLaizsKGGS46Om1XBoFM4nU8c1+LgYngM3y3I4+ChlluOvpplARC0ul4fG5ZRwFNo3V78p9LQUofszy2os7ChhluevrpVERC0yn4fG3ZBwFOI7U8ct+LQUoftDy24k7ChZluujoplARDEul4e+3ZRwGOY/V8Mp/LgYpf9Dy3Ik7CxZluejpplARDEym4fG3ZBwFOI/V8cp+LQYoftDy24o7ChZmuejpplARDEym4fG3YxwFOI/V8Ml/LgYof9Dy3Io7ChZmuujqplARDEym4fG3YxwFOI/V8Ml/LgYof9Dy3Io7ChZmuejpplARDEym4fG3YxwFOI/V8Ml/LgYof9Dy3Io7ChZmuejpplARDEym4fG3YxwFOI/V8Ml/LgYof9Dy3Io7ChZmuejpplARDEym4fG3YxwFOI/V8Ml/LgYof9Dy3Io7ChZmuejpplARDEym4fG3YxwFOI/V8Ml/LgYof9Dy3Io7ChZmuejpplARDEym4fG3YxwFOI/V8Ml/LgYof9Dy3Io7ChZmuejpplARDEym4fG3YxwFOI/V8Ml/LgYof9Dy3Io7ChZmuejpplARDEym4fG3YxwFOI/V8Ml/LgYof9Dy3Io7ChZmuejpplARDEym4fG3YxwFOI/V8Ml/LgYof9Dy3Io7ChZmuejpplARDEym4fG3YxwFOI/V8Ml/LgYof9Dy3Io7ChZmuejpplARDEym4fG3YxwFOI/V8Ml/LgYof9Dy3Io7ChZmuejpplARDEym4fG3YxwFOI/V8Ml/LgYof9Dy3Io7ChZmuejpplARDEym4fG3YxwFOI/V8Ml/LgYof9Dy3Io7ChZmuejpplARDEym4fG3YxwFOI/V8Ml/LgYof9Dy3Io7ChZmuejpplARDEym4fG3YxwFOI/V8Ml/";

// Integrate new notification system
// const { notifications, unreadCount, acknowledgeNotification, wsConnected } =
//   useIntegratedNotifications({
//     autoConnect: true,
//     token: userStore.user?.apiToken,
//     userId: userStore.user?.id,
//     fetchNotifications: true,
//     userToken: userStore.user?.apiToken,

//     onNotification: (notification) => {
//       console.log(notification);
//       // make ring sound
//       const audio = new Audio(NOTIFICATION_SOUND_BASE64);
//       audio.play();

//       // Show global toast
//       toast.add({
//         severity: "info",
//         summary: notification.title,
//         detail:
//           wordSlice(JSON.parse(notification?.body!)?.message, 35) ||
//           notification.body,
//         life: 5000,
//       });
//     },
//   });
const op = ref();

const toggle = (event: Event) => {
  op.value.toggle(event);
};


</script>

<template>
  <header class="header minmize">
    <nav class="nav">
      <div class="menu">

        <!-- Add the new icon to open the sidebar -->
        <!-- <span v-if="!props.open" class="cursor-pointer" @click="toggleSidebar">
          <IconMenu />
        </span> -->
        <!-- <span  class="cursor-pointer" @click="toggleSidebar">
          <IconMenu />
        </span> -->
        <!-- <div class="header-link flex gap-sm items-center">
          <h1>
            <router-link to="/">{{ $t('home') }} </router-link>
          </h1>
          <p class="route-name">{{ $t(typeof route?.name === 'string' ? route.name : '') }} /</p>
        </div> -->
        <router-link class="flex items-center gap-2"
          :to="user?.type == OrganizationTypeEnum?.ADMIN ? '/admin' : user?.employeeType == EmployeeStatusEnum.Employee ? '/organization/employee-interface' : '/organization'">
          <img :src="defaultLogo" alt="logo-img">
          <p class="logo">HSE.Cloud.Ai </p>
        </router-link>
      </div>

      <div class="input-wrapper" v-if="!showProjectSelect && user?.type != OrganizationTypeEnum.ADMIN">
        <!-- label="Project" -->
        <CustomSelectInput :modelValue="SelectProject" class="input" :staticOptions="ProjectSelector.AllProjects"
          id="project" placeholder="select your project" @update:modelValue="setSelectedProject" :reload="false" />

      </div>
      <!-- <div class="search">
        <SearchIcon />
        <input type="serach" placeholder="Search What You Want" />
      </div> -->

      <div class="setting">
        <ChangeLanguage class="countery-icon" />

        <!-- <div class="notification cursor-pointer" @click="toggleFullScreen">
          <Notification />
        </div> -->

        <div class="user cursor-pointer dropdown-trigger" @click="toggleDropMenu">
          <IconArrowDownNav class="drop-icon" />
          <div class="profile-data">
            <span>{{ user?.name.split(' ')[0] }}</span>
            <span>{{ user?.type == OrganizationTypeEnum.ADMIN ? 'Admin' : 'Organization' }}</span>
          </div>

          <!-- <img alt="user" src="../../assets/images/travel.png" /> -->
          <img src="https://cyber.comolho.com/static/img/avatar.png" alt="employee" />
          <div class="dropdown-menu" v-if="isDropMenuOpen">
            <ul>
              <li @click="logout">
                <IconLogout />
                <span> {{ $t('logout') }} </span>
              </li>
            </ul>
          </div>
        </div>

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
.input-wrapper {
  /* .input {
    width: 400px;
  } */

  padding-inline: 24px;
  width: 400px;

  @media (max-width: 1000px) {
    width: 200px;
  }
}
</style>
