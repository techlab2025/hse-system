<script setup lang="ts">
import { useId } from 'vue'
import type { ResourceStatus } from '../../../data/Model/OrganizationDashboardModel'
import DashboardIcon from './DashboardIcon.vue'
withDefaults(
  defineProps<{
    title: string
    subtitle?: string
    status?: ResourceStatus
    link?: string
    collapseNotes?: boolean
    linkLabel?: string
  }>(),
  { status: 'ready', subtitle: '', link: '', linkLabel: '', collapseNotes: true },
)
defineEmits<{ retry: [] }>()
const headingId = `dashboard-panel-${useId()}`
</script>
<template>
  <section class="command-panel" :aria-labelledby="headingId" :aria-busy="status === 'loading'">
    <header class="command-panel-head">
      <div>
        <h2 :id="headingId">{{ title }}</h2>
        <p v-if="subtitle">{{ subtitle }}</p>
      </div>
      <RouterLink v-if="link" :to="link" class="command-text-link"
        >{{ linkLabel || $t('command.viewRegister')
        }}<DashboardIcon name="arrow" class="locale-directional-icon" /></RouterLink
      ><slot name="header" />
    </header>
    <div v-if="status === 'loading'" class="command-skeleton" role="status">
      <span class="sr-only">{{ $t('command.loading') }}</span
      ><i v-for="n in 3" :key="n"></i>
    </div>
    <div v-else-if="status === 'error'" class="command-state command-state-error" role="status">
      <DashboardIcon name="incident" /><strong>{{ $t('command.loadFailed') }}</strong>
      <p>{{ $t('command.loadFailedDetail') }}</p>
      <button class="command-button command-button-small" type="button" @click="$emit('retry')">
        {{ $t('command.retry') }}
      </button>
    </div>
    <div
      v-else-if="status === 'empty' || status === 'forbidden'"
      class="command-state"
      role="status"
    >
      <DashboardIcon :name="status === 'forbidden' ? 'shield' : 'project'" /><strong>{{
        $t(status === 'forbidden' ? 'command.restricted' : 'command.noData')
      }}</strong>
      <p>{{ $t(status === 'forbidden' ? 'command.restrictedDetail' : 'command.noDataDetail') }}</p>
    </div>
    <div v-else class="command-panel-body"><slot /></div>
    <div v-if="$slots.footer && status === 'ready'" class="command-panel-foot">
      <details v-if="collapseNotes" class="command-figure-notes">
        <summary>{{ $t('command.aboutFigures') }}</summary>
        <slot name="footer" />
      </details>
      <slot v-else name="footer" />
    </div>
  </section>
</template>
