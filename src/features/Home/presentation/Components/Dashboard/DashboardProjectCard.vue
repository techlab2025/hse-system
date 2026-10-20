<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type ProjectModel from '@/features/Organization/Project/Data/models/ProjectModel'
import DashboardIcon from './DashboardIcon.vue'
import { formatMetric, metricPercent } from '../../utils/dashboardMetrics'
const props = defineProps<{ project: ProjectModel }>()
const { t, locale } = useI18n()
const progress = computed(() => metricPercent(props.project.projectProgress))
const status = computed(
  () =>
    ({
      1: { label: t('project_status_active'), tone: 'success' },
      2: { label: t('project_status_completed'), tone: 'primary' },
      3: { label: t('project_status_on_hold'), tone: 'warning' },
      4: { label: t('project_status_cancelled'), tone: 'muted' },
    })[props.project.status] ?? { label: t('Project'), tone: 'muted' },
)
</script>
<template>
  <router-link :to="`/organization/project-summary/${project.id}`" class="dashboard-project-card">
    <div class="dashboard-project-card__top">
      <span class="dashboard-project-card__mark"><DashboardIcon name="folder" /></span
      ><span class="dashboard-status" :class="`dashboard-status--${status.tone}`"
        ><i></i>{{ status.label }}</span
      ><DashboardIcon name="arrow" class="dashboard-project-card__arrow" />
    </div>
    <small class="dashboard-project-card__serial">{{
      project.serialName || project.serial_number || `#${project.id}`
    }}</small>
    <h3>{{ project.title }}</h3>
    <p>{{ project.partner?.title || $t('Project overview') }}</p>
    <div class="dashboard-project-card__progress-label">
      <span>{{ $t('Project progress') }}</span
      ><strong
        >{{ formatMetric(progress, locale) }}<template v-if="progress != null">%</template></strong
      >
    </div>
    <div
      class="dashboard-progress"
      role="meter"
      :aria-label="`${project.title}: ${$t('Project progress')}`"
      :aria-valuenow="progress ?? undefined"
      aria-valuemin="0"
      aria-valuemax="100"
      :aria-valuetext="progress == null ? $t('No data available') : undefined"
    >
      <i :style="{ width: `${progress ?? 0}%` }"></i>
    </div>
    <div class="dashboard-project-card__metrics">
      <span
        ><DashboardIcon name="users" /><strong>{{
          formatMetric(project.assigned_employees_count, locale)
        }}</strong
        >{{ $t('employee') }}</span
      ><span
        ><DashboardIcon name="equipment" /><strong>{{
          formatMetric(project.equipment_count, locale)
        }}</strong
        >{{ $t('equipment') }}</span
      >
    </div>
  </router-link>
</template>
