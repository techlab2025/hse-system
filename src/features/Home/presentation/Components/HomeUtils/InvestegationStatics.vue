<script setup lang="ts">
import InvestegationStatics from '../HomeStatistics/InvestegationStatics.vue'
import ObservatoinFactoryStatistics from '../HomeStatistics/ObservatoinFactoryStatistics.vue'

const { OverviewHazardChartstate, overviewInvestigationsChartstate } = defineProps<{
  OverviewHazardChartstate: any
  overviewInvestigationsChartstate: any
}>()
</script>

<template>
  <div class="Hazard-Investigation">
    <ObservatoinFactoryStatistics
      v-if="OverviewHazardChartstate?.data?.length! > 0"
      :OverviewHazardChartstate="OverviewHazardChartstate?.data!"
    />
    <InvestegationStatics
      v-if="overviewInvestigationsChartstate?.data?.length! > 0"
      :overviewInvestigationsChartstate="overviewInvestigationsChartstate?.data!"
    />
  </div>
</template>
