<script setup lang="ts">
import { computed } from 'vue'
import Dialog from 'primevue/dialog'
import type TodayTalkModel from '../../../Data/models/TodayTalk/TodayTalkModel'

const props = defineProps<{
  visible: boolean
  talk: TodayTalkModel | null
  projectName?: string | null
}>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
}>()

const attendingCount = computed(
  () => props.talk?.employees.filter((employee) => employee.isAttend).length ?? 0,
)
const absentCount = computed(() => (props.talk?.employees.length ?? 0) - attendingCount.value)
const attendanceRate = computed(() => {
  const total = props.talk?.employees.length ?? 0
  return total ? Math.round((attendingCount.value / total) * 100) : 0
})

const employeeName = (title: string, employeeId: number) => title || `Employee #${employeeId}`
const employeeInitials = (title: string, employeeId: number) => {
  const initials = employeeName(title, employeeId)
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join('')

  return initials || '?'
}

const formatDate = (date: string) => {
  if (!date) return 'Date not provided'
  const parsed = new Date(`${date}T00:00:00`)
  return Number.isNaN(parsed.getTime())
    ? date
    : new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(parsed)
}

const formatDateTime = (dateTime: string | null | undefined) => {
  if (!dateTime) return 'Not recorded'
  const parsed = new Date(dateTime.replace(' ', 'T'))
  return Number.isNaN(parsed.getTime())
    ? dateTime
    : new Intl.DateTimeFormat(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(parsed)
}
</script>

<template>
  <Dialog
    :visible="visible"
    modal
    dismissable-mask
    class="talk-details-dialog"
    :style="{ width: 'min(58rem, calc(100vw - 24px))' }"
    @update:visible="emit('update:visible', $event)"
  >
    <template #header>
      <div v-if="talk" class="dialog-heading">
        <span class="dialog-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M5 4h14v12H9l-4 4V4Z" />
            <path d="M8 8h8M8 12h5" />
          </svg>
        </span>
        <div>
          <span class="dialog-eyebrow">Today talk details</span>
          <h2>Talk {{ talk.serialName || `#${talk.id}` }}</h2>
        </div>
      </div>
    </template>

    <div v-if="talk" class="talk-details">
      <section class="details-hero">
        <div class="details-meta">
          <span class="assignment-badge">{{ projectName || `Project #${talk.projectId}` }}</span>
          <span>{{ formatDate(talk.date) }}</span>
          <i aria-hidden="true"></i>
          <span>{{ talk.time || 'No time' }}</span>
        </div>
        <p>{{ talk.content }}</p>
        <div class="talk-identifiers">
          <!-- <span><small>Talk ID</small><strong>#{{ talk.id }}</strong></span> -->
          <span><small>Serial number</small><strong>{{ talk.serialNumber || '—' }}</strong></span>
          <span><small>Created</small><strong>{{ formatDateTime(talk.createdAt) }}</strong></span>
        </div>
      </section>

      <!-- <section class="attendance-overview" aria-label="Attendance summary">
        <div class="attendance-stat total-stat">
          <span>Total employees</span><strong>{{ talk.employees.length }}</strong>
        </div>
        <div class="attendance-stat attended-stat">
          <span>Attended</span><strong>{{ attendingCount }}</strong>
        </div>
        <div class="attendance-stat absent-stat">
          <span>Absent</span><strong>{{ absentCount }}</strong>
        </div>
        <div class="attendance-stat rate-stat">
          <span>Attendance rate</span><strong>{{ attendanceRate }}%</strong>
        </div>
      </section> -->

      <section class="employee-roster">
        <header>
          <div>
            <span>Attendance roster</span>
            <h3>Employees and attendance</h3>
          </div>
          <span class="roster-count">{{ talk.employees.length }} employees</span>
        </header>

        <div v-if="talk.employees.length" class="employee-list">
          <RouterLink
            v-for="employee in talk.employees"
            :key="employee.id || employee.organizationEmployeeId"
            class="employee-row"
            :to="`/organization/organization-employee/show/${employee.organizationEmployeeId}?type=3`"
            @click="emit('update:visible', false)"
          >
            <span :class="['employee-avatar', { attended: employee.isAttend }]">
              {{ employeeInitials(employee.title, employee.organizationEmployeeId) }}
            </span>
            <div class="employee-identity">
              <strong>{{ employeeName(employee.title, employee.organizationEmployeeId) }}</strong>
              <span>Employee ID #{{ employee.organizationEmployeeId }}</span>
            </div>
            <div class="attendance-result">
              <span :class="['status-pill', { attended: employee.isAttend }]">
                <i aria-hidden="true"></i>
                {{ employee.isAttend ? 'Attended' : 'Absent' }}
              </span>
              <small v-if="employee.isAttend">{{ formatDateTime(employee.attendAt) }}</small>
            </div>
            <svg class="employee-arrow" viewBox="0 0 20 20" aria-hidden="true">
              <path d="m7 4 6 6-6 6" />
            </svg>
          </RouterLink>
        </div>
        <div v-else class="no-employees">No employees were assigned to this talk.</div>
      </section>
    </div>
  </Dialog>
</template>

<style scoped lang="scss">
:global(.talk-details-dialog) {
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 18%, var(--main-border));
  border-radius: 24px;
  background: var(--surface-1);
  box-shadow: 0 28px 80px color-mix(in srgb, var(--brand-primary-900) 24%, transparent);
}
:global(.talk-details-dialog .p-dialog-header) {
  padding: 20px 22px;
  border-bottom: 1px solid var(--main-border);
  background: radial-gradient(circle at 88% 0, color-mix(in srgb, var(--PrimaryColor) 20%, transparent), transparent 46%), var(--surface-1);
}
:global(.talk-details-dialog .p-dialog-content) {
  padding: 0;
  background: var(--surface-2);
}
:global(.talk-details-dialog .p-dialog-close-button) {
  border-radius: 10px;
  color: var(--text-strong);
  background: var(--surface-2);
}
.dialog-heading, .details-meta, .employee-roster > header, .attendance-stat {
  display: flex;
  align-items: center;
}
.dialog-heading { gap: 12px; }
.dialog-icon {
  display: grid;
  width: 44px;
  height: 44px;
  flex: 0 0 44px;
  place-items: center;
  border-radius: 14px;
  color: var(--text-on-brand);
  background: linear-gradient(145deg, var(--PrimaryColor), var(--brand-primary-700));
}
.dialog-icon svg { width: 24px; fill: none; stroke: currentColor; stroke-width: 1.7; }
.dialog-eyebrow { color: var(--PrimaryColor); font-size: .65rem; font-weight: 900; letter-spacing: .09em; text-transform: uppercase; }
.dialog-heading h2 { margin: 3px 0 0; color: var(--text-strong); font-size: 1.2rem; }
.talk-details { display: grid; gap: 14px; max-height: min(75vh, 760px); padding: 18px; overflow-y: auto; }
.details-hero, .attendance-overview, .employee-roster { border: 1px solid var(--main-border); border-radius: 18px; background: var(--surface-1); }
.details-hero { position: relative; overflow: hidden; padding: 20px; background: radial-gradient(circle at 100% 0, color-mix(in srgb, var(--PrimaryColor) 10%, transparent), transparent 38%), var(--surface-1); }
.details-hero::before { content: ''; position: absolute; inset-block: 0; inset-inline-start: 0; width: 4px; background: linear-gradient(var(--PrimaryColor), var(--brand-accent-500)); }
.details-meta { flex-wrap: wrap; gap: 8px; color: var(--text-soft); font-size: .72rem; }
.details-meta i { width: 4px; height: 4px; border-radius: 50%; background: var(--main-border); }
.assignment-badge { padding: 5px 9px; border-radius: 999px; color: var(--PrimaryColor); background: color-mix(in srgb, var(--PrimaryColor) 10%, var(--surface-1)); font-weight: 900; }
.details-hero > p { margin: 17px 0 20px; color: var(--text-strong); line-height: 1.75; white-space: pre-wrap; }
.talk-identifiers { display: grid; grid-template-columns: .7fr 1fr 1.4fr; gap: 9px; }
.talk-identifiers > span { display: grid; gap: 3px; min-width: 0; padding: 10px 12px; border-radius: 11px; background: var(--surface-2); }
.talk-identifiers small { color: var(--text-soft); font-size: .61rem; font-weight: 700; }
.talk-identifiers strong { overflow: hidden; color: var(--text-strong); font-size: .72rem; text-overflow: ellipsis; white-space: nowrap; }
.attendance-overview { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); overflow: hidden; }
.attendance-stat { position: relative; justify-content: space-between; min-height: 76px; gap: 8px; padding: 14px 16px; border-inline-end: 1px solid var(--main-border); }
.attendance-stat:last-child { border-inline-end: 0; }
.attendance-stat::after { content: ''; position: absolute; inset-inline: 15px; inset-block-end: 0; height: 3px; border-radius: 999px 999px 0 0; background: var(--PrimaryColor); }
.attendance-stat span { color: var(--text-soft); font-size: .67rem; font-weight: 750; }
.attendance-stat strong { color: var(--text-strong); font-size: 1.35rem; }
.attended-stat::after { background: var(--status-success); }
.attended-stat strong { color: var(--status-success); }
.absent-stat::after { background: var(--status-danger); }
.absent-stat strong { color: var(--status-danger); }
.rate-stat::after { background: var(--brand-accent-500); }
.employee-roster { overflow: hidden; }
.employee-roster > header { justify-content: space-between; gap: 12px; padding: 17px 18px; border-bottom: 1px solid var(--main-border); }
.employee-roster header > div { display: grid; gap: 2px; }
.employee-roster header > div > span { color: var(--PrimaryColor); font-size: .61rem; font-weight: 900; letter-spacing: .08em; text-transform: uppercase; }
.employee-roster h3 { margin: 0; color: var(--text-strong); font-size: .95rem; }
.roster-count { padding: 6px 10px; border-radius: 999px; color: var(--PrimaryColor); background: color-mix(in srgb, var(--PrimaryColor) 9%, var(--surface-1)); font-size: .65rem; font-weight: 850; }
.employee-list { display: grid; max-height: 330px; overflow-y: auto; }
.employee-row { display: grid; grid-template-columns: auto minmax(0, 1fr) auto auto; align-items: center; gap: 11px; padding: 12px 17px; border-bottom: 1px solid color-mix(in srgb, var(--main-border) 72%, transparent); text-decoration: none; transition: background .18s ease; }
.employee-row:last-child { border-bottom: 0; }
.employee-row:hover { background: color-mix(in srgb, var(--PrimaryColor) 4%, var(--surface-1)); }
.employee-avatar { display: grid; width: 38px; height: 38px; place-items: center; border: 1px solid var(--main-border); border-radius: 12px; color: var(--text-soft); background: var(--surface-2); font-size: .7rem; font-weight: 900; text-transform: uppercase; }
.employee-avatar.attended { border-color: color-mix(in srgb, var(--status-success) 25%, var(--main-border)); color: var(--status-success); background: var(--status-success-soft); }
.employee-identity { display: grid; min-width: 0; gap: 3px; }
.employee-identity strong { overflow: hidden; color: var(--text-strong); font-size: .76rem; text-overflow: ellipsis; white-space: nowrap; }
.employee-identity span, .attendance-result small { color: var(--text-soft); font-size: .62rem; }
.attendance-result { display: grid; justify-items: end; gap: 4px; }
.status-pill { display: inline-flex; align-items: center; gap: 5px; padding: 5px 8px; border-radius: 999px; color: var(--status-danger); background: var(--status-danger-soft); font-size: .62rem; font-weight: 900; }
.status-pill i { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
.status-pill.attended { color: var(--status-success); background: var(--status-success-soft); }
.employee-arrow { width: 16px; fill: none; stroke: var(--PrimaryColor); stroke-width: 1.8; }
.no-employees { padding: 30px 18px; color: var(--text-soft); text-align: center; }
@media (max-width: 650px) {
  .attendance-overview { grid-template-columns: repeat(2, 1fr); }
  .talk-identifiers { grid-template-columns: 1fr; }
  .employee-row { grid-template-columns: auto minmax(0, 1fr) auto; }
  .attendance-result { grid-column: 2; justify-items: start; }
  .employee-arrow { grid-column: 3; grid-row: 1 / span 2; }
}
</style>
