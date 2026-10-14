<script setup lang="ts">
import '../../styles/home-identity.css'
import InvestegationStatics from '../HomeStatistics/InvestegationStatics.vue'
import ObservatoinFactoryStatistics from '../HomeStatistics/ObservatoinFactoryStatistics.vue'

const { OverviewHazardChartstate, overviewInvestigationsChartstate } = defineProps<{
  OverviewHazardChartstate: any
  overviewInvestigationsChartstate: any
}>()
</script>

<template>
  <div class="hse-identity hse-home-charts">
    <!-- <div class="dashboard-section-heading">
      <span>{{ $t('risk') }}</span>
      <h3>{{ $t('Investigations') }}</h3>
    </div> -->

    <div class="hse-home-chart-grid">
      <section class="hse-home-panel hse-home-chart-panel">
        <ObservatoinFactoryStatistics
          v-if="OverviewHazardChartstate?.data?.length! > 0"
          :OverviewHazardChartstate="OverviewHazardChartstate?.data!"
        />
      </section>

      <section class="hse-home-panel hse-home-chart-panel">
        <InvestegationStatics
          v-if="overviewInvestigationsChartstate?.data?.length! > 0"
          :overviewInvestigationsChartstate="overviewInvestigationsChartstate?.data!"
        />
      </section>
    </div>
  </div>
</template>
