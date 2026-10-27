<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Resource, SummarySnapshot } from '../../../data/Model/OrganizationDashboardModel'
import DashboardPanel from './DashboardPanel.vue'
import DashboardIcon from './DashboardIcon.vue'
const props = defineProps<{ resource: Resource<SummarySnapshot>; investigations: boolean }>()
defineEmits<{ retry: [] }>()
const { t, locale } = useI18n()
const signals = computed(() => [
  {
    key: 'highRisk',
    value: props.resource.data?.highRiskObservations,
    label: t('command.reviewHighRisk'),
    detail: t('command.reviewHighRiskDetail'),
    to: '/organization/equipment-mangement/observation?isAll=1&type=2&risk_level=3',
    tone: 'red',
    icon: 'risk',
  },
  {
    key: 'delayed',
    value: props.resource.data?.inspections.delayed,
    label: t('command.reviewDelayed'),
    detail: t('command.reviewDelayedDetail'),
    to: '/organization/equipment-mangement/inspection?inspectionType=1',
    tone: 'amber',
    icon: 'clock',
  },
  {
    key: 'certificates',
    value: props.resource.data?.certificates.expired,
    label: t('command.reviewCertificates'),
    detail: t('command.reviewCertificatesDetail'),
    to: '/organization/employee-certificate',
    tone: 'amber',
    icon: 'people',
  },
])
const positive = computed(() =>
  signals.value.filter((signal) => typeof signal.value === 'number' && signal.value > 0),
)
const incomplete = computed(() => signals.value.some((signal) => signal.value == null))
</script>
<template>
  <DashboardPanel
    :collapse-notes="false"
    :title="$t('command.attentionTitle')"
    :subtitle="$t('command.attentionSubtitle')"
    :status="resource.status"
    @retry="$emit('retry')"
  >
    <ul v-if="positive.length" class="command-attention-list">
      <li v-for="signal in positive" :key="signal.key">
        <RouterLink :to="signal.to" :class="`command-tone-${signal.tone}`"
          ><span class="command-attention-icon"><DashboardIcon :name="signal.icon" /></span
          ><span class="command-attention-copy"
            ><strong>{{ signal.label }}</strong
            ><small>{{ signal.detail }}</small></span
          ><bdi class="command-attention-number">{{
            new Intl.NumberFormat(locale).format(signal.value!)
          }}</bdi
          ><DashboardIcon name="arrow" class="locale-directional-icon"
        /></RouterLink>
      </li>
    </ul>
    <div v-else class="command-calm-state">
      <DashboardIcon name="shield" /><strong>{{
        $t(incomplete ? 'command.signalsIncomplete' : 'command.nothingFlagged')
      }}</strong>
      <p>{{ $t('command.notSafetyAssessment') }}</p>
    </div>
    <p v-if="positive.length && incomplete" class="command-data-note">
      {{ $t('command.signalsIncomplete') }}
    </p>
    <template #footer
      ><RouterLink v-if="investigations" to="/organization/Investigating" class="command-text-link"
        >{{ $t('command.investigationRegister')
        }}<DashboardIcon name="arrow" class="locale-directional-icon"
      /></RouterLink>
      <p v-else>{{ $t('command.countsNotWorklist') }}</p></template
    >
  </DashboardPanel>
</template>
