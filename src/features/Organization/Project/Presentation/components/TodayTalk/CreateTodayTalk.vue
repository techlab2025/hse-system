<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ToggleSwitch from 'primevue/toggleswitch'
import ProjectCustomLocationParams from '../../../Core/params/ProjectCustomLocationParams'
import { ProjectCustomLocationEnum } from '../../../Core/Enums/ProjectCustomLocationEnum'
import CreateTodayTalkParams from '../../../Core/params/TodayTalk/CreateTodayTalkParams'
import type ProjectCustomLocationModel from '../../../Data/models/CustomLocation/ProjectCustomLocationModel'
import ProjectCustomLocationController from '../../controllers/ProjectCustomLocationController'
import CreateTodayTalkController from '../../controllers/TodayTalk/CreateTodayTalkController'
import IndexOrganizatoinEmployeeController from '@/features/Organization/OrganizationEmployee/Presentation/controllers/indexOrganizatoinEmployeeController'
import IndexOrganizatoinEmployeeParams from '@/features/Organization/OrganizationEmployee/Core/params/indexOrganizatoinEmployeeParams'

type AttendanceEmployee = {
  organizationEmployeeId: number
  name: string
  email: string
  image: string
  isAttend: boolean
}

const route = useRoute()
const router = useRouter()
const projectId = computed(() => {
  const id = Number(route.params.id)
  return Number.isFinite(id) && id > 0 ? id : undefined
})
const isProjectTalk = computed(() => projectId.value != null)
const projectCustomLocationController = ProjectCustomLocationController.getInstance()
const employeesState = computed(() => projectCustomLocationController.state.value)
const organizationEmployeeController = IndexOrganizatoinEmployeeController.getInstance()
const organizationEmployeeParams = new IndexOrganizatoinEmployeeParams('', 1, 10, 0)
const createController = CreateTodayTalkController.getInstance()

const now = new Date()
const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60_000)
const content = ref('')
const date = ref(localDate.toISOString().slice(0, 10))
const time = ref(localDate.toISOString().slice(11, 16))
const attendance = ref<AttendanceEmployee[]>([])
const contentError = ref('')
const dateError = ref('')
const timeError = ref('')
const employeesError = ref('')
const isEmployeesLoading = ref(false)
const hasEmployeeError = ref(false)
const isSaving = computed(() => createController.isDataLoading())
const attendingCount = computed(() =>
  attendance.value.reduce((count, employee) => count + Number(employee.isAttend), 0),
)
const allAttending = computed(
  () => Boolean(attendance.value.length) && attendingCount.value === attendance.value.length,
)

const initials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || '—'

const hydrateEmployees = (locations?: ProjectCustomLocationModel[] | null) => {
  if (!locations) return

  const currentAttendance = new Map(
    attendance.value.map((employee) => [employee.organizationEmployeeId, employee.isAttend]),
  )
  const employees = new Map<number, AttendanceEmployee>()

  locations.forEach((location) => {
    const locationEmployees = [
      ...(location.locationEmplyees ?? []),
      ...(location.locationHierarchy ?? []).flatMap((hierarchy) => hierarchy.Employees ?? []),
    ]

    locationEmployees.forEach((employee) => {
      const organizationEmployeeId = Number(
        employee.organization_employee_id || employee.employeeId,
      )
      if (!organizationEmployeeId || employees.has(organizationEmployeeId)) return

      employees.set(organizationEmployeeId, {
        organizationEmployeeId,
        name: employee.name || `Employee #${organizationEmployeeId}`,
        email: employee.email || '',
        image: employee.image || '',
        isAttend: currentAttendance.get(organizationEmployeeId) ?? false,
      })
    })
  })

  attendance.value = [...employees.values()].sort((a, b) => a.name.localeCompare(b.name))
}

