<script setup lang="ts">
import { computed } from 'vue'
import Chart from 'primevue/chart'
import type { ChartData, ChartOptions, ChartType } from 'chart.js'
import { useI18n } from 'vue-i18n'
import { useSystemIdentity } from '@/composables/useSystemIdentity'
import { resolveChartColors, type ChartSettings } from '@/features/SystemIdentity/dashboard'
import type { BarRow } from '../../../data/Model/OrganizationDashboardModel'
const props = defineProps<{
  rows: BarRow[]
  label: string
  settings: ChartSettings
  defaultType?: 'bar' | 'horizontalBar' | 'doughnut'
  brandColors?: string[]
}>()
const { locale, t } = useI18n()
const { identity } = useSystemIdentity()
const style = computed(() =>
  props.settings.type === 'default' ? (props.defaultType ?? 'horizontalBar') : props.settings.type,
)
const horizontal = computed(() => ['horizontalBar', 'horizontalStackedBar'].includes(style.value))
const stacked = computed(() =>
  ['stackedBar', 'horizontalStackedBar', 'stackedArea'].includes(style.value),
)
const filled = computed(() => ['area', 'stackedArea', 'radar'].includes(style.value))
const type = computed<ChartType>(() => {
  if (
    ['horizontalBar', 'stackedBar', 'horizontalStackedBar', 'roundedBar', 'mixed'].includes(
      style.value,
    )
  )
    return 'bar'
  if (
    ['area', 'straightLine', 'steppedLine', 'dashedLine', 'points', 'stackedArea'].includes(
      style.value,
    )
  )
    return 'line'
  if (style.value === 'radarOutline') return 'radar'
  if (style.value === 'semiDoughnut') return 'doughnut'
  return style.value as ChartType
})
const circular = computed(() => ['pie', 'doughnut', 'polarArea'].includes(type.value))
const colors = computed(() =>
  resolveChartColors(
    props.settings,
    props.brandColors ?? [
      identity.value.primaryColor,
      identity.value.accentColor,
      identity.value.secondaryColor,
    ],
  ),
)
const series = computed(() => [
  ...new Map(
    props.rows.flatMap((row) => row.segments.map((segment) => [segment.key, segment] as const)),
  ).values(),
])
// Grouped circular charts use one ring per location and one color per series.
const data = computed<ChartData>(() => {
  if (circular.value && series.value.length > 1) {
    return {
      labels: series.value.map((segment) => segment.label),
      datasets: props.rows.map((row) => ({
        label: row.label,
        data: series.value.map(
          (segment) => row.segments.find((item) => item.key === segment.key)?.value ?? null,
        ),
        backgroundColor: series.value.map((_, index) => colors.value[index % colors.value.length]!),
        borderColor: '#ffffff',
        borderWidth: 2,
      })),
    } as ChartData
  }
  const datasets = series.value.flatMap<ChartData['datasets'][number]>((segment, index) => {
    const color = colors.value[index % colors.value.length]!
    const perCategory =
      circular.value || (props.settings.palette === 'custom' && series.value.length === 1)
    const categoryColors = props.rows.map((_, i) => colors.value[i % colors.value.length]!)
    const values = props.rows.map(
      (row) => row.segments.find((item) => item.key === segment.key)?.value ?? null,
    )
    const dataset = {
      label: segment.label,
      data: values,
      backgroundColor: perCategory ? categoryColors : filled.value ? `${color}33` : color,
      borderColor: circular.value
        ? '#ffffff'
        : perCategory && type.value === 'bar'
          ? categoryColors
          : color,
      borderWidth: 2,
      fill: filled.value,
      tension: ['straightLine', 'steppedLine', 'points'].includes(style.value) ? 0 : 0.3,
      stepped: style.value === 'steppedLine',
      borderDash: style.value === 'dashedLine' ? [8, 5] : [],
      showLine: style.value !== 'points',
      pointBackgroundColor: perCategory ? categoryColors : color,
      pointBorderColor: perCategory ? categoryColors : color,
      pointRadius: style.value === 'points' ? 5 : 3,
      pointHoverRadius: 6,
      borderRadius: type.value === 'bar' ? (style.value === 'roundedBar' ? 999 : 5) : undefined,
      borderSkipped: false as const,
      maxBarThickness: 48,
      spanGaps: false,
    }
    // Overlay the same counts on one axis. The line does not introduce a new measure.
    if (style.value === 'mixed')
      return [
        {
          ...dataset,
          type: 'bar' as const,
          order: 2,
          backgroundColor: perCategory ? categoryColors.map((value) => `${value}66`) : `${color}66`,
        },
        {
          ...dataset,
          label: `${segment.label} (${t('Line')})`,
          type: 'line' as const,
          borderColor: color,
          order: 1,
          fill: false,
          backgroundColor: color,
        },
      ]
    return [dataset]
  })
  return { labels: props.rows.map((row) => row.label), datasets } as ChartData
})
const options = computed<ChartOptions>(() => ({
  responsive: true,
  maintainAspectRatio: false,
  animation: false,
  locale: locale.value,
  indexAxis: horizontal.value ? 'y' : 'x',
  ...(style.value === 'semiDoughnut' ? { rotation: -90, circumference: 180, cutout: '65%' } : {}),
  plugins: {
    legend: {
      display: props.settings.legend,
      position: 'bottom',
      rtl: locale.value.startsWith('ar'),
    },
    tooltip: { rtl: locale.value.startsWith('ar') },
  },
  scales:
    circular.value || type.value === 'radar'
      ? type.value === 'radar' || type.value === 'polarArea'
        ? {
            r: {
              beginAtZero: true,
              grid: { display: props.settings.grid },
              ticks: { precision: 0 },
            },
          }
        : {}
      : {
          x: {
            stacked: stacked.value,
            grid: { display: props.settings.grid },
            ...(horizontal.value ? { beginAtZero: true, ticks: { precision: 0 } } : {}),
          },
          y: {
            stacked: stacked.value,
            grid: { display: props.settings.grid },
            ...(!horizontal.value ? { beginAtZero: true, ticks: { precision: 0 } } : {}),
          },
        },
}))
const number = (value: number | null) =>
  value === null ? '—' : new Intl.NumberFormat(locale.value).format(value)
