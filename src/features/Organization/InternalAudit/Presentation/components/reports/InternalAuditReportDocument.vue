<script setup lang="ts">
import { computed } from 'vue'
import type InternalAuditPlanReportDetailsModel from '../../../Data/models/reports/InternalAuditPlanReportDetailsModel'
import type InternalAuditPlanModel from '../../../Data/models/plan/InternalAuditPlanModel'
import type InternalAuditAttendanceModel from '../../../Data/models/attendance/InternalAuditAttendanceModel'
import type InternalAuditNcrModel from '../../../Data/models/ncrs/InternalAuditNcrModel'
import HandleFIlesUpload from '@/features/Organization/OrganizationEmployee/Presentation/supcomponents/HandleFIlesUpload.vue'

const props = defineProps<{
  details: InternalAuditPlanReportDetailsModel
  plan: InternalAuditPlanModel | null
  attendance: InternalAuditAttendanceModel[]
  ncrs: InternalAuditNcrModel[]
  scope: string
  methodology: string
  maintenance: string
  generalObservations: string
  conclusion: string
  attachments: string[]
}>()

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' ? (value as Record<string, unknown>) : {}
}
function name(value: unknown): string {
  if (value == null) return ''
  if (Array.isArray(value)) return value.map(name).filter(Boolean).join(', ')
  if (typeof value === 'string') return value
  const item = record(value)
  return String(item.name ?? item.title ?? '') || name(item.employee ?? item.organization_employee)
}
function status(value: number): string {
  return (
    ({ 1: 'Pending', 2: 'Open', 3: 'In progress', 4: 'Closed' } as Record<number, string>)[value] ||
    'Unknown'
  )
}
const attendanceGroups = computed(() => [
  { title: 'Audit team', members: props.attendance.filter((item) => !item.isParticipant) },
  { title: 'Participants', members: props.attendance.filter((item) => item.isParticipant) },
])
const overview = computed(() => [
  {
    label: 'Period',
    value: `${props.plan?.auditStartDate || props.details.auditStartDate} / ${props.plan?.auditEndDate || props.details.auditEndDate}`,
  },
  {
    label: 'Focus Area',
    value: props.plan?.fullCompany ? 'Full Company' : name(props.plan?.project),
  },
  { label: 'Standards', value: name(props.plan?.auditStandards) },
  {
    label: 'Internal auditors / Lead',
    value: `${name(props.plan?.auditTeam) || props.details.internalAuditors.map((item) => item.name).join(', ') || '—'} / ${name(props.plan?.leader) || '—'}`,
  },
])
const scopes = computed(() =>
  props.plan?.auditScope.length
    ? props.plan.auditScope.map((entry) => {
        const item = record(entry)
        return {
          department: name(item.department ?? item.depertment),
          activities: name(item.activities ?? item.audit_activities ?? item.audit_activitys),
        }
      })
    : props.details.auditScope.map((item) => ({
        department: item.department,
        activities: item.activities.join(', '),
      })),
)
const scheduleGroups = computed(() => {
  const rows = props.plan?.auditSchedule.length
    ? props.plan.auditSchedule.map((entry) => {
        const item = record(entry)
        return {
          day: String(item.day ?? ''),
          startTime: String(item.start_time ?? ''),
          endTime: String(item.end_time ?? ''),
          location: String(item.location ?? ''),
          auditFocus: name(item.audit_focus),
          assignedAuditor: name(
            item.assigned_auditors ?? item.assigned_auditor ?? item.assigend_auditor,
          ),
        }
      })
    : props.details.auditSchedule
  const groups: Record<string, typeof rows> = {}
  for (const row of rows) (groups[row.day || 'Unscheduled'] ??= []).push(row)
  return Object.entries(groups)
})
const contextFields = computed(() => [
  { label: 'General Instructions', value: props.plan?.generalInstructions },
  { label: 'Reason For Date Changes', value: props.plan?.reasonForDateChanges },
  { label: 'Purpose', value: props.details.purpose },
  { label: 'Scope', value: scopes.value.map((item) => item.department).join(', ') },
  { label: 'Scope Clarifications', value: props.scope },
  { label: 'Methodology', value: props.methodology },
])
</script>

