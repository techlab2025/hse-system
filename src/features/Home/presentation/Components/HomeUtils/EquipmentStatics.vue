<script setup lang="ts">
import MachineStatics from '../HomeStatistics/MachineStatics.vue'
import TotalMachines from '../HomeStatistics/TotalMachines.vue'

const { EquipmentStatics } = defineProps<{
  EquipmentStatics: any
}>()
</script>

<template>
  <div class="flex gap-4 statics">
    <TotalMachines
      v-if="EquipmentStatics?.data?.statics?.length! > 0"
      :totalMachines="EquipmentStatics.data?.statics!"
      class="col-span-12 xl:col-span-8"
    />
    <MachineStatics
      :statics="EquipmentStatics.data?.rentEquipments!"
      class="col-span-12 xl:col-span-4"
    />
  </div>
</template>
