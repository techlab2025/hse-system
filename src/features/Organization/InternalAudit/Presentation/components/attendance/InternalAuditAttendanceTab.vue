<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import ToggleSwitch from 'primevue/toggleswitch'
import { InternalAuditMeetingTypeEnum } from '../../../Core/enums/attendance/InternalAuditMeetingTypeEnum'
import ChangeInternalAuditAttendanceStatusParams from '../../../Core/params/attendance/changeInternalAuditAttendanceStatusParams'
import FetchInternalAuditAttendanceParams from '../../../Core/params/attendance/fetchInternalAuditAttendanceParams'
import type InternalAuditAttendanceModel from '../../../Data/models/attendance/InternalAuditAttendanceModel'
import ChangeInternalAuditAttendanceStatusController from '../../controllers/attendance/changeInternalAuditAttendanceStatusController'
import FetchInternalAuditAttendanceController from '../../controllers/attendance/fetchInternalAuditAttendanceController'

const props = withDefaults(
  defineProps<{
    internalAuditPlanId?: number
    auditStatus?: string
    auditStartDate?: string
  }>(),
  { internalAuditPlanId: 0, auditStatus: '', auditStartDate: '' },
)

const fetchController = FetchInternalAuditAttendanceController.getInstance()
const statusController = ChangeInternalAuditAttendanceStatusController.getInstance()
const attendance = ref<InternalAuditAttendanceModel[]>([])
const error = ref('')
const changingStatus = ref<string | null>(null)
const isLoading = computed(() => fetchController.isDataLoading())
const canManageAttendance = computed(() => {
  const status = props.auditStatus.toLowerCase()
  const today = new Date().toISOString().slice(0, 10)
  return (
    props.internalAuditPlanId > 0 &&
    status === 'planned' &&
    (!props.auditStartDate || props.auditStartDate.slice(0, 10) <= today)
  )
})

type AttendanceStatusKey = 'openMeeting' | 'closeMeeting'

async function fetchAttendance() {
  error.value = ''
  await fetchController.fetch(new FetchInternalAuditAttendanceParams())

  if (fetchController.isDataSuccess()) {
    attendance.value = fetchController.state.value.data ?? []
    return
  }

  attendance.value = []
  error.value = fetchController.state.value.error?.title ?? 'Unable to load audit attendance.'
}

async function changeStatus(
  item: InternalAuditAttendanceModel,
  key: AttendanceStatusKey,
  meetingType: InternalAuditMeetingTypeEnum,
  checked: boolean,
) {
  if (!item.id || changingStatus.value !== null) return
  const previousValue = item[key]
  const controlKey = `${item.id}-${key}`
  item[key] = checked
  changingStatus.value = controlKey
  error.value = ''

  try {
    await statusController.changeStatus(
      new ChangeInternalAuditAttendanceStatusParams(item.id, meetingType),
    )

    if (statusController.isDataSuccess()) await fetchAttendance()
    else {
      item[key] = previousValue
      error.value =
        statusController.state.value.error?.title ?? 'Unable to change attendance status.'
    }
  } finally {
    changingStatus.value = null
  }
}

onMounted(fetchAttendance)
</script>