<template>
  <article class="audit-report-document" aria-label="Internal audit report">
    <h1>Internal Audit Report · {{ details.auditNumber || plan?.title }}</h1>
    <section>
      <h2>Audit Overview</h2>
      <dl>
        <div v-for="field in overview" :key="field.label">
          <dt>{{ field.label }}</dt>
          <dd>{{ field.value || '—' }}</dd>
        </div>
      </dl>
    </section>
    <section>
      <h2>Audit Scope</h2>
      <dl>
        <div v-for="(item, index) in scopes" :key="index">
          <dt>{{ item.department || '—' }}</dt>
          <dd>{{ item.activities || '—' }}</dd>
        </div>
      </dl>
    </section>
    <section>
      <h2>Audit Schedule</h2>
      <div v-for="[day, rows] in scheduleGroups" :key="day">
        <h3>{{ day }}</h3>
        <div class="document-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Time</th>
                <th>Focus</th>
                <th>Location</th>
                <th>Auditors</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, index) in rows" :key="index">
                <td>{{ row.startTime }} - {{ row.endTime }}</td>
                <td>{{ row.auditFocus || '—' }}</td>
                <td>{{ row.location || '—' }}</td>
                <td>{{ row.assignedAuditor || '—' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <p v-if="!scheduleGroups.length">No schedule recorded.</p>
      <dl>
        <div v-for="field in contextFields" :key="field.label">
          <dt>{{ field.label }}</dt>
          <dd>{{ field.value || '—' }}</dd>
        </div>
      </dl>
      <HandleFIlesUpload
        v-if="plan?.attachments.length"
        label="Plan attachments"
        :file="plan.attachments"
        readonly
      />
    </section>
    <section>
      <h2>Audit Attendance</h2>
      <div v-for="group in attendanceGroups" :key="group.title">
        <h3>{{ group.title }}</h3>
        <div class="document-table-wrap">
          <table class="attendance-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Position</th>
                <th>Department</th>
                <th>Opening meeting</th>
                <th>Closing meeting</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in group.members" :key="item.id || item.orgEmployeeId">
                <td>{{ item.employee.name }}{{ item.isLead ? ' (Lead)' : '' }}</td>
                <td>{{ name(item.position) || '—' }}</td>
                <td>{{ name(item.department) || '—' }}</td>
                <td>{{ item.openMeeting ? 'Yes' : 'No' }}</td>
                <td>{{ item.closeMeeting ? 'Yes' : 'No' }}</td>
              </tr>
              <tr v-if="!group.members.length">
                <td colspan="5">No records</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
    <section>
      <h2>Non-conformity</h2>
      <div class="document-table-wrap">
        <table>
          <thead>
            <tr>
              <th>NCR</th>
              <th>Description</th>
              <th>Area / Process</th>
              <th>Standard / Reference</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="ncr in ncrs" :key="ncr.id">
              <td>{{ ncr.serial_name || ncr.ncr }}</td>
              <td>{{ ncr.details?.description || '—' }}</td>
              <td>{{ ncr.area || name(ncr.details?.areaUnderReviews) || '—' }}</td>
              <td>
                {{ name(ncr.details?.auditStandard) || ncr.details?.requirementReference || '—' }}
              </td>
              <td>{{ status(ncr.status) }}</td>
            </tr>
            <tr v-if="!ncrs.length">
              <td colspan="5">No NCRs recorded.</td>
            </tr>
          </tbody>
        </table>
      </div>
      <dl>
        <div>
          <dt>Maintenance</dt>
          <dd>{{ maintenance || '—' }}</dd>
        </div>
        <div>
          <dt>General Observations</dt>
          <dd>{{ generalObservations || '—' }}</dd>
        </div>
      </dl>
    </section>
    <section v-for="ncr in ncrs" :key="ncr.id" class="ncr-document">
      <h2>Non-Conformance Report</h2>
      <dl class="identity-grid">
        <div>
          <dt>Audit No.</dt>
          <dd>{{ details.auditNumber }}</dd>
        </div>
        <div>
          <dt>NCR No.</dt>
          <dd>{{ ncr.serial_name || ncr.ncr }}</dd>
        </div>
        <div>
          <dt>Area Under Review</dt>
          <dd>{{ name(ncr.details?.areaUnderReviews) || ncr.area || '—' }}</dd>
        </div>
        <div>
          <dt>Category</dt>
          <dd>{{ Number(ncr.ncrsCategory) === 2 ? 'Major NC' : 'Minor NC' }}</dd>
        </div>
        <div>
          <dt>Auditor / Date</dt>
          <dd>{{ ncr.createdBy.name || '—' }} / {{ ncr.createdAt || '—' }}</dd>
        </div>
        <div>
          <dt>Standard / Reference</dt>
          <dd>
            {{ name(ncr.details?.auditStandard) || '—' }} {{ ncr.details?.requirementReference }}
          </dd>
        </div>
      </dl>
      <template v-if="ncr.details">
        <dl>
          <div>
            <dt>Description</dt>
            <dd>{{ ncr.details.description || '—' }}</dd>
          </div>
          <div>
            <dt>Correction – Immediate Action</dt>
            <dd>{{ ncr.details.immediateAction || '—' }}</dd>
          </div>
          <div>
            <dt>Root Cause</dt>
            <dd>{{ name(ncr.details.rootCauses) || '—' }}</dd>
          </div>
        </dl>
        <div v-for="(task, index) in ncr.details.tasks" :key="index">
          <dl v-for="kind in ['corrective', 'preventive'] as const" :key="kind">
            <div>
              <dt>{{ kind === 'corrective' ? 'Corrective Action' : 'Preventive Action' }}</dt>
              <dd>{{ task[kind].text || '—' }}</dd>
            </div>
            <div>
              <dt>Assigned To / Target Date</dt>
              <dd>{{ name(task[kind].assignedTo) || '—' }} / {{ task[kind].targetDate || '—' }}</dd>
            </div>
            <div>
              <dt>Actual Date</dt>
              <dd>{{ task[kind].actualDate || '—' }}</dd>
            </div>
          </dl>
        </div>
        <HandleFIlesUpload
          v-if="ncr.details.attachments.length"
          label="NCR attachments"
          :file="ncr.details.attachments"
          readonly
        />
      </template>
      <p v-else>Details are unavailable for this NCR.</p>
      <dl>
        <div>
          <dt>Status</dt>
          <dd>{{ status(ncr.status) }}</dd>
        </div>
      </dl>
    </section>
    <section>
      <h2>Conclusion</h2>
      <p>{{ conclusion || '—' }}</p>
      <HandleFIlesUpload
        v-if="attachments.length"
        label="Report attachments"
        :file="attachments"
        readonly
      />
    </section>
  </article>
</template>

<style scoped>
.audit-report-document {
  padding: 32px;
  background: #fff;
  color: #172334;
  font:
    13px/1.6 Arial,
    sans-serif;
  overflow-wrap: anywhere;
  min-width: 0;
}
h1 {
  font-size: 24px;
  margin: 0 0 20px;
}
h2 {
  font-size: 19px;
  margin: 24px 0 12px;
}
h3 {
  font-size: 15px;
  margin: 16px 0 10px;
}
dl {
  margin: 0;
}
dl > div {
  margin: 0 0 20px;
}
dt {
  font-weight: 700;
  margin-bottom: 8px;
}
dd {
  margin: 0;
  white-space: pre-wrap;
}
p {
  white-space: pre-wrap;
}
.document-table-wrap {
  overflow-x: auto;
  margin-bottom: 12px;
}
table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}
th,
td {
  border: 1px solid #bccbd9;
  padding: 7px;
  text-align: start;
  vertical-align: top;
}
th {
  font-weight: 700;
}
.attendance-table {
  table-layout: fixed;
}
.identity-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0 28px;
}
@media (max-width: 700px) {
  .audit-report-document {
    padding: 18px;
  }
  .identity-grid {
    grid-template-columns: 1fr;
  }
}
@media print {
  .audit-report-document {
    padding: 0;
  }
  h1,
  h2,
  h3,
  dt {
    break-after: avoid;
  }
  tr {
    break-inside: avoid;
  }
  thead {
    display: table-header-group;
  }
}
</style>
