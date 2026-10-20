<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { formatMetric, metricNumber } from '../../utils/dashboardMetrics'
import {
  DataInitial,
  DataLoading,
  type DataState,
} from '@/base/core/networkStructure/Resources/dataState/data_state'
import type FetchHomeInspectionModel from '@/features/Home/data/Model/FetchHomeInspectionModel'
import ToatlInsedant from '../HomeStatistics/ToatlInsedant.vue'
const props = defineProps<{ homeInspectionState: DataState<FetchHomeInspectionModel> }>()
const loading = computed(
  () =>
    props.homeInspectionState instanceof DataInitial ||
    props.homeInspectionState instanceof DataLoading,
)
const { t, locale } = useI18n()
const plannedInspectionsLabel = computed(() => {
  const planned = metricNumber(
    props.homeInspectionState.data?.totalInspectionSupposedOccuredThisMonth,
  )
  return planned == null
    ? t('per this month')
    : t('Inspections planned this month', { count: formatMetric(planned, locale.value) })
})
</script>
<template>
  <div class="dashboard-kpis">
    <ToatlInsedant
      :total-insedant="homeInspectionState.data?.totalIncidents"
      :title="$t('Total Incidents')"
      :sub-title="$t('per this month')"
      icon="activity"
      tone="danger"
      :loading="loading"
      link="/organization/equipment-mangement/incedant?isAll=1"
    />
    <ToatlInsedant
      :total-insedant="homeInspectionState.data?.hazardObservationsHigh"
      :title="$t('High Severity Events')"
      :sub-title="$t('per this month')"
      icon="alert"
      tone="warning"
      :loading="loading"
      link="/organization/equipment-mangement/observation?isAll=1&type=2&risk_level=3"
    />
    <ToatlInsedant
      :total-insedant="homeInspectionState.data?.inspectionCompliancePercentage"
      :title="$t('Inspection Compliance')"
      :sub-title="plannedInspectionsLabel"
      icon="shield"
      tone="success"
      percentage
      :loading="loading"
      link="/organization/equipment-mangement/inspection?inspectionType=1"
    />
    <ToatlInsedant
      :total-insedant="homeInspectionState.data?.openCorrectiveActions"
      :title="$t('Open Corrective Actions')"
      :sub-title="$t('Actions awaiting closure')"
      icon="clipboard"
      tone="primary"
      :loading="loading"
    />
  </div>
</template>
