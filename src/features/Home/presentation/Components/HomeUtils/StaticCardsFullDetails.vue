<script setup lang="ts">
import MostIncidantFactor from '../HomeStatistics/MostIncidantFactor.vue'

const { homeInspectionState } = defineProps<{
  homeInspectionState: any
}>()
</script>
<template>
  <div class="most-incidat-factor">
    <MostIncidantFactor
      :title="$t('high-risk hazards unmitigated')"
      v-if="homeInspectionState?.data?.Hazard?.length! > 0"
      :data="[
          {
            value: homeInspectionState?.data?.Hazard[0]?.count!,
            label: homeInspectionState?.data?.Hazard[0]?.hazard_title!,
            spanClass: 'ToatlInsedant-one',
            link: `/organization/equipment-mangement/observation?isAll=1&type=2&hazard=${homeInspectionState?.data?.Hazard[0]?.hazard_id}`,
          },
          {
            value: homeInspectionState?.data?.Hazard[1]?.count!,
            label: homeInspectionState?.data?.Hazard[1]?.hazard_title!,
            spanClass: 'ToatlInsedant-two',
            link: `/organization/equipment-mangement/observation?isAll=1&type=2&hazard=${homeInspectionState?.data?.Hazard[1]?.hazard_id}`,
          },
          {
            value: homeInspectionState?.data?.Hazard[2]?.count!,
            label: homeInspectionState?.data?.Hazard[2]?.hazard_title!,
            spanClass: 'ToatlInsedant-three',
            link: `/organization/equipment-mangement/observation?isAll=1&type=2&hazard=${homeInspectionState?.data?.Hazard[2]?.hazard_id}`,
          },
        ]"
    />
    <MostIncidantFactor
      :title="$t('Employee certificates status')"
      :data="[
          {
            value: homeInspectionState?.data?.employeeCertificates?.expired!,
            label: `${$t('Expired')}`,
            spanClass: 'Expired',
            divClass: 'ExpiredClass',
            link: '/organization/employee-certificate',
          },
          {
            value: homeInspectionState?.data?.employeeCertificates?.inactive!,
            label: `${$t('need to take')}`,
            spanClass: 'more-time',
            divClass: 'more-time-class',
            link: '/organization/employee-certificate',
          },
        ]"
    />
    <MostIncidantFactor
      :title="$t('Inspections status')"
      :data="[
          {
            value: homeInspectionState?.data?.totalFinishedInspectionsResults!,
            label: `${$t('finished')}`,
            spanClass: 'finished',
            divClass: 'finished-class',
          },
          {
            value: homeInspectionState?.data?.Inspection?.delayed!,
            label: `${$t('duration-ended')}`,
            spanClass: 'duration-ended',
            divClass: 'duration-ended-class',
          },
        ]"
    />
    <MostIncidantFactor
      :title="$t('most used root causes')"
      v-if="homeInspectionState?.data?.MostUsed?.length! > 0"
      :data="[
          {
            value: homeInspectionState?.data?.MostUsed[0]?.count!,
            label: homeInspectionState?.data?.MostUsed[0]?.rootCauseTitle!,
            spanClass: 'ToatlInsedant-one',
            link: `/organization/equipment-mangement/incedant?isAll=1&rootCause=${homeInspectionState?.data?.MostUsed[0]?.id}`,
          },
          {
            value: homeInspectionState?.data?.MostUsed[1]?.count!,
            label: homeInspectionState?.data?.MostUsed[1]?.rootCauseTitle!,
            spanClass: 'ToatlInsedant-two',
            link: `/organization/equipment-mangement/incedant?isAll=1&rootCause=${homeInspectionState?.data?.MostUsed[1]?.id}`,
          },
          {
            value: homeInspectionState?.data?.MostUsed[2]?.count!,
            label: homeInspectionState?.data?.MostUsed[2]?.rootCauseTitle!,
            spanClass: 'ToatlInsedant-three',
            link: `/organization/equipment-mangement/incedant?isAll=1&rootCause=${homeInspectionState?.data?.MostUsed[2]?.id}`,
          },
        ]"
    />
  </div>
</template>
