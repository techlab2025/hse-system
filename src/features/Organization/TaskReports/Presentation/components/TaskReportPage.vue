<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import Popover from 'primevue/popover'
import { debounce } from '@/base/Presentation/utils/debouced'
import { DataSuccess } from '@/base/core/networkStructure/Resources/dataState/data_state'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import DataEmpty from '@/shared/DataStatues/DataEmpty.vue'
import DataFailed from '@/shared/DataStatues/DataFailed.vue'
import TableLoader from '@/shared/DataStatues/TableLoader.vue'
import Pagination from '@/shared/HelpersComponents/Pagination.vue'
import PermissionBuilder from '@/shared/HelpersComponents/PermissionBuilder.vue'
import Search from '@/shared/icons/Search.vue'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
import { Observation } from '@/features/Organization/ObservationFactory/Core/Enums/ObservationTypeEnum'
import ReportFilterDialog from '../subComponents/ReportFilterDialog.vue'
import ExportReportPdf from '../subComponents/ExportReportPdf.vue'
import FetchTaskReportParams from '../../Core/params/FetchTaskReportParams'
import CorrectiveTasksController from '../controllers/CorrectiveTasksController'
import PreventiveTasksController from '../controllers/PreventiveTasksController'
import { InvestegationTaskEnum } from '@/features/Organization/Capa/Core/Core/InvestegationTaskEnum'

type ReportType = 'corrective' | 'preventive'
type StatusFilterValue = string | number | { id?: string | number }

type TaskEmployee = {
  name?: string
}

type TaskReportItem = {
  id?: number | string
  status?: number
  reason?: string | null
  description?: string
  title?: string
  due_date?: string
  dueDate?: string
  date?: string
  createdAt?: string
  responablePerson?: {
    title?: string
  }
  ResponsablePerson?: TaskEmployee
  responsiblePersonName?: string
  assignedTo?: TaskEmployee
  assignedToName?: string
  investigation_task_employees?: Array<{
    follow_up_employee?: TaskEmployee
    employee?: TaskEmployee
  }>
  investigationTaskEmployees?: Array<{
    follow_up_employee?: TaskEmployee
    employee?: TaskEmployee
  }>
  project?: {
    id?: number
    serial_name?: string
    title?: string
  }
  observation?: {
    id?: number
    type?: number | string
    serialName?: string
    serial?: string | number
  }
  investigation?: {
    investigationId?: number
    serialName?: string
  } | null
  investigation_id?: number | string | null
}

type RelatedLink = {
  label: string
  text: string
  to: string
  mark: string
  className?: string
}

const props = defineProps<{ type: ReportType }>()
const { t } = useI18n({ useScope: 'global' })

const controller =
  props.type === 'corrective'
    ? CorrectiveTasksController.getInstance()
    : PreventiveTasksController.getInstance()

const state = ref(controller.state.value)
const word = ref('')
const currentPage = ref(1)
const countPerPage = ref(10)
const isFilterDialogVisible = ref(false)
const selectedStatusFilter = ref<StatusFilterValue>('all')
const selectedFromDate = ref('')
const selectedToDate = ref('')
const statusReasonPopover = ref<{ show: (event: Event) => void; hide: () => void } | null>(null)
const selectedStatusReason = ref('')
let statusReasonHideTimer: number | undefined

const content = computed(() =>
  props.type === 'corrective'
    ? {
        eyebrow: t('report_corrective_eyebrow'),
        title: t('report_corrective_title'),
        description: t('report_corrective_description'),
        emptyTitle: t('report_corrective_empty_title'),
        emptyDescription: t('report_corrective_empty_description'),
      }
    : {
        eyebrow: t('report_preventive_eyebrow'),
        title: t('report_preventive_title'),
        description: t('report_preventive_description'),
        emptyTitle: t('report_preventive_empty_title'),
        emptyDescription: t('report_preventive_empty_description'),
      },
)

const tasks = computed<TaskReportItem[]>(() =>
  state.value instanceof DataSuccess
    ? ((state.value.data ?? []) as unknown as TaskReportItem[])
    : [],
)

const taskStatusOptions = computed(() => [
  { title: t('all'), id: -1 },
  { title: t('task_status_not_started'), id: InvestegationTaskEnum.NotStarted },
  { title: t('task_status_in_progress'), id: InvestegationTaskEnum.InProgress },
  { title: t('task_status_pending'), id: InvestegationTaskEnum.PendingOnHold },
  { title: t('task_status_overdue'), id: InvestegationTaskEnum.Overdue },
  { title: t('task_status_completed'), id: InvestegationTaskEnum.Completed },
  { title: t('task_status_cancelled'), id: InvestegationTaskEnum.Cancelled },
])

