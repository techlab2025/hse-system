<script setup>
import { ref, onMounted } from "vue";
import Chart from 'primevue/chart';

onMounted(() => {
  chartData.value = setChartData();
  chartOptions.value = setChartOptions();
});

const chartData = ref();
const chartOptions = ref();

const setChartData = () => {
  const documentStyle = getComputedStyle(document.documentElement);

  return {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'male ',
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: true,
        tension: 0.4,
        borderColor: '#1D4ED8',
        backgroundColor: 'rgba(29, 79, 216, 0.253)'
      },
      {
        label: 'female',
        data: [12, 51, 62, 33, 21, 62, 45],
        fill: true,
        borderColor: '#F2B2B2',
        tension: 0.4,
        backgroundColor: 'rgba(242, 178, 178, 0.466)',

      }
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
    aspectRatio: 0.6,
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
          color: textColorSecondary
        },
        grid: {
          color: surfaceBorder
        }
      },
      y: {
        ticks: {
          color: textColorSecondary
        },
        grid: {
          color: surfaceBorder
        }
      }
    }
  };
}
</script>


<template>
  <Chart type="line" :data="chartData" :options="chartOptions" class="h-[30rem]" />
</template>
