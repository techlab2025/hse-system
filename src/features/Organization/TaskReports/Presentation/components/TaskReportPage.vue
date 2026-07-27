<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
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
import InvestegaionResultTasksAnswerCard from '@/features/Organization/Investigating/Presentation/components/InvestegationResultAnswer/InvestegationResultAnswerUtils/InvestegaionResultTasksAnswerCard.vue'
import ReportFilterDialog from '../subComponents/ReportFilterDialog.vue'
import ExportReportPdf from '../subComponents/ExportReportPdf.vue'
import FetchTaskReportParams from '../../Core/params/FetchTaskReportParams'
import CorrectiveTasksController from '../controllers/CorrectiveTasksController'
import PreventiveTasksController from '../controllers/PreventiveTasksController'
import { InvestegationTaskEnum } from '@/features/Organization/Capa/Core/Core/InvestegationTaskEnum'
import type TitleInterface from '@/base/Data/Models/title_interface.ts'

type ReportType = 'corrective' | 'preventive'

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
const selectedStatusFilter = ref<string | number>('all')
const selectedFromDate = ref('')
const selectedToDate = ref('')

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

const tasks = computed(() => (state.value instanceof DataSuccess ? (state.value.data ?? []) : []))

const taskStatusOptions = computed(() => [
  { title: t('all'), id: -1 },
  { title: t('task_status_not_started'), id: InvestegationTaskEnum.NotStarted },
  { title: t('task_status_in_progress'), id: InvestegationTaskEnum.InProgress },
  { title: t('task_status_pending'), id: InvestegationTaskEnum.PendingOnHold },
  { title: t('task_status_overdue'), id: InvestegationTaskEnum.Overdue },
  { title: t('task_status_completed'), id: InvestegationTaskEnum.Completed },
  { title: t('task_status_cancelled'), id: InvestegationTaskEnum.Cancelled },
])

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

const matchesFilters = (task: Record<string, unknown>) => {
  const statusValue = Number(task?.status)
  if (selectedStatusFilter.value !== 'all' && statusValue !== Number(selectedStatusFilter.value)) {
    return false
  }

  const taskDate = parseDateValue(task?.dueDate || task?.due_date || task?.date || task?.createdAt)
  const fromDate = parseDateValue(selectedFromDate.value)
  const toDate = parseDateValue(selectedToDate.value)

  if (fromDate && taskDate && taskDate < fromDate) return false
  if (toDate && taskDate && taskDate > toDate) return false

  return true
}

const visibleTasks = computed(() => tasks.value.filter((task) => matchesFilters(task as Record<string, unknown>)))

