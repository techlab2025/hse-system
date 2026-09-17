<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { DataSuccess } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { debounce } from '@/base/Presentation/utils/debouced'
import { Observation } from '@/features/Organization/ObservationFactory/Core/Enums/ObservationTypeEnum'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
import DataEmpty from '@/shared/DataStatues/DataEmpty.vue'
import DataFailed from '@/shared/DataStatues/DataFailed.vue'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import TableLoader from '@/shared/DataStatues/TableLoader.vue'
import Pagination from '@/shared/HelpersComponents/Pagination.vue'
import PermissionBuilder from '@/shared/HelpersComponents/PermissionBuilder.vue'
import Search from '@/shared/icons/Search.vue'
import ReportFilterDialog from '../subComponents/ReportFilterDialog.vue'
import ExportReportPdf from '../subComponents/ExportReportPdf.vue'
import FetchTaskReportParams from '../../Core/params/FetchTaskReportParams'
import LessonsLearntController from '../controllers/LessonsLearntController'

const controller = LessonsLearntController.getInstance()
const { t } = useI18n({ useScope: 'global' })
const state = ref(controller.state.value)
const word = ref('')
const currentPage = ref(1)
const countPerPage = ref(10)
const isFilterDialogVisible = ref(false)
const selectedFromDate = ref('')
const selectedToDate = ref('')

const lessons = computed(() => (state.value instanceof DataSuccess ? (state.value.data ?? []) : []))

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

const matchesFilters = (item: Record<string, any>) => {
  const itemDate = parseDateValue(
    item?.observation?.date || item?.observation?.createdAt || item?.createdAt,
  )
  const fromDate = parseDateValue(selectedFromDate.value)
  const toDate = parseDateValue(selectedToDate.value)

  if (fromDate && itemDate && itemDate < fromDate) return false
  if (toDate && itemDate && itemDate > toDate) return false

  return true
}

const visibleLessons = computed(() =>
  lessons.value.filter((item) => matchesFilters(item as Record<string, any>)),
)

// const summary = computed(() => ({
//   visible: lessons.value.length,
//   incidents: lessons.value.filter(
//     (item) => Number(item.observation?.type) === Observation.AccidentsType,
//   ).length,
//   observations: lessons.value.filter(
//     (item) => Number(item.observation?.type) !== Observation.AccidentsType,
//   ).length,
//   projects: new Set(
//     lessons.value
//       .map((item) => item.observation?.project?.id ?? item.observation?.project?.title)
//       .filter(Boolean),
//   ).size,
// }))

const fetchLessons = async (
  query: string = word.value,
  page: number = currentPage.value,
  limit: number = countPerPage.value,
  fromDate: string = selectedFromDate.value,
  toDate: string = selectedToDate.value,
) => {
  await controller.fetch(new FetchTaskReportParams(query, page, limit, 1, null, fromDate, toDate))
}

const searchLessons = debounce(() => {
  currentPage.value = 1
  fetchLessons(word.value, 1)
})

const clearSearch = () => {
  word.value = ''
  currentPage.value = 1
  fetchLessons('', 1)
}

const handleChangePage = (page: number) => {
  currentPage.value = page
  fetchLessons(word.value, page)
}

const handleCountPerPage = (count: number) => {
  countPerPage.value = count
  currentPage.value = 1
  fetchLessons(word.value, 1, count)
}

const openFilterDialog = () => {
  isFilterDialogVisible.value = true
}

const applyFilters = ({
  fromDate,
  toDate,
}: {
  status: string | number
  fromDate: string
  toDate: string
}) => {
  selectedFromDate.value = fromDate
  selectedToDate.value = toDate
  currentPage.value = 1
  fetchLessons(word.value, 1, countPerPage.value, fromDate, toDate)
}

const resetFilters = () => {
  selectedFromDate.value = ''
  selectedToDate.value = ''
  currentPage.value = 1
  fetchLessons(word.value, 1, countPerPage.value, '', '')
}

const observationType = (type: number) => {
  if (type === Observation.AccidentsType) return t('report_incident')
  if (type === Observation.HazardType) return t('report_hazard')
  return t('report_observation')
}