<template>
  <section class="attendance-tab">
    <header class="attendance-header">
      <div>
        <span class="eyebrow">Audit participants</span>
        <h2>Audit Attendance</h2>
        <p>Track attendance for the opening and closing meetings.</p>
      </div>
      <button class="refresh-button" type="button" :disabled="isLoading" @click="fetchAttendance">
        {{ isLoading ? 'Loading…' : 'Refresh' }}
      </button>
    </header>

    <p v-if="error" class="message error" role="alert">{{ error }}</p>
    <p v-if="!canManageAttendance" class="stage-note">
      Attendance can be updated after the plan is published and the audit start date is reached.
    </p>

    <div v-if="isLoading" class="attendance-loading" aria-label="Loading audit attendance">
      <span v-for="index in 4" :key="index"></span>
    </div>

    <div v-else-if="attendance.length" class="attendance-table-wrap">
      <table class="attendance-table">
        <thead>
          <tr>
            <th>Employee</th>
            <th>Position</th>
            <th>Department</th>
            <th>Opening meeting</th>
            <th>Closing meeting</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in attendance" :key="item.id || item.employee.id">
            <td>
              <div class="employee-cell">
                <span class="avatar">{{ item.employee.name.charAt(0).toUpperCase() || '?' }}</span>
                <strong>{{ item.employee.name || 'Unknown employee' }}</strong>
              </div>
            </td>
            <td>{{ item.position?.title || '—' }}</td>
            <td>{{ item.department?.title || '—' }}</td>
            <td>
              <div class="status-control">
                <ToggleSwitch
                  :model-value="item.openMeeting"
                  :input-id="`opening-meeting-${item.id}`"
                  :disabled="!canManageAttendance || !item.id || changingStatus !== null"
                  @update:model-value="changeStatus(item, 'openMeeting', InternalAuditMeetingTypeEnum.OPENING, $event)"
                />
              </div>
            </td>
            <td>
              <div class="status-control">
                <ToggleSwitch
                  :model-value="item.closeMeeting"
                  :input-id="`closing-meeting-${item.id}`"
                  :disabled="!canManageAttendance || !item.id || changingStatus !== null"
                  @update:model-value="changeStatus(item, 'closeMeeting', InternalAuditMeetingTypeEnum.CLOSING, $event)"
                />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else-if="!error" class="empty-tab">
      <span class="tab-icon">✓</span>
      <h3>No attendance records</h3>
      <p>Attendance records and participant sign-off will appear here.</p>
    </div>
  </section>
</template>

<style scoped>
.attendance-tab{display:grid;gap:18px}.attendance-header{display:flex;align-items:center;justify-content:space-between;gap:20px;padding:22px;border:1px solid var(--main-border,#d9e1df);border-radius:18px;background:var(--card-bg,#fff)}.eyebrow{color:var(--PrimaryColor,#087d80);font-size:.72rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase}.attendance-header h2{margin:4px 0;color:var(--text-primary,#172334);font-size:1.2rem}.attendance-header p{margin:0;color:var(--text-soft,#687777);font-size:.86rem}.refresh-button{border:1px solid var(--PrimaryColor,#087d80);border-radius:9px;background:transparent;padding:9px 14px;color:var(--PrimaryColor,#087d80);font-weight:650}.refresh-button:disabled{cursor:not-allowed;opacity:.55}.message,.stage-note{margin:0;border-radius:10px;padding:12px 16px}.error{background:#fff0f0;color:#b42318}.stage-note{border-inline-start:4px solid #c6841b;background:#fff6e5;color:#76501b}.attendance-table-wrap{overflow-x:auto;border:1px solid var(--main-border,#d9e1df);border-radius:18px;background:var(--card-bg,#fff)}.attendance-table{width:100%;border-collapse:collapse}.attendance-table th,.attendance-table td{padding:15px 18px;border-bottom:1px solid var(--main-border,#e5e9e8);text-align:start;white-space:nowrap}.attendance-table th{background:color-mix(in srgb,var(--PrimaryColor,#087d80) 6%,transparent);color:var(--text-soft,#687777);font-size:.72rem;letter-spacing:.04em;text-transform:uppercase}.attendance-table tbody tr:last-child td{border-bottom:0}.employee-cell{display:flex;align-items:center;gap:10px}.avatar{display:grid;width:34px;height:34px;place-items:center;border-radius:50%;background:color-mix(in srgb,var(--PrimaryColor,#087d80) 13%,transparent);color:var(--PrimaryColor,#087d80);font-weight:750}.status-control{display:flex;align-items:center}.empty-tab{display:grid;min-height:260px;place-items:center;align-content:center;gap:8px;border:1px dashed var(--main-border,#cbd8d6);border-radius:18px;background:var(--card-bg,#fff);text-align:center}.tab-icon{display:grid;width:52px;height:52px;place-items:center;border-radius:50%;background:color-mix(in srgb,var(--PrimaryColor,#087d80) 12%,transparent);color:var(--PrimaryColor,#087d80);font-size:1.4rem}.empty-tab h3,.empty-tab p{margin:0}.empty-tab p{color:var(--text-soft,#687777)}.attendance-loading{display:grid;gap:10px}.attendance-loading span{height:66px;border-radius:12px;background:linear-gradient(90deg,#eef2f1 25%,#f8faf9 50%,#eef2f1 75%);background-size:200% 100%;animation:pulse 1.3s infinite}@keyframes pulse{to{background-position:-200% 0}}@media(max-width:600px){.attendance-header{align-items:flex-start;flex-direction:column}.refresh-button{width:100%}}
</style>
