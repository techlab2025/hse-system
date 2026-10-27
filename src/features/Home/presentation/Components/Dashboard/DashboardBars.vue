<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { knownSum, type BarRow, type Count } from '../../../data/Model/OrganizationDashboardModel'
const props = defineProps<{ rows: BarRow[]; label: string }>()
const { t, locale } = useI18n()
const ordered = computed(() =>
  props.rows
    .map((row) => ({ ...row, total: knownSum(row.segments.map((s) => s.value)) }))
    .sort((a, b) => (b.total ?? -1) - (a.total ?? -1)),
)
const maximum = computed(() => Math.max(1, ...ordered.value.map((row) => row.total ?? 0)))
const number = (value: Count) =>
  value === null ? '—' : new Intl.NumberFormat(locale.value).format(value)
const legend = computed(() => props.rows[0]?.segments ?? [])
</script>
<template>
  <div class="command-chart" :aria-label="label">
    <ul class="command-legend" :aria-label="$t('command.legend')">
      <li v-for="item in legend" :key="item.key">
        <i :class="`command-fill-${item.tone}`"></i>{{ item.label }}
      </li>
    </ul>
    <ol class="command-bars" :class="{ 'command-bars-scroll': rows.length > 6 }">
      <li v-for="(row, index) in ordered" :key="row.id">
        <div class="command-bar-title">
          <span
            ><small>{{ number(index + 1) }}</small
            ><bdi dir="auto">{{ row.label || t('command.unnamedLocation') }}</bdi></span
          ><strong
            ><bdi>{{ number(row.total) }}</bdi></strong
          >
        </div>
        <div class="command-bar-track" aria-hidden="true">
          <span
            v-for="segment in row.segments"
            :key="segment.key"
            :class="`command-fill-${segment.tone}`"
            :style="{
              width: `${Math.min(100, ((row.total === null ? 0 : (segment.value ?? 0)) / maximum) * 100)}%`,
            }"
          ></span>
        </div>
        <div class="command-bar-values">
          <span
            v-for="segment in row.segments"
            :key="segment.key"
            :title="segment.value === null ? t('command.notProvided') : ''"
            >{{ segment.label }} <bdi>{{ number(segment.value) }}</bdi></span
          >
        </div>
      </li>
    </ol>
    <p v-if="!rows.length" class="command-inline-empty">{{ $t('command.noLocations') }}</p>
    <p
      v-if="rows.some((row) => row.segments.some((s) => s.value === null))"
      class="command-data-note"
    >
      {{ $t('command.incompleteCounts') }}
    </p>
  </div>
</template>
