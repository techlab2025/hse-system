<template>
  <div class="section projects-section">
    <div class="section-header">
      <img class="icon" src="/src/assets/images/project.png" alt="project" />
      <div class="section-header-text">
        <h4>Projects</h4>
        <p class="hint">All Projects Where This Employee Is Present</p>
      </div>
    </div>

    <div v-for="project in mockProjects" :key="project.id" class="project-item">
      <span class="status-badge" :class="project.status">
        {{ getStatusText(project.status, project.startDate) }}
      </span>

      <h5 class="project-title">{{ project.title }}</h5>
      <div class="project-meta">
        <div class="meta-item">
          <ProjTeam />
          <h5 class="meta-title">
            Team
            <span class="value">:{{ project.team }}</span>
          </h5>
        </div>

        <div class="meta-item">
          <RedPinMark />
          <h5 class="meta-title">
            Locations
            <span class="value">:{{ project.locationsCount }}</span>
          </h5>
        </div>
      </div>
    </div>

    <p v-if="!mockProjects.length" class="no-data">No projects found for this employee yet.</p>
  </div>
</template>

<script setup lang="ts">
import ProjTeam from '@/shared/icons/ProjTeam.vue'
import RedPinMark from '@/shared/icons/RedPinMark.vue'
import { ref } from 'vue'

defineProps({
  projects: {
    type: Array,
    default: () => [],
  },
})

// للتجربة السريعة - يمكنك حذفها لاحقاً واستخدام الـ props فقط
const mockProjects = ref([
  {
    id: 1,
    title: 'Construction of New Administrative Building - Phase 2',
    status: 'current',
    team: 'Alpha Crew',
    locationsCount: 2,
    startDate: '2025-03-15',
  },
  {
    id: 2,
    title: 'Cairo Metro Line 4 Extension',
    status: 'current',
    team: 'Metro Works ',
    locationsCount: 5,
    startDate: '2024-11-01',
  },
  {
    id: 3,
    title: 'Renovation of Historical Bridge - Dakahlia',
    status: 'ended',
    team: 'Heritage ',
    locationsCount: 1,
    startDate: '2023-06-10',
  },
  {
    id: 4,
    title: 'New Industrial Zone Development - Mansoura',
    status: 'upcoming',
    team: 'Planning & Team',
    locationsCount: 8,
    startDate: '2026-04-01',
  },
])

// تحسين دالة عرض النص حسب الحالة
const getStatusText = (status, startDate) => {
  if (status === 'current') return 'Current'
  if (status === 'ended') return 'Ended'
  if (status === 'upcoming') {
    if (startDate) {
      const date = new Date(startDate)
      return `Starts At: ${date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}`
    }
    return 'Upcoming'
  }
  return status
}
</script>
