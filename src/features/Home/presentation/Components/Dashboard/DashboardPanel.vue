<script setup lang="ts">
import { computed } from 'vue'
import {
  DataInitial,
  DataLoading,
  DataFailed,
  type DataState,
} from '@/base/core/networkStructure/Resources/dataState/data_state'
import DashboardIcon, { type DashboardIconName } from './DashboardIcon.vue'
const props = defineProps<{
  title: string
  eyebrow?: string
  description?: string
  icon?: DashboardIconName
  state?: DataState<unknown>
}>()
const loading = computed(
  () => props.state instanceof DataInitial || props.state instanceof DataLoading,
)
const failed = computed(() => props.state instanceof DataFailed)
</script>
<template>
  <section class="dashboard-panel" :aria-label="title" :aria-busy="loading">
    <header class="dashboard-panel__header">
      <div class="dashboard-panel__heading">
        <span v-if="icon" class="dashboard-panel__icon"><DashboardIcon :name="icon" /></span>
        <div>
          <span v-if="eyebrow" class="dashboard-eyebrow">{{ eyebrow }}</span>
          <h2>{{ title }}</h2>
          <p v-if="description">{{ description }}</p>
        </div>
      </div>
      <div v-if="$slots.action" class="dashboard-panel__action"><slot name="action" /></div>
    </header>
    <div v-if="loading" class="dashboard-panel__skeleton" role="status">
      <span class="sr-only">{{ $t('Loading dashboard data') }}</span
      ><i v-for="i in 3" :key="i"></i>
    </div>
    <div v-else-if="failed" class="dashboard-empty dashboard-empty--error" role="status">
      <DashboardIcon name="alert" /><strong>{{ $t('Dashboard section unavailable') }}</strong>
      <p>{{ $t('Other dashboard sections are still available.') }}</p>
    </div>
    <div v-else class="dashboard-panel__body"><slot /></div>
    <footer v-if="$slots.footer && !loading && !failed" class="dashboard-panel__footer">
      <slot name="footer" />
    </footer>
  </section>
</template>