const normalizeStatusFilter = (status: StatusFilterValue): number | null => {
  const rawValue = typeof status === 'object' ? status?.id : status

  if (rawValue === 'all' || rawValue === '' || rawValue === null || rawValue === undefined) {
    return null
  }

  const numericValue = Number(rawValue)
  return Number.isFinite(numericValue) && numericValue !== -1 ? numericValue : null
}

const parseDateValue = (value?: string | null) => {
  if (!value) return null

  const trimmed = String(value).trim()
  if (!trimmed) return null

  const direct = new Date(trimmed)
  if (!Number.isNaN(direct.getTime())) return direct

  const normalized = trimmed.split('/').reverse().join('-')
  const fallback = new Date(normalized)
  return Number.isNaN(fallback.getTime()) ? null : fallback
}

const matchesFilters = (task: TaskReportItem) => {
  const selectedStatus = normalizeStatusFilter(selectedStatusFilter.value)

  if (selectedStatus !== null && Number(task.status) !== selectedStatus) {
    return false
  }

  const taskDate = parseDateValue(task.dueDate || task.due_date || task.date || task.createdAt)
  const fromDate = parseDateValue(selectedFromDate.value)
  const toDate = parseDateValue(selectedToDate.value)

  if (fromDate && taskDate && taskDate < fromDate) return false

  if (toDate && taskDate) {
    const endOfDay = new Date(toDate)
    endOfDay.setHours(23, 59, 59, 999)
    if (taskDate > endOfDay) return false
  }

  return true
}

const visibleTasks = computed(() => tasks.value.filter(matchesFilters))

const fetchReport = async (
  query: string = word.value,
  page: number = currentPage.value,
  limit: number = countPerPage.value,
  status: StatusFilterValue = selectedStatusFilter.value,
  fromDate: string = selectedFromDate.value,
  toDate: string = selectedToDate.value,
) => {
  await controller.fetch(
    new FetchTaskReportParams(
      query,
      page,
      limit,
      1,
      normalizeStatusFilter(status),
      fromDate,
      toDate,
    ),
  )
}

const searchReport = debounce(() => {
  currentPage.value = 1
  fetchReport(word.value, 1)
})

const clearSearch = () => {
  word.value = ''
  currentPage.value = 1
  fetchReport('', 1)
}

const handleChangePage = (page: number) => {
  currentPage.value = page
  fetchReport(word.value, page)
}

const handleCountPerPage = (count: number) => {
  countPerPage.value = count
  currentPage.value = 1
  fetchReport(word.value, 1, count)
}

const openFilterDialog = () => {
  isFilterDialogVisible.value = true
}

const applyFilters = ({
  status,
  fromDate,
  toDate,
}: {
  status: StatusFilterValue
  fromDate: string
  toDate: string
}) => {
  selectedStatusFilter.value = status
  selectedFromDate.value = fromDate
  selectedToDate.value = toDate
  currentPage.value = 1
  fetchReport(word.value, 1, countPerPage.value, status, fromDate, toDate)
}

const resetFilters = () => {
  selectedStatusFilter.value = 'all'
  selectedFromDate.value = ''
  selectedToDate.value = ''
  currentPage.value = 1
  fetchReport(word.value, 1, countPerPage.value, 'all', '', '')
}

const getTaskTitle = (task: TaskReportItem) => task.description || task.title || t('task_untitled')

const getDueDate = (task: TaskReportItem) => task.date || task.due_date || task.dueDate || 'N/A'

const getResponsiblePerson = (task: TaskReportItem) =>
  task.investigation_task_employees?.[0]?.follow_up_employee?.name ||
  task.investigationTaskEmployees?.[0]?.follow_up_employee?.name ||
  task.responablePerson?.title ||
  task.ResponsablePerson?.name ||
  task.responsiblePersonName ||
  'N/A'

const getAssignedTo = (task: TaskReportItem) =>
  task.investigation_task_employees?.[0]?.employee?.name ||
  task.investigationTaskEmployees?.[0]?.employee?.name ||
  task.assignedTo?.name ||
  task.assignedToName ||
  'N/A'

