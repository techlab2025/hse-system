<script setup lang="ts">
import { computed } from 'vue'
import DashboardCustomChart from './DashboardCustomChart.vue'
import { useDashboardChart } from '@/composables/useDashboardPreferences'
const { settings, customized } = useDashboardChart('workforce')
import { useI18n } from 'vue-i18n'
import type { Resource, SummarySnapshot } from '../../../data/Model/OrganizationDashboardModel'
import DashboardPanel from './DashboardPanel.vue'
const props = defineProps<{ resource: Resource<SummarySnapshot>; link: boolean }>()
defineEmits<{ retry: [] }>()
const { locale } = useI18n()
const maximum = computed(() =>
  Math.max(
    1,
    ...['active', 'inactive', 'expired'].map(
      (key) => props.resource.data?.certificates[key as 'active' | 'inactive' | 'expired'] ?? 0,
    ),
  ),
)
const number = (value: number | null | undefined) =>
  value == null ? '—' : new Intl.NumberFormat(locale.value).format(value)
</script>
<template>
  <DashboardPanel
    :title="$t('command.workforceTitle')"
    :subtitle="$t('command.workforceSubtitle')"
    :status="resource.status"
    :link="link ? '/organization/employee-certificate' : ''"
    @retry="$emit('retry')"
    ><DashboardCustomChart
      v-if="customized"
      :rows="
        ['active', 'inactive', 'expired'].map((key) => ({
          id: key,
          label: $t(
            `command.${key === 'active' ? 'activeRecords' : key === 'inactive' ? 'inactiveRecords' : 'expiredRecords'}`,
          ),
          segments: [
            {
              key: 'count',
              label: $t('command.certificateTotal'),
              value: resource.data?.certificates[key as 'active' | 'inactive' | 'expired'] ?? null,
              tone: 'blue',
            },
          ],
        }))
      "
      :label="$t('command.workforceTitle')"
      :settings="settings"
    />
    <dl v-else class="command-record-counts">
      <div>
        <dt><i class="command-fill-teal"></i>{{ $t('command.activeRecords') }}</dt>
        <dd>
          <bdi>{{ number(props.resource.data?.certificates.active) }}</bdi
          ><span class="command-certificate-track" aria-hidden="true"
            ><i
              :style="{
                width: `${((props.resource.data?.certificates.active ?? 0) / maximum) * 100}%`,
              }"
            ></i
          ></span>
        </dd>
      </div>
      <div>
        <dt><i class="command-fill-muted"></i>{{ $t('command.inactiveRecords') }}</dt>
        <dd>
          <bdi>{{ number(props.resource.data?.certificates.inactive) }}</bdi
          ><span class="command-certificate-track" aria-hidden="true"
            ><i
              :style="{
                width: `${((props.resource.data?.certificates.inactive ?? 0) / maximum) * 100}%`,
              }"
            ></i
          ></span>
        </dd>
      </div>
      <div>
        <dt><i class="command-fill-amber"></i>{{ $t('command.expiredRecords') }}</dt>
        <dd>
          <bdi>{{ number(props.resource.data?.certificates.expired) }}</bdi
          ><span class="command-certificate-track" aria-hidden="true"
            ><i
              :style="{
                width: `${((props.resource.data?.certificates.expired ?? 0) / maximum) * 100}%`,
              }"
            ></i
          ></span>
        </dd>
      </div>
    </dl>
    <div class="command-certificate-total">
      <span>{{ $t('command.certificateTotal') }}</span
      ><strong
        ><bdi>{{ number(props.resource.data?.certificates.total) }}</bdi></strong
      >
    </div>
    <template #footer
      ><p>{{ $t('command.certificateNote') }}</p></template
    ></DashboardPanel
  >
</template>
