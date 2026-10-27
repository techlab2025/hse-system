<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { knownSum, type Count } from '../../../data/Model/OrganizationDashboardModel'
const props = defineProps<{
  items: { key: string; label: string; value: Count; tone: string }[]
  caption: string
}>()
const { locale, t } = useI18n()
const total = computed(() => knownSum(props.items.map((item) => item.value)))
const arcs = computed(() => {
  let offset = 0
  return props.items.map((item) => {
    const percentage = total.value && item.value !== null ? (item.value / total.value) * 100 : 0
    const result = { ...item, percentage, offset }
    offset += percentage
    return result
  })
})
const number = (value: Count) =>
  value === null ? '—' : new Intl.NumberFormat(locale.value).format(value)
</script>
<template>
  <div class="command-donut-layout">
    <div class="command-donut" :aria-label="`${caption}: ${number(total)}`" role="img">
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <circle class="command-donut-base" cx="60" cy="60" r="46" fill="none" stroke-width="19" />
        <circle
          v-for="arc in arcs"
          :key="arc.key"
          v-show="arc.percentage > 0"
          :class="`command-stroke-${arc.tone}`"
          cx="60"
          cy="60"
          r="46"
          fill="none"
          stroke-width="19"
          pathLength="100"
          :stroke-dasharray="`${arc.percentage} ${100 - arc.percentage}`"
          :stroke-dashoffset="-arc.offset"
          transform="rotate(-90 60 60)"
        >
          <title>{{ arc.label }}: {{ number(arc.value) }}</title>
        </circle>
      </svg>
      <span class="command-donut-center"
        ><strong
          ><bdi>{{ number(total) }}</bdi></strong
        ><small>{{ caption }}</small></span
      >
    </div>
    <dl class="command-donut-legend">
      <div v-for="arc in arcs" :key="arc.key">
        <dt><i :class="`command-fill-${arc.tone}`"></i>{{ arc.label }}</dt>
        <dd>
          <bdi>{{ number(arc.value) }}</bdi
          ><small v-if="total && arc.value !== null"
            ><bdi>{{
              new Intl.NumberFormat(locale, { style: 'percent', maximumFractionDigits: 1 }).format(
                arc.value / total,
              )
            }}</bdi></small
          >
        </dd>
      </div>
    </dl>
    <p v-if="total === null || total === 0" class="command-data-note">
      {{ t(total === 0 ? 'command.noOwnership' : 'command.incompleteOwnership') }}
    </p>
  </div>
</template>
