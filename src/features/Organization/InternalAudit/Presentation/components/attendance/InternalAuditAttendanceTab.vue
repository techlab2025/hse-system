<script setup lang="ts">
import type TitleInterface from '@/base/Data/Models/title_interface'
import IndexOrganizatoinEmployeeController from '@/features/Organization/OrganizationEmployee/Presentation/controllers/indexOrganizatoinEmployeeController'
import IndexOrganizationParams from '@/features/setting/Organization/Core/params/indexOrganizationParams'
import UpdatedCustomInputSelect from '@/shared/FormInputs/UpdatedCustomInputSelect.vue'
import Checkbox from 'primevue/checkbox'
import Dialog from 'primevue/dialog'
import { computed, onMounted, ref } from 'vue'
import AddInternalAuditParticipantsParams from '../../../Core/params/attendance/addInternalAuditParticipantsParams'
import FetchInternalAuditAttendanceParams from '../../../Core/params/attendance/fetchInternalAuditAttendanceParams'
import SaveInternalAuditAttendanceParams from '../../../Core/params/attendance/saveInternalAuditAttendanceParams'
import type InternalAuditAttendanceModel from '../../../Data/models/attendance/InternalAuditAttendanceModel'
import AddInternalAuditParticipantsController from '../../controllers/attendance/addInternalAuditParticipantsController'
import FetchInternalAuditAttendanceController from '../../controllers/attendance/fetchInternalAuditAttendanceController'
import SaveInternalAuditAttendanceController from '../../controllers/attendance/saveInternalAuditAttendanceController'

const props = withDefaults(
  defineProps<{
    internalAuditPlanId?: number
    auditStatus?: string
    auditStartDate?: string
  }>(),
  { internalAuditPlanId: 0, auditStatus: '', auditStartDate: '' },
)

const fetchController = FetchInternalAuditAttendanceController.getInstance()
const saveController = SaveInternalAuditAttendanceController.getInstance()
const addParticipantsController = AddInternalAuditParticipantsController.getInstance()
const employeeController = IndexOrganizatoinEmployeeController.getInstance()
const employeeParams = new IndexOrganizationParams('', 1, 20, 0)

const attendance = ref<InternalAuditAttendanceModel[]>([])
const selectedEmployees = ref<TitleInterface[]>([])
const attendeeDialogVisible = ref(false)
const error = ref('')
const success = ref('')

const isLoading = computed(() => fetchController.isDataLoading())
const isSaving = computed(() => saveController.isDataLoading())
const isAddingParticipants = computed(() => addParticipantsController.isDataLoading())
const auditTeam = computed(() => attendance.value.filter((item) => !item.isParticipant))
const participants = computed(() => attendance.value.filter((item) => item.isParticipant))
const canManageAttendance = computed(() => {
  const status = props.auditStatus.toLowerCase()
  const today = new Date().toISOString().slice(0, 10)
  return (
    props.internalAuditPlanId > 0 &&
    status === 'planned' &&
    (!props.auditStartDate || props.auditStartDate.slice(0, 10) <= today)
  )
})

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

function setSelectedEmployees(value: TitleInterface | TitleInterface[] | null) {
  selectedEmployees.value = Array.isArray(value) ? value : value ? [value] : []
}

function setMeetingStatus(
  item: InternalAuditAttendanceModel,
  key: 'openMeeting' | 'closeMeeting',
  value: boolean,
) {
  item[key] = value
  success.value = ''
}

async function saveAttendance() {
  if (!attendance.value.length || isSaving.value) return

  error.value = ''
  success.value = ''
  const employees = attendance.value.map((item) => ({
    org_emploee_id: item.orgEmployeeId || item.employee.id,
    open_meeting: item.openMeeting,
    close_meeting: item.closeMeeting,
  }))

  await saveController.save(new SaveInternalAuditAttendanceParams(employees))
  if (saveController.isDataSuccess()) {
    success.value = 'Attendance saved successfully.'
    await fetchAttendance()
    return
  }

  error.value = saveController.state.value.error?.title ?? 'Unable to save attendance.'
}

