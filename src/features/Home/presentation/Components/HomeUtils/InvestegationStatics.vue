<script setup lang="ts">
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type OverviewHazardChartModel from '@/features/Home/data/Model/OverviewHazardChartModel'
import type OverviewInvestigationsChartModel from '@/features/Home/data/Model/OverviewInvestigationsChartModel'
import InvestegationStatics from '../HomeStatistics/InvestegationStatics.vue'
import ObservatoinFactoryStatistics from '../HomeStatistics/ObservatoinFactoryStatistics.vue'
import DashboardPanel from '../Dashboard/DashboardPanel.vue'
defineProps<{
  OverviewHazardChartstate: DataState<OverviewHazardChartModel[]>
  overviewInvestigationsChartstate: DataState<OverviewInvestigationsChartModel[]>
}>()
</script>
<template>
  <div class="dashboard-chart-grid">
    <DashboardPanel
      :title="$t('Safety activity by zone')"
      :eyebrow="$t('Understand the signals')"
      :description="$t('Explore hazards, observations, and incidents.')"
      icon="activity"
      :state="OverviewHazardChartstate"
      ><ObservatoinFactoryStatistics
        :OverviewHazardChartstate="OverviewHazardChartstate.data ?? []"
      /><template #footer
        ><span>{{ $t('Use the category buttons to focus the comparison.') }}</span></template
      ></DashboardPanel
    >
    <DashboardPanel
      :title="$t('Investigation closure')"
      :eyebrow="$t('Close the loop')"
      :description="$t('Closure percentages reported for each zone.')"
      icon="shield"
      :state="overviewInvestigationsChartstate"
      ><InvestegationStatics
        :overviewInvestigationsChartstate="overviewInvestigationsChartstate.data ?? []"
    /></DashboardPanel>
  </div>
</template>
