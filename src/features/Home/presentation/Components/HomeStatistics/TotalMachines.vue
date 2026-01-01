<script setup lang="ts">
import { ref, onMounted, watch, nextTick, onBeforeUnmount } from 'vue'
import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
} from 'chart.js'
import type StatisticsMachineModel from '@/features/Home/data/Model/StatisticsMachineModel';

Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip
)

const props = defineProps<{
  totalMachines: StatisticsMachineModel[]
}>()


import { shallowRef } from 'vue'

const chartInstance = shallowRef<Chart | null>(null)
const chartRef = ref<HTMLCanvasElement | null>(null)
// const chartInstance = ref<Chart | null>(null)
let isUpdating = false
const buildMonthlyData = (type: number) => {
  const months = Array(12).fill(0)

  const machine = props.totalMachines?.find(m => m.type === type)
  if (!machine) return months

  machine.months.forEach(m => {
    months[m.month - 1] = m.number
  })

  return months
}
const toolData = ref(buildMonthlyData(3))
const EquipmentTypeData = ref(buildMonthlyData(1))
const DeviceTypeData = ref(buildMonthlyData(2))

onMounted(() => {
  chartInstance.value = new Chart(chartRef.value!, {
    type: 'bar',
    data: {
      labels: [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [
        {
          data: Array(12).fill(0),
          backgroundColor: '#BEE8FF',
          borderRadius: 20,
          stack: 'stack1',
        },
        {
          data: Array(12).fill(0),
          backgroundColor: '#6BB6FF',
          borderRadius: { bottomLeft: 20, bottomRight: 20 },
          stack: 'stack1',
        },
        {
          data: Array(12).fill(0),
          backgroundColor: '#2F6BFF',
          borderRadius: 7,
          stack: 'stack1',
        },
      ],
    },
    options: {
      responsive: true,
      animation: false, // 👈 مهم
      scales: {
        x: {
          stacked: true,
          grid: { display: false },
          ticks: {
            font: {
              size: 8, 
              weight: '500', 
              family: 'Light', 
            },
            color: '#333', 
          },

        },
        y: { stacked: true, display: false },
      },
      plugins: { legend: { display: false } },
      barThickness: 20,
    },
  })
})


watch(
  () => props.totalMachines,
  () => {
    if (!chartInstance.value) return

    chartInstance.value.data.datasets[0].data = buildMonthlyData(1)
    chartInstance.value.data.datasets[1].data = buildMonthlyData(2)
    chartInstance.value.data.datasets[2].data = buildMonthlyData(3)

    chartInstance.value.update('none')
  },
  { immediate: true }
)
onBeforeUnmount(() => {
  chartInstance.value?.destroy()
})

</script>
<template>
  <div class="total-machines-container">
    <div class="total-machines-header-container">
      <div class="total-machines-header">
        <span class="static">static</span>
        <p class="static-title">total machines </p>
      </div>

      <div class="static-data">
        <p>tool</p>
        <p>equipment</p>
        <p>device</p>
      </div>

    </div>

    <div style="width:100%;">
      <canvas ref="chartRef"></canvas>
    </div>
  </div>
</template>
