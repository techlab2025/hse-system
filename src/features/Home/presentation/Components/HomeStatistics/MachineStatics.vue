<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Chart from 'primevue/chart'
import { watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useThemeMode } from '@/composables/useThemeMode'
const identityRoot = ref<HTMLElement | null>(null)
const { isDarkMode } = useThemeMode()
const chartStyle = () =>
  getComputedStyle(identityRoot.value?.closest('.hse-identity') ?? document.documentElement)

const props = defineProps<{
  statics: { rent: number; owned: number }
}>()
const { t, locale } = useI18n()
// watch(() => props.statics, () => {
//   chartData.value = setChartData();
//   chartOptions.value = setChartOptions();
// })
onMounted(() => {
  chartData.value = setChartData()
  chartOptions.value = setChartOptions()
})
const Rent = ref(props.statics?.rent)
const Owned = ref(props.statics?.owned)

const chartData = ref()
const chartOptions = ref()

const setChartData = () => {
  const documentStyle = chartStyle()

  return {
    labels: [t('rent'), t('owned')],
    datasets: [
      {
        data: [Rent.value, Owned.value],
        backgroundColor: [
          documentStyle.getPropertyValue('--hse-project-blue') ||
            documentStyle.getPropertyValue('--p-owned-500'),
          documentStyle.getPropertyValue('--hse-project-cyan') ||
            documentStyle.getPropertyValue('--p-rent-500'),
        ],
        hoverBackgroundColor: [
          documentStyle.getPropertyValue('--hse-project-blue') ||
            documentStyle.getPropertyValue('--p-owned-500'),
          documentStyle.getPropertyValue('--hse-project-cyan') ||
            documentStyle.getPropertyValue('--p-rent-500'),
        ],
      },
    ],
  }
}

const setChartOptions = () => {
  const documentStyle = chartStyle()
  const textColor =
    documentStyle.getPropertyValue('--hse-project-muted') ||
    documentStyle.getPropertyValue('--p-text-color')

  return {
    locale: locale.value,
    plugins: {
      legend: {
        rtl: locale.value === 'ar',
        textDirection: locale.value === 'ar' ? 'rtl' : 'ltr',
        labels: {
          usePointStyle: true,
          font: { family: documentStyle.fontFamily, size: 12 },
          color: textColor,
        },
      },
    },
  }
}

watch(
  () => props.statics,
  (newVal) => {
    console.log(newVal, 'new ')
    Rent.value = newVal.rent
    Owned.value = newVal.owned
    chartData.value = setChartData()
    chartOptions.value = setChartOptions()
  },
)

watch(
  [locale, isDarkMode],
  () => {
    chartData.value = setChartData()
    chartOptions.value = setChartOptions()
  },
  { flush: 'post' },
)
</script>
<template>
  <div ref="identityRoot" class="top-teams-container">
    <div class="top-teams-header">
      <span class="static">{{ $t('statistics') }}</span>
      <p class="static-title">{{ $t('equipment_devices_tools') }}</p>
    </div>
    <!-- <div class="top-teams-container"> -->
    <div class="machine-statics">
      <Chart
        style="max-height: 250px"
        type="pie"
        :data="chartData"
        :options="chartOptions"
        class="w-full md:w-[20rem]"
      />
    </div>
    <!-- </div> -->
  </div>
</template>

<style lang="scss" scoped>
.top-teams-container {
  height: fit-content;
  //
}
.machine-statics {
  gap: 10px;
  padding: 10px;
  border-radius: 10px;
  // box-shadow: 0px 4px 8px color-mix(in srgb, var(--text-strong) 10%, transparent);
  width: 100%;
  // height: 400px;
}
.p-chart {
  display: flex !important;
  justify-content: center !important;
  margin-inline: auto !important;
}
.top-teams-container {
  @media (max-width: 1050px) {
    margin-bottom: 5rem;
  }
}
</style>
