<script setup lang="ts">
import type OverviewHazardChartModel from '@/features/Home/data/Model/OverviewHazardChartModel'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { formatMetric, metricNumber } from '../../utils/dashboardMetrics'
defineOptions({ name: 'ObservationZoneOverview' })
const props = defineProps<{
  OverviewHazardChartstate?: OverviewHazardChartModel[]
  chartHeight?: string
  chartWidth?: string
}>()
const { t, locale } = useI18n()
type SeriesKey = 'hazard' | 'observation' | 'accidents'
const visible = ref<SeriesKey[]>(['hazard', 'observation', 'accidents'])
const series = computed(() => [
  { key: 'hazard' as const, label: t('Hazard'), color: 'var(--hse-project-amber)' },
  { key: 'observation' as const, label: t('Observation'), color: 'var(--hse-project-blue)' },
  { key: 'accidents' as const, label: t('Incident'), color: 'var(--hse-project-red)' },
])
const rows = computed(() =>
  (props.OverviewHazardChartstate ?? []).map((zone) => {
    const segments = series.value
      .filter((item) => visible.value.includes(item.key))
      .map((item) => ({ ...item, count: metricNumber(zone.allObservations?.[item.key]) ?? 0 }))
    return {
      id: zone.zoneId,
      title: zone.zoneTitle,
      segments,
      total: segments.reduce((sum, item) => sum + item.count, 0),
    }
  }),
)
const total = computed(() => rows.value.reduce((sum, row) => sum + row.total, 0))
const max = computed(() => Math.max(1, ...rows.value.map((row) => row.total)))
const toggle = (key: SeriesKey) => {
  visible.value = visible.value.includes(key)
    ? visible.value.filter((item) => item !== key)
    : [...visible.value, key]
}
</script>
<template>
  <div class="dashboard-observation-chart">
    <div class="dashboard-chart-summary">
      <strong>{{ formatMetric(total, locale) }}</strong
      ><span>{{ $t('Events in selected categories') }}</span>
    </div>
    <div
      class="dashboard-legend dashboard-legend--interactive"
      :aria-label="$t('Event categories')"
    >
      <button
        v-for="item in series"
        :key="item.key"
        type="button"
        :aria-pressed="visible.includes(item.key)"
        @click="toggle(item.key)"
      >
        <i :style="{ background: item.color }"></i>{{ item.label }}
      </button>
    </div>
    <p v-if="!visible.length" class="dashboard-empty-inline">
      {{ $t('Select a category to explore the data.') }}
    </p>
    <div v-else-if="rows.length" class="dashboard-zone-rows">
      <div v-for="(row, index) in rows" :key="`${row.id}-${index}`" class="dashboard-zone-row">
        <div class="dashboard-zone-row__label">
          <span>{{ row.title || $t('Unnamed zone') }}</span
          ><strong>{{ formatMetric(row.total, locale) }}</strong>
        </div>
        <div
          class="dashboard-stacked-track"
          role="img"
          :aria-label="`${row.title}: ${row.segments.map((segment) => `${segment.label} ${segment.count}`).join(', ')}`"
        >
          <i
            v-for="segment in row.segments.filter((segment) => segment.count > 0)"
            :key="segment.key"
            :style="{ width: `${(segment.count / max) * 100}%`, background: segment.color }"
          ></i>
        </div>
        <div class="dashboard-zone-row__breakdown">
          <span v-for="segment in row.segments" :key="segment.key"
            >{{ segment.label }} <b>{{ formatMetric(segment.count, locale) }}</b></span
          >
        </div>
      </div>
    </div>
    <p v-else class="dashboard-empty-inline">{{ $t('No observation data available') }}</p>
  </div>
</template>
