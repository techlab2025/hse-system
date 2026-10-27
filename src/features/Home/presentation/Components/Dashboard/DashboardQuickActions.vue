<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { dashboardPermissions } from '../../composables/dashboardPermissions'
import DashboardPanel from './DashboardPanel.vue'
import DashboardIcon from './DashboardIcon.vue'
const props = defineProps<{ access: ReturnType<typeof dashboardPermissions> }>()
const { t } = useI18n()
const actions = computed(() =>
  [
    {
      label: t('command.reportIncident'),
      icon: 'incident',
      tone: 'red',
      to: '/organization/equipment-mangement/incedant/add',
      allowed: props.access.reportIncident,
    },
    {
      label: t('command.createInspection'),
      icon: 'inspection',
      tone: 'blue',
      to: '/organization/equipment-mangement/inspection/add?inspectionType=1',
      allowed: props.access.createInspection,
    },
    {
      label: t('command.addObservation'),
      icon: 'risk',
      tone: 'amber',
      to: '/organization/equipment-mangement/observation/add?type=2',
      allowed: props.access.addObservation,
    },
    {
      label: t('command.manageCorrective'),
      icon: 'corrective',
      tone: 'purple',
      to: '/organization/capa',
      allowed: props.access.corrective,
    },
  ].filter((action) => action.allowed),
)
</script>
<template>
  <DashboardPanel :title="$t('command.quickActions')"
    ><div v-if="actions.length" class="command-quick-grid">
      <RouterLink
        v-for="action in actions"
        :key="action.to"
        :to="action.to"
        :class="`command-quick-action command-tone-${action.tone}`"
        ><DashboardIcon :name="action.icon" /><span>{{ action.label }}</span
        ><DashboardIcon name="arrow" class="locale-directional-icon"
      /></RouterLink>
    </div>
    <p v-else class="command-inline-empty">{{ $t('command.noQuickActions') }}</p></DashboardPanel
  >
</template>
