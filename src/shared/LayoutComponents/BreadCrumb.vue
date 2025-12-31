<script setup lang="ts">
import Breadcrumb from 'primevue/breadcrumb'
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BackIcon from '../icons/BackIcon.vue'
import FastRoutes from './FastrRoutes/FastRoutes.vue'

const route = useRoute()
const router = useRouter()

const items = ref<{ label: string; url?: string }[]>([])

/* =========================
   Helpers
========================= */

// get section after /organization/
const getSection = (path: string) => {
  const match = path.match(/^\/organization\/([^\/]+)/)
  return match ? match[1] : null
}

// is edit page
const isEditRoute = (name?: string) =>
  name?.toLowerCase().includes('edit')

// remove ONLY edit breadcrumb
const removeEdit = () => {
  items.value = items.value.filter(
    i => !i.label.toLowerCase().includes('edit')
  )
}

/* =========================
   Build Breadcrumb
========================= */

const buildBreadcrumb = () => {
  items.value = []

  // Home
  items.value.push({
    label: 'Home',
    url: '/organization',
  })

  if (route.path === '/organization') return

  const section = getSection(route.path)
  const currentLabel = route.name as string

  // Add Table (section) ONCE
  if (section) {
    items.value.push({
      label: section,
      url: `/organization/${section}`,
    })
  }

  // If Edit page
  if (isEditRoute(currentLabel)) {
    removeEdit()

    items.value.push({
      label: currentLabel,
      url: undefined,
    })
  }
}

/* =========================
   Watch route
========================= */

watch(
  () => route.fullPath,
  () => buildBreadcrumb(),
  { immediate: true }
)

/* =========================
   Back
========================= */

const RouterBack = () => {
  router.back()
}

const IsHome = computed(
  () => route.path === '/organization' || route.path === '/admin'
)
const IsHomeSetting = computed(
  () => route.path === '/organization/setting' || route.path === '/admin' || route.path === '/organization'
)

</script>

<template>
  <div class="breadcrump-container">
    <div class="breadcrump">
      <button class="sidebar-back" @click="RouterBack" v-if="!IsHome">
        <BackIcon class="icon" />
        <span>back</span>
      </button>

      <Breadcrumb :model="items" />
    </div>

    <FastRoutes v-if="!IsHomeSetting" />
  </div>
</template>
