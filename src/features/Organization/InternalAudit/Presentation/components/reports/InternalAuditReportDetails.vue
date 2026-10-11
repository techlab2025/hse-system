<script setup lang="ts">
import { computed } from 'vue'
import InternalAuditPlanReportDetailsModel from '../../../Data/models/reports/InternalAuditPlanReportDetailsModel'
import type { AuditReportData } from './loadAuditReport'
const props = defineProps<{ data: AuditReportData }>()
function label(value: unknown): string {
  if (value === null || value === undefined || value === '') return '—'
  if (Array.isArray(value)) return value.map(label).join(', ')
  if (typeof value !== 'object') return String(value)
  const item = value as Record<string, unknown>
  return label(item.employee ?? item.organization_employee ?? item.title ?? item.name)
}
function member(entry: unknown) {
  const row = (entry ?? {}) as Record<string, unknown>
  return {
    name: label(row.employee ?? row.organization_employee ?? row),
    lead: Boolean(row.is_lead_auditor ?? row.is_leader ?? row.is_lead),
  }
}
const planDetails = computed(() => {
  const plan = props.data.plan
  if (!plan) return props.data.summary
  return InternalAuditPlanReportDetailsModel.fromMap({
    id: plan.id,
    serial_name: plan.serial_name || plan.title,
    audit_start_date: plan.auditStartDate,
    audit_end_date: plan.auditEndDate,
    audit_team: plan.auditTeam,
    audit_scope: plan.auditScope,
    audit_schedule: plan.auditSchedule,
    purpose: props.data.summary?.purpose,
  })
})
function planStatus(value: string) {
  return (
    ({ '1': 'Draft', '2': 'Planned', '3': 'Reported' } as Record<string, string>)[value] || value
  )
}
function status(value: unknown) {
  return (
    ({ '0': 'Pending', '1': 'Open', '2': 'In progress', '3': 'Closed' } as Record<string, string>)[
      String(value)
    ] ?? label(value)
  )
}
function safeLink(value: string) {
  return /^(https?:\/\/|blob:|\/[^/])/i.test(value) ? value : undefined
}
</script>

