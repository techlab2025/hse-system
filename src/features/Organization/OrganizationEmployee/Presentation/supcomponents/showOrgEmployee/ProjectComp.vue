<script setup lang="ts">
import ProjTeam from '@/shared/icons/ProjTeam.vue'
import RedPinMark from '@/shared/icons/RedPinMark.vue'
import { ref } from 'vue'
import type ProjectModel from '@/features/Organization/Project/Data/models/ProjectModel'
import type OrganizatoinEmployeeDetailsModel from '../../../Data/models/OrganizatoinEmployeeDetailsModel'

const { state } = defineProps<{
  state?: ProjectModel[]
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

    <div v-for="project in state ?? []" :key="project.id" class="project-item">
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

    <p v-if="!state?.length" class="side-empty">No projects found for this employee yet.</p>
  </div>
</template>

<style scoped>
.projects-section {
  overflow: hidden;
  padding: 16px;
  border: 1px solid rgba(221, 226, 237, 0.78);
  border-radius: 22px;
  background: linear-gradient(135deg, #ffffff, #f8fbff);
  box-shadow: 0 16px 36px rgba(15, 25, 39, 0.06);
}

.section-header {
  align-items: flex-start;
  margin-bottom: 14px;
}

.section-header .icon {
  width: 42px;
  height: 42px;
  padding: 8px;
  border-radius: 14px;
  background: rgba(74, 174, 58, 0.1);
}

.section-header-text h4 {
  color: #041953;
  font-size: 17px;
  font-weight: 900;
}

.section-header-text .hint {
  color: #607086;
  font-size: 11px;
  font-weight: 700;
}

.project-item {
  position: relative;
  margin: 0 0 9px;
  padding: 12px;
  border: 1px solid rgba(221, 226, 237, 0.82);
  border-radius: 15px;
  background: #fff;
}

.project-item::before {
  position: absolute;
  inset-inline-start: 0;
  top: 10px;
  bottom: 10px;
  width: 3px;
  border-radius: 999px;
  content: '';
  background: linear-gradient(180deg, #1d4ed8, #4aae3a);
}

.project-title {
  margin: 0;
  padding-inline-start: 8px;
  color: #111827;
  font-size: 13px;
  font-weight: 900;
}

.side-empty {
  margin: 0;
  padding: 14px;
  border: 1px dashed rgba(29, 78, 216, 0.22);
  border-radius: 14px;
  color: #607086;
  font-size: 11px;
  font-weight: 800;
  background: rgba(29, 78, 216, 0.04);
}
</style>
