<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import DashboardLayout from '@/shared/layouts/DashboardLayout.vue'
import { useProjectSelectStore } from '@/stores/ProjectSelect'
import { projectViewKey, isHeaderProjectRoute } from '@/shared/utils/headerProjectRoutes'
import { projectViewChanging } from '@/composables/useHeaderProjectSelection'

defineOptions({ name: 'DashboardView' })

const route = useRoute()
const projectStore = useProjectSelectStore()
const projectKey = computed(() => projectViewKey(route, projectStore.getProjectId()))
</script>

<template>
  <DashboardLayout>
    <RouterView v-if="!projectViewChanging || !isHeaderProjectRoute(route)" :key="projectKey" />
  </DashboardLayout>
</template>
