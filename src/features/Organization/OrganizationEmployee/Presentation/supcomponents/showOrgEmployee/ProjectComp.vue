<script setup lang="ts">
import ProjTeam from '@/shared/icons/ProjTeam.vue'
import RedPinMark from '@/shared/icons/RedPinMark.vue'
import { ref } from 'vue'
import type ProjectModel from '@/features/Organization/Project/Data/models/ProjectModel'
import type OrganizatoinEmployeeDetailsModel from '../../../Data/models/OrganizatoinEmployeeDetailsModel'

const { state } = defineProps<{
  state: ProjectModel[]
}>()

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

<template>
  <div class="section projects-section">
    <div class="section-header">
      <img class="icon" src="/src/assets/images/project.png" alt="project" />
      <div class="section-header-text">
        <h4>Projects</h4>
        <p class="hint">All Projects Where This Employee Is Present</p>
      </div>
    </div>

    <div v-for="project in state" :key="project.id" class="project-item">
      <!-- <pre>
        {{ project }}
      </pre> -->

      <!-- <span class="status-badge" :class="project.status">
        {{ getStatusText(project.status, project.startDate) }}
      </span> -->

      <h5 class="project-title">{{ project.title }}</h5>
      <div class="project-meta">
        <!-- <div class="meta-item" v-if="project.team">
          <ProjTeam />
          <h5 class="meta-title">
            Team
            <span class="value">:{{ project.team }}</span>
          </h5>
        </div>

        <div class="meta-item" v-if="project.locations">
          <RedPinMark />
          <h5 class="meta-title">
            Locations
            <span class="value">:{{ project.locations }}</span>
          </h5>
        </div> -->
      </div>
    </div>

    <!-- <p v-if="project.length" class="no-data">No projects found for this employee yet.</p> -->
  </div>
</template>
