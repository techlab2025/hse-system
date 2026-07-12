<script setup lang="ts">
import InvestegationStatics from '../HomeStatistics/InvestegationStatics.vue'
import ObservatoinFactoryStatistics from '../HomeStatistics/ObservatoinFactoryStatistics.vue'

const { OverviewHazardChartstate, overviewInvestigationsChartstate } = defineProps<{
  OverviewHazardChartstate: any
  overviewInvestigationsChartstate: any
}>()
</script>

<template>
  <div class="risk-dashboard-section">
    <!-- <div class="dashboard-section-heading">
      <span>{{ $t('risk') }}</span>
      <h3>{{ $t('Investigations') }}</h3>
    </div> -->

    <div class="Hazard-Investigation risk-dashboard-grid">
      <section class="analytics-panel analytics-panel-wide">
        <ObservatoinFactoryStatistics
          v-if="OverviewHazardChartstate?.data?.length! > 0"
          :OverviewHazardChartstate="OverviewHazardChartstate?.data!"
        />
      </section>

      <section class="analytics-panel">
        <InvestegationStatics
          v-if="overviewInvestigationsChartstate?.data?.length! > 0"
          :overviewInvestigationsChartstate="overviewInvestigationsChartstate?.data!"
        />
      </section>
    </div>
  </div>
</template>

<style scoped lang="scss">
.risk-dashboard-section {
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-width: 0;
}

.dashboard-section-heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 12px;

  span {
    width: fit-content;
    padding: 6px 12px;
    border-radius: 999px;
    background: color-mix(in srgb, var(--danger-color) 9%, transparent);
    color: var(--danger-color);
    font-size: 12px;
    font-weight: 900;
  }

  h3 {
    margin: 0;
    color: var(--header-page-color);
    font-family: 'bold';
    font-size: 20px;
    font-weight: 900;
  }
}

.risk-dashboard-grid {
  display: grid !important;
  grid-template-columns: minmax(0, 1.45fr) minmax(360px, 0.8fr) !important;
  gap: 18px !important;
  align-items: stretch !important;
  min-width: 0;
  margin-top: 0 !important;
  overflow: visible !important;
}

.analytics-panel {
  min-width: 0;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--main-border) 78%, transparent);
  border-radius: 24px;
  background:
    radial-gradient(
      circle at 100% 0%,
      color-mix(in srgb, var(--PrimaryColor) 8%, transparent),
      transparent 40%
    ),
    var(--BgWhite);
  padding: 16px;
  box-shadow:
    0 1px 2px rgba(15, 23, 42, 0.04),
    0 18px 42px rgba(15, 23, 42, 0.07);
}

.analytics-panel :deep(.total-observation-container),
.analytics-panel :deep(.investigations_container) {
  width: 100%;
  min-width: 0;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
}

.analytics-panel :deep(.chart-scroll-wrapper),
.analytics-panel :deep(.chart_container) {
  max-width: 100%;
  min-width: 0;
}

@media (max-width: 1180px) {
  .risk-dashboard-grid {
    grid-template-columns: 1fr !important;
  }
}

@media (max-width: 640px) {
  .dashboard-section-heading {
    align-items: flex-start;
    flex-direction: column;
  }

  .analytics-panel {
    border-radius: 18px;
    padding: 12px;
  }
}
</style>
