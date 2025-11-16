<script setup lang="ts">
import HeaderPage from '@/features/Organization/Project/Presentation/components/Details/DetailsHeader/HeaderPage.vue'
import Tabs from './tabs.vue'
import EquipmentForm from './EquipmentForm.vue'
import DeviceForm from './deviceForm.vue'
import ToolsForm from './ToolsForm.vue'
import { ref } from 'vue'

const activeTab = ref('Equipment')
</script>

<template>
  <HeaderPage :title="$t('Add & Manage Assets')" />

  <Tabs @update:activeTab="activeTab = $event" />

  <EquipmentForm v-if="activeTab == 'Equipment'" />
  <DeviceForm v-if="activeTab == 'devices'" />
  <ToolsForm v-if="activeTab == 'tools'" />
</template>
