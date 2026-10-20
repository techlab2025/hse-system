<script setup lang="ts">
import type OverviewInvestigationsChartModel from '@/features/Home/data/Model/OverviewInvestigationsChartModel'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { formatMetric, metricPercent } from '../../utils/dashboardMetrics'
import DashboardIcon from '../Dashboard/DashboardIcon.vue'
const props = defineProps<{
  overviewInvestigationsChartstate?: OverviewInvestigationsChartModel[]
}>()
const { locale } = useI18n()
const rows = computed(() =>
  (props.overviewInvestigationsChartstate ?? []).map((row) => ({
    ...row,
    percentage: metricPercent(row.total),
  })),
)
const completed = computed(() => rows.value.filter((row) => row.percentage === 100).length)
</script>
<template>
  <div class="dashboard-investigations">
    <div class="dashboard-investigations__summary">
      <span><DashboardIcon name="check" /></span>
      <div>
        <strong
          >{{ formatMetric(completed, locale) }}
          <small>/ {{ formatMetric(rows.length, locale) }}</small></strong
        >
        <p>{{ $t('Zones with investigations fully closed') }}</p>
      </div>
    </div>
    <div v-if="rows.length" class="dashboard-zone-rows">
      <div v-for="(row, index) in rows" :key="`${row.zoneId}-${index}`" class="dashboard-zone-row">
        <div class="dashboard-zone-row__label">
          <span>{{ row.zoneTitle || $t('Unnamed zone') }}</span
          ><strong
            >{{ formatMetric(row.percentage, locale)
            }}<template v-if="row.percentage != null">%</template></strong
          >
        </div>
        <div
          class="dashboard-progress dashboard-progress--success"
          role="meter"
          :aria-label="row.zoneTitle"
          :aria-valuenow="row.percentage ?? undefined"
          aria-valuemin="0"
          aria-valuemax="100"
          :aria-valuetext="row.percentage == null ? $t('No data available') : undefined"
        >
          <i :style="{ width: `${row.percentage ?? 0}%` }"></i>
        </div>
      </div>
    </div>
    <p v-else class="dashboard-empty-inline">{{ $t('No investigation data available') }}</p>
  </div>
</template>
