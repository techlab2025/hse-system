<script setup lang="ts">
import MostIncidantFactor from '../HomeStatistics/MostIncidantFactor.vue'

const { homeInspectionState } = defineProps<{
  homeInspectionState: any
}>()
</script>
<template>
  <div class="most-incidat-factor details-signal-grid">
    <!-- <MostIncidantFactor
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
    /> -->
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

<style scoped lang="scss">
.details-signal-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  min-width: 0;
}
@media (max-width: 900px) {
  .details-signal-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.details-signal-grid :deep(.incidant-factor-container) {
  min-width: 0;
  min-height: 176px;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--main-border) 80%, transparent);
  border-radius: 20px;
  background:
    radial-gradient(
      circle at 100% 0%,
      color-mix(in srgb, var(--PrimaryColor) 8%, transparent),
      transparent 42%
    ),
    var(--BgWhite);
  padding: 16px;
  box-shadow: none;
  transition:
    transform 0.22s ease,
    border-color 0.22s ease,
    box-shadow 0.22s ease;
}

.details-signal-grid :deep(.incidant-factor-container:hover) {
  transform: translateY(-3px);
  border-color: color-mix(in srgb, var(--PrimaryColor) 28%, var(--main-border));
  box-shadow: 0 16px 34px color-mix(in srgb, var(--brand-primary-900) 10%, transparent);
}

.details-signal-grid :deep(.incidant-factor-header-container) {
  padding: 0;
  margin-bottom: 12px;
}

.details-signal-grid :deep(.static-title) {
  margin: 0;
  color: var(--header-page-color);
  font-family: 'bold';
  font-size: 15px;
  font-weight: 900;
  line-height: 1.25;
}

.details-signal-grid :deep(.static-data) {
  margin-top: 8px;
}

.details-signal-grid :deep(.static-data p) {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 10px;
  align-items: center;
  min-height: 40px;
  margin: 0;
  padding: 9px 10px;
  border: 1px solid color-mix(in srgb, var(--main-border) 72%, transparent);
  border-radius: 14px;
  background: color-mix(in srgb, var(--Gray-1) 70%, var(--BgWhite));
  color: var(--GrayText-1);
  font-size: 12px;
  font-weight: 800;
  line-height: 1.3;
}

.details-signal-grid :deep(.static-data + .static-data) {
  margin-top: 8px;
}

.details-signal-grid :deep(.static-data p span) {
  display: inline-flex;
  min-width: 32px;
  height: 32px;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: color-mix(in srgb, var(--PrimaryColor) 10%, transparent);
  color: var(--PrimaryColor);
  font-family: 'bold';
  font-size: 14px;
  font-weight: 900;
}

.details-signal-grid :deep(.Expired),
.details-signal-grid :deep(.duration-ended),
.details-signal-grid :deep(.ToatlInsedant-two) {
  background: color-mix(in srgb, var(--danger-color) 10%, transparent) !important;
  color: var(--danger-color) !important;
}

.details-signal-grid :deep(.finished),
.details-signal-grid :deep(.ToatlInsedant-three) {
  background: color-mix(in srgb, var(--green) 12%, transparent) !important;
  color: var(--green) !important;
}

.details-signal-grid :deep(.more-time),
.details-signal-grid :deep(.ToatlInsedant-one) {
  background: color-mix(in srgb, var(--p-rent-500) 12%, transparent) !important;
  color: var(--p-rent-500) !important;
}

@media (max-width: 760px) {
  .details-signal-grid {
    grid-template-columns: 1fr;
  }
}
</style>
