<script setup lang="ts">
import { ncrStatusLabel as GetNcrStatus } from '../../utils/labels'
import type InternalAuditNcrModel from '../../../Data/models/ncrs/InternalAuditNcrModel'
import InternalAuditPlanTab from '../plan/InternalAuditPlanTab.vue'
import InternalAuditAttendanceTab from '../attendance/InternalAuditAttendanceTab.vue'
import InternalAuditNcrForm from '../ncrs/InternalAuditNcrForm.vue'

defineProps<{
  auditId: number
  auditSerialName: string
  ncrs: InternalAuditNcrModel[]
  ncrError: string
}>()
</script>

<template>
  <div class="report-step-forms">
    <section :aria-label="$t('Audit plan')">
      <h2>{{ $t('1. Audit plan') }}</h2>
      <InternalAuditPlanTab :key="`plan-${auditId}`" :internal-audit-plan-id="auditId" readonly />
    </section>
    <section :aria-label="$t('Audit attendance')">
      <h2>{{ $t('2. Attendance') }}</h2>
      <InternalAuditAttendanceTab
        :key="`attendance-${auditId}`"
        :internal-audit-plan-id="auditId"
        readonly
      />
    </section>
    <section :aria-label="$t('All non-conformance reports')">
      <h2>
        {{ $t('3. NCRs') }} <span>({{ ncrs.length }})</span>
      </h2>
      <p v-if="ncrError" class="error" role="alert">{{ ncrError }}</p>
      <p v-else-if="!ncrs.length">{{ $t('No NCRs recorded for this audit.') }}</p>
      <article v-for="(ncr, index) in ncrs" :key="ncr.id" class="report-ncr">
        <div class="report-ncr-header">
          <h3>{{ index + 1 }}. {{ ncr.serial_name || ncr.ncr || `NCR-${ncr.id}` }}</h3>
          <p
            class="ncr-status"
            :class="`ncr-status--${GetNcrStatus(ncr.status).replace(/\s+/g, '-')}`"
          >
            {{ GetNcrStatus(ncr.status) }}
          </p>
        </div>

        <InternalAuditNcrForm
          v-if="ncr.details"
          :internal-audit-plan-id="auditId"
          :audit-serial-name="auditSerialName"
          :area-options="ncr.details.areaUnderReviews"
          :details="ncr.details"
          readonly
          embedded
        />
        <p v-else class="error" role="alert">{{ $t('Details are unavailable for this NCR.') }}</p>
      </article>
    </section>
  </div>
</template>

<style scoped>
.report-step-forms {
  display: grid;
  gap: 28px;
  min-width: 0;
}
.report-step-forms > section {
  min-width: 0;
}
h2 {
  margin: 0 0 18px;
  font-size: 1.2rem;
}
h2 span {
  color: var(--text-muted);
}
.report-ncr {
  margin-top: 20px;
}
.report-ncr-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 12px;
}
.report-ncr-header h3 {
  margin: 0;
}
.ncr-status {
  --ncr-status-color: var(--text-muted, #64748b);
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  gap: 7px;
  margin: 0;
  padding: 6px 12px;
  border: 1px solid color-mix(in srgb, var(--ncr-status-color) 28%, transparent);
  border-radius: 999px;
  background: color-mix(in srgb, var(--ncr-status-color) 10%, transparent);
  color: var(--ncr-status-color);
  font-size: 0.75rem;
  font-weight: 700;
  line-height: 1.5;
  text-transform: capitalize;
}
.ncr-status::before {
  content: '';
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}
.ncr-status--pending {
  --ncr-status-color: var(--status-warning, #b7791f);
}
.ncr-status--open {
  --ncr-status-color: var(--status-danger, #dc2626);
}
.ncr-status--in-progress {
  --ncr-status-color: var(--status-info, #2563eb);
}
.ncr-status--closed {
  --ncr-status-color: var(--status-success, #15803d);
}
.error {
  color: var(--status-danger);
}
@media print {
  h2,
  h3 {
    break-after: avoid;
  }
}
</style>