</script>
<template>
  <figure class="dashboard-custom-chart" :data-chart-style="style">
    <Chart
      :key="style"
      :type="type"
      :data="data"
      :options="options"
      :style="{ height: `${settings.height}px` }"
      :canvas-props="{ role: 'img', 'aria-label': label }"
    />
    <p
      v-if="rows.some((row) => row.segments.some((segment) => segment.value === null))"
      class="command-data-note"
    >
      {{ t('command.incompleteCounts') }}
    </p>
    <details class="command-chart-table">
      <summary>{{ t('command.viewChartData') }}</summary>
      <div class="command-table-wrap hse-table-scroll">
        <table v-table-identity class="hse-data-table">
          <caption>
            {{
              label
            }}
          </caption>
          <thead>
            <tr>
              <th scope="col">{{ t('category') }}</th>
              <th v-for="segment in series" :key="segment.key" scope="col">{{ segment.label }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in rows" :key="row.id">
              <th scope="row">
                <bdi dir="auto">{{ row.label }}</bdi>
              </th>
              <td v-for="segment in series" :key="segment.key">
                {{ number(row.segments.find((item) => item.key === segment.key)?.value ?? null) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </details>
  </figure>
</template>
<style scoped>
.dashboard-custom-chart {
  margin: 0;
  min-width: 0;
  width: 100%;
}
.dashboard-custom-chart :deep(canvas) {
  max-width: 100%;
}
table {
  width: 100%;
  text-align: start;
  border-collapse: collapse;
}
th,
td {
  padding: 0.5rem;
}
</style>
