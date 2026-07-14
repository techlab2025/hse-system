<script setup lang="ts">
import ToatlInsedant from '../HomeStatistics/ToatlInsedant.vue'

const { homeInspectionState } = defineProps<{
  homeInspectionState: any
}>()
</script>
<template>
  <div class="all-total-insedents monthly-kpi-grid">
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

<style scoped lang="scss">
.monthly-kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  min-width: 0;
}
@media (max-width: 900px) {
  .monthly-kpi-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.monthly-kpi-grid :deep(a),
.monthly-kpi-grid :deep(> div) {
  min-width: 0;
}

.monthly-kpi-grid :deep(.total-insedent-card) {
  position: relative;
  min-height: 142px;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--main-border) 82%, transparent);
  border-radius: 20px;
  background:
    radial-gradient(
      circle at 100% 0%,
      color-mix(in srgb, var(--PrimaryColor) 10%, transparent),
      transparent 42%
    ),
    linear-gradient(145deg, var(--BgWhite), var(--Gray-1));
  padding: 18px;
  box-shadow: none;
  transition:
    transform 0.22s ease,
    border-color 0.22s ease,
    box-shadow 0.22s ease;
}

.monthly-kpi-grid :deep(.total-insedent-card)::before {
  content: '';
  position: absolute;
  inset-inline-start: 0;
  inset-block: 16px;
  width: 5px;
  border-radius: 999px;
  background: var(--PrimaryColor);
}

.monthly-kpi-grid :deep(.total-insedent-card:hover) {
  transform: translateY(-4px);
  border-color: color-mix(in srgb, var(--PrimaryColor) 34%, var(--main-border));
  box-shadow: 0 18px 36px color-mix(in srgb, var(--brand-primary-900) 12%, transparent);
}

.monthly-kpi-grid :deep(.titlte p) {
  max-width: 170px;
  margin: 0;
  color: var(--GrayText-1);
  font-size: 13px;
  font-weight: 800;
  line-height: 1.4;
}

.monthly-kpi-grid :deep(.data) {
  align-items: flex-end;
  justify-content: space-between;
  gap: 10px;
  margin-top: 24px;
}

.monthly-kpi-grid :deep(.data p) {
  margin: 0;
  font-family: 'bold';
  font-size: clamp(30px, 4vw, 46px);
  font-weight: 900;
  line-height: 0.95;
}

.monthly-kpi-grid :deep(.data h6) {
  margin: 0;
  color: var(--Gray-3);
  font-size: 11px;
  font-weight: 800;
  line-height: 1.35;
  text-align: end;
}

.monthly-kpi-grid :deep(.ToatlInsedant-one) {
  color: var(--incidant-color);
}

.monthly-kpi-grid :deep(.ToatlInsedant-two) {
  color: var(--danger-color);
}

.monthly-kpi-grid :deep(.ToatlInsedant-three) {
  color: var(--PrimaryColor);
}

.monthly-kpi-grid :deep(.ToatlInsedant-four) {
  color: var(--p-rent-500);
}

@media (max-width: 680px) {
  .monthly-kpi-grid {
    grid-template-columns: 1fr;
  }

  .monthly-kpi-grid :deep(.total-insedent-card) {
    min-height: 118px;
  }
}
</style>
