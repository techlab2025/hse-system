<script setup lang="ts">
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
    <section aria-label="Audit plan">
      <h2>1. Audit plan</h2>
      <InternalAuditPlanTab :key="`plan-${auditId}`" :internal-audit-plan-id="auditId" readonly />
    </section>
    <section aria-label="Audit attendance">
      <h2>2. Attendance</h2>
      <InternalAuditAttendanceTab
        :key="`attendance-${auditId}`"
        :internal-audit-plan-id="auditId"
        readonly
      />
    </section>
    <section aria-label="All non-conformance reports">
      <h2>
        3. NCRs <span>({{ ncrs.length }})</span>
      </h2>
      <p v-if="ncrError" class="error" role="alert">{{ ncrError }}</p>
      <p v-else-if="!ncrs.length">No NCRs recorded for this audit.</p>
      <article v-for="(ncr, index) in ncrs" :key="ncr.id" class="report-ncr">
        <h3>{{ index + 1 }}. {{ ncr.serial_name || ncr.ncr || `NCR-${ncr.id}` }}</h3>
        <InternalAuditNcrForm
          v-if="ncr.details"
          :internal-audit-plan-id="auditId"
          :audit-serial-name="auditSerialName"
          :area-options="ncr.details.areaUnderReviews"
          :details="ncr.details"
          readonly
          embedded
        />
        <p v-else class="error" role="alert">Details are unavailable for this NCR.</p>
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
.report-ncr h3 {
  margin-bottom: 12px;
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
