<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  Chart,
  ArcElement,
  Tooltip,
  Legend,
  DoughnutController
} from 'chart.js'
import type TopTeamsModel from '@/features/Home/data/Model/TopTeamsModel';

Chart.register(
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend
)

const props = defineProps<{
  topTeams: TopTeamsModel[]
}>()

const chartCanvas = ref(null)
const chartCanvas2 = ref(null)
const chartCanvas3 = ref(null)

onMounted(() => {
  new Chart(chartCanvas.value, {
    type: 'doughnut',
    data: {
      datasets: [
        {
          data: [70, 30],
          backgroundColor: ['#1D4ED8', '#F1F3F7'],
          borderRadius: [5, 0],
          borderWidth: 0,
          hoverBackgroundColor: ['#4CAF50', '#E0E0E0'],
        },
      ],
    },
    options: {
      cutout: '70%',
      rotation: -90,
      circumference: 180,
      plugins: {
        legend: { display: false },
      },
    },
  })
  new Chart(chartCanvas2.value, {
    type: 'doughnut',
    data: {
      datasets: [
        {
          data: [40, 60],
          backgroundColor: ['#4E9FFF', '#F1F3F7'],
          borderRadius: [5, 0],
          borderWidth: 0,
          hoverBackgroundColor: ['#4CAF50', '#E0E0E0'],
        },
      ],
    },
    options: {
      cutout: '70%',
      rotation: -90,
      circumference: 180,
      plugins: {
        legend: { display: false },
      },
    },
  })

  new Chart(chartCanvas3.value, {
    type: 'doughnut',
    data: {
      datasets: [
        {
          data: [20, 80],
          backgroundColor: ['#8BBEFB', '#F1F3F7'],
          borderRadius: [5, 0],
          borderWidth: 0,
          hoverBackgroundColor: ['#4CAF50', '#E0E0E0'],
        },
      ],
    },
    options: {
      cutout: '50%',
      rotation: -90,
      circumference: 180,
      plugins: {
        legend: { display: false },
      },
    },
  })
})
</script>

<template>
  <div class="top-teams-container">
    <div class="top-teams-header">
      <span class="static">static</span>
      <p class="static-title">top 3 teams <span>_ The largest in number</span></p>
    </div>
    <div class="top-teams-container">
      <div class="first" style="width:300px;margin:auto">
        <canvas ref="chartCanvas"></canvas>
      </div>
      <div class="second" style="width:200px;margin:auto">
        <canvas ref="chartCanvas2"></canvas>
      </div>
      <div class="third" style="width:120px;margin:auto">
        <canvas ref="chartCanvas3"></canvas>
      </div>
    </div>
    <div class="top-teams-names">
      <p v-for="(teams, index) in topTeams" :key="index">{{ teams.title }} <span>( {{ teams.number }})</span></p>
    </div>
  </div>
</template>