async function addAttendees() {
  if (!selectedEmployees.value.length || isAddingParticipants.value) return

  error.value = ''
  success.value = ''
  await addParticipantsController.add(
    new AddInternalAuditParticipantsParams(
      selectedEmployees.value.map((employee) => ({ employee_id: Number(employee.id) })),
    ),
  )

  if (addParticipantsController.isDataSuccess()) {
    attendeeDialogVisible.value = false
    selectedEmployees.value = []
    success.value = 'Attendees added successfully.'
    await fetchAttendance()
    return
  }

  error.value =
    addParticipantsController.state.value.error?.title ?? 'Unable to add audit attendees.'
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
      <div class="header-actions">
        <button
          class="secondary-button"
          type="button"
          :disabled="isLoading"
          @click="fetchAttendance"
        >
          {{ isLoading ? 'Loading…' : 'Refresh' }}
        </button>
        <button
          class="primary-button"
          type="button"
          :disabled="!canManageAttendance"
          @click="attendeeDialogVisible = true"
        >
          Add Attendee
        </button>
      </div>
    </header>

    <!-- <p v-if="error" class="message error" role="alert">{{ error }}</p> -->
    <!-- <p v-if="success" class="message success" role="status">{{ success }}</p>
    <p v-if="!canManageAttendance" class="stage-note">
      Attendance can be updated after the plan is published and the audit start date is reached.
    </p> -->

    <div v-if="isLoading" class="attendance-loading" aria-label="Loading audit attendance">
      <span v-for="index in 4" :key="index"></span>
    </div>

    <div v-else-if="attendance.length" class="attendance-groups">
      <section v-if="auditTeam.length" class="attendance-group">
        <h3>Audit team</h3>
        <div class="attendance-table-wrap">
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
              <tr v-for="item in auditTeam" :key="item.id || item.orgEmployeeId">
                <td>
                  <div class="employee-cell">
                    <span class="avatar">{{
                      item.employee.name.charAt(0).toUpperCase() || '?'
                    }}</span>
                    <strong>{{ item.employee.name || 'Unknown employee' }}</strong>
                    <span v-if="item.isLead" class="lead-badge">Lead</span>
                  </div>
                </td>
                <td>{{ item.position || '—' }}</td>
                <td>{{ item.department || '—' }}</td>
                <td>
                  <Checkbox
                    :model-value="item.openMeeting"
                    :input-id="`team-opening-${item.orgEmployeeId}`"
                    binary
                    :disabled="!canManageAttendance || isSaving"
                    @update:model-value="setMeetingStatus(item, 'openMeeting', $event)"
                  />
                </td>
                <td>
                  <Checkbox
                    :model-value="item.closeMeeting"
                    :input-id="`team-closing-${item.orgEmployeeId}`"
                    binary
                    :disabled="!canManageAttendance || isSaving"
                    @update:model-value="setMeetingStatus(item, 'closeMeeting', $event)"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section v-if="participants.length" class="attendance-group">
        <h3>Participants</h3>
        <div class="attendance-table-wrap">
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
              <tr v-for="item in participants" :key="item.id || item.orgEmployeeId">
                <td>
                  <div class="employee-cell">
                    <span class="avatar">{{
                      item.employee.name.charAt(0).toUpperCase() || '?'
                    }}</span>
                    <strong>{{ item.employee.name || 'Unknown employee' }}</strong>
                  </div>
                </td>
                <td>{{ item.position || '—' }}</td>
                <td>{{ item.department || '—' }}</td>
                <td>
                  <Checkbox
                    :model-value="item.openMeeting"
                    :input-id="`participant-opening-${item.orgEmployeeId}`"
                    binary
                    :disabled="!canManageAttendance || isSaving"
                    @update:model-value="setMeetingStatus(item, 'openMeeting', $event)"
                  />
                </td>
                <td>
                  <Checkbox
                    :model-value="item.closeMeeting"
                    :input-id="`participant-closing-${item.orgEmployeeId}`"
                    binary
                    :disabled="!canManageAttendance || isSaving"
                    @update:model-value="setMeetingStatus(item, 'closeMeeting', $event)"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <button
        class="primary-button save-button"
        type="button"
        :disabled="!canManageAttendance || isSaving"
        @click="saveAttendance"
      >
        {{ isSaving ? 'Saving…' : 'Save Attendance' }}
      </button>
    </div>

    <div v-else-if="!error" class="empty-tab">
      <span class="tab-icon">✓</span>
      <h3>No attendance records</h3>
      <p>Add attendees or publish the audit plan to create attendance rows.</p>
    </div>

    <Dialog
      v-model:visible="attendeeDialogVisible"
      modal
      header="Add audit attendees"
      :dismissable-mask="true"
      :style="{ width: 'min(34rem, calc(100vw - 24px))' }"
    >
      <div class="attendee-dialog">
        <p>Select one or more organization employees to add as audit participants.</p>
        <UpdatedCustomInputSelect
          id="internal-audit-attendees"
          label="Employees"
          placeholder="Select employees"
          type="multiselect"
          :required="true"
          :controller="employeeController"
          :params="employeeParams"
          :model-value="selectedEmployees"
          @update:model-value="setSelectedEmployees"
        />
        <div class="dialog-actions">
          <button class="secondary-button" type="button" @click="attendeeDialogVisible = false">
            Cancel
          </button>
          <button
            class="primary-button"
            type="button"
            :disabled="!selectedEmployees.length || isAddingParticipants"
            @click="addAttendees"
          >
            {{ isAddingParticipants ? 'Adding…' : 'Add Attendees' }}
          </button>
        </div>
      </div>
    </Dialog>
  </section>
</template>

<style scoped>
.attendance-tab {
  display: grid;
  gap: 18px;
}
.attendance-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 22px;
  border: 1px solid var(--main-border, #d9e1df);
  border-radius: 18px;
  background: var(--card-bg, #fff);
}
.eyebrow {
  color: var(--PrimaryColor, #087d80);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.attendance-header h2 {
  margin: 4px 0;
  color: var(--text-primary, #172334);
  font-size: 1.2rem;
}
.attendance-header p,
.attendee-dialog > p {
  margin: 0;
  color: var(--text-soft, #687777);
  font-size: 0.86rem;
}
.header-actions,
.dialog-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}
.primary-button,
.secondary-button {
  border: 1px solid var(--PrimaryColor, #087d80);
  border-radius: 9px;
  padding: 9px 14px;
  font-weight: 650;
}
.primary-button {
  background: var(--PrimaryColor, #087d80);
  color: #fff;
}
.secondary-button {
  background: transparent;
  color: var(--PrimaryColor, #087d80);
}
button:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}
.message,
.stage-note {
  margin: 0;
  border-radius: 10px;
  padding: 12px 16px;
}
.error {
  background: #fff0f0;
  color: #b42318;
}
.success {
  background: #ecfdf3;
  color: #027a48;
}
.stage-note {
  border-inline-start: 4px solid #c6841b;
  background: #fff6e5;
  color: #76501b;
}
.attendance-groups,
.attendance-group {
  display: grid;
  gap: 12px;
}
.attendance-group h3 {
  margin: 0;
  color: var(--text-primary, #172334);
  font-size: 1rem;
}
.attendance-table-wrap {
  overflow-x: auto;
  border: 1px solid var(--main-border, #d9e1df);
  border-radius: 12px;
  background: var(--card-bg, #fff);
}
.attendance-table {
  width: 100%;
  border-collapse: collapse;
}
.attendance-table th,
.attendance-table td {
  padding: 14px 16px;
  border-bottom: 1px solid var(--main-border, #e5e9e8);
  text-align: start;
  white-space: nowrap;
}
.attendance-table th {
  background: color-mix(in srgb, var(--PrimaryColor, #087d80) 6%, transparent);
  color: var(--text-soft, #687777);
  font-size: 0.72rem;
  letter-spacing: 0.02em;
  text-transform: uppercase;
}
.attendance-table tbody tr:last-child td {
  border-bottom: 0;
}
.employee-cell {
  display: flex;
  align-items: center;
  gap: 9px;
}
.avatar {
  display: grid;
  width: 32px;
  height: 32px;
  place-items: center;
  border-radius: 50%;
  background: color-mix(in srgb, var(--PrimaryColor, #087d80) 13%, transparent);
  color: var(--PrimaryColor, #087d80);
  font-weight: 750;
}
.lead-badge {
  border-radius: 5px;
  background: color-mix(in srgb, var(--PrimaryColor, #087d80) 11%, transparent);
  padding: 4px 7px;
  color: var(--PrimaryColor, #087d80);
  font-size: 0.72rem;
  font-weight: 700;
}
.save-button {
  justify-self: start;
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
.attendance-loading {
  display: grid;
  gap: 10px;
}
.attendance-loading span {
  height: 66px;
  border-radius: 12px;
  background: linear-gradient(90deg, #eef2f1 25%, #f8faf9 50%, #eef2f1 75%);
  background-size: 200% 100%;
  animation: pulse 1.3s infinite;
}
.attendee-dialog {
  display: grid;
  gap: 18px;
}
.dialog-actions {
  justify-content: flex-end;
}
@keyframes pulse {
  to {
    background-position: -200% 0;
  }
}
@media (max-width: 700px) {
  .attendance-header {
    align-items: flex-start;
    flex-direction: column;
  }
  .header-actions {
    width: 100%;
  }
  .header-actions button {
    flex: 1;
  }
  .attendance-table th,
  .attendance-table td {
    padding: 12px;
  }
  .dialog-actions {
    flex-direction: column-reverse;
  }
  .dialog-actions button {
    width: 100%;
  }
}
</style>