const getTaskStatus = (task: TaskReportItem) => {
  const status = Number(task.status)
  const validStatuses = [
    InvestegationTaskEnum.NotStarted,
    InvestegationTaskEnum.InProgress,
    InvestegationTaskEnum.PendingOnHold,
    InvestegationTaskEnum.Overdue,
    InvestegationTaskEnum.Completed,
    InvestegationTaskEnum.Cancelled,
  ]

  return validStatuses.includes(status) ? status : InvestegationTaskEnum.NotStarted
}

const getTaskStatusLabel = (task: TaskReportItem) => {
  const status = getTaskStatus(task)
  return (
    taskStatusOptions.value.find((option) => option.id === status)?.title ||
    t('task_status_not_started')
  )
}

const getTaskReason = (task: TaskReportItem) => String(task.reason ?? '').trim()

const clearStatusReasonHideTimer = () => {
  if (statusReasonHideTimer === undefined) return
  window.clearTimeout(statusReasonHideTimer)
  statusReasonHideTimer = undefined
}

const openStatusReason = (event: Event, task: TaskReportItem) => {
  const reason = getTaskReason(task)
  if (!reason) return

  clearStatusReasonHideTimer()
  selectedStatusReason.value = reason
  statusReasonPopover.value?.show(event)
}

const closeStatusReason = () => {
  clearStatusReasonHideTimer()
  statusReasonPopover.value?.hide()
}

const scheduleStatusReasonClose = () => {
  clearStatusReasonHideTimer()
  statusReasonHideTimer = window.setTimeout(() => {
    statusReasonPopover.value?.hide()
    statusReasonHideTimer = undefined
  }, 180)
}

onBeforeUnmount(clearStatusReasonHideTimer)

const getRowNumber = (index: number) => (currentPage.value - 1) * countPerPage.value + index + 1

const observationTypeLabel = (observationType: number) => {
  if (observationType === Observation.AccidentsType) return t('report_incident')
  if (observationType === Observation.HazardType) return t('report_hazard')
  return t('report_observation')
}

const observationLink = (id: number, observationType: number) =>
  observationType === Observation.AccidentsType
    ? `/organization/equipment-mangement/incedant/show/${id}`
    : `/organization/equipment-mangement/observation/show/${id}`

const buildRelatedLinks = (task: TaskReportItem): RelatedLink[] => {
  const links: RelatedLink[] = []

  if (task.project?.id) {
    links.push({
      label: t('report_project'),
      text: task.project.serial_name || task.project.title || 'N/A',
      to: `/organization/project-details/${task.project.id}`,
      mark: 'P',
    })
  }

  if (task.observation?.id) {
    links.push({
      label: observationTypeLabel(Number(task.observation.type)),
      text: String(task.observation.serialName || task.observation.serial || 'N/A'),
      to: observationLink(task.observation.id, Number(task.observation.type)),
      mark: 'O',
      className: 'observation-link',
    })
  }

  if (task.investigation?.investigationId) {
    links.push({
      label: t('report_investigation'),
      text: task.investigation.serialName || `#${task.investigation_id ?? ''}`,
      to: `/organization/Investigating-result-answer/${task.investigation.investigationId}`,
      mark: 'I',
      className: 'investigation-link',
    })
  }

  return links
}

watch(
  () => controller.state.value,
  (newState) => {
    state.value = newState
  },
  { deep: true },
)

onMounted(() => fetchReport())
</script>

<template>
  <main class="task-report-page investegation-result-answer-container" :class="`report-${type}`">
    <section class="report-hero">
      <span class="report-orb report-orb-one" aria-hidden="true"></span>
      <span class="report-orb report-orb-two" aria-hidden="true"></span>

      <div class="hero-copy">
        <!-- <span class="report-eyebrow">{{ content.eyebrow }}</span> -->
        <h1>{{ content.title }}</h1>
        <p>{{ $t('report_register_description') }}</p>
        <!-- <p>{{ content.description }}</p> -->
      </div>

      <div class="hero-mark" aria-hidden="true">
        <svg viewBox="0 0 64 64" fill="none">
          <path
            d="M17 33 27 43 48 21"
            stroke="currentColor"
            stroke-width="5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M32 7a25 25 0 1 0 25 25"
            stroke="currentColor"
            stroke-width="3"
            stroke-linecap="round"
          />
        </svg>
      </div>
    </section>

    <header class="report-board-header">
      <div>
        <!-- <span class="report-eyebrow">{{ $t('report_action_register') }}</span> -->
        <!-- <h2>{{ content.title }}</h2> -->
      </div>

      <div class="report-actions">
        <button
          type="button"
          class="report-action-btn report-action-btn--ghost"
          @click="openFilterDialog"
        >
          {{ $t('Filter') }}
        </button>

        <ExportReportPdf
          target-selector=".report-board"
          :file-name="`${props.type}-report`"
          :data="visibleTasks"
        />

        <label class="report-search">
          <Search aria-hidden="true" />
          <input
            v-model="word"
            type="search"
            :placeholder="$t('report_search_actions')"
            @input="searchReport"
          />
          <button
            v-if="word"
            type="button"
            :aria-label="$t('report_clear_search')"
            @click="clearSearch"
          >
            ×
          </button>
        </label>
      </div>
    </header>

    <ReportFilterDialog
      v-model="isFilterDialogVisible"
      :status-options="taskStatusOptions"
      :initial-status="selectedStatusFilter"
      :initial-from-date="selectedFromDate"
      :initial-to-date="selectedToDate"
      :title="$t('Filter')"
      :subtitle="$t('report_register_description')"
      @apply="applyFilters"
      @reset="resetFilters"
    />

    <PermissionBuilder :code="[PermissionsEnum.ADMIN, PermissionsEnum.ORGANIZATION_EMPLOYEE]">
      <DataStatus :controller="state">
        <template #success>
          <section v-if="visibleTasks.length" class="report-board">
            <div class="report-table-scroll">
              <table class="report-table">
                <thead>
                  <tr>
                    <th class="number-column">#</th>
                    <th>{{ $t('task') }}</th>
                    <th>{{ $t('task_status') }}</th>
                    <th>{{ $t('task_due_date') }}</th>
                    <th>{{ $t('task_responsible') }}</th>
                    <th>{{ $t('assigned_to') }}</th>
                    <th>{{ $t('lessons_related_records') }}</th>
                  </tr>
                </thead>

                <tbody>
                  <tr v-for="(task, index) in visibleTasks" :key="task.id ?? index">
                    <td class="number-cell">
                      <span>{{ getRowNumber(index) }}</span>
                    </td>

                    <td class="task-cell">
                      <div class="task-main-data">
                        <strong>{{ getTaskTitle(task) }}</strong>
                        <small v-if="task.id">#{{ task.id }}</small>
                      </div>
                    </td>

                    <td>
                      <span
                        class="task-status-pill"
                        :class="[
                          `status-${getTaskStatus(task)}`,
                          { 'has-reason': getTaskReason(task) },
                        ]"
                        :tabindex="getTaskReason(task) ? 0 : undefined"
                        :aria-haspopup="getTaskReason(task) ? 'dialog' : undefined"
                        @mouseenter="openStatusReason($event, task)"
                        @mouseleave="scheduleStatusReasonClose"
                        @focus="openStatusReason($event, task)"
                        @blur="scheduleStatusReasonClose"
                        @click="openStatusReason($event, task)"
                        @keydown.esc="closeStatusReason"
                      >
                        {{ getTaskStatusLabel(task) }}
                        <span v-if="getTaskReason(task)" class="task-reason-indicator" aria-hidden="true">
                          i
                        </span>
                      </span>
                    </td>

                    <td>
                      <span class="table-value table-date">{{ getDueDate(task) }}</span>
                    </td>

                    <td>
                      <span class="person-value">{{ getResponsiblePerson(task) }}</span>
                    </td>

                    <td>
                      <span class="person-value">{{ getAssignedTo(task) }}</span>
                    </td>

                    <td class="related-cell">
                      <div
                        v-if="buildRelatedLinks(task).length"
                        class="table-related-links"
                        :aria-label="$t('lessons_related_records')"
                      >
                        <RouterLink
                          v-for="link in buildRelatedLinks(task)"
                          :key="`${link.to}-${link.mark}`"
                          class="table-related-link"
                          :class="link.className"
                          :to="link.to"
                          :title="`${link.label}: ${link.text}`"
                        >
                          <span class="table-related-mark" aria-hidden="true">
                            {{ link.mark }}
                          </span>
                          <span class="table-related-copy">
                            <small>{{ link.label }}</small>
                            <strong>{{ link.text }}</strong>
                          </span>
                        </RouterLink>
                      </div>

                      <span v-else class="empty-value">—</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <DataEmpty
            v-else
            :title="content.emptyTitle"
            :description="content.emptyDescription"
            :withbtn="false"
          />

          <Popover ref="statusReasonPopover">
            <div
              class="task-reason-popover"
              role="tooltip"
              @mouseenter="clearStatusReasonHideTimer"
              @mouseleave="closeStatusReason"
            >
              <span class="task-reason-popover-label">{{ $t('task_reason') }}</span>
              <p>{{ selectedStatusReason }}</p>
            </div>
          </Popover>

          <Pagination
            v-if="visibleTasks.length"
            :pagination="state.pagination"
            @change-page="handleChangePage"
            @count-per-page="handleCountPerPage"
          />
        </template>

        <template #loader>
          <section class="report-loading">
            <TableLoader :cols="7" :rows="6" />
          </section>
        </template>

        <template #initial>
          <section class="report-loading">
            <TableLoader :cols="7" :rows="6" />
          </section>
        </template>

        <template #empty>
          <DataEmpty
            :title="content.emptyTitle"
            :description="content.emptyDescription"
            :withbtn="false"
          />
        </template>

        <template #failed>
          <DataFailed
            :title="$t('report_load_failed_title')"
            :description="$t('report_load_failed_description')"
            :withbtn="false"
          />
        </template>
      </DataStatus>

      <template #notPermitted>
        <DataFailed
          :title="$t('report_permission_required')"
          :description="$t('report_permission_description')"
          :withbtn="false"
        />
      </template>
    </PermissionBuilder>
  </main>
</template>

<style scoped lang="scss">
.task-report-page {
  --report-tone: var(--identity-primary);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  padding: clamp(0.75rem, 2vw, 1.5rem);
}

.task-report-page.report-preventive {
  --report-tone: var(--identity-accent);
}

.task-report-page > :deep(div) {
  width: 100%;
}

.report-hero,
.report-board,
.report-loading {
  width: 100%;
  border: 1px solid color-mix(in srgb, var(--report-tone) 18%, var(--main-border));
  border-radius: 24px;
  background: var(--surface-1);
  box-shadow: 0 22px 52px color-mix(in srgb, var(--shadow-color) 38%, transparent);
}

.report-hero {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 190px;
  padding: clamp(1.4rem, 4vw, 2.6rem);
  background:
    radial-gradient(
      circle at 92% 20%,
      color-mix(in srgb, var(--report-tone) 18%, transparent),
      transparent 30%
    ),
    linear-gradient(
      135deg,
      color-mix(in srgb, var(--report-tone) 8%, var(--surface-1)),
      var(--surface-1)
    );
}

.report-orb {
  position: absolute;
  z-index: -1;
  border: 1px solid color-mix(in srgb, var(--report-tone) 16%, transparent);
  border-radius: 50%;
}

.report-orb-one {
  inset-block-start: -110px;
  inset-inline-end: 8%;
  width: 250px;
  height: 250px;
}

.report-orb-two {
  inset-block-end: -90px;
  inset-inline-end: 23%;
  width: 170px;
  height: 170px;
}

.hero-copy {
  max-width: 760px;
}

.report-eyebrow {
  color: var(--report-tone);
  font-size: 0.72rem;
  font-weight: 900;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.hero-copy h1,
.report-board-header h2 {
  margin: 0.35rem 0 0;
  color: var(--text-strong);
  font-weight: 900;
  line-height: 1.15;
}

.hero-copy h1 {
  font-size: clamp(1.75rem, 3vw, 2.7rem);
  letter-spacing: -0.035em;
}

.hero-copy p,
.report-board-header p {
  margin: 0.65rem 0 0;
  color: var(--text-soft);
  line-height: 1.7;
}

.hero-mark {
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  width: clamp(74px, 10vw, 112px);
  height: clamp(74px, 10vw, 112px);
  border: 1px solid color-mix(in srgb, var(--report-tone) 25%, transparent);
  border-radius: 28px;
  background: color-mix(in srgb, var(--report-tone) 10%, var(--surface-1));
  color: var(--report-tone);
  transform: rotate(4deg);
}

.hero-mark svg {
  width: 58%;
}

.report-board-header {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(270px, 520px);
  align-items: center;
  gap: 1rem;
  width: 100%;
  padding-bottom: 1rem;
  border-bottom: 1px dashed color-mix(in srgb, var(--report-tone) 24%, var(--main-border));
}

.report-board-header h2 {
  font-size: 1.25rem;
}

.report-board-header p {
  font-size: 0.86rem;
}

.report-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  gap: 0.65rem;
}

.report-action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 46px;
  border: 0;
  border-radius: 14px;
  padding: 0.7rem 1rem;
  cursor: pointer;
  font-weight: 800;
}

.report-action-btn--ghost {
  background: color-mix(in srgb, var(--main-border) 68%, transparent);
  color: var(--text-strong);
}

.report-search {
  position: relative;
  display: flex;
  align-items: center;
  min-width: min(100%, 250px);
  flex: 1;
}

.report-search > svg {
  position: absolute;
  inset-inline-start: 0.9rem;
  z-index: 1;
  width: 20px;
  color: var(--report-tone);
  left: 100%;
  transform: translateX(-150%);
}

.report-search input {
  width: 100%;
  min-height: 48px;
  padding-block: 0.75rem;
  padding-inline: 2.8rem;
  border: 1px solid var(--main-border);
  border-radius: 14px;
  background: var(--surface-2);
  color: var(--text-strong);
  outline: none;
  transition: 0.2s ease;
}

.report-search input:focus {
  border-color: var(--report-tone);
  background: var(--surface-1);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--report-tone) 12%, transparent);
}

.report-search button {
  position: absolute;
  inset-inline-end: 0.7rem;
  width: 28px;
  height: 28px;
  border: 0;
  border-radius: 9px;
  background: color-mix(in srgb, var(--report-tone) 10%, transparent);
  color: var(--report-tone);
  cursor: pointer;
  font-size: 1.2rem;
}

.report-board {
  overflow: hidden;
  margin-top: 0.25rem;
}

.report-table-scroll {
  width: 100%;
  overflow-x: auto;
  overscroll-behavior-inline: contain;
}

.report-table {
  width: 100%;
  min-width: 1120px;
  border-collapse: separate;
  border-spacing: 0;
  color: var(--text-strong);
}

.report-table th,
.report-table td {
  padding: 1rem;
  border-bottom: 1px solid color-mix(in srgb, var(--main-border) 82%, transparent);
  text-align: start;
  vertical-align: middle;
}

.report-table th {
  position: sticky;
  inset-block-start: 0;
  z-index: 2;
  background: color-mix(in srgb, var(--report-tone) 8%, var(--surface-1));
  color: var(--text-muted);
  font-size: 0.72rem;
  font-weight: 900;
  letter-spacing: 0.045em;
  text-transform: uppercase;
  white-space: nowrap;
}

.report-table tbody tr {
  background: var(--surface-1);
  transition:
    background 0.2s ease,
    box-shadow 0.2s ease;
}

.report-table tbody tr:hover {
  background: color-mix(in srgb, var(--report-tone) 4%, var(--surface-1));
  box-shadow: inset 4px 0 0 var(--report-tone);
}

[dir='rtl'] .report-table tbody tr:hover {
  box-shadow: inset -4px 0 0 var(--report-tone);
}

.report-table tbody tr:last-child td {
  border-bottom: 0;
}

.number-column,
.number-cell {
  width: 64px;
  text-align: center !important;
}

.number-cell span {
  display: inline-grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: color-mix(in srgb, var(--report-tone) 10%, var(--surface-1));
  color: var(--report-tone);
  font-size: 0.78rem;
  font-weight: 900;
}

.task-cell {
  min-width: 280px;
  max-width: 380px;
}

.task-main-data {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 0.3rem;
}

.task-main-data strong {
  display: -webkit-box;
  overflow: hidden;
  color: var(--text-strong);
  font-size: 0.9rem;
  font-weight: 900;
  line-height: 1.55;
  overflow-wrap: anywhere;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
}

.task-main-data small {
  color: var(--text-muted);
  font-size: 0.7rem;
  font-weight: 800;
}

.table-value,
.person-value {
  display: inline-block;
  max-width: 190px;
  overflow: hidden;
  color: var(--text-strong);
  font-size: 0.82rem;
  font-weight: 800;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.table-date {
  direction: ltr;
  unicode-bidi: plaintext;
}

.task-status-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 112px;
  border: 1px solid transparent;
  border-radius: 999px;
  padding: 0.42rem 0.75rem;
  font-size: 0.72rem;
  font-weight: 900;
  white-space: nowrap;
}

.task-status-pill.has-reason {
  gap: 0.45rem;
  cursor: help;
  outline: none;
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease;
}