const observationLink = (id: number, type: number) =>
  type === Observation.AccidentsType
    ? `/organization/equipment-mangement/incedant/show/${id}`
    : `/organization/equipment-mangement/observation/show/${id}`

const getRowNumber = (index: number) =>
  String((currentPage.value - 1) * countPerPage.value + index + 1).padStart(2, '0')

const getLessonDate = (item: Record<string, any>) =>
  item?.observation?.date || item?.observation?.createdAt || item?.createdAt || 'N/A'

const getProjectLabel = (item: Record<string, any>) =>
  item?.project?.serial_name ||
  item?.project?.title ||
  item?.observation?.project?.serial_name ||
  item?.observation?.project?.title ||
  'N/A'

const getObservationLabel = (item: Record<string, any>) =>
  item?.observation?.serialName || item?.observation?.serial || 'N/A'

const getInvestigationLabel = (item: Record<string, any>) =>
  item?.serial_name ||
  item?.investigation?.serialName ||
  (item?.investigation_id ? `#${item.investigation_id}` : 'N/A')

watch(
  () => controller.state.value,
  (newState) => {
    state.value = newState
  },
  { deep: true },
)

onMounted(() => fetchLessons())
</script>

<template>
  <main class="lessons-report-page">
    <section class="lessons-hero">
      <div class="hero-copy">
        <span class="eyebrow">{{ $t('lessons_organizational_knowledge') }}</span>
        <h1>{{ $t('lessons_report_title') }}</h1>
        <p>{{ $t('lessons_report_description') }}</p>
      </div>

      <div class="knowledge-mark" aria-hidden="true">
        <svg viewBox="0 0 64 64" fill="none">
          <path
            d="M21 48h22M24 54h16"
            stroke="currentColor"
            stroke-width="3"
            stroke-linecap="round"
          />
          <path
            d="M19 27a13 13 0 1 1 23 8c-3 3-4 5-4 8H26c0-3-1-5-4-8a13 13 0 0 1-3-8Z"
            stroke="currentColor"
            stroke-width="3"
          />
          <path
            d="M32 13v6m-10-2 4 5m16-5-4 5"
            stroke="currentColor"
            stroke-width="3"
            stroke-linecap="round"
          />
        </svg>
      </div>
    </section>

    <header class="board-header">
      <div>
        <span class="eyebrow">{{ $t('lessons_knowledge_library') }}</span>
        <h2>{{ $t('lessons_connected_title') }}</h2>
        <p>{{ $t('lessons_connected_description') }}</p>
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
          :target-selector="'.lessons-board'"
          file-name="lessons-report"
          :data="visibleLessons"
          :columns="[
            { key: 'lesson_learnt', label: $t('lessons_report_title') },
            { key: 'project.serial_name', label: $t('report_project') },
            { key: 'observation.serialName', label: $t('report_observation') },
          ]"
        />

        <label class="lessons-search">
          <Search aria-hidden="true" />
          <input
            v-model="word"
            type="search"
            :placeholder="$t('lessons_search_placeholder')"
            @input="searchLessons"
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
      :show-status-filter="false"
      :initial-from-date="selectedFromDate"
      :initial-to-date="selectedToDate"
      :title="$t('Filter')"
      :subtitle="$t('lessons_connected_description')"
      @apply="applyFilters"
      @reset="resetFilters"
    />

    <PermissionBuilder :code="[PermissionsEnum.ADMIN, PermissionsEnum.ORGANIZATION_EMPLOYEE]">
      <DataStatus :controller="state">
        <template #success>
          <section v-if="visibleLessons.length" class="lessons-board">
            <div class="lessons-table-scroll">
              <table class="lessons-table">
                <thead>
                  <tr>
                    <th class="number-column">#</th>
                    <th class="lesson-column">{{ $t('lessons_report_title') }}</th>
                    <!-- <th>{{ $t('type') }}</th> -->
                    <!-- <th>{{ $t('date') }}</th> -->
                    <th>{{ $t('report_project') }}</th>
                    <th>{{ $t('report_observation') }}</th>
                    <th>{{ $t('report_investigation') }}</th>
                  </tr>
                </thead>

                <tbody>
                  <tr
                    v-for="(item, index) in visibleLessons"
                    :key="`${item.observation?.id ?? item.investigation_id ?? 'lesson'}-${index}`"
                  >
                    <td class="number-cell">
                      <span>{{ getRowNumber(index) }}</span>
                    </td>

                    <td class="lesson-cell">
                      <div
                        class="lesson-content"
                        v-html="item.lesson_learnt || $t('lessons_no_details')"
                      ></div>
                    </td>

                    <!-- <td>
                      <span class="source-type">
                        {{ observationType(Number(item.observation?.type)) }}
                      </span>
                    </td>

                    <td>
                      <span class="table-value table-date">
                        {{ getLessonDate(item) }}
                      </span>
                    </td> -->

                    <td class="reference-cell">
                      <RouterLink
                        v-if="item.project?.id || item.observation?.project?.id"
                        class="table-reference-link project-reference"
                        :to="`/organization/project-details/${item.project?.id || item.observation?.project?.id}`"
                      >
                        <span class="reference-mark" aria-hidden="true">P</span>
                        <span class="reference-text">{{ getProjectLabel(item) }}</span>
                        <span class="reference-arrow" aria-hidden="true">→</span>
                      </RouterLink>
                      <span v-else class="empty-value">—</span>
                    </td>

                    <td class="reference-cell">
                      <RouterLink
                        v-if="item.observation?.id"
                        class="table-reference-link observation-reference"
                        :to="observationLink(item.observation.id, Number(item.observation.type))"
                      >
                        <span class="reference-mark" aria-hidden="true">O</span>
                        <span class="reference-text">{{ getObservationLabel(item) }}</span>
                        <span class="reference-arrow" aria-hidden="true">→</span>
                      </RouterLink>
                      <span v-else class="empty-value">—</span>
                    </td>

                    <td class="reference-cell">
                      <RouterLink
                        v-if="item.investigation_id"
                        class="table-reference-link investigation-reference"
                        :to="`/organization/Investigating-result-answer/${item.investigation_id}`"
                      >
                        <span class="reference-mark" aria-hidden="true">I</span>
                        <span class="reference-text">{{ getInvestigationLabel(item) }}</span>
                        <span class="reference-arrow" aria-hidden="true">→</span>
                      </RouterLink>
                      <span v-else class="empty-value">—</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <DataEmpty
            v-else
            :title="$t('lessons_empty_title')"
            :description="$t('lessons_empty_description')"
            :withbtn="false"
          />

          <Pagination
            v-if="visibleLessons.length"
            :pagination="state.pagination"
            @change-page="handleChangePage"
            @count-per-page="handleCountPerPage"
          />
        </template>

        <template #loader>
          <section class="lessons-loading">
            <TableLoader :cols="7" :rows="6" />
          </section>
        </template>

        <template #initial>
          <section class="lessons-loading">
            <TableLoader :cols="7" :rows="6" />
          </section>
        </template>

        <template #empty>
          <DataEmpty
            :title="$t('lessons_empty_title')"
            :description="$t('lessons_empty_description')"
            :withbtn="false"
          />
        </template>

        <template #failed>
          <DataFailed
            :title="$t('lessons_load_failed_title')"
            :description="$t('lessons_load_failed_description')"
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
.lessons-report-page {
  --lesson-tone: var(--identity-accent);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  padding: clamp(0.75rem, 2vw, 1.5rem);
}

