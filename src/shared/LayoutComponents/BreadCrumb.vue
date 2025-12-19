<script setup lang="ts">
import Breadcrumb from 'primevue/breadcrumb'
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BackIcon from '../icons/BackIcon.vue'
import FastRoutes from './FastrRoutes/FastRoutes.vue'

const route = useRoute()
const router = useRouter()
const items = ref<{ label: string; url?: string }[]>([])
const navigationHistory = ref<{ path: string; name: string; params: any }[]>([])

const extractKeywords = (text: string): string[] => {
  return text
    .toLowerCase()
    .split(/[-_\s]/)
    .filter(Boolean)
}

// Check if two routes share common keywords
const shareKeywords = (route1: string, route2: string): boolean => {
  const keywords1 = extractKeywords(route1)
  const keywords2 = extractKeywords(route2)
  return keywords1.some((keyword) => keywords2.includes(keyword))
}

const removeGuard = router.beforeEach((to, from) => {
  if (to.path !== from.path && from.name) {
    const toName = to.name as string
    const fromName = from.name as string

    if (toName && fromName && shareKeywords(toName, fromName)) {
      const existingIndex = navigationHistory.value.findIndex((h) => h.path === from.path)

      if (existingIndex === -1) {
        navigationHistory.value.push({
          path: from.path,
          name: fromName,
          params: { ...from.params },
        })
      }
    } else {
      navigationHistory.value = []
    }
  }
})

const GetFullPath = () => {
  items.value = []

  items.value.push({
    label: 'Home',
    url: '/organization',
  })

  const currentRouteName = route.name as string

  if (!currentRouteName || currentRouteName.toLowerCase() === 'organization') {
    return
  }

  navigationHistory.value.forEach((historyItem) => {
    if (shareKeywords(historyItem.name, currentRouteName)) {
      items.value.push({
        label: historyItem.name,
        url: historyItem.path,
      })
    }
  })

  items.value.push({
    label: currentRouteName,
    url: undefined,
  })
}

onMounted(() => {
  GetFullPath()
})

onUnmounted(() => {
  removeGuard()
})

watch(
  () => route.fullPath,
  () => {
    GetFullPath()
  }
)

const RouterBack = () => {
  if (navigationHistory.value.length > 0) {
    navigationHistory.value.pop()
  }
  router.back()
}
</script>

<template>
  <div class="breadcrump-container">
    <div class="breadcrump">
      <button class="sidebar-back" @click="RouterBack">
        <BackIcon class="icon" />
        <span>back</span>
      </button>
      <Breadcrumb :model="items" />
    </div>
    <!-- <FastRoutes /> -->
  </div>
</template>