const getEmployees = async () => {
  isEmployeesLoading.value = true
  hasEmployeeError.value = false
  try {
    if (projectId.value) {
      const projectCustomLocationParams = new ProjectCustomLocationParams(projectId.value, [
        ProjectCustomLocationEnum.HIERARCHY_EMPLOYEE,
      ])
      await projectCustomLocationController.getData(projectCustomLocationParams)
    } else {
      const employees = await organizationEmployeeController.fetch(organizationEmployeeParams)
      attendance.value = employees.map((employee) => ({
        organizationEmployeeId: Number(employee.id),
        name: employee.title || `Employee #${employee.id}`,
        email: String(employee.subtitle || ''),
        image: '',
        isAttend: false,
      }))
    }
  } catch (error) {
    hasEmployeeError.value = true
    console.error('Unable to refresh employees', error)
  } finally {
    isEmployeesLoading.value = false
  }
}

const toggleAll = () => {
  const nextValue = !allAttending.value
  attendance.value.forEach((employee) => {
    employee.isAttend = nextValue
  })
}

const validate = () => {
  contentError.value = content.value.trim() ? '' : 'Talk content is required'
  dateError.value = date.value ? '' : 'Date is required'
  timeError.value = time.value ? '' : 'Time is required'
  employeesError.value = attendance.value.length ? '' : 'No employees are available'
  return !contentError.value && !dateError.value && !timeError.value && !employeesError.value
}

const saveTalk = async () => {
  if (!validate() || isSaving.value) return

  const params = new CreateTodayTalkParams(
    projectId.value,
    content.value.trim(),
    attendance.value.map((employee) => ({
      organization_employee_id: employee.organizationEmployeeId,
      is_attend: employee.isAttend,
    })),
    date.value,
    time.value,
  )
  await createController.createTodayTalk(params, projectId.value, router)
}

watch(
  () => employeesState.value.data,
  (locations) => {
    if (isProjectTalk.value) hydrateEmployees(locations ?? null)
  },
  { immediate: true },
)

watch(content, (value) => {
  if (value.trim()) contentError.value = ''
})

onMounted(getEmployees)
</script>

