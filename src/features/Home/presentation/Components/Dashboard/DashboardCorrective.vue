<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { Resource, SummarySnapshot } from '../../../data/Model/OrganizationDashboardModel'
import DashboardPanel from './DashboardPanel.vue'
import DashboardIcon from './DashboardIcon.vue'
defineProps<{ resource: Resource<SummarySnapshot>; link: boolean }>()
defineEmits<{ retry: [] }>()
const { locale } = useI18n()
</script>
<template>
  <DashboardPanel
    :title="$t('command.correctiveTitle')"
    :subtitle="$t('command.correctiveSubtitle')"
    :status="resource.status"
    :link="link ? '/organization/capa' : ''"
    @retry="$emit('retry')"
    ><div class="command-corrective-layout">
      <div class="command-open-counter">
        <span class="command-open-symbol"><DashboardIcon name="corrective" /></span
        ><strong
          ><bdi>{{
            resource.data?.openCorrectiveActions == null
              ? '—'
              : new Intl.NumberFormat(locale).format(resource.data.openCorrectiveActions)
          }}</bdi></strong
        ><small>{{ $t('command.openCorrective') }}</small>
      </div>
      <div class="command-corrective-action">
        <strong>{{ $t('command.capaActionTitle') }}</strong>
        <p>{{ $t('command.capaActionDescription') }}</p>
        <RouterLink v-if="link" to="/organization/capa" class="command-button command-tone-purple">
          {{ $t('command.viewRegister')
          }}<DashboardIcon name="arrow" class="locale-directional-icon" />
        </RouterLink>
      </div>
    </div>
    <template #footer
      ><p>{{ $t('command.capaNoRate') }}</p></template
    ></DashboardPanel
  >
</template>
