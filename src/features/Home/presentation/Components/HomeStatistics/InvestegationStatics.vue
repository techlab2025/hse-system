<script setup lang="ts">
import OverviewInvestigationsChartModel from '@/features/Home/data/Model/OverviewInvestigationsChartModel'
import { computed } from 'vue'

const props = defineProps<{
  overviewInvestigationsChartstate: OverviewInvestigationsChartModel[]
}>()

const maxTotal = computed(() => {
  const totals = props.overviewInvestigationsChartstate.map((v) => Number(v.total) || 0)
  return totals.length ? Math.max(...totals) : 0
})
</script>
<template>
  <section class="hse-identity hse-investigation-chart">
    <h3>{{ $t('investigations_overview') }}</h3>
    <p class="hse-investigation-chart__subtitle">
      {{ $t('closed_investigations_monthly_percentages') }}
    </p>
    <ul class="hse-investigation-chart__rows">
      <li
        v-for="(value, index) in props.overviewInvestigationsChartstate"
        :key="`${value.zoneId}-${index}`"
      >
        <div class="hse-investigation-chart__label">
          <span>{{ value.zoneTitle }}</span
          ><strong>{{ value.total }}%</strong>
        </div>
        <div
          class="hse-investigation-chart__track"
          role="meter"
          :aria-label="value.zoneTitle"
          :aria-valuenow="value.total"
          aria-valuemin="0"
          aria-valuemax="100"
        >
          <span
            :class="{ peak: value.total === maxTotal }"
            :style="{ width: `${Math.max(0, Math.min(100, Number(value.total) || 0))}%` }"
          ></span>
        </div>
      </li>
    </ul>
  </section>
</template>
<style scoped>
.hse-investigation-chart {
  min-width: 0;
}
.hse-investigation-chart h3 {
  margin: 0;
  color: var(--hse-project-ink);
  font: 700 16px/1.4 var(--hse-project-font);
}
.hse-investigation-chart__subtitle {
  margin: 6px 0 24px;
  color: var(--hse-project-muted);
  font: 400 12px/1.5 var(--hse-project-font);
}
.hse-investigation-chart__rows {
  display: grid;
  gap: 22px;
  max-height: 360px;
  overflow: auto;
  padding: 0 4px 4px;
  margin: 0;
  list-style: none;
}
.hse-investigation-chart__label {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 8px;
  font-size: 12px;
}
.hse-investigation-chart__label span {
  overflow-wrap: anywhere;
  color: var(--hse-project-muted);
}
.hse-investigation-chart__label strong {
  color: var(--hse-project-ink);
}
.hse-investigation-chart__track {
  height: 9px;
  border-radius: 5px;
  background: var(--hse-project-line-soft);
  overflow: hidden;
}
.hse-investigation-chart__track span {
  display: block;
  height: 100%;
  background: var(--hse-project-blue2);
  border-radius: inherit;
}
.hse-investigation-chart__track .peak {
  background: var(--hse-project-blue);
}
</style>
