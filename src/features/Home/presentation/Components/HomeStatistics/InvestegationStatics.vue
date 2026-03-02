<template>

  <div class="investigations_container">
    <div class="title">
      <h6>Overview investigations</h6>
      <p>These are the percentages of closed investigations for each month.</p>
    </div>
    <div class="chart_container">
      <div class="chart_row" v-for="(value, index) in props.overviewInvestigationsChartstate" :key="index">
        <div class="span" v-for="i in 8" :key="i"></div>
        <div class="total_count_chart" :style="{ height: value.total + '%' }"><span>+{{ value.total }}</span>%</div>
        <p class="zone_title">{{ wordSlice(value.zoneTitle, 7) }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import wordSlice from '@/base/Presentation/utils/word_slice';
import OverviewInvestigationsChartModel from '@/features/Home/data/Model/OverviewInvestigationsChartModel';
import { ref } from 'vue'

const data = ref([65, 59, 80, 81, 56])

const props = defineProps<{
  overviewInvestigationsChartstate: OverviewInvestigationsChartModel[]
}>()

</script>

<style lang="scss" scoped>
.investigations_container {
  //  overflow: hidden;
  padding-bottom: 30px;

  .title {

    h6 {
      font-size: 20px;
      font-weight: 700;
      color: #0C2058;
    }

    p {
      font-size: 12px;
      font-weight: 600;
      color: #BCBCBC;
    }

    margin: 1.8rem 0;
  }
}

.chart_container {
  display: flex;
  gap: 1rem;
  // height: 500px;
  height: 35vh;
  position: relative;
  margin-bottom: 1rem;

}

.chart_container p {
  color: #0C2058;
  font-size: 12px;
  font-weight: 700;
}

.chart_container .zone_title {
  position: absolute;
  bottom: -30px;
}

.chart_container span {
  z-index: 11;
}

.chart_row {
  position: relative;
  width: 100%;
  background-color: rgba(227, 239, 255, 1);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  max-width: 35px;
  // padding-bottom: 10px;


  .span:nth-child(1) {
    bottom: 10%;
    transform: rotate(160deg)
  }

  .span:nth-child(2) {
    bottom: 30%;
    transform: rotate(160deg)
  }

  .span:nth-child(3) {
    bottom: 50%;
    transform: rotate(160deg)
  }

  .span:nth-child(4) {
    bottom: 70%;
    transform: rotate(160deg)
  }

  .span:nth-child(5) {
    bottom: 800%;
    transform: rotate(160deg)
  }

  .span:nth-child(6) {
    bottom: 90%;
    transform: rotate(160deg)
  }

  //  .span:nth-child(7) { bottom: 100%; transform: rotate(160deg)}
  .span {
    position: absolute;
    width: 100%;
    height: 2px;
    background-color: rgb(149, 192, 248);

  }

  .total_count_chart {
    background: linear-gradient(163.62deg, #789EFF 2.14%, #1D4ED8 97.96%);
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
    border-radius: 12px;
    width: 100%;
    text-align: center;
    color: white;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    font-weight: bold;
    font-size: 13px;
    // padding-bottom: 1rem;
    padding: 0 .5rem 1rem;
    z-index: 11;
    text-shadow: 2px 2px 4px #000000;
  }
}

@media (max-width: 600px) {
  .chart_row {
    max-width: 25px;
  }

  .total_count_chart {
    font-size: 12px !important;
  }

  .chart_container {
    overflow: scroll;
  }
}
</style>
