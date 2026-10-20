<script setup lang="ts">
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type EquipmentStaticsModel from '@/features/Home/data/Model/EquipmentStaticsModel'
import MachineStatics from '../HomeStatistics/MachineStatics.vue'
import TotalMachines from '../HomeStatistics/TotalMachines.vue'
import DashboardPanel from '../Dashboard/DashboardPanel.vue'
defineProps<{ EquipmentStatics: DataState<EquipmentStaticsModel> }>()
</script>
<template>
  <div class="dashboard-chart-grid">
    <DashboardPanel
      :title="$t('Equipment footprint')"
      :eyebrow="$t('Resources at a glance')"
      :description="$t('Equipment, devices, and tools by zone.')"
      icon="equipment"
      :state="EquipmentStatics"
      ><TotalMachines :total-machines="EquipmentStatics.data?.statics" /><template #footer
        ><span>{{ $t('Compare recorded asset counts across zones.') }}</span></template
      ></DashboardPanel
    >
    <DashboardPanel
      :title="$t('Fleet ownership')"
      :eyebrow="$t('Asset mix')"
      :description="$t('The balance between owned and rented assets.')"
      icon="equipment"
      :state="EquipmentStatics"
      ><MachineStatics :statics="EquipmentStatics.data?.rentEquipments"
    /></DashboardPanel>
  </div>
</template>
