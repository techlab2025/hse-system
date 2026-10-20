<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { formatMetric, metricNumber } from '../../utils/dashboardMetrics'
const props = defineProps<{ statics?: { rent: number; owned: number } | null }>()
const { locale } = useI18n()
const owned = computed(() => metricNumber(props.statics?.owned))
const rent = computed(() => metricNumber(props.statics?.rent))
const total = computed(() =>
  owned.value != null && rent.value != null ? owned.value + rent.value : null,
)
const ownedShare = computed(() => (total.value ? ((owned.value ?? 0) / total.value) * 100 : 0))
</script>
<template>
  <div class="dashboard-ownership">
    <div class="dashboard-donut-wrap">
      <div
        class="dashboard-donut"
        :class="{ 'dashboard-donut--empty': !total }"
        :style="{ '--owned-share': `${ownedShare}%` }"
        role="img"
        :aria-label="`${$t('owned')}: ${formatMetric(owned, locale)}, ${$t('rent')}: ${formatMetric(rent, locale)}`"
      >
        <div>
          <strong>{{ formatMetric(total, locale) }}</strong
          ><span>{{ $t('Total assets') }}</span>
        </div>
      </div>
    </div>
    <div class="dashboard-ownership__legend">
      <div>
        <span><i></i>{{ $t('owned') }}</span
        ><strong>{{ formatMetric(owned, locale) }}</strong
        ><small>{{ total ? `${formatMetric(ownedShare, locale)}%` : '—' }}</small>
      </div>
      <div>
        <span><i class="is-rented"></i>{{ $t('rent') }}</span
        ><strong>{{ formatMetric(rent, locale) }}</strong
        ><small>{{ total ? `${formatMetric(100 - ownedShare, locale)}%` : '—' }}</small>
      </div>
    </div>
    <p v-if="!total" class="dashboard-empty-inline">{{ $t('No equipment data available') }}</p>
  </div>
</template>
