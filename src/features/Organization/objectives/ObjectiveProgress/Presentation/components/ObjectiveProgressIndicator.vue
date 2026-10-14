<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { achievement, type ObjectiveMeasurement } from '../../Core/utils/objectiveProgress'
import { objectiveProgressContract as contract } from '../../Data/apiServices/objectiveProgressContract'
const props = defineProps<{
  objective: ObjectiveMeasurement
  actual: number | null
  backendIndicator?: number | null
}>()
const { locale } = useI18n()
const value = computed(() =>
  achievement(
    props.objective,
    contract.semantics === 'period-specific' ? null : props.actual,
    props.backendIndicator,
    contract.numberReduction,
  ),
)
const width = computed(() => (value.value === null ? 0 : Math.min(100, Math.max(0, value.value))))
const formatted = computed(() =>
  value.value === null
    ? '—'
    : `${new Intl.NumberFormat(locale.value, { maximumFractionDigits: 2 }).format(value.value)}%`,
)
</script>
<template>
  <div class="op-indicator">
    <strong>{{ formatted }}</strong>
    <div
      v-if="value !== null"
      class="op-indicator-track"
      role="progressbar"
      :aria-label="$t('op.indicator')"
      :aria-valuenow="width"
      :aria-valuetext="formatted"
      :aria-valuemin="0"
      :aria-valuemax="100"
    >
      <span :style="{ width: `${width}%` }" />
    </div>
    <small v-else>{{ $t('op.indicatorUnavailable') }}</small>
  </div>
</template>
