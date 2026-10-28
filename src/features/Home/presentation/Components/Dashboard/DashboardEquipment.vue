<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  displayName,
  type Resource,
  type EquipmentSnapshot,
} from '../../../data/Model/OrganizationDashboardModel'
import DashboardPanel from './DashboardPanel.vue'
import DashboardBars from './DashboardBars.vue'
import DashboardDonut from './DashboardDonut.vue'
const props = defineProps<{ resource: Resource<EquipmentSnapshot>; link: boolean }>()
defineEmits<{ retry: [] }>()
const { t, locale } = useI18n()
const ownership = computed(() => [
  {
    key: 'owned',
    label: t('command.owned'),
    value: props.resource.data?.owned ?? null,
    tone: 'blue',
  },
  {
    key: 'rented',
    label: t('command.rented'),
    value: props.resource.data?.rented ?? null,
    tone: 'teal',
  },
])
const rows = computed(() =>
  (props.resource.data?.zones ?? []).map((zone) => ({
    id: zone.id,
    label: displayName(zone, locale.value),
    segments: [
      { key: 'equipment', label: t('command.equipment'), value: zone.equipment, tone: 'blue' },
      { key: 'devices', label: t('command.devices'), value: zone.devices, tone: 'teal' },
      { key: 'tools', label: t('command.tools'), value: zone.tools, tone: 'muted' },
    ],
  })),
)
</script>
<template>
  <DashboardPanel
    :title="$t('command.equipmentOwnership')"
    :subtitle="$t('command.ownershipSubtitle')"
    :status="resource.status"
    :link="link ? '/organization/equipments' : ''"
    @retry="$emit('retry')"
    ><DashboardDonut :items="ownership" :caption="$t('command.ownershipRecords')" />
    <details v-if="rows.length" class="command-equipment-detail">
      <summary>{{ $t('command.equipmentByLocation') }}</summary>
      <DashboardBars
        chart-id="equipmentLocations"
        :rows="rows"
        :label="$t('command.equipmentByLocation')"
      />
    </details>
    <template #footer
      ><p>{{ $t('command.equipmentCountsNote') }}</p></template
    ></DashboardPanel
  >
</template>
