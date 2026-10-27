<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  displayName,
  type SummarySnapshot,
  type Resource,
  type ZoneReports,
} from '../../../data/Model/OrganizationDashboardModel'
import DashboardPanel from './DashboardPanel.vue'
import DashboardCases from './DashboardCases.vue'
import DashboardCategoryChart from './DashboardCategoryChart.vue'
const props = defineProps<{
  resource: Resource<ZoneReports[]>
  link: boolean
  summary?: Resource<SummarySnapshot>
}>()
defineEmits<{ retry: [] }>()
const { t, locale } = useI18n()
const rows = computed(() =>
  (props.resource.data ?? []).map((zone) => ({
    id: zone.id,
    label: displayName(zone, locale.value),
    segments: [
      { key: 'incident', label: t('command.incidents'), value: zone.incident, tone: 'red' },
      { key: 'hazard', label: t('command.hazards'), value: zone.hazard, tone: 'amber' },
      {
        key: 'observation',
        label: t('command.observations'),
        value: zone.observation,
        tone: 'blue',
      },
    ],
  })),
)
</script>
<template>
  <DashboardPanel
    :title="$t('command.safetyTitle')"
    :subtitle="$t('command.safetySubtitle')"
    :status="resource.status"
    :link="link ? '/organization/equipment-mangement/observation?isAll=1&type=2' : ''"
    @retry="$emit('retry')"
  >
    <DashboardCategoryChart v-if="rows.length" :rows="rows" :label="$t('command.safetyTitle')" />
    <p v-else class="command-inline-empty">{{ $t('command.noLocations') }}</p>
    <DashboardCases
      v-if="summary?.status === 'ready' && summary.data?.rootCauses.length"
      :resource="summary"
      class="command-embedded-cases"
      data-testid="cases-panel"
    />
    <template #footer
      ><p>{{ $t('command.locationCountsNote') }}</p></template
    >
  </DashboardPanel>
</template>
