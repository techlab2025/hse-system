<script setup lang="ts">
import ToatlInsedant from '../HomeStatistics/ToatlInsedant.vue'

const { homeInspectionState } = defineProps<{
  homeInspectionState: any
}>()
</script>
<template>
  <div class="all-total-insedents">
    <ToatlInsedant
      :totalInsedant="homeInspectionState?.data?.totalIncidents!"
      :title="`${$t('Total Incidents')}`"
      :subTitle="`${$t('per this month')}`"
      textClass="ToatlInsedant-one"
      link="/organization/equipment-mangement/incedant?isAll=1"
    />

    <ToatlInsedant
      :totalInsedant="homeInspectionState?.data?.hazardObservationsHigh!"
      :title="`${$t('High Severity Events')}`"
      :subTitle="`${$t('per this month')}`"
      textClass="ToatlInsedant-two"
      link="/organization/equipment-mangement/observation?isAll=1&type=2&risk_level=3"
    />

    <ToatlInsedant
      :totalInsedant="homeInspectionState?.data?.totalInspectionSupposedOccuredThisMonth!"
      :title="`${$t('Inspection Compliance')}`"
      :subTitle="`${$t('per this month')}`"
      textClass="ToatlInsedant-three"
      link="/organization/equipment-mangement/inspection?inspectionType=1"
    />

    <ToatlInsedant
      :totalInsedant="homeInspectionState?.data?.openCorrectiveActions!"
      :title="`${$t('Open Corrective Actions')}`"
      :subTitle="`${$t('per this month')}`"
      textClass="ToatlInsedant-four"
    />
  </div>
</template>
