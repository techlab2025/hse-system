<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import DashboardIcon, { type DashboardIconName } from '../Dashboard/DashboardIcon.vue'
import { formatMetric, metricPercent } from '../../utils/dashboardMetrics'
const props = defineProps<{
  title: string
  subTitle: string
  totalInsedant?: number | string | null
  textClass?: string
  link?: string
  icon?: DashboardIconName
  tone?: 'danger' | 'warning' | 'success' | 'primary'
  percentage?: boolean
  loading?: boolean
}>()
const { locale } = useI18n()
const value = computed(() =>
  props.percentage ? metricPercent(props.totalInsedant) : props.totalInsedant,
)
const displayValue = computed(() => formatMetric(value.value, locale.value))
</script>
<template>
  <component
    :is="link ? RouterLink : 'article'"
    :to="link"
    class="dashboard-kpi"
    :class="[`dashboard-kpi--${tone ?? 'primary'}`, { 'dashboard-kpi--loading': loading }]"
    :aria-busy="loading"
  >
    <div class="dashboard-kpi__top">
      <span class="dashboard-kpi__icon"><DashboardIcon :name="icon ?? 'activity'" /></span
      ><span v-if="percentage" class="dashboard-kpi__tag">{{ $t('Compliance') }}</span
      ><DashboardIcon v-else-if="link" name="arrow" class="dashboard-kpi__arrow" />
    </div>
    <h3>{{ title }}</h3>
    <div class="dashboard-kpi__value" :class="textClass">
      <span v-if="loading" class="dashboard-value-skeleton"></span
      ><template v-else
        >{{ displayValue }}<small v-if="percentage && value != null">%</small></template
      >
    </div>
    <div class="dashboard-kpi__bottom">
      <span>{{ subTitle }}</span
      ><span v-if="percentage && value != null" class="dashboard-kpi__mini-track" aria-hidden="true"
        ><i :style="{ width: `${value}%` }"></i
      ></span>
    </div>
  </component>
</template>
