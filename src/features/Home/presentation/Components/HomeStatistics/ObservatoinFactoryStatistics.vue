<script setup lang="ts">
import { ref, onMounted } from "vue";
import Chart from 'primevue/chart';



const chartData = ref();
const chartOptions = ref();

const setChartData = () => {
  const documentStyle = getComputedStyle(document.documentElement);

  return {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    datasets: [
      {
        label: 'hazard',
        backgroundColor: documentStyle.getPropertyValue('--hazard-color'),
        borderColor: documentStyle.getPropertyValue('--hazard-color'),
        data: [25, 25, 30, 20, 10, 15, 35]
      },
      {
        label: 'observation',
        backgroundColor: documentStyle.getPropertyValue('--observation-color'),
        borderColor: documentStyle.getPropertyValue('--observation-color'),
        data: [25, 25, 30, 20, 10, 15, 35]


      },
      {
        label: 'incident',
        backgroundColor: documentStyle.getPropertyValue('--incidant-color'),
        borderColor: documentStyle.getPropertyValue('--incidant-color'),
        // marginbottm
        margin: '20px',
        data: [25, 25, 30, 20, 10, 15, 35]


      },
    ]
  };
};
const setChartOptions = () => {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue('--p-text-color');
  const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
  const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

  return {
    maintainAspectRatio: false,
    aspectRatio: 0.8,
    plugins: {
      legend: {
        labels: {
          color: textColor
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: textColorSecondary,
          font: {
            weight: 500
          }
        },
        grid: {
          display: false,
          drawBorder: false
        }
      },
      y: {
        ticks: {
          color: textColorSecondary
        },
        grid: {
          color: surfaceBorder,
          drawBorder: false
        }
      }
    }
  };
}

onMounted(() => {
  chartData.value = setChartData();
  chartOptions.value = setChartOptions();
});
</script>

<template>
  <div class="total-observation-container">
    <div class="total-observation-header-container">
      <div class="total-observation-header">
        <p class="static-title">hazard & opservation & incident overview </p>
      </div>
    </div>
    <Chart type="bar" :data="chartData" :options="chartOptions" class="h-[30rem]" />
  </div>
</template>