<template>
  <main class="today-talk-page">
    <header class="page-header">
      <RouterLink
        :to="
          isProjectTalk ? `/organization/project-details/${projectId}` : '/organization/today-talks'
        "
        class="back-link"
      >
        <span aria-hidden="true">←</span>
        {{ isProjectTalk ? 'Back to project' : 'Back to today talks' }}
      </RouterLink>
      <div class="heading-row">
        <div>
          <span class="eyebrow">Daily field briefing</span>
          <h1>Create Today’s Talk</h1>
          <p>Capture the safety conversation and confirm every team member’s attendance.</p>
        </div>
        <div class="today-badge">
          <span>{{
            new Intl.DateTimeFormat(undefined, { weekday: 'short' }).format(new Date())
          }}</span>
          <strong>{{ new Date().getDate() }}</strong>
        </div>
      </div>
    </header>

    <form class="talk-form" @submit.prevent="saveTalk">
      <section class="discussion-card">
        <div class="section-heading">
          <span class="step-number">01</span>
          <div>
            <h2>What did the team discuss?</h2>
            <p>Record the key safety topic, decisions, and actions from today’s talk.</p>
          </div>
        </div>
        <div class="content-field" :class="{ invalid: contentError }">
          <textarea
            id="today-talk-content"
            v-model="content"
            rows="7"
            maxlength="3000"
            placeholder="Example: We reviewed safe lifting practices, the day’s high-risk activities, and the stop-work procedure..."
            :aria-invalid="Boolean(contentError)"
          ></textarea>
          <div class="field-meta">
            <span class="error-message">{{ contentError }}</span>
            <span>{{ content.length }}/3000</span>
          </div>
        </div>
        <div class="schedule-grid">
          <label :class="{ invalid: dateError }">
            <span>Talk date</span>
            <input v-model="date" type="date" :aria-invalid="Boolean(dateError)" />
            <small class="error-message">{{ dateError }}</small>
          </label>
          <label :class="{ invalid: timeError }">
            <span>Talk time</span>
            <input v-model="time" type="time" :aria-invalid="Boolean(timeError)" />
            <small class="error-message">{{ timeError }}</small>
          </label>
        </div>
      </section>

      <section class="attendance-card">
        <div class="section-heading attendance-heading">
          <div class="heading-copy">
            <span class="step-number">02</span>
            <div>
              <h2>Who attended?</h2>
              <p>Switch attendance on for each employee who joined today’s talk.</p>
            </div>
          </div>
          <div class="attendance-actions">
            <span><strong>{{ attendingCount }}</strong> / {{ attendance.length }} attending</span>
            <button v-if="attendance.length" type="button" class="select-all" @click="toggleAll">
              {{ allAttending ? 'Clear all' : 'Mark all attending' }}
            </button>
          </div>
        </div>

        <div v-if="isEmployeesLoading" class="employee-grid employee-loading" aria-live="polite">
          <div v-for="index in 6" :key="index" class="employee-skeleton"></div>
        </div>

        <div v-else-if="attendance.length" class="employee-grid">
          <label
            v-for="employee in attendance"
            :key="employee.organizationEmployeeId"
            class="employee-card"
            :class="{ attending: employee.isAttend }"
            :for="`attendance-${employee.organizationEmployeeId}`"
          >
            <span class="avatar">
              <img v-if="employee.image" :src="employee.image" :alt="employee.name" />
              <span v-else>{{ initials(employee.name) }}</span>
            </span>
            <span class="employee-copy">
              <strong>{{ employee.name }}</strong>
              <small>{{ employee.email || `Employee #${employee.organizationEmployeeId}` }}</small>
            </span>
            <span class="attendance-control">
              <ToggleSwitch
                v-model="employee.isAttend"
                :input-id="`attendance-${employee.organizationEmployeeId}`"
              />
              <small>{{ employee.isAttend ? 'Attending' : 'Absent' }}</small>
            </span>
          </label>
        </div>

        <div v-else class="employees-empty">
          <span aria-hidden="true">!</span>
          <div>
            <h3>{{ hasEmployeeError ? 'Employees could not be loaded' : 'No employees found' }}</h3>
            <p>
              {{
                isProjectTalk
                  ? 'Add employees to this project or retry loading the project workforce.'
                  : 'Add organization employees or retry loading the employee list.'
              }}
            </p>
          </div>
          <button type="button" class="retry" @click="getEmployees">Retry</button>
        </div>
        <p v-if="employeesError" class="error-message employees-error">{{ employeesError }}</p>
      </section>

      <footer class="form-actions">
        <RouterLink
          :to="
            isProjectTalk
              ? `/organization/project-details/${projectId}`
              : '/organization/today-talks'
          "
          class="cancel-button"
        >
          Cancel
        </RouterLink>
        <button type="submit" class="btn btn-primary save-button" :disabled="isSaving">
          <span v-if="isSaving" class="button-spinner" aria-hidden="true"></span>
          {{ isSaving ? 'Saving talk…' : 'Save today’s talk' }}
        </button>
      </footer>
    </form>
  </main>
</template>

<style scoped lang="scss">
.today-talk-page {
  // width: min(1180px, calc(100% - 24px));
  margin: 18px auto 40px;
}

.page-header,
.discussion-card,
.attendance-card {
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 15%, var(--main-border));
  background: var(--surface-1);
  box-shadow: 0 18px 45px color-mix(in srgb, var(--brand-primary-900) 9%, transparent);
}

.page-header {
  overflow: hidden;
  padding: clamp(20px, 3vw, 34px);
  border-radius: 26px;
  background:
    radial-gradient(
      circle at 90% 0,
      color-mix(in srgb, var(--PrimaryColor) 20%, transparent),
      transparent 38%
    ),
    var(--surface-1);
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  margin-bottom: 24px;
  color: var(--text-soft);
  font-size: 0.82rem;
  font-weight: 700;
}

