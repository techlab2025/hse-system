<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type FetchHomeInspectionModel from '@/features/Home/data/Model/FetchHomeInspectionModel'
import MostIncidantFactor from '../HomeStatistics/MostIncidantFactor.vue'
import DashboardPanel from '../Dashboard/DashboardPanel.vue'
const props = defineProps<{ homeInspectionState: DataState<FetchHomeInspectionModel> }>()
const { t } = useI18n()
const certificates = computed(() => [
  {
    value: props.homeInspectionState.data?.employeeCertificates?.expired,
    label: t('Expired'),
    spanClass: 'danger',
    link: '/organization/employee-certificate',
  },
  {
    value: props.homeInspectionState.data?.employeeCertificates?.inactive,
    label: t('need to take'),
    spanClass: 'warning',
    link: '/organization/employee-certificate',
  },
])
const inspections = computed(() => [
  {
    value: props.homeInspectionState.data?.totalFinishedInspectionsResults,
    label: t('finished'),
    spanClass: 'success',
    link: '/organization/equipment-mangement/inspection?inspectionType=3',
  },
  {
    value: props.homeInspectionState.data?.Inspection?.delayed,
    label: t('duration-ended'),
    spanClass: 'danger',
    link: '/organization/equipment-mangement/inspection?inspectionType=1',
  },
])
const rootCauses = computed(() =>
  (props.homeInspectionState.data?.MostUsed ?? [])
    .slice()
    .sort((a, b) => b.count - a.count)
    .slice(0, 3)
    .map((item) => ({
      value: item.count,
      label: item.rootCauseTitle,
      link: `/organization/equipment-mangement/incedant?isAll=1&rootCause=${item.id}`,
    })),
)
</script>
<template>
  <DashboardPanel
    :title="$t('Operational focus')"
    :eyebrow="$t('Keep work moving')"
    :description="$t('Certificates, inspections, and recurring causes.')"
    icon="target"
    :state="homeInspectionState"
    class="dashboard-focus-panel"
  >
    <MostIncidantFactor :title="$t('Employee certificates status')" :data="certificates" />
    <MostIncidantFactor :title="$t('Inspections status')" :data="inspections" />
    <MostIncidantFactor :title="$t('most used root causes')" :data="rootCauses" />
  </DashboardPanel>
</template>
