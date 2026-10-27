<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { dashboardPermissions } from '../../composables/dashboardPermissions'
import DashboardPanel from './DashboardPanel.vue'
import DashboardIcon from './DashboardIcon.vue'
const props = defineProps<{ access: ReturnType<typeof dashboardPermissions> }>()
const { t } = useI18n()
const registers = computed(() =>
  [
    {
      label: t('command.incidents'),
      icon: 'incident',
      tone: 'red',
      allowed: props.access.incidents,
      to: '/organization/equipment-mangement/incedant?isAll=1',
    },
    {
      label: t('command.observations'),
      icon: 'risk',
      tone: 'amber',
      allowed: props.access.observations,
      to: '/organization/equipment-mangement/observation?isAll=1&type=2',
    },
    {
      label: t('command.inspections'),
      icon: 'inspection',
      tone: 'blue',
      allowed: props.access.inspections,
      to: '/organization/equipment-mangement/inspection?inspectionType=1',
    },
    {
      label: t('command.investigationRegister'),
      icon: 'shield',
      tone: 'purple',
      allowed: props.access.investigations,
      to: '/organization/Investigating',
    },
  ].filter((item) => item.allowed),
)
</script>
<template>
  <DashboardPanel :title="$t('command.operationalRegisters')">
    <ul class="command-register-links">
      <li v-for="item in registers" :key="item.to">
        <RouterLink :to="item.to" :class="`command-tone-${item.tone}`"
          ><span class="command-register-icon"><DashboardIcon :name="item.icon" /></span
          ><span>{{ item.label }}</span
          ><DashboardIcon name="arrow" class="locale-directional-icon"
        /></RouterLink>
      </li></ul
  ></DashboardPanel>
</template>
