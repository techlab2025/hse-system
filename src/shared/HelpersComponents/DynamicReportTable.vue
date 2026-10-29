<script setup lang="ts">
import { computed, useSlots } from 'vue'
import { useI18n } from 'vue-i18n'

type ReportRecord = Record<string, unknown>

interface ReportColumn {
  key: string
  label?: string
}

const props = withDefaults(
  defineProps<{
    items?: unknown[] | null
    startIndex?: number
    maxDepth?: number
    columns?: Array<string | ReportColumn>
  }>(),
  {
    items: () => [],
    startIndex: 0,
    maxDepth: 2,
    columns: () => [],
  },
)

// const slots = defineSlots<{
//   actions?(props: { item: unknown; index: number }): unknown
// }>()

const slots = useSlots()
const { t, te, locale } = useI18n({ useScope: 'global' })

const isRecord = (value: unknown): value is ReportRecord =>
  value !== null && typeof value === 'object' && !Array.isArray(value)

const hasValue = (value: unknown): boolean => {
  if (value === null || value === undefined || value === '') return false
  if (Array.isArray(value)) return value.some(hasValue)
  if (isRecord(value)) return Object.values(value).some(hasValue)
  return true
}

const sourceRecord = (item: unknown): ReportRecord => {
  if (!isRecord(item)) return { value: item }
  return isRecord(item.rawData) ? item.rawData : item
}

const compactValue = (value: unknown): string => {
  if (value === null || value === undefined || value === '') return '—'
  if (typeof value === 'boolean') return value ? t('Yes') : t('No')
  if (Array.isArray(value))
    return value
      .map(compactValue)
      .filter((item) => item !== '—')
      .join(', ')
  if (isRecord(value)) {
    return Object.entries(value)
      .filter(([, child]) => hasValue(child))
      .map(([key, child]) => `${humanize(key)}: ${compactValue(child)}`)
      .join(' · ')
  }
  return String(value)
}

const flattenRecord = (
  value: ReportRecord,
  prefix = '',
  depth = 0,
  output: ReportRecord = {},
): ReportRecord => {
  Object.entries(value).forEach(([key, child]) => {
    if (key === 'rawData' || !hasValue(child)) return
    const path = prefix ? `${prefix}.${key}` : key

    if (isRecord(child) && depth < props.maxDepth) {
      flattenRecord(child, path, depth + 1, output)
      return
    }

    output[path] = child
  })

  return output
}

const rows = computed(() =>
  (props.items ?? []).map((item) => ({ item, values: flattenRecord(sourceRecord(item)) })),
)

const humanize = (key: string) =>
  key
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[._-]+/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())

const columnLabel = (key: string) => {
  const segments = key.split('.')
  const leaf = segments.at(-1) ?? key
  const translationKey = te(key) ? key : te(leaf) ? leaf : ''
  if (translationKey) return t(translationKey)
  return segments.map(humanize).join(' / ')
}

const responseColumns = computed<Required<ReportColumn>[]>(() => {
  const keys = new Set<string>()
  rows.value.forEach((row) => Object.keys(row.values).forEach((key) => keys.add(key)))
  return [...keys].map((key) => ({ key, label: columnLabel(key) }))
})

const visibleColumns = computed<Required<ReportColumn>[]>(() => {
  if (!props.columns.length) return responseColumns.value

  const returnedKeys = new Set(responseColumns.value.map((column) => column.key))
  return props.columns
    .map((column) => (typeof column === 'string' ? { key: column } : column))
    .filter((column) => returnedKeys.has(column.key))
    .map((column) => ({
      key: column.key,
      label: column.label || columnLabel(column.key),
    }))
})

const displayValue = (value: unknown) => {
  if (typeof value !== 'string') return compactValue(value)

  const timestamp = Date.parse(value)
  if (/^\d{4}-\d{2}-\d{2}(?:[T\s].*)?$/.test(value) && Number.isFinite(timestamp)) {
    return new Intl.DateTimeFormat(locale.value, {
      dateStyle: 'medium',
      ...(value.includes('T') || value.includes(' ') ? { timeStyle: 'short' as const } : {}),
    }).format(new Date(timestamp))
  }

  return value
}

const isExternalUrl = (value: unknown) => typeof value === 'string' && /^https?:\/\//i.test(value)
</script>

<template>
  <div class="dynamic-report-table-container">
    <div class="dynamic-report-table-wrap hse-table-scroll">
      <table v-table-identity class="main-table dynamic-report-table hse-data-table">
        <thead>
          <tr>
            <th class="dynamic-report-table__number" scope="col">#</th>
            <th v-for="column in visibleColumns" :key="column.key" scope="col">
              {{ column.label }}
            </th>
            <th v-if="slots.actions" scope="col" data-pdf-exclude>{{ $t('actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in rows" :key="String(row.values.id ?? index)">
            <td class="dynamic-report-table__number">{{ startIndex + index + 1 }}</td>
            <td v-for="column in visibleColumns" :key="column.key">
              <a
                v-if="isExternalUrl(row.values[column.key])"
                :href="String(row.values[column.key])"
                target="_blank"
                rel="noopener noreferrer"
              >
                {{ displayValue(row.values[column.key]) }}
              </a>
              <span v-else :title="displayValue(row.values[column.key])">
                {{ displayValue(row.values[column.key]) }}
              </span>
            </td>
            <td v-if="slots.actions" data-pdf-exclude>
              <slot name="actions" :item="row.item" :index="index" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.dynamic-report-table-container {
  width: 100%;
}

.dynamic-report-table-wrap {
  width: 100%;
  overflow: auto;
  border: 1px solid var(--main-border, var(--hse-project-line));
  border-radius: var(--hse-card-radius, 14px);
  background: var(--BgWhite, var(--hse-project-surface));
  box-shadow: var(--hse-shadow-sm, 0 8px 24px rgb(16 42 77 / 6%));
}

.dynamic-report-table {
  width: max-content;
  min-width: 100%;
}

.dynamic-report-table th,
.dynamic-report-table td {
  min-width: 150px;
  max-width: 340px;
  vertical-align: top;
}

.dynamic-report-table td span,
.dynamic-report-table td a {
  display: block;
  overflow: hidden;
  line-height: 1.55;
  overflow-wrap: anywhere;
  text-overflow: ellipsis;
}

.dynamic-report-table td a {
  color: var(--PrimaryColor, var(--hse-project-blue));
  font-weight: 700;
}

.dynamic-report-table__number {
  width: 68px;
  min-width: 68px !important;
  max-width: 68px !important;
  position: sticky;
  inset-inline-start: 0;
  z-index: 1;
  background: inherit;
  text-align: center;
}
</style>
