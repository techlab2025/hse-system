<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type StatisticsMachineModel from '@/features/Home/data/Model/StatisticsMachineModel'
import { formatMetric, metricNumber } from '../../utils/dashboardMetrics'
const props = defineProps<{ totalMachines?: StatisticsMachineModel[] }>()
const { t, locale } = useI18n()
const categories = computed(() => [
  { type: 1, label: t('equipment'), color: 'var(--hse-project-blue)' },
  { type: 2, label: t('device'), color: 'var(--hse-project-cyan)' },
  { type: 3, label: t('tool'), color: 'var(--hse-project-blue2)' },
])
const rows = computed(() =>
  (props.totalMachines ?? []).map((machine) => {
    const stats = Object.values(machine.statics ?? {})
    const segments = categories.value.map((category) => ({
      ...category,
      count: stats
        .filter((stat) => Number(stat.type) === category.type)
        .reduce((sum, stat) => sum + (metricNumber(stat.count) ?? 0), 0),
    }))
    return {
      name: machine.zoon,
      segments,
      total: segments.reduce((sum, segment) => sum + segment.count, 0),
    }
  }),
)
const max = computed(() => Math.max(1, ...rows.value.map((row) => row.total)))
const total = computed(() => rows.value.reduce((sum, row) => sum + row.total, 0))
</script>
<template>
  <div class="dashboard-equipment-distribution">
    <div class="dashboard-chart-summary">
      <strong>{{ formatMetric(total, locale) }}</strong
      ><span>{{ $t('Recorded assets across zones') }}</span>
    </div>
    <div class="dashboard-legend">
      <span v-for="category in categories" :key="category.type"
        ><i :style="{ background: category.color }"></i>{{ category.label }}</span
      >
    </div>
    <div v-if="rows.length" class="dashboard-zone-rows">
      <div v-for="(row, index) in rows" :key="`${row.name}-${index}`" class="dashboard-zone-row">
        <div class="dashboard-zone-row__label">
          <span>{{ row.name || $t('Unnamed zone') }}</span
          ><strong>{{ formatMetric(row.total, locale) }}</strong>
        </div>
        <div
          class="dashboard-stacked-track"
          role="img"
          :aria-label="`${row.name}: ${row.segments.map((segment) => `${segment.label} ${segment.count}`).join(', ')}`"
        >
          <i
            v-for="segment in row.segments.filter((segment) => segment.count > 0)"
            :key="segment.type"
            :style="{ width: `${(segment.count / max) * 100}%`, background: segment.color }"
          ></i>
        </div>
        <div class="dashboard-zone-row__breakdown">
          <span v-for="segment in row.segments" :key="segment.type"
            >{{ segment.label }} <b>{{ formatMetric(segment.count, locale) }}</b></span
          >
        </div>
      </div>
    </div>
    <p v-else class="dashboard-empty-inline">{{ $t('No equipment data available') }}</p>
  </div>
</template>