.heading-row,
.section-heading,
.heading-copy,
.form-actions,
.employees-empty {
  display: flex;
  align-items: center;
}

.heading-row,
.attendance-heading,
.form-actions {
  justify-content: space-between;
  gap: 20px;
}

.eyebrow {
  color: var(--PrimaryColor);
  font-size: 0.7rem;
  font-weight: 900;
  letter-spacing: 0.11em;
  text-transform: uppercase;
}

h1 {
  margin: 5px 0 8px;
  color: var(--text-strong);
  font-size: clamp(1.6rem, 3vw, 2.35rem);
}
.heading-row p,
.section-heading p,
.employees-empty p {
  margin: 0;
  color: var(--text-soft);
  line-height: 1.55;
}

.today-badge {
  display: grid;
  width: 76px;
  height: 82px;
  flex: 0 0 76px;
  place-items: center;
  border-radius: 19px;
  color: var(--text-on-brand);
  background: linear-gradient(145deg, var(--PrimaryColor), var(--brand-primary-700));
  box-shadow: 0 14px 28px color-mix(in srgb, var(--PrimaryColor) 26%, transparent);
}

.today-badge span {
  align-self: end;
  font-size: 0.72rem;
  font-weight: 800;
  text-transform: uppercase;
}
.today-badge strong {
  align-self: start;
  font-size: 1.8rem;
  line-height: 1;
}
.talk-form {
  display: grid;
  gap: 18px;
  margin-top: 18px;
}
.discussion-card,
.attendance-card {
  padding: clamp(18px, 2.5vw, 28px);
  border-radius: 23px;
}
.section-heading,
.heading-copy {
  gap: 13px;
}

.step-number {
  display: grid;
  width: 43px;
  height: 43px;
  flex: 0 0 43px;
  place-items: center;
  border-radius: 14px;
  color: var(--PrimaryColor);
  background: color-mix(in srgb, var(--PrimaryColor) 11%, var(--surface-1));
  font-weight: 900;
}

h2 {
  margin: 0 0 3px;
  color: var(--text-strong);
  font-size: 1.12rem;
}
.section-heading p {
  font-size: 0.82rem;
}
.content-field {
  margin-top: 20px;
}

textarea {
  width: 100%;
  min-height: 160px;
  resize: vertical;
  padding: 17px;
  border: 1px solid var(--main-border);
  border-radius: 15px;
  outline: none;
  color: var(--text-strong);
  background: var(--surface-2);
  line-height: 1.65;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}

textarea:focus {
  border-color: var(--PrimaryColor);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--PrimaryColor) 13%, transparent);
}
.invalid textarea {
  border-color: var(--status-danger);
}
.field-meta {
  display: flex;
  justify-content: space-between;
  min-height: 20px;
  margin-top: 6px;
  color: var(--text-soft);
  font-size: 0.75rem;
}
.schedule-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  margin-top: 14px;
}
.schedule-grid label {
  display: grid;
  gap: 7px;
  color: var(--text-strong);
  font-size: 0.78rem;
  font-weight: 800;
}
.schedule-grid input {
  width: 100%;
  padding: 11px 13px;
  border: 1px solid var(--main-border);
  border-radius: 11px;
  outline: none;
  color: var(--text-strong);
  background: var(--surface-2);
}
.schedule-grid input:focus {
  border-color: var(--PrimaryColor);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--PrimaryColor) 12%, transparent);
}
.schedule-grid .invalid input {
  border-color: var(--status-danger);
}
.error-message {
  color: var(--status-danger);
  font-size: 0.78rem;
  font-weight: 700;
}
.attendance-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--text-soft);
  font-size: 0.8rem;
}
.attendance-actions strong {
  color: var(--PrimaryColor);
  font-size: 1.05rem;
}