.lessons-report-page > :deep(div) {
  width: 100%;
}

.lessons-hero,
.lessons-board,
.lessons-loading {
  width: 100%;
  border: 1px solid color-mix(in srgb, var(--lesson-tone) 18%, var(--main-border));
  border-radius: 24px;
  background: var(--surface-1);
  box-shadow: 0 22px 52px color-mix(in srgb, var(--shadow-color) 38%, transparent);
}

.lessons-hero {
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 190px;
  padding: clamp(1.4rem, 4vw, 2.6rem);
  background:
    radial-gradient(
      circle at 88% 18%,
      color-mix(in srgb, var(--lesson-tone) 19%, transparent),
      transparent 31%
    ),
    linear-gradient(
      135deg,
      color-mix(in srgb, var(--lesson-tone) 8%, var(--surface-1)),
      var(--surface-1)
    );
}

.hero-copy {
  max-width: 760px;
}

.eyebrow {
  color: var(--lesson-tone);
  font-size: 0.72rem;
  font-weight: 900;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.hero-copy h1,
.board-header h2 {
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
.board-header p {
  margin: 0.65rem 0 0;
  color: var(--text-soft);
  line-height: 1.7;
}

.knowledge-mark {
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  width: clamp(80px, 10vw, 116px);
  height: clamp(80px, 10vw, 116px);
  border: 1px solid color-mix(in srgb, var(--lesson-tone) 26%, transparent);
  border-radius: 50%;
  background: color-mix(in srgb, var(--lesson-tone) 10%, var(--surface-1));
  color: var(--lesson-tone);
}

.knowledge-mark svg {
  width: 58%;
}

.board-header {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(320px, 520px);
  align-items: center;
  gap: 1rem;
  width: 100%;
  padding-bottom: 1rem;
  border-bottom: 1px dashed color-mix(in srgb, var(--lesson-tone) 24%, var(--main-border));
}

.board-header h2 {
  font-size: 1.25rem;
}

.board-header p {
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
  min-height: 44px;
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

.lessons-search {
  position: relative;
  display: flex;
  align-items: center;
  flex: 1 1 230px;
  min-width: 210px;
}

.lessons-search > svg {
  position: absolute;
  inset-inline-start: 0.9rem;
  z-index: 1;
  width: 20px;
  color: var(--lesson-tone);
  left: 100%;
  transform: translateX(-150%);
}

.lessons-search input {
  width: 100%;
  min-height: 48px;
  padding: 0.75rem 2.8rem;
  border: 1px solid var(--main-border);
  border-radius: 14px;
  background: var(--surface-2);
  color: var(--text-strong);
  outline: none;
  transition:
    border-color 0.2s ease,
    background 0.2s ease,
    box-shadow 0.2s ease;
}

.lessons-search input:focus {
  border-color: var(--lesson-tone);
  background: var(--surface-1);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--lesson-tone) 12%, transparent);
}

.lessons-search button {
  position: absolute;
  inset-inline-end: 0.7rem;
  width: 28px;
  height: 28px;
  border: 0;
  border-radius: 9px;
  background: color-mix(in srgb, var(--lesson-tone) 10%, transparent);
  color: var(--lesson-tone);
  cursor: pointer;
  font-size: 1.2rem;
}

.lessons-board {
  overflow: hidden;
  margin-top: 1rem;
}

.lessons-table-scroll {
  width: 100%;
  overflow-x: auto;
  overscroll-behavior-inline: contain;
}

.lessons-table {
  width: 100%;
  min-width: 1120px;
  border-collapse: separate;
  border-spacing: 0;
  color: var(--text-strong);
  table-layout: fixed;
}

.lessons-table th,
.lessons-table td {
  padding: 1rem;
  border-bottom: 1px solid color-mix(in srgb, var(--main-border) 84%, transparent);
  text-align: start;
  vertical-align: middle;
}

.lessons-table thead th {
  position: sticky;
  top: 0;
  z-index: 2;
  background: color-mix(in srgb, var(--lesson-tone) 7%, var(--surface-1));
  color: var(--text-muted);
  font-size: 0.72rem;
  font-weight: 900;
  letter-spacing: 0.045em;
  text-transform: uppercase;
  white-space: nowrap;
}

.lessons-table thead th:first-child {
  border-start-start-radius: 23px;
}

.lessons-table thead th:last-child {
  border-start-end-radius: 23px;
}

.lessons-table tbody tr {
  background: var(--surface-1);
  transition:
    background 0.2s ease,
    box-shadow 0.2s ease;
}

.lessons-table tbody tr:hover {
  background: color-mix(in srgb, var(--lesson-tone) 4%, var(--surface-1));
}

.lessons-table tbody tr:last-child td {
  border-bottom: 0;
}

.number-column {
  width: 72px;
}

.lesson-column {
  width: 31%;
}

.number-cell span {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: 11px;
  background: color-mix(in srgb, var(--lesson-tone) 10%, var(--surface-1));
  color: var(--lesson-tone);
  font-family: monospace;
  font-size: 0.75rem;
  font-weight: 900;
}

.lesson-cell {
  min-width: 0;
}

.lesson-content {
  display: -webkit-box;
  max-height: 4.8rem;
  overflow: hidden;
  color: var(--text-strong);
  font-size: 0.88rem;
  font-weight: 700;
  line-height: 1.55;
  overflow-wrap: anywhere;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  line-clamp: 3;
}

.lesson-content :deep(p) {
  margin: 0;
}

.source-type {
  display: inline-flex;
  align-items: center;
  min-height: 30px;
  padding: 0.35rem 0.7rem;
  border: 1px solid color-mix(in srgb, var(--lesson-tone) 18%, transparent);
  border-radius: 999px;
  background: color-mix(in srgb, var(--lesson-tone) 9%, var(--surface-1));
  color: var(--lesson-tone);
  font-size: 0.72rem;
  font-weight: 900;
  white-space: nowrap;
}

.table-value {
  display: inline-block;
  color: var(--text-soft);
  font-size: 0.8rem;
  font-weight: 800;
}

.table-date {
  white-space: nowrap;
}

.reference-cell {
  min-width: 0;
}

.table-reference-link {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 0.45rem;
  min-width: 0;
  min-height: 44px;
  padding: 0.45rem 0.55rem;
  border: 1px solid color-mix(in srgb, var(--lesson-tone) 16%, var(--main-border));
  border-radius: 12px;
  background: color-mix(in srgb, var(--surface-2) 74%, var(--surface-1));
  color: var(--text-strong);
  text-decoration: none;
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.table-reference-link:hover,
.table-reference-link:focus-visible {
  transform: translateY(-1px);
  border-color: color-mix(in srgb, var(--lesson-tone) 40%, var(--main-border));
  box-shadow: 0 8px 18px color-mix(in srgb, var(--lesson-tone) 10%, transparent);
  outline: none;
}

.reference-mark {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border-radius: 9px;
  background: color-mix(in srgb, var(--lesson-tone) 12%, var(--surface-1));
  color: var(--lesson-tone);
  font-size: 0.68rem;
  font-weight: 900;
}

.observation-reference .reference-mark {
  background: var(--status-warning-soft);
  color: var(--status-warning);
}

.investigation-reference .reference-mark {
  background: var(--status-success-soft);
  color: var(--status-success);
}

.reference-text {
  overflow: hidden;
  font-size: 0.74rem;
  font-weight: 900;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.reference-arrow {
  color: var(--lesson-tone);
  font-size: 0.8rem;
  transition: transform 0.2s ease;
}

.table-reference-link:hover .reference-arrow,
.table-reference-link:focus-visible .reference-arrow {
  transform: translateX(2px);
}

[dir='rtl'] .table-reference-link:hover .reference-arrow,
[dir='rtl'] .table-reference-link:focus-visible .reference-arrow {
  transform: translateX(-2px);
}

.empty-value {
  color: var(--text-muted);
  font-weight: 800;
}

.lessons-loading {
  margin-top: 1rem;
  padding: 1rem;
}

@media (max-width: 900px) {
  .board-header {
    grid-template-columns: 1fr;
  }

  .report-actions {
    justify-content: flex-start;
  }
}

@media (max-width: 620px) {
  .lessons-report-page {
    padding: 0.7rem;
  }

  .lessons-hero {
    min-height: 160px;
  }

  .knowledge-mark {
    display: none;
  }

  .report-actions {
    align-items: stretch;
    flex-direction: column;
  }

  .report-action-btn,
  .lessons-search {
    width: 100%;
  }

  .lessons-board,
  .lessons-hero,
  .lessons-loading {
    border-radius: 18px;
  }
}
</style>
