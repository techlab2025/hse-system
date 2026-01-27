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
const indexProjectController = IndexProjectController.getInstance()
const indexProjectParams = new IndexProjectParams("", 1, 10, 0)

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
  showProjectSelect.value = user?.type == OrganizationTypeEnum.ORGANIZATION && user?.employeeType == EmployeeStatusEnum.Employee
})
</script>

<template>
  <header class="header">
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

      <div class="input-wrapper" v-if="!showProjectSelect">
        <!-- label="Project" -->
        <CustomSelectInput :modelValue="SelectProject" class="input" :controller="indexProjectController"
          :params="indexProjectParams" id="project" placeholder="select your project"
          @update:modelValue="setSelectedProject" :reload="false" />

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

          <img alt="user" src="../../assets/images/travel.png" />

          <div class="dropdown-menu" v-if="isDropMenuOpen">
            <ul>
              <li @click="logout">
                <IconLogout />
                <span> {{ $t('logout') }} </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<style scoped>
.input-wrapper {
  .input {
    width: 400px;
  }

  width: 400px;
}
</style>