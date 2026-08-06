<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import {
  DataFailed,
  DataLoading,
  DataSuccess,
} from '@/base/core/networkStructure/Resources/dataState/data_state'
import GetTodayTalkParams from '../../../Core/params/TodayTalk/GetTodayTalkParams'
import GetTodayTalkController from '../../controllers/TodayTalk/GetTodayTalkController'
import IndexProjectController from '../../controllers/indexProjectController'
import IndexProjectParams from '../../../Core/params/indexProjectParams'
import UpdatedCustomInputSelect from '@/shared/FormInputs/UpdatedCustomInputSelect.vue'
import TitleInterface from '@/base/Data/Models/title_interface'
import Dialog from 'primevue/dialog'
import type TodayTalkModel from '../../../Data/models/TodayTalk/TodayTalkModel'

const controller = GetTodayTalkController.getInstance()
const projectController = IndexProjectController.getInstance()
const state = computed(() => controller.state.value)
const talks = computed(() => (state.value instanceof DataSuccess ? (state.value.data ?? []) : []))
const projects = computed(() => projectController.state.value.data ?? [])
const isLoading = computed(() => state.value instanceof DataLoading)
const isFailed = computed(() => state.value instanceof DataFailed)
const projectParams = new IndexProjectParams('', 1, 100, 1)
const assignmentOptions = [
  new TitleInterface({ id: -1, title: 'All talks' }),
  new TitleInterface({ id: 1, title: 'Assigned to project' }),
  new TitleInterface({ id: 0, title: 'Not assigned to project' }),
]
const selectedProject = ref<TitleInterface | null>(null)
const selectedAssignment = ref<TitleInterface | null>(assignmentOptions[0] ?? null)
const selectedTalk = ref<TodayTalkModel | null>(null)
const talkDialogVisible = ref(false)

const projectNames = computed(
  () => new Map(projects.value.map((project) => [Number(project.id), project.title])),
)

const fetchTalks = async () => {
  const assignmentId = selectedAssignment.value?.id
  const isAssigned = assignmentId === -1 || assignmentId == null ? undefined : assignmentId === 1
  await controller.getTodayTalk(new GetTodayTalkParams(selectedProject.value?.id, isAssigned))
}

const resetFilters = () => {
  selectedProject.value = null
  selectedAssignment.value = assignmentOptions[0] ?? null
}

const setSelectedProject = (value: TitleInterface | TitleInterface[] | null) => {
  selectedProject.value = Array.isArray(value) ? null : value
}

const setSelectedAssignment = (value: TitleInterface | TitleInterface[] | null) => {
  selectedAssignment.value = Array.isArray(value) ? null : value
}

const attendingCount = (employees: { isAttend: boolean }[]) =>
  employees.filter((employee) => employee.isAttend).length

const selectedAttendanceCount = computed(() =>
  selectedTalk.value ? attendingCount(selectedTalk.value.employees) : 0,
)
const selectedAbsentCount = computed(
  () => (selectedTalk.value?.employees.length ?? 0) - selectedAttendanceCount.value,
)
const selectedAttendanceRate = computed(() => {
  const total = selectedTalk.value?.employees.length ?? 0
  return total ? Math.round((selectedAttendanceCount.value / total) * 100) : 0
})

const openTalkDetails = (talk: TodayTalkModel) => {
  selectedTalk.value = talk
  talkDialogVisible.value = true
}

const employeeInitials = (name: string) => {
  const initials = name
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

watch([selectedProject, selectedAssignment], fetchTalks)

onMounted(fetchTalks)
</script>

<template>
  <main class="talks-page">
    <header class="talks-header">
      <div>
        <span class="eyebrow">Daily safety conversations</span>
        <h1>Today Talks</h1>
        <p>Review organization and project briefings, attendance, dates, and times.</p>
      </div>
      <RouterLink to="/organization/today-talks/create" class="btn btn-primary">
        <span aria-hidden="true">+</span> Add today talk
      </RouterLink>
    </header>

    <section class="filters" aria-label="Today talk filters">
      <UpdatedCustomInputSelect
        id="today-talk-project-filter"
        class="filter-select"
        :model-value="selectedProject"
        :controller="projectController"
        :params="projectParams"
        :reload="false"
        label="Project"
        placeholder="All projects"
        @update:model-value="setSelectedProject"
      />
      <UpdatedCustomInputSelect
        id="today-talk-assignment-filter"
        class="filter-select"
        :model-value="selectedAssignment"
        :static-options="assignmentOptions"
        :reload="false"
        label="Assignment"
        placeholder="All talks"
        @update:model-value="setSelectedAssignment"
      />
      <button type="button" class="reset-button" @click="resetFilters">Reset filters</button>
    </section>

    <section v-if="isLoading" class="talk-grid" aria-live="polite">
      <div v-for="index in 6" :key="index" class="talk-card skeleton"></div>
    </section>

    <section v-else-if="talks.length" class="talk-grid">
      <article
        v-for="talk in talks"
        :key="talk.id"
        class="talk-card"
        role="button"
        tabindex="0"
        :aria-label="`View details for talk ${talk.serialName || talk.id}`"
        @click="openTalkDetails(talk)"
        @keydown.enter="openTalkDetails(talk)"
        @keydown.space.prevent="openTalkDetails(talk)"
      >
        <div class="card-topline">
          <span :class="['assignment-badge', { organization: !talk.projectId }]">
            {{
              talk.projectId
                ? projectNames.get(talk.projectId) || `Project #${talk.projectId}`
                : 'Organization'
            }}
          </span>
          <span>{{ formatDate(talk.date) }} · {{ talk.time || 'No time' }}</span>
        </div>
        <p class="talk-content">{{ talk.content }}</p>
        <footer>
          <div>
            <strong>{{ attendingCount(talk.employees) }}</strong>
            <span>of {{ talk.employees.length }} attended</span>
          </div>
          <div class="employee-dots" :aria-label="`${talk.employees.length} employees`">
            <i
              v-for="employee in talk.employees.slice(0, 8)"
              :key="employee.id || employee.organizationEmployeeId"
              :class="{ attended: employee.isAttend }"
              :title="employee.title || `Employee #${employee.organizationEmployeeId}`"
            ></i>
            <small v-if="talk.employees.length > 8">+{{ talk.employees.length - 8 }}</small>
          </div>
        </footer>
        <span class="view-details">
          View full details
          <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m7 4 6 6-6 6" /></svg>
        </span>
      </article>
    </section>

    <section v-else class="empty-state">
      <span aria-hidden="true">💬</span>
      <h2>{{ isFailed ? 'Today talks could not be loaded' : 'No today talks found' }}</h2>
      <p>
        {{
          isFailed
            ? 'Please retry loading the talks.'
            : 'Change the filters or record a new daily safety conversation.'
        }}
      </p>
      <!-- <button v-if="isFailed" type="button" class="btn btn-primary" @click="fetchTalks">Retry</button> -->
    </section>

    <Dialog
      v-model:visible="talkDialogVisible"
      modal
      dismissable-mask
      class="talk-details-dialog"
      :style="{ width: 'min(58rem, calc(100vw - 24px))' }"
    >
      <template #header>
        <div v-if="selectedTalk" class="dialog-heading">
          <span class="dialog-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M5 4h14v12H9l-4 4V4Z" />
              <path d="M8 8h8M8 12h5" />
            </svg>
          </span>
          <div>
            <span class="dialog-eyebrow">Today talk details</span>
            <h2>Talk {{ selectedTalk.serialName || `#${selectedTalk.id}` }}</h2>
          </div>
        </div>
      </template>

      <div v-if="selectedTalk" class="talk-details">
        <section class="details-hero">
          <div class="details-meta">
            <span :class="['assignment-badge', { organization: !selectedTalk.projectId }]">
              {{
                selectedTalk.projectId
                  ? projectNames.get(selectedTalk.projectId) || `Project #${selectedTalk.projectId}`
                  : 'Organization'
              }}
            </span>
            <span>{{ formatDate(selectedTalk.date) }}</span>
            <i aria-hidden="true"></i>
            <span>{{ selectedTalk.time || 'No time' }}</span>
          </div>
          <p>{{ selectedTalk.content }}</p>
          <div class="talk-identifiers">
            <!-- <span
              ><small>Talk ID</small><strong>#{{ selectedTalk.id }}</strong></span
            > -->
            <span
              ><small>Serial number</small
              ><strong>{{ selectedTalk.serialNumber || '—' }}</strong></span
            >
            <span
              ><small>Created</small
              ><strong>{{ formatDateTime(selectedTalk.createdAt) }}</strong></span
            >
          </div>
        </section>

        <!-- <section class="attendance-overview" aria-label="Attendance summary">
          <div class="attendance-stat total-stat">
            <span>Invited employees</span>
            <strong>{{ selectedTalk.employees.length }}</strong>
          </div>
          <div class="attendance-stat attended-stat">
            <span>Attended</span>
            <strong>{{ selectedAttendanceCount }}</strong>
          </div>
          <div class="attendance-stat absent-stat">
            <span>Absent</span>
            <strong>{{ selectedAbsentCount }}</strong>
          </div>
          <div class="attendance-stat rate-stat">
            <span>Attendance rate</span>
            <strong>{{ selectedAttendanceRate }}%</strong>
          </div>
        </section> -->

        <section class="employee-roster">
          <header>
            <div>
              <span>Attendance roster</span>
              <h3>Employees and attendance</h3>
            </div>
            <span class="roster-count">{{ selectedTalk.employees.length }} employees</span>
          </header>

          <div v-if="selectedTalk.employees.length" class="employee-list">
            <article
              v-for="employee in selectedTalk.employees"
              :key="employee.id || employee.organizationEmployeeId"
              class="employee-row"
            >
              <span :class="['employee-avatar', { attended: employee.isAttend }]">
                {{ employeeInitials(employee.title) }}
              </span>
              <div class="employee-identity">
                <strong>{{
                  employee.title || `Employee #${employee.organizationEmployeeId}`
                }}</strong>
                <span>Employee ID #{{ employee.organizationEmployeeId }}</span>
              </div>
              <div class="attendance-result">
                <span :class="['status-pill', { attended: employee.isAttend }]">
                  <i aria-hidden="true"></i>
                  {{ employee.isAttend ? 'Attended' : 'Absent' }}
                </span>
                <small v-if="employee.isAttend">{{ formatDateTime(employee.attendAt) }}</small>
              </div>
            </article>
          </div>
          <div v-else class="no-employees">No employees were assigned to this talk.</div>
        </section>
      </div>
    </Dialog>
  </main>
</template>

<style scoped lang="scss">
.talks-page {
  display: grid;
  gap: 18px;
  margin: 18px auto 40px;
}
.talks-header,
.filters,
.talk-card,
.empty-state {
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 15%, var(--main-border));
  background: var(--surface-1);
}
.talks-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: clamp(20px, 3vw, 32px);
  border-radius: 24px;
  background:
    radial-gradient(
      circle at 88% 0,
      color-mix(in srgb, var(--PrimaryColor) 18%, transparent),
      transparent 36%
    ),
    var(--surface-1);
}
.eyebrow {
  color: var(--PrimaryColor);
  font-size: 0.7rem;
  font-weight: 900;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
h1 {
  margin: 5px 0 7px;
  color: var(--text-strong);
  font-size: clamp(1.55rem, 3vw, 2.25rem);
}
.talks-header p,
.empty-state p {
  margin: 0;
  color: var(--text-soft);
}
.talks-header .btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
}
.filters {
  display: grid;
  grid-template-columns: repeat(2, minmax(180px, 1fr)) auto;
  align-items: end;
  gap: 14px;
  padding: 18px;
  border-radius: 17px;
}
.filter-select {
  min-width: 0;
}
.reset-button {
  min-height: 41px;
  padding: 8px 14px;
  border: 1px solid var(--main-border);
  border-radius: 10px;
  color: var(--text-strong);
  background: var(--surface-2);
  font-weight: 800;
  cursor: pointer;
}
.talk-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 15px;
}
.talk-card {
  min-height: 220px;
  padding: 19px;
  border-radius: 18px;
  box-shadow: 0 13px 30px color-mix(in srgb, var(--brand-primary-900) 7%, transparent);
  cursor: pointer;
  outline: none;
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}
.talk-card:hover {
  transform: translateY(-3px);
  border-color: color-mix(in srgb, var(--PrimaryColor) 42%, var(--main-border));
  box-shadow: 0 18px 38px color-mix(in srgb, var(--brand-primary-900) 12%, transparent);
}
.talk-card:focus-visible {
  border-color: var(--PrimaryColor);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--PrimaryColor) 14%, transparent);
}
.card-topline,
.talk-card footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.card-topline > span:last-child {
  color: var(--text-soft);
  font-size: 0.7rem;
  text-align: end;
}
.assignment-badge {
  overflow: hidden;
  max-width: 55%;
  padding: 5px 9px;
  border-radius: 999px;
  color: var(--PrimaryColor);
  background: color-mix(in srgb, var(--PrimaryColor) 10%, var(--surface-1));
  font-size: 0.7rem;
  font-weight: 900;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.assignment-badge.organization {
  color: var(--text-soft);
  background: var(--surface-3);
}
.talk-content {
  min-height: 92px;
  margin: 17px 0;
  color: var(--text-strong);
  line-height: 1.65;
  white-space: pre-wrap;
}
.talk-card footer {
  padding-top: 14px;
  border-top: 1px solid var(--main-border);
}
.talk-card footer > div:first-child {
  display: flex;
  align-items: baseline;
  gap: 5px;
}
.talk-card footer strong {
  color: var(--PrimaryColor);
  font-size: 1.25rem;
}
.talk-card footer span {
  color: var(--text-soft);
  font-size: 0.72rem;
}
.employee-dots {
  display: flex;
  align-items: center;
  gap: 4px;
}
.employee-dots i {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: var(--main-border);
}
.employee-dots i.attended {
  background: var(--PrimaryColor);
}
.employee-dots small {
  color: var(--text-soft);
  font-size: 0.68rem;
}
.view-details {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 5px;
  margin-top: 12px;
  color: var(--PrimaryColor);
  font-size: 0.68rem;
  font-weight: 900;
}
.view-details svg {
  width: 15px;
  height: 15px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  transition: transform 0.2s ease;
}
.talk-card:hover .view-details svg {
  transform: translateX(3px);
}
.skeleton {
  border: 0;
  background: color-mix(in srgb, var(--PrimaryColor) 8%, var(--surface-2));
  animation: pulse 1.1s ease-in-out infinite alternate;
}
.empty-state {
  padding: 60px 20px;
  border-radius: 20px;
  text-align: center;
}
.empty-state > span {
  font-size: 2rem;
}
.empty-state h2 {
  margin: 12px 0 7px;
  color: var(--text-strong);
}
.empty-state .btn {
  margin-top: 17px;
}

:deep(.talk-details-dialog) {
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 18%, var(--main-border));
  border-radius: 24px;
  background: var(--surface-1);
  box-shadow: 0 28px 80px color-mix(in srgb, var(--brand-primary-900) 24%, transparent);
}
:deep(.talk-details-dialog .p-dialog-header) {
  padding: 20px 22px;
  border-bottom: 1px solid var(--main-border);
  background:
    radial-gradient(
      circle at 88% 0,
      color-mix(in srgb, var(--PrimaryColor) 20%, transparent),
      transparent 46%
    ),
    var(--surface-1);
}
:deep(.talk-details-dialog .p-dialog-content) {
  padding: 0;
  background: var(--surface-2);
}
:deep(.talk-details-dialog .p-dialog-close-button) {
  border-radius: 10px;
  color: var(--text-strong);
  background: var(--surface-2);
}
.dialog-heading {
  display: flex;
  align-items: center;
  gap: 12px;
}
.dialog-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  flex: 0 0 44px;
  border-radius: 14px;
  color: var(--text-on-brand);
  background: linear-gradient(145deg, var(--PrimaryColor), var(--brand-primary-700));
  box-shadow: 0 9px 20px color-mix(in srgb, var(--PrimaryColor) 24%, transparent);
}
.dialog-icon svg {
  width: 24px;
  height: 24px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.7;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.dialog-eyebrow {
  color: var(--PrimaryColor);
  font-size: 0.65rem;
  font-weight: 900;
  letter-spacing: 0.09em;
  text-transform: uppercase;
}
.dialog-heading h2 {
  margin: 3px 0 0;
  color: var(--text-strong);
  font-size: 1.2rem;
}
.talk-details {
  display: grid;
  gap: 14px;
  max-height: min(75vh, 760px);
  padding: 18px;
  overflow-y: auto;
}
.details-hero,
.attendance-overview,
.employee-roster {
  border: 1px solid var(--main-border);
  border-radius: 18px;
  background: var(--surface-1);
}
.details-hero {
  position: relative;
  overflow: hidden;
  padding: 20px;
  background:
    radial-gradient(
      circle at 100% 0,
      color-mix(in srgb, var(--PrimaryColor) 10%, transparent),
      transparent 38%
    ),
    var(--surface-1);
}
.details-hero::before {
  content: '';
  position: absolute;
  inset-block: 0;
  inset-inline-start: 0;
  width: 4px;
  background: linear-gradient(180deg, var(--PrimaryColor), var(--brand-accent-500));
}
.details-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  color: var(--text-soft);
  font-size: 0.72rem;
}
.details-meta i {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--main-border);
}
.details-hero > p {
  margin: 17px 0 20px;
  color: var(--text-strong);
  font-size: 0.95rem;
  line-height: 1.75;
  white-space: pre-wrap;
}
.talk-identifiers {
  display: grid;
  grid-template-columns: 0.7fr 1fr 1.4fr;
  gap: 9px;
}
.talk-identifiers > span {
  display: grid;
  gap: 3px;
  padding: 10px 12px;
  border-radius: 11px;
  background: var(--surface-2);
}
.talk-identifiers small {
  color: var(--text-soft);
  font-size: 0.61rem;
  font-weight: 700;
}
.talk-identifiers strong {
  overflow: hidden;
  color: var(--text-strong);
  font-size: 0.72rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.attendance-overview {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  overflow: hidden;
}
.attendance-stat {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 76px;
  gap: 8px;
  padding: 14px 16px;
  border-inline-end: 1px solid var(--main-border);
}
.attendance-stat:last-child {
  border-inline-end: 0;
}
.attendance-stat::after {
  content: '';
  position: absolute;
  inset-inline: 15px;
  inset-block-end: 0;
  height: 3px;
  border-radius: 999px 999px 0 0;
  background: var(--PrimaryColor);
}
.attendance-stat span {
  color: var(--text-soft);
  font-size: 0.67rem;
  font-weight: 750;
}
.attendance-stat strong {
  color: var(--text-strong);
  font-size: 1.35rem;
}
.attended-stat::after {
  background: var(--status-success);
}
.attended-stat strong {
  color: var(--status-success);
}
.absent-stat::after {
  background: var(--status-danger);
}
.absent-stat strong {
  color: var(--status-danger);
}
.rate-stat::after {
  background: var(--brand-accent-500);
}
.employee-roster {
  overflow: hidden;
}
.employee-roster > header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 17px 18px;
  border-bottom: 1px solid var(--main-border);
  background: color-mix(in srgb, var(--PrimaryColor) 3%, var(--surface-1));
}
.employee-roster header > div {
  display: grid;
  gap: 2px;
}
.employee-roster header > div > span {
  color: var(--PrimaryColor);
  font-size: 0.61rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.employee-roster h3 {
  margin: 0;
  color: var(--text-strong);
  font-size: 0.95rem;
}
.roster-count {
  padding: 6px 10px;
  border-radius: 999px;
  color: var(--PrimaryColor);
  background: color-mix(in srgb, var(--PrimaryColor) 9%, var(--surface-1));
  font-size: 0.65rem;
  font-weight: 850;
}
.employee-list {
  display: grid;
  max-height: 330px;
  overflow-y: auto;
}
.employee-row {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 11px;
  padding: 12px 17px;
  border-bottom: 1px solid color-mix(in srgb, var(--main-border) 72%, transparent);
}
.employee-row:last-child {
  border-bottom: 0;
}
.employee-row:hover {
  background: color-mix(in srgb, var(--PrimaryColor) 3%, var(--surface-1));
}
.employee-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border: 1px solid var(--main-border);
  border-radius: 12px;
  color: var(--text-soft);
  background: var(--surface-2);
  font-size: 0.7rem;
  font-weight: 900;
  text-transform: uppercase;
}
.employee-avatar.attended {
  border-color: color-mix(in srgb, var(--status-success) 25%, var(--main-border));
  color: var(--status-success);
  background: var(--status-success-soft);
}
.employee-identity {
  display: grid;
  min-width: 0;
  gap: 3px;
}
.employee-identity strong {
  overflow: hidden;
  color: var(--text-strong);
  font-size: 0.76rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.employee-identity span {
  color: var(--text-soft);
  font-size: 0.62rem;
}
.attendance-result {
  display: grid;
  justify-items: end;
  gap: 4px;
}
.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 8px;
  border-radius: 999px;
  color: var(--status-danger);
  background: var(--status-danger-soft);
  font-size: 0.62rem;
  font-weight: 900;
}
.status-pill i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}
.status-pill.attended {
  color: var(--status-success);
  background: var(--status-success-soft);
}
.attendance-result small {
  color: var(--text-soft);
  font-size: 0.57rem;
}
.no-employees {
  padding: 30px 18px;
  color: var(--text-soft);
  text-align: center;
}
@keyframes pulse {
  to {
    opacity: 0.45;
  }
}
@media (max-width: 1050px) {
  .talk-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 700px) {
  .talks-header {
    align-items: flex-start;
    flex-direction: column;
  }
  .filters {
    grid-template-columns: 1fr;
  }
  .talk-grid {
    grid-template-columns: 1fr;
  }
  .talk-details {
    padding: 12px;
  }
  .talk-identifiers {
    grid-template-columns: 1fr;
  }
  .attendance-overview {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .attendance-stat:nth-child(2) {
    border-inline-end: 0;
  }
  .attendance-stat:nth-child(-n + 2) {
    border-bottom: 1px solid var(--main-border);
  }
  .employee-row {
    grid-template-columns: auto minmax(0, 1fr);
  }
  .attendance-result {
    grid-column: 2;
    justify-items: start;
  }
}
</style>
