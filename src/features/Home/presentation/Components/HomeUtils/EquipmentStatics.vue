<script setup lang="ts">
import MachineStatics from '../HomeStatistics/MachineStatics.vue'
import TotalMachines from '../HomeStatistics/TotalMachines.vue'

const { EquipmentStatics } = defineProps<{
  EquipmentStatics: any
}>()
</script>

<template>
  <div class="equipment-dashboard-section">
    <!-- <div class="dashboard-section-heading">
      <span>{{ $t('equipment') }}</span>
      <h3>{{ $t('Equipment Statistics') }}</h3>
    </div> -->

    <div class="equipment-dashboard-grid">
      <section class="analytics-panel analytics-panel-wide">
        <TotalMachines
          v-if="EquipmentStatics?.data?.statics?.length! > 0"
          :totalMachines="EquipmentStatics.data?.statics!"
        />
      </section>

      <section class="analytics-panel">
        <MachineStatics :statics="EquipmentStatics.data?.rentEquipments!" />
      </section>
    </div>
  </div>
</template>

<style scoped lang="scss">
.equipment-dashboard-section {
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
  min-width: 0;

  span {
    width: fit-content;
    padding: 6px 12px;
    border-radius: 999px;
    background: color-mix(in srgb, var(--PrimaryColor) 9%, transparent);
    color: var(--PrimaryColor);
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

.equipment-dashboard-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.55fr) minmax(320px, 0.7fr);
  gap: 18px;
  min-width: 0;
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

.analytics-panel :deep(.total-machines-container),
.analytics-panel :deep(.top-teams-container),
.analytics-panel :deep(.total-observation-container),
.analytics-panel :deep(.investigations_container) {
  width: 100%;
  min-width: 0;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
}

.analytics-panel :deep(.chart-container),
.analytics-panel :deep(.chart-scroll-wrapper),
.analytics-panel :deep(.machine-statics) {
  max-width: 100%;
  min-width: 0;
  overflow-x: auto;
  overflow-y: hidden;

}

@media (max-width: 1180px) {
  .equipment-dashboard-grid {
    grid-template-columns: 1fr;
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