<template>
  <div class="report-evidence">
    <section>
      <h3>1. Audit plan</h3>
      <p v-if="data.errors.plan" class="error">{{ data.errors.plan }}</p>
      <dl v-if="data.plan">
        <div>
          <dt>Title</dt>
          <dd>{{ data.plan.title }}</dd>
        </div>
        <div>
          <dt>Serial name / number</dt>
          <dd>{{ data.plan.serial_name || '—' }} / {{ data.plan.serial_number || '—' }}</dd>
        </div>
        <div>
          <dt>Dates</dt>
          <dd>{{ data.plan.auditStartDate }} – {{ data.plan.auditEndDate }}</dd>
        </div>
        <div>
          <dt>Status</dt>
          <dd>{{ planStatus(data.plan.status) }}</dd>
        </div>
        <div>
          <dt>Project / coverage</dt>
          <dd>{{ data.plan.fullCompany ? 'Full company' : label(data.plan.project) }}</dd>
        </div>
        <div>
          <dt>Audit standard</dt>
          <dd>{{ label(data.plan.auditStandard) }}</dd>
        </div>
        <div>
          <dt>Lead auditor</dt>
          <dd>{{ label(data.plan.leader) }}</dd>
        </div>
        <div>
          <dt>Auditee</dt>
          <dd>{{ label(data.plan.auditee) }}</dd>
        </div>
        <div>
          <dt>General instructions</dt>
          <dd>{{ data.plan.generalInstructions || '—' }}</dd>
        </div>
        <div>
          <dt>Audit team</dt>
          <dd>
            <p v-for="(entry, index) in data.plan.auditTeam" :key="index">
              {{ member(entry).name }}{{ member(entry).lead ? ' · Lead auditor' : '' }}
            </p>
            <span v-if="!data.plan.auditTeam.length">No team recorded.</span>
          </dd>
        </div>
      </dl>
      <template v-if="planDetails">
        <h4>Purpose</h4>
        <p class="prose">{{ planDetails.purpose }}</p>
        <h4>Scope and activities</h4>
        <dl>
          <div v-for="(scope, index) in planDetails.auditScope" :key="index">
            <dt>{{ scope.department }}</dt>
            <dd>{{ scope.activities.join(', ') || 'No activities recorded.' }}</dd>
          </div>
        </dl>
        <p v-if="!planDetails.auditScope.length">No scope recorded.</p>
        <h4>Schedule</h4>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Day</th>
                <th>Time</th>
                <th>Location</th>
                <th>Focus</th>
                <th>Auditor</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, index) in planDetails.auditSchedule" :key="index">
                <td>{{ row.day }}</td>
                <td>{{ row.startTime }} – {{ row.endTime }}</td>
                <td>{{ row.location }}</td>
                <td>{{ row.auditFocus }}</td>
                <td>{{ row.assignedAuditor }}</td>
              </tr>
              <tr v-if="!planDetails.auditSchedule.length">
                <td colspan="5">No schedule recorded.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
      <template v-if="data.plan?.attachments.length"
        ><h4>Plan attachments</h4>
        <ul>
          <li v-for="(url, index) in data.plan.attachments" :key="index">
            <a
              v-if="safeLink(url)"
              :href="safeLink(url)"
              target="_blank"
              rel="noopener noreferrer"
              >{{ data.plan.attachmentFileNames[index] || `Attachment ${index + 1}` }}</a
            ><span v-else>{{
              data.plan.attachmentFileNames[index] || `Attachment ${index + 1}`
            }}</span>
          </li>
        </ul></template
      >
    </section>
    <section>
      <h3>2. Attendance</h3>
      <p v-if="data.errors.attendance" class="error">{{ data.errors.attendance }}</p>
      <div v-else class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Employee</th>
              <th>Position</th>
              <th>Department</th>
              <th>Role</th>
              <th>Opening meeting</th>
              <th>Closing meeting</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in data.attendance" :key="`${row.id}-${index}`">
              <td>{{ row.employee.name }}</td>
              <td>{{ label(row.position) }}</td>
              <td>{{ label(row.department) }}</td>
              <td>
                {{ row.isLead ? 'Lead auditor' : row.isParticipant ? 'Participant' : 'Audit team' }}
              </td>
              <td>{{ row.openMeeting ? 'Present' : 'Absent' }}</td>
              <td>{{ row.closeMeeting ? 'Present' : 'Absent' }}</td>
            </tr>
            <tr v-if="!data.attendance.length">
              <td colspan="6">No attendance recorded.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
    <section>
      <h3>3. Non-conformance reports</h3>
      <p v-if="data.errors['NCR list']" class="error">{{ data.errors['NCR list'] }}</p>
      <p v-else-if="!data.ncrs.length">No NCRs recorded.</p>
      <article v-for="ncr in data.ncrs" :key="ncr.id" class="ncr-record">
        <h4>{{ ncr.serial_name || ncr.ncr || `NCR-${ncr.id}` }}</h4>
        <p v-if="data.errors[`NCR ${ncr.serial_name || ncr.ncr || ncr.id}`]" class="error">
          {{ data.errors[`NCR ${ncr.serial_name || ncr.ncr || ncr.id}`] }}
        </p>
        <template v-for="full in data.fullNcrs.filter((item) => item.id === ncr.id)" :key="full.id">
          <dl>
            <div>
              <dt>Serial name / number</dt>
              <dd>{{ full.serial_name || '—' }} / {{ full.serial_number || '—' }}</dd>
            </div>
            <div>
              <dt>Status / category</dt>
              <dd>
                {{ status(full.status) }} /
                {{ full.details?.category === 2 ? 'Major NC' : 'Minor NC' }}
              </dd>
            </div>
            <div>
              <dt>Created by / date</dt>
              <dd>{{ full.createdBy.name || '—' }} / {{ full.createdAt || '—' }}</dd>
            </div>
            <div>
              <dt>Auditee / due date</dt>
              <dd>{{ full.auditee.name || '—' }} / {{ full.dueDate || '—' }}</dd>
            </div>
            <div>
              <dt>Lead review</dt>
              <dd>{{ full.leadReview.name || '—' }} / {{ full.leadReviewStatus || '—' }}</dd>
            </div>
            <div>
              <dt>Area under review</dt>
              <dd>
                {{ full.details?.areaUnderReviews.map(label).join(', ') || full.area || '—' }}
              </dd>
            </div>
            <div>
              <dt>Audit standard</dt>
              <dd>{{ label(full.details?.auditStandard) }}</dd>
            </div>
            <div>
              <dt>Requirement reference</dt>
              <dd>{{ full.details?.requirementReference || '—' }}</dd>
            </div>
            <div>
              <dt>Description</dt>
              <dd>{{ full.details?.description || '—' }}</dd>
            </div>
            <div>
              <dt>Immediate action</dt>
              <dd>{{ full.details?.immediateAction || '—' }}</dd>
            </div>
            <div>
              <dt>Root causes</dt>
              <dd>{{ full.details?.rootCauses.map(label).join(', ') || '—' }}</dd>
            </div>
            <div>
              <dt>Result recorded</dt>
              <dd>{{ full.hasResult ? 'Yes' : 'No' }}</dd>
            </div>
          </dl>
          <h4>Corrective and preventive actions</h4>
          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Action</th>
                  <th>Assigned to</th>
                  <th>Target date</th>
                  <th>Actual date</th>
                </tr>
              </thead>
              <tbody>
                <template v-for="(task, index) in full.details?.tasks" :key="index"
                  ><tr v-for="kind in ['corrective', 'preventive'] as const" :key="kind">
                    <td>{{ kind === 'corrective' ? 'Corrective' : 'Preventive' }}</td>
                    <td class="prose">{{ task[kind].text || '—' }}</td>
                    <td>{{ label(task[kind].assignedTo) }}</td>
                    <td>{{ task[kind].targetDate || '—' }}</td>
                    <td>{{ task[kind].actualDate || '—' }}</td>
                  </tr></template
                >
                <tr v-if="!full.details?.tasks.length">
                  <td colspan="5">No actions recorded.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <h4>Attachments</h4>
          <ul v-if="full.details?.media.length">
            <li v-for="(file, index) in full.details.media" :key="index">
              <a
                v-if="safeLink(file.url)"
                :href="safeLink(file.url)"
                target="_blank"
                rel="noopener noreferrer"
                >{{ file.fileName }}</a
              ><span v-else>{{ file.fileName }}</span>
            </li>
          </ul>
          <p v-else>No attachments recorded.</p>
        </template>
      </article>
    </section>
  </div>
