<script setup lang="ts">
import type TitleInterface from '@/base/Data/Models/title_interface'
import type InternalAuditNcrModel from '../../../Data/models/ncrs/InternalAuditNcrModel'

defineProps<{
  ncrs: InternalAuditNcrModel[]
  auditLeadAuditor: TitleInterface | null
  loading: boolean
  hasError: boolean
}>()

const emit = defineEmits<{
  open: [ncr: InternalAuditNcrModel]
}>()

function statusLabel(status: unknown): string {
  const value = String(status ?? '')
  const numericLabels: Record<string, string> = {
    '0': 'Pending',
    '1': 'Open',
    '2': 'In progress',
    '3': 'Closed',
  }
  return (numericLabels[value] ?? value.split('_').join(' ')) || 'Unknown'
}

function categoryLabel(categoryValue: unknown): string {
  const value = String(categoryValue ?? '').toLowerCase()
  if (value === '1' || value === 'minor' || value === 'minor_nc') return 'Minor NC'
  if (value === '2' || value === 'major' || value === 'major_nc') return 'Major NC'
  return value.split('_').join(' ') || '—'
}

function createdAtLabel(value: string): string {
  if (!value) return '—'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString()
}
</script>

<template>
  <div v-if="loading" class="ncr-loading" aria-label="Loading NCRs">
    <span v-for="index in 4" :key="index"></span>
  </div>
  <div v-else-if="ncrs.length" class="ncr-index">
    <div class="ncr-table-wrap">
      <table class="ncr-table">
        <thead>
          <tr>
            <th>NCR</th>
            <th>Area</th>
            <th>Created by</th>
            <th>Created at</th>
            <th>Lead Auditor</th>
            <!-- <th>Due</th> -->
            <th>Status</th>
            <th>Lead Review</th>
            <th><span class="sr-only">Actions</span></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in ncrs" :key="item.id || item.ncr">
            <td>
              <div class="ncr-identity">
                <strong>{{ item.ncr || `NCR-${item.id}` }}</strong>
                <span
                  class="category"
                  :class="{ major: categoryLabel(item.ncrsCategory) === 'Major NC' }"
                >
                  {{ categoryLabel(item.ncrsCategory) }}
                </span>
              </div>
            </td>
            <td>{{ item.area || '—' }}</td>
            <td>{{ item.createdBy.name || '—' }}</td>
            <td>{{ createdAtLabel(item.createdAt) }}</td>
            <td>{{ auditLeadAuditor?.title || auditLeadAuditor?.name || '—' }}</td>
            <!-- <td>{{ item.dueDate || '—' }}</td> -->
            <td>
              <span class="status">{{ statusLabel(item.status) }}</span>
            </td>
            <td>{{ item.leadReviewStatus || item.leadReview.name || 'Pending' }}</td>
            <td class="row-action">
              <button
                type="button"
                class="open-button"
                @click="emit('open', item)"
              >
                Open
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <div v-else-if="!hasError" class="empty-tab">
    <span class="tab-icon">!</span>
    <h3>No NCRs found</h3>
    <p>NCR findings, owners, and corrective actions will appear here.</p>
  </div>
</template>

<style scoped>
.ncr-loading {
  display: grid;
  gap: 10px;
}
.ncr-loading span {
  height: 120px;
  border-radius: 12px;
  background: linear-gradient(90deg, #eef2f1 25%, #f8faf9 50%, #eef2f1 75%);
  background-size: 200% 100%;
  animation: pulse 1.3s infinite;
}
.ncr-index {
  display: grid;
  gap: 16px;
}
.ncr-table-wrap {
  overflow-x: auto;
  border: 1px solid var(--main-border, #cbd8d6);
  background: var(--card-bg, #fff);
}
.ncr-table {
  width: 100%;
  border-collapse: collapse;
}
.ncr-table th,
.ncr-table td {
  padding: 13px 12px;
  border-bottom: 1px solid var(--main-border, #cbd8d6);
  text-align: start;
  white-space: nowrap;
}
.ncr-table th {
  background: color-mix(in srgb, var(--PrimaryColor, #087d80) 8%, #fff);
  color: var(--text-primary, #172334);
  font-size: 0.73rem;
}
.ncr-table td {
  font-size: 0.82rem;
}
.ncr-table tbody tr:last-child td {
  border-bottom: 0;
}
.ncr-identity {
  display: flex;
  align-items: center;
  gap: 7px;
}
.category,
.status {
  display: inline-flex;
  border-radius: 4px;
  background: #e8eef7;
  padding: 4px 8px;
  color: #294b75;
  font-size: 0.69rem;
  font-weight: 700;
}
.category.major {
  background: #fff0e8;
  color: #a14519;
}
.row-action {
  text-align: end !important;
}
.open-button {
  border: 1px solid color-mix(in srgb, var(--PrimaryColor, #087d80) 45%, #cbd8d6);
  border-radius: 6px;
  background: #fff;
  padding: 8px 12px;
  color: var(--text-primary, #172334);
}
.open-button:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}
.empty-tab {
  display: grid;
  min-height: 260px;
  place-items: center;
  align-content: center;
  gap: 8px;
  border: 1px dashed var(--main-border, #cbd8d6);
  border-radius: 18px;
  background: var(--card-bg, #fff);
  text-align: center;
}
.tab-icon {
  display: grid;
  width: 52px;
  height: 52px;
  place-items: center;
  border-radius: 50%;
  background: color-mix(in srgb, var(--PrimaryColor, #087d80) 12%, transparent);
  color: var(--PrimaryColor, #087d80);
  font-size: 1.4rem;
}
.empty-tab h3,
.empty-tab p {
  margin: 0;
}
.empty-tab p {
  color: var(--text-soft, #687777);
}
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
}
@keyframes pulse {
  to {
    background-position: -200% 0;
  }
}
</style>