const fetchReport = async (
  query: string = word.value,
  page: number = currentPage.value,
  limit: number = countPerPage.value,
  status: TitleInterface= selectedStatusFilter.value,
  fromDate: string = selectedFromDate.value,
  toDate: string = selectedToDate.value,
) => {
  await controller.fetch(new FetchTaskReportParams(query, page, limit, 1, status.id != -1 ? status.id : null, fromDate, toDate))
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

const applyFilters = ({ status, fromDate, toDate }: { status: string | number; fromDate: string; toDate: string }) => {
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

const observationTypeLabel = (observationType: number) => {
  if (observationType === Observation.AccidentsType) return t('report_incident')
  if (observationType === Observation.HazardType) return t('report_hazard')
  return t('report_observation')
}

const observationLink = (id: number, observationType: number) =>
  observationType === Observation.AccidentsType
    ? `/organization/equipment-mangement/incedant/show/${id}`
    : `/organization/equipment-mangement/observation/show/${id}`

type TaskReportItem = {
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

const buildRelatedLinks = (task: TaskReportItem) => {
  const links: Array<{
    label: string
    text: string
    to: string
    mark: string
    className?: string
  }> = []

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
      text: task.investigation?.serialName || `#${task.investigation_id}`,
      to: `/organization/Investigating-result-answer/${task.investigation?.investigationId}`,
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
        <span class="report-eyebrow">{{ content.eyebrow }}</span>
        <h1>{{ content.title }}</h1>
        <p>{{ content.description }}</p>
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
        <span class="report-eyebrow">{{ $t('report_action_register') }}</span>
        <h2>{{ content.title }}</h2>
        <p>{{ $t('report_register_description') }}</p>
      </div>

      <div class="report-actions">
        <button type="button" class="report-action-btn report-action-btn--ghost" @click="openFilterDialog">
          {{ $t('Filter') }}
        </button>
        <ExportReportPdf
          :target-selector="'.report-board'"
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
          <!-- <section class="report-summary" aria-label="Current page summary">
            <article>
              <span>Visible actions</span><strong>{{ summary.visible }}</strong>
            </article>
            <article>
              <span>Active</span><strong>{{ summary.active }}</strong>
            </article>
            <article class="is-overdue">
              <span>Overdue</span><strong>{{ summary.overdue }}</strong>
            </article>
            <article class="is-completed">
              <span>Completed</span><strong>{{ summary.completed }}</strong>
            </article>
          </section> -->

          <section class="report-board">
            <div class="report-grid">
              <article v-for="task in state.data" :key="task.id" class="report-card-shell">
                <InvestegaionResultTasksAnswerCard
                  :task="task"
                  :is-change-status="true"
                  :related-links="buildRelatedLinks(task)"
                />
              </article>
            </div>
          </section>

          <Pagination
            :pagination="state.pagination"
            @change-page="handleChangePage"
            @count-per-page="handleCountPerPage"
          />
        </template>

        <template #loader>
          <section class="report-loading"><TableLoader :cols="2" :rows="6" /></section>
        </template>

        <template #initial>
          <section class="report-loading"><TableLoader :cols="2" :rows="6" /></section>
        </template>

        <template #empty>
          <DataEmpty
            :title="content.emptyTitle"
            :description="content.emptyDescription"
            :withbtn="false"
          />
          <!-- link="/organization" -->
          <!-- add-text="overview" -->
        </template>

        <template #failed>
          <DataFailed
            :title="$t('report_load_failed_title')"
            :description="$t('report_load_failed_description')"
            :withbtn="false"
          />
          <!-- link="/organization" -->
          <!-- add-text="overview" -->
        </template>
      </DataStatus>

      <template #notPermitted>
        <DataFailed
          :title="$t('report_permission_required')"
          :description="$t('report_permission_description')"
          :withbtn="false"
        />
        <!-- link="/organization" -->
        <!-- add-text="overview" -->
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
.report-board-header {
  width: 100%;
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
  border: 0;
  border-radius: 999px;
  padding: 0.7rem 1rem;
  cursor: pointer;
  font-weight: 800;
}

.report-action-btn--ghost {
  background: color-mix(in srgb, var(--main-border) 68%, transparent);
  color: var(--text-strong);
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

.report-summary {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.75rem;
  margin-top: 1rem;
}

.report-summary article {
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 90px;
  padding: 1rem;
  border: 1px solid var(--main-border);
  border-radius: 18px;
  background: linear-gradient(145deg, var(--surface-1), var(--surface-2));
}

.report-summary article::after {
  content: '';
  position: absolute;
  inset-block: 0;
  inset-inline-start: 0;
  width: 4px;
  background: var(--report-tone);
}

.report-summary article.is-overdue::after {
  background: var(--status-danger);
}

.report-summary article.is-completed::after {
  background: var(--status-success);
}

.report-summary span {
  color: var(--text-muted);
  font-size: 0.82rem;
  font-weight: 800;
}

.report-summary strong {
  color: var(--text-strong);
  font-size: 1.8rem;
  font-weight: 900;
}

.report-board {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
  padding: clamp(1rem, 2vw, 1.4rem);
}

.report-board-header {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(270px, 410px);
  align-items: center;
  gap: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px dashed color-mix(in srgb, var(--report-tone) 24%, var(--main-border));
}

.report-board-header h2 {
  font-size: 1.25rem;
}

.report-board-header p {
  font-size: 0.86rem;
}

.report-search {
  position: relative;
  display: flex;
  align-items: center;
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
  padding: 0.75rem 2.8rem;
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

.report-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(300px, 1fr));
  gap: 1rem;
  align-items: stretch;
}

.report-card-shell {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 0.65rem;
}

.report-card-shell > :deep(.investegaion-task-card) {
  flex: 1;
}

.task-reference-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.5rem;
}

.task-reference-link {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 0.45rem;
  min-width: 0;
  min-height: 60px;
  padding: 0.6rem;
  border: 1px solid color-mix(in srgb, var(--report-tone) 18%, var(--main-border));
  border-radius: 13px;
  background: color-mix(in srgb, var(--report-tone) 5%, var(--surface-1));
  color: var(--text-strong);
  text-decoration: none;
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.task-reference-link:hover,
.task-reference-link:focus-visible {
  transform: translateY(-2px);
  border-color: color-mix(in srgb, var(--report-tone) 42%, var(--main-border));
  box-shadow: 0 10px 22px color-mix(in srgb, var(--report-tone) 12%, transparent);
  outline: none;
}

.task-reference-mark {
  display: grid;
  place-items: center;
  width: 29px;
  height: 29px;
  border-radius: 9px;
  background: color-mix(in srgb, var(--report-tone) 12%, var(--surface-1));
  color: var(--report-tone);
  font-size: 0.7rem;
  font-weight: 900;
}

.observation-link .task-reference-mark {
  background: var(--status-warning-soft);
  color: var(--status-warning);
}

.investigation-link .task-reference-mark {
  background: var(--status-success-soft);
  color: var(--status-success);
}

.task-reference-copy {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 0.15rem;
}

.task-reference-copy small {
  color: var(--text-muted);
  font-size: 0.6rem;
  font-weight: 800;
  text-transform: uppercase;
}

.task-reference-copy strong {
  overflow: hidden;
  font-size: 0.7rem;
  font-weight: 900;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.task-reference-arrow {
  color: var(--report-tone);
  font-size: 0.85rem;
  transition: transform 0.2s ease;
}

.task-reference-link:hover .task-reference-arrow,
.task-reference-link:focus-visible .task-reference-arrow {
  transform: translateX(2px);
}

[dir='rtl'] .task-reference-link:hover .task-reference-arrow,
[dir='rtl'] .task-reference-link:focus-visible .task-reference-arrow {
  transform: translateX(-2px);
}

/* Report-only treatment for the shared investigation task card. */
.report-grid :deep(.investegaion-task-card) {
  --task-state-color: var(--report-tone);
  position: relative;
  isolation: isolate;
  overflow: hidden;
  min-width: 0;
  min-height: 285px;
  padding: 1.15rem;
  border: 1px solid color-mix(in srgb, var(--task-state-color) 20%, var(--main-border));
  border-radius: 20px;
  background:
    radial-gradient(
      circle at 100% 0%,
      color-mix(in srgb, var(--task-state-color) 10%, transparent),
      transparent 34%
    ),
    linear-gradient(
      145deg,
      var(--surface-1),
      color-mix(in srgb, var(--surface-2) 74%, var(--surface-1))
    );
  box-shadow:
    0 14px 32px color-mix(in srgb, var(--shadow-color) 30%, transparent),
    inset 0 1px 0 color-mix(in srgb, var(--text-on-brand) 42%, transparent);
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.report-grid :deep(.investegaion-task-card)::before {
  content: '';
  position: absolute;
  z-index: -1;
  inset-block: 1.1rem;
  inset-inline-start: 0;
  width: 4px;
  border-radius: 0 999px 999px 0;
  background: var(--task-state-color);
}

[dir='rtl'] .report-grid :deep(.investegaion-task-card)::before {
  border-radius: 999px 0 0 999px;
}

.report-grid :deep(.investegaion-task-card.status-3),
.report-grid :deep(.investegaion-task-card.status-4) {
  --task-state-color: var(--status-danger);
}

.report-grid :deep(.investegaion-task-card.status-5) {
  --task-state-color: var(--status-success);
}

.report-grid :deep(.investegaion-task-card.status-6) {
  --task-state-color: var(--text-muted);
}

.report-grid :deep(.investegaion-task-card:hover) {
  transform: translateY(-4px);
  border-color: color-mix(in srgb, var(--task-state-color) 42%, var(--main-border));
  box-shadow: 0 22px 44px color-mix(in srgb, var(--task-state-color) 13%, transparent);
}

.report-grid :deep(.investegaion-task-card .card-header) {
  justify-content: flex-end;
  min-height: 30px;
}

.report-grid :deep(.investegaion-task-card .task-status-pill) {
  border: 1px solid color-mix(in srgb, currentColor 20%, transparent);
  box-shadow: 0 6px 16px color-mix(in srgb, var(--task-state-color) 10%, transparent);
}

.report-grid :deep(.investegaion-task-card .card-content) {
  gap: 0.9rem;
  min-width: 0;
}

.report-grid :deep(.investegaion-task-card .task-description) {
  display: -webkit-box;
  min-height: 3.1rem;
  margin: 0;
  overflow: hidden;
  color: var(--text-strong);
  font-size: 1rem;
  line-height: 1.55;
  overflow-wrap: anywhere;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
}

.report-grid :deep(.investegaion-task-card .info) {
  gap: 0.65rem;
}

.report-grid :deep(.investegaion-task-card .info .date),
.report-grid :deep(.investegaion-task-card .info .responsable) {
  min-width: 0;
  padding: 0.75rem;
  border: 1px solid color-mix(in srgb, var(--task-state-color) 14%, var(--main-border));
  border-radius: 13px;
  background: color-mix(in srgb, var(--task-state-color) 6%, var(--surface-1));
  color: var(--text-muted);
  font-size: 0.72rem;
  letter-spacing: 0.025em;
  text-transform: uppercase;
}

.report-grid :deep(.investegaion-task-card .info .date span),
.report-grid :deep(.investegaion-task-card .info .responsable span) {
  overflow: hidden;
  color: var(--text-strong);
  font-size: 0.84rem;
  letter-spacing: 0;
  text-overflow: ellipsis;
  text-transform: none;
  white-space: nowrap;
}

.report-grid :deep(.investegaion-task-card .assigned-to-container) {
  min-width: 0;
  margin-top: auto;
  padding: 0.8rem;
  border: 1px solid color-mix(in srgb, var(--task-state-color) 13%, var(--main-border));
  border-radius: 14px;
  background: color-mix(in srgb, var(--task-state-color) 5%, var(--surface-1));
}

.report-grid :deep(.investegaion-task-card .assigned-to) {
  min-width: 0;
}

.report-grid :deep(.investegaion-task-card .assigned-to .icon) {
  width: 36px;
  height: 36px;
  padding: 8px;
  border-radius: 11px;
  background: color-mix(in srgb, var(--task-state-color) 12%, transparent);
  color: var(--task-state-color);
}

.report-grid :deep(.investegaion-task-card .assigned-to-info) {
  min-width: 0;
}

.report-grid :deep(.investegaion-task-card .assigned-to-info .assign) {
  margin: 0;
  color: var(--text-muted);
}

.report-grid :deep(.investegaion-task-card .assigned-to-info .person) {
  max-width: min(220px, 35vw);
  margin: 0.15rem 0 0;
  color: var(--text-strong);
}

.report-loading {
  margin-top: 1rem;
  padding: 1rem;
}

@media (max-width: 900px) {
  .report-summary,
  .report-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .report-board-header {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 620px) {
  .report-hero {
    align-items: flex-start;
  }

  .hero-mark {
    display: none;
  }

  .report-summary,
  .report-grid {
    grid-template-columns: 1fr;
  }

  .report-grid :deep(.investegaion-task-card) {
    min-height: 0;
  }

  .task-reference-grid {
    grid-template-columns: 1fr;
  }
}
</style>
