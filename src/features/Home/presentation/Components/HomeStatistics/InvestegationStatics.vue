<template>
  <div class="chart_container">
    <div class="chart_row" v-for="(value, index) in data" :key="index">
      <div class="span" v-for="i in 8" :key="i"></div>
      <div class="total_count_chart" :style="{ height: value + '%' }">+<span>{{ value }}</span>%</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const data = ref([65, 59, 80, 81, 56]) 
</script>

<style lang="scss" scoped>
.chart_container {
  display: flex;
  gap: 1rem; 
  // height: 500px;
  height: 60vh;
}

.chart_row {
  position: relative;
  width: 80px;
  background-color: rgba(227, 239, 255, 1);
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  // padding-bottom: 10px;

  
  .span:nth-child(1) { bottom: 10%; transform: rotate(160deg) }
  .span:nth-child(2) { bottom: 30%; transform: rotate(160deg)}
  .span:nth-child(3) { bottom: 50%; transform: rotate(160deg)}
  .span:nth-child(4) { bottom: 70%; transform: rotate(160deg)}
  .span:nth-child(5) { bottom: 800%; transform: rotate(160deg)}
  .span:nth-child(6) { bottom: 90%; transform: rotate(160deg)}
  //  .span:nth-child(7) { bottom: 100%; transform: rotate(160deg)}
  .span {
    position: absolute;
    width: 100%;
    height: 2px;
    background-color: rgb(149, 192, 248);
  
  }

  .total_count_chart {
   background: linear-gradient(163.62deg, #789EFF 2.14%, #1D4ED8 97.96%);
    border-radius: 15px ;
    width: 100%;
    text-align: center;
    color: white;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    font-weight: bold;
    font-size: 20px;
    padding-bottom: 1rem;
  }
}

</style>
