<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Resource, SummarySnapshot } from '../../../data/Model/OrganizationDashboardModel'
import DashboardPanel from './DashboardPanel.vue'
import DashboardBars from './DashboardBars.vue'
const props = defineProps<{ resource: Resource<SummarySnapshot>; link: boolean }>()
defineEmits<{ retry: [] }>()
const { t, locale } = useI18n()
const number = (value: number | null | undefined) =>
  value == null ? '—' : new Intl.NumberFormat(locale.value).format(value)
const rows = computed(() => {
  const values = props.resource.data?.inspections
  return [
    { id: 'new', label: t('command.inspectionNew'), value: values?.new, tone: 'blue' },
    { id: 'inProgress', label: t('command.inProgress'), value: values?.inProgress, tone: 'teal' },
    { id: 'completed', label: t('command.completed'), value: values?.completed, tone: 'green' },
    { id: 'delayed', label: t('command.delayed'), value: values?.delayed, tone: 'amber' },
    { id: 'canceled', label: t('command.canceled'), value: values?.canceled, tone: 'muted' },
  ].map((item) => ({
    id: item.id,
    label: item.label,
    segments: [
      { key: 'count', label: t('command.inspections'), value: item.value ?? null, tone: item.tone },
    ],
  }))
})
</script>
<template>
  <DashboardPanel
    :title="$t('command.inspectionTitle')"
    :subtitle="$t('command.inspectionSubtitle')"
    :status="resource.status"
    :link="link ? '/organization/equipment-mangement/inspection?inspectionType=1' : ''"
    @retry="$emit('retry')"
  >
    <div class="command-inspection-layout">
      <DashboardBars :rows="rows" :label="$t('command.inspectionTitle')" />
      <div class="command-planning-metrics">
        <div>
          <span>{{ $t('command.scheduledThisMonth') }}</span
          ><strong
            ><bdi>{{ number(resource.data?.inspections.scheduledThisMonth) }}</bdi></strong
          ><small>{{ $t('command.explicitMonth') }}</small>
        </div>
      </div>
    </div>
    <template #footer
      ><p>{{ $t('command.inspectionDefinitionNote') }}</p></template
    >
  </DashboardPanel>
</template>
