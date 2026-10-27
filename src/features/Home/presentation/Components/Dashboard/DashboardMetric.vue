<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Count, ResourceStatus } from '../../../data/Model/OrganizationDashboardModel'
import DashboardIcon from './DashboardIcon.vue'
const props = defineProps<{
  subtitle: string
  label: string
  value: Count
  status: ResourceStatus
  tone: string
  icon: string
  link?: string
}>()
const { locale } = useI18n()
const formatted = computed(() =>
  props.value === null ? '—' : new Intl.NumberFormat(locale.value).format(props.value),
)
</script>
<template>
  <article class="command-metric" :class="`command-tone-${tone}`" :aria-busy="status === 'loading'">
    <div class="command-metric-label">
      <h2>{{ label }}</h2>
      <span class="command-metric-icon"><DashboardIcon :name="icon" /></span>
    </div>
    <span
      v-if="status === 'loading'"
      class="command-metric-placeholder"
      :aria-label="$t('command.loading')"
    ></span
    ><strong v-else class="command-metric-value"
      ><bdi>{{ formatted }}</bdi></strong
    >
    <div class="command-metric-meta">
      <span>{{
        status === 'ready' && value !== null
          ? subtitle
          : $t(
              status === 'error'
                ? 'command.notLoaded'
                : status === 'forbidden'
                  ? 'command.restricted'
                  : value === null
                    ? 'command.notProvided'
                    : '',
            )
      }}</span
      ><RouterLink
        v-if="link && status === 'ready'"
        :to="link"
        :aria-label="$t('command.reviewMetric', { metric: label })"
        ><DashboardIcon name="arrow" class="locale-directional-icon"
      /></RouterLink>
    </div>
  </article>
</template>
