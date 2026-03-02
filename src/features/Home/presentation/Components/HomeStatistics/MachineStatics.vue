<script setup lang="ts">
import { ref, onMounted } from "vue";
import Chart from 'primevue/chart';
import { watch } from "vue";

const props = defineProps<{
  statics: { rent: number, owned: number }
}>()
// watch(() => props.statics, () => {
//   chartData.value = setChartData();
//   chartOptions.value = setChartOptions();
// })
onMounted(() => {
  chartData.value = setChartData();
  chartOptions.value = setChartOptions();
});
const Rent = ref(props.statics?.rent)
const Owned = ref(props.statics?.owned)

const chartData = ref();
const chartOptions = ref();

const setChartData = () => {
  const documentStyle = getComputedStyle(document.body);


  return {
    labels: ['rent', 'owned'],
    datasets: [
      {
        data: [Rent.value, Owned.value],
        backgroundColor: [documentStyle.getPropertyValue('--p-owned-500'), documentStyle.getPropertyValue('--p-rent-500')],
        hoverBackgroundColor: [documentStyle.getPropertyValue('--p-owned-500'), documentStyle.getPropertyValue('--p-rent-500')]
      }
    ]
  };
};

const setChartOptions = () => {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue('--p-text-color');

  return {
    plugins: {
      legend: {
        labels: {
          usePointStyle: true,
          color: textColor
        }
      }
    }
  };
};

watch(() => props.statics, (newVal) => {
  console.log(newVal, "new ");
  Rent.value = newVal.rent
  Owned.value = newVal.owned
  chartData.value = setChartData();
  chartOptions.value = setChartOptions();
})
</script>
<template>

  <div class="top-teams-container">
    <div class="top-teams-header">
      <span class="static">static</span>
      <p class="static-title">Equipment & Devices & Tools</p>
    </div>
    <!-- <div class="top-teams-container"> -->
    <div class="machine-statics">
      <Chart style="max-height: 250px;" type="pie" :data="chartData" :options="chartOptions"
        class="w-full md:w-[20rem]" />
    </div>
    <!-- </div> -->
  </div>


</template>

<style lang="scss" scoped>
.top-teams-container{
  height: fit-content;
//
}
.machine-statics {
  gap: 10px;
  padding: 10px;
  border-radius: 10px;
  // box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  // height: 400px;
}
.top-teams-container{
  @media (max-width: 1050px) {
margin-bottom: 5rem;
  }
}
</style>
