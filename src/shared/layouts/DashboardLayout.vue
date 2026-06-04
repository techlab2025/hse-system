<script setup lang="ts">
import { computed, ref } from 'vue'
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

const showSidebar = computed(() => {
  if (!user) return false
  return user.type === OrganizationTypeEnum.ADMIN || user.employeeType == EmployeeStatusEnum.Admin
})
</script>

<template>
  <main class="content">
    <div class="sidebar-container">
      <NewSidebar v-if="showSidebar" v-model:open="isSidebarOpen" />
    </div>
    <section class="content-wrapper">
      <Header />
      <div class="main-content minmize">
        <BreadCrumb v-if="!route.fullPath.includes('project-progress')" />
        <slot />
      </div>
    </section>
  </main>
</template>

<style scoped></style>