</template>

<style scoped>
.report-evidence {
  display: grid;
  gap: 28px;
}
section {
  min-width: 0;
}
h3 {
  padding-bottom: 12px;
  border-bottom: 2px solid var(--PrimaryColor);
}
h4 {
  margin: 20px 0 10px;
}
dl {
  margin: 0;
}
dl > div {
  display: grid;
  grid-template-columns: minmax(140px, 1fr) 3fr;
  gap: 20px;
  padding: 12px 0;
  border-bottom: 1px solid var(--main-border);
}
dt {
  font-weight: 650;
}
dd {
  margin: 0;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}
dd p {
  margin: 0 0 6px;
}
.prose {
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}
.table-wrap {
  overflow-x: auto;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th,
td {
  padding: 12px;
  border: 1px solid var(--main-border);
  text-align: start;
  vertical-align: top;
}
th {
  background: var(--surface-2);
}
.ncr-record {
  margin-top: 20px;
  padding: 20px;
  border: 1px solid var(--main-border);
  border-radius: 12px;
}
.error {
  color: var(--status-danger);
}
a {
  color: var(--PrimaryColor);
  text-decoration: underline;
}
@media (max-width: 640px) {
  dl > div {
    grid-template-columns: 1fr;
    gap: 6px;
  }
  .ncr-record {
    padding: 12px;
  }
}
@media print {
  .table-wrap {
    overflow: visible;
  }
  th,
  td {
    overflow-wrap: anywhere;
  }
  tr,
  dl > div {
    break-inside: avoid;
  }
  h3,
  h4 {
    break-after: avoid;
  }
}
</style>