.task-status-pill.has-reason:hover,
.task-status-pill.has-reason:focus-visible {
  transform: translateY(-1px);
  box-shadow: 0 7px 18px color-mix(in srgb, currentColor 13%, transparent);
}

.task-reason-indicator {
  display: inline-grid;
  place-items: center;
  width: 17px;
  height: 17px;
  flex: 0 0 auto;
  border: 1px solid color-mix(in srgb, currentColor 30%, transparent);
  border-radius: 50%;
  background: color-mix(in srgb, currentColor 9%, transparent);
  font-family: serif;
  font-size: 0.68rem;
  font-weight: 900;
  line-height: 1;
}

.task-reason-popover {
  width: min(320px, calc(100vw - 48px));
  padding: 0.15rem;
}

.task-reason-popover-label {
  display: block;
  margin-bottom: 0.35rem;
  color: var(--report-tone);
  font-size: 0.68rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.task-reason-popover p {
  margin: 0;
  color: var(--text-strong);
  font-size: 0.82rem;
  font-weight: 700;
  line-height: 1.55;
  overflow-wrap: anywhere;
}

.task-status-pill.status-1 {
  border-color: color-mix(in srgb, var(--brand-primary-600) 18%, transparent);
  background: var(--brand-primary-50);
  color: var(--brand-primary-600);
}

.task-status-pill.status-2 {
  border-color: color-mix(in srgb, var(--report-tone) 20%, transparent);
  background: color-mix(in srgb, var(--report-tone) 12%, var(--surface-1));
  color: var(--report-tone);
}

.task-status-pill.status-3,
.task-status-pill.status-4 {
  border-color: color-mix(in srgb, var(--status-danger) 18%, transparent);
  background: var(--status-danger-soft);
  color: var(--status-danger);
}

.task-status-pill.status-5 {
  border-color: color-mix(in srgb, var(--status-success) 18%, transparent);
  background: var(--status-success-soft);
  color: var(--status-success);
}

.task-status-pill.status-6 {
  border-color: color-mix(in srgb, var(--text-muted) 18%, transparent);
  background: color-mix(in srgb, var(--text-muted) 10%, var(--surface-1));
  color: var(--text-muted);
}

.related-cell {
  min-width: 260px;
}

.table-related-links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}

.table-related-link {
  display: inline-grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: center;
  gap: 0.4rem;
  min-width: 0;
  max-width: 120px;
  padding: 0.45rem 0.55rem;
  border: 1px solid color-mix(in srgb, var(--report-tone) 18%, var(--main-border));
  border-radius: 11px;
  background: color-mix(in srgb, var(--report-tone) 5%, var(--surface-1));
  color: var(--text-strong);
  text-decoration: none;
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.table-related-link:hover,
.table-related-link:focus-visible {
  transform: translateY(-1px);
  border-color: color-mix(in srgb, var(--report-tone) 42%, var(--main-border));
  box-shadow: 0 8px 18px color-mix(in srgb, var(--report-tone) 10%, transparent);
  outline: none;
}

.table-related-mark {
  display: grid;
  place-items: center;
  width: 27px;
  height: 27px;
  border-radius: 8px;
  background: color-mix(in srgb, var(--report-tone) 12%, var(--surface-1));
  color: var(--report-tone);
  font-size: 0.66rem;
  font-weight: 900;
}

.observation-link .table-related-mark {
  background: var(--status-warning-soft);
  color: var(--status-warning);
}

.investigation-link .table-related-mark {
  background: var(--status-success-soft);
  color: var(--status-success);
}

.table-related-copy {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 0.1rem;
}

.table-related-copy small {
  color: var(--text-muted);
  font-size: 0.56rem;
  font-weight: 800;
  text-transform: uppercase;
}

.table-related-copy strong {
  overflow: hidden;
  font-size: 0.68rem;
  font-weight: 900;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.empty-value {
  color: var(--text-muted);
  font-weight: 800;
}

.report-loading {
  margin-top: 1rem;
  padding: 1rem;
}

@media (max-width: 900px) {
  .report-board-header {
    grid-template-columns: 1fr;
  }

  .report-actions {
    justify-content: flex-start;
  }
}

@media (max-width: 620px) {
  .report-hero {
    align-items: flex-start;
  }

  .hero-mark {
    display: none;
  }

  .report-actions > * {
    flex: 1 1 auto;
  }

  .report-search {
    flex-basis: 100%;
  }
}
</style>