.select-all,
.retry,
.cancel-button {
  border: 1px solid var(--main-border);
  border-radius: 10px;
  color: var(--text-strong);
  background: var(--surface-2);
  font-size: 0.78rem;
  font-weight: 800;
  cursor: pointer;
}

.select-all {
  padding: 9px 12px;
}
.employee-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-top: 21px;
}

.employee-card {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 12px;
  padding: 13px;
  border: 1px solid var(--main-border);
  border-radius: 15px;
  background: var(--surface-2);
  cursor: pointer;
  transition:
    transform 0.18s,
    border-color 0.18s,
    background 0.18s;
}

.employee-card:hover {
  transform: translateY(-2px);
  border-color: color-mix(in srgb, var(--PrimaryColor) 45%, var(--main-border));
}
.employee-card.attending {
  border-color: color-mix(in srgb, var(--PrimaryColor) 50%, var(--main-border));
  background: color-mix(in srgb, var(--PrimaryColor) 7%, var(--surface-1));
}
.avatar {
  display: grid;
  width: 44px;
  height: 44px;
  place-items: center;
  overflow: hidden;
  border-radius: 14px;
  color: var(--PrimaryColor);
  background: color-mix(in srgb, var(--PrimaryColor) 12%, var(--surface-1));
  font-size: 0.78rem;
  font-weight: 900;
}
.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.employee-copy {
  display: flex;
  min-width: 0;
  flex-direction: column;
}
.employee-copy strong,
.employee-copy small {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.employee-copy strong {
  color: var(--text-strong);
  font-size: 0.88rem;
}
.employee-copy small,
.attendance-control small {
  color: var(--text-soft);
  font-size: 0.7rem;
}
.attendance-control {
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 4px;
}
.employee-skeleton {
  height: 72px;
  border-radius: 15px;
  background: color-mix(in srgb, var(--PrimaryColor) 9%, var(--surface-2));
  animation: pulse 1.2s ease-in-out infinite alternate;
}
.employees-empty {
  gap: 13px;
  margin-top: 20px;
  padding: 18px;
  border: 1px dashed var(--main-border);
  border-radius: 15px;
  background: var(--surface-2);
}
.employees-empty > span {
  display: grid;
  width: 38px;
  height: 38px;
  flex: 0 0 38px;
  place-items: center;
  border-radius: 50%;
  color: var(--PrimaryColor);
  background: color-mix(in srgb, var(--PrimaryColor) 12%, transparent);
  font-weight: 900;
}
.employees-empty div {
  flex: 1;
}
.employees-empty h3 {
  margin: 0 0 3px;
  color: var(--text-strong);
  font-size: 0.95rem;
}
.employees-empty p {
  font-size: 0.78rem;
}
.retry {
  padding: 8px 13px;
}
.employees-error {
  display: block;
  margin-top: 8px;
}
.form-actions {
  padding: 6px 2px 0;
}
.cancel-button {
  padding: 11px 18px;
}
.save-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  min-width: 175px;
}
.save-button:disabled {
  cursor: wait;
  opacity: 0.7;
}
.button-spinner {
  width: 15px;
  height: 15px;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes pulse {
  to {
    opacity: 0.45;
  }
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 760px) {
  .employee-grid {
    grid-template-columns: 1fr;
  }
  .attendance-heading {
    align-items: flex-start;
    flex-direction: column;
  }
  .attendance-actions {
    width: 100%;
    justify-content: space-between;
  }
}

@media (max-width: 520px) {
  .schedule-grid {
    grid-template-columns: 1fr;
  }
  .heading-row {
    align-items: flex-start;
  }
  .today-badge {
    width: 60px;
    height: 68px;
    flex-basis: 60px;
  }
  .today-badge strong {
    font-size: 1.45rem;
  }
  .employee-card {
    grid-template-columns: auto minmax(0, 1fr);
  }
  .attendance-control {
    grid-column: 1 / -1;
    align-items: center;
    flex-direction: row;
    justify-content: flex-end;
  }
}
</style>
