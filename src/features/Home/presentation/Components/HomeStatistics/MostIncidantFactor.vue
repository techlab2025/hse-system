<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import DashboardIcon from '../Dashboard/DashboardIcon.vue'
import { formatMetric, metricNumber } from '../../utils/dashboardMetrics'
interface MetricRow {
  value?: number | null
  label: string
  spanClass?: string
  divClass?: string
  link?: string
}
const props = defineProps<{ title: string; data: MetricRow[]; description?: string }>()
const { locale } = useI18n()
const max = computed(() => Math.max(1, ...props.data.map((row) => metricNumber(row.value) ?? 0)))
</script>
<template>
  <section class="dashboard-detail-group" :aria-label="title">
    <div class="dashboard-detail-group__heading">
      <h3>{{ title }}</h3>
      <p v-if="description">{{ description }}</p>
    </div>
    <div v-if="data.length" class="dashboard-detail-rows">
      <component
        :is="item.link ? RouterLink : 'div'"
        v-for="(item, index) in data"
        :key="`${item.label}-${index}`"
        :to="item.link"
        class="dashboard-detail-row"
        :class="item.spanClass"
      >
        <span class="dashboard-detail-row__dot" aria-hidden="true"></span
        ><span class="dashboard-detail-row__label">{{ item.label }}</span
        ><strong>{{ formatMetric(item.value, locale) }}</strong
        ><DashboardIcon v-if="item.link" name="arrow" />
        <span class="dashboard-detail-row__track" aria-hidden="true"
          ><i :style="{ width: `${((metricNumber(item.value) ?? 0) / max) * 100}%` }"></i
        ></span>
      </component>
    </div>
    <p v-else class="dashboard-empty-inline">{{ $t('No data available') }}</p>
  </section>
</template>
