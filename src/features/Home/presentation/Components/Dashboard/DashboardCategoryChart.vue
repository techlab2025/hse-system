<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import Chart from 'chart.js/auto'
import type { ChartData, ChartOptions } from 'chart.js'
import type { BarRow, Count } from '../../../data/Model/OrganizationDashboardModel'
import DashboardIcon from './DashboardIcon.vue'
import DashboardCustomChart from './DashboardCustomChart.vue'
import { useDashboardChart } from '@/composables/useDashboardPreferences'
const { settings, customized } = useDashboardChart('safety')
const props = defineProps<{ rows: BarRow[]; label: string }>()
const { locale, t } = useI18n()
const host = ref<HTMLElement>()
const canvas = ref<HTMLCanvasElement>()
const page = ref(0)
const capacity = ref(4)
const rtl = computed(() => locale.value.startsWith('ar'))
const pages = computed(() => Math.max(1, Math.ceil(props.rows.length / capacity.value)))
const visible = computed(() => {
  const rows = props.rows.slice(page.value * capacity.value, (page.value + 1) * capacity.value)
  return rtl.value ? [...rows].reverse() : rows
})
const colors = ['#F04452', '#2864F0']
const series = computed(() => props.rows[0]?.segments.map((segment) => segment.label) ?? [])
const number = (value: Count) =>
  value === null ? '—' : new Intl.NumberFormat(locale.value).format(value)
const data = computed<ChartData<'bar', (number | null)[], string>>(() => ({
  labels: visible.value.map((row) => row.label || t('command.unnamedLocation')),
  datasets: series.value.map((label, index) => ({
    label,
    data: visible.value.map((row) => row.segments[index]?.value ?? null),
    backgroundColor: colors[index],
    hoverBackgroundColor: colors[index],
    borderRadius: 5,
    borderSkipped: false,
    maxBarThickness: props.rows.length === 1 ? 44 : 28,
    categoryPercentage: props.rows.length === 1 ? 0.6 : 0.76,
    barPercentage: 0.8,
  })),
}))
const options = computed<ChartOptions<'bar'>>(() => ({
  responsive: true,
  maintainAspectRatio: false,
  animation: false,
  locale: locale.value,
  interaction: { mode: 'index', intersect: false },
  layout: { padding: { top: 12, right: 8, bottom: 0, left: 0 } },
  font: {
    family: canvas.value ? getComputedStyle(canvas.value).fontFamily : 'sans-serif',
    size: 12,
  },
  plugins: {
    legend: { display: false },
    tooltip: {
      rtl: rtl.value,
      textDirection: rtl.value ? 'rtl' : 'ltr',
      backgroundColor: '#ffffff',
      titleColor: '#10264b',
      bodyColor: '#526781',
      borderColor: '#dce6f3',
      borderWidth: 1,
      cornerRadius: 10,
      padding: 14,
      titleFont: { size: 13, weight: 600 },
      bodyFont: { size: 13 },
      bodySpacing: 8,
      displayColors: true,
      boxWidth: 9,
      boxHeight: 9,
      callbacks: {
        title: (items) =>
          visible.value[items[0]?.dataIndex ?? 0]?.label || t('command.unnamedLocation'),
        label: (context) => `${context.dataset.label}: ${number(context.raw as Count)}`,
        afterBody: (items) =>
          visible.value[items[0]?.dataIndex ?? 0]?.segments.some((s) => s.value === null)
            ? t('command.incompleteCounts')
            : '',
      },
    },
  },
  scales: {
    x: {
      stacked: false,
      grid: { display: false },
      border: { display: false },
      ticks: {
        color: '#627594',
        autoSkip: false,
        maxRotation: 0,
        minRotation: 0,
        padding: 12,
        callback(_value, index) {
          const label = visible.value[index]?.label || t('command.unnamedLocation')
          const words = label.match(/.{1,18}(?:\s|$)|.{1,18}/gu) || [label]
          return words.length > 2 ? [words[0], words[1]?.slice(0, 15) + '…'] : words
        },
      },
      title: {
        display: true,
        text: t('command.locationsAxis'),
        color: '#627594',
        font: { size: 12 },
        padding: { top: 8, bottom: 0 },
      },
    },
    y: {
      stacked: false,
      beginAtZero: true,
      suggestedMax: 1,
      position: rtl.value ? 'right' : 'left',
      border: { display: false, dash: [3, 4] },
      grid: { color: '#e8eef7', drawTicks: false },
      ticks: {
        color: '#7b8da7',
        precision: 0,
        maxTicksLimit: 6,
        padding: 10,
        callback: (value) => number(Number(value)),
      },
      title: {
        display: true,
        text: t('command.reportsAxis'),
        color: '#627594',
        font: { size: 12 },
      },
    },
  },
}))
let chart: Chart<'bar', (number | null)[], string> | undefined
let observer: ResizeObserver | undefined
const render = () => {
  if (!canvas.value) return
  if (chart) {
    chart.data = data.value
    chart.options = options.value
    chart.update('none')
  } else chart = new Chart(canvas.value, { type: 'bar', data: data.value, options: options.value })
}
watch([data, options], render, { flush: 'post' })
watch(
  () => props.rows,
  () => {
    page.value = 0
  },
)
watch(capacity, () => {
  page.value = Math.min(page.value, pages.value - 1)
})
onMounted(() => {
  render()
  observer = new ResizeObserver((entries) => {
    capacity.value = Math.max(
      1,
      Math.min(6, Math.floor((entries[0]?.contentRect.width ?? 400) / 115)),
    )
  })
  if (host.value) observer.observe(host.value)
})
onBeforeUnmount(() => {
  observer?.disconnect()
  chart?.destroy()
  chart = undefined
})
</script>
<template>
  <DashboardCustomChart
    v-if="customized"
    :rows="rows"
    :label="label"
    :settings="settings"
    default-type="bar"
  />
  <figure
    v-show="!customized"
    ref="host"
    class="command-category-chart command-grouped-chart"
    :aria-label="label"
  >
    <ul class="command-legend" :aria-label="t('command.legend')">
      <li v-for="(label, index) in series" :key="index">
        <i :style="{ background: colors[index] }"></i>{{ label }}
      </li>
    </ul>
    <div class="command-grouped-canvas">
      <canvas ref="canvas" role="img" :aria-label="label"></canvas>
    </div>
    <nav v-if="pages > 1" class="command-chart-pagination" :aria-label="t('command.locationPages')">
      <span>{{
        t('command.locationRange', {
          start: page * capacity + 1,
          end: Math.min((page + 1) * capacity, rows.length),
          total: rows.length,
        })
      }}</span>
      <div>
        <button type="button" :disabled="page === 0" :aria-label="t('previous')" @click="page--">
          <DashboardIcon name="arrow" class="command-prev locale-directional-icon" />
        </button>
        <button type="button" :disabled="page >= pages - 1" :aria-label="t('next')" @click="page++">
          <DashboardIcon name="arrow" class="locale-directional-icon" />
        </button>
      </div>
    </nav>
    <details class="command-chart-table">
      <summary>{{ t('command.viewChartData') }}</summary>
      <div class="command-table-wrap">
        <table>
          <thead>
            <tr>
              <th scope="col">{{ t('command.locationsAxis') }}</th>
              <th v-for="label in series" :key="label" scope="col">{{ label }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in visible" :key="row.id">
              <th scope="row">
                <bdi dir="auto">{{ row.label }}</bdi>
              </th>
              <td v-for="segment in row.segments" :key="segment.key">
                <bdi>{{ number(segment.value) }}</bdi>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </details>
  </figure>
</template>
