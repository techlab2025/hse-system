<script setup lang="ts">
import '../../styles/home-identity.css'
import MachineStatics from '../HomeStatistics/MachineStatics.vue'
import TotalMachines from '../HomeStatistics/TotalMachines.vue'

const { EquipmentStatics } = defineProps<{
  EquipmentStatics: any
}>()
</script>

<template>
  <div class="hse-identity hse-home-charts">
    <!-- <div class="dashboard-section-heading">
      <span>{{ $t('equipment') }}</span>
      <h3>{{ $t('Equipment Statistics') }}</h3>
    </div> -->

    <div class="hse-home-chart-grid">
      <section class="hse-home-panel hse-home-chart-panel">
        <TotalMachines
          v-if="EquipmentStatics?.data?.statics?.length! > 0"
          :totalMachines="EquipmentStatics.data?.statics!"
        />
      </section>

      <section class="hse-home-panel hse-home-chart-panel">
        <MachineStatics :statics="EquipmentStatics.data?.rentEquipments!" />
      </section>
    </div>
  </div>
</template>
