<script setup lang="ts">
import { computed } from 'vue'
import DashboardCustomChart from './DashboardCustomChart.vue'
import { useDashboardChart } from '@/composables/useDashboardPreferences'
const { settings, customized } = useDashboardChart('cases')
import { useI18n } from 'vue-i18n'
import {
  displayName,
  type Resource,
  type SummarySnapshot,
} from '../../../data/Model/OrganizationDashboardModel'
import DashboardPanel from './DashboardPanel.vue'
const props = defineProps<{ resource: Resource<SummarySnapshot> }>()
defineEmits<{ retry: [] }>()
const { locale } = useI18n()
const rows = computed(() =>
  [...(props.resource.data?.rootCauses ?? [])]
    .sort((a, b) => (b.value ?? -1) - (a.value ?? -1))
    .slice(0, 6),
)
const max = computed(() => Math.max(1, ...rows.value.map((row) => row.value ?? 0)))
const tones = ['red', 'amber', 'blue', 'teal', 'purple', 'muted']
</script>
<template>
  <DashboardPanel
    :title="$t('command.casesTitle')"
    :subtitle="$t('command.casesSubtitle')"
    :status="resource.status"
    @retry="$emit('retry')"
    ><DashboardCustomChart
      v-if="customized && rows.length"
      :rows="
        rows.map((row) => ({
          id: row.id,
          label: displayName(row, locale),
          segments: [
            { key: 'count', label: $t('command.casesTitle'), value: row.value, tone: 'blue' },
          ],
        }))
      "
      :label="$t('command.casesTitle')"
      :settings="settings"
    />
    <ol v-else-if="rows.length" class="command-case-ranking">
      <li v-for="(row, index) in rows" :key="row.id">
        <span
          ><bdi dir="auto">{{
            displayName(row, locale) || $t('command.unnamedCategory')
          }}</bdi></span
        >
        <div aria-hidden="true">
          <i
            :class="`command-fill-${tones[index]}`"
            :style="{ width: `${((row.value ?? 0) / max) * 100}%` }"
          ></i>
        </div>
        <strong
          ><bdi>{{
            row.value === null ? '—' : new Intl.NumberFormat(locale).format(row.value)
          }}</bdi></strong
        >
      </li>
    </ol>
    <div v-else class="command-inline-fallback">
      <p>{{ $t('command.noCategories') }}</p>
    </div>
    <template #footer
      ><p>{{ $t('command.rootCauseNote') }}</p></template
    ></DashboardPanel
  >
</template>
