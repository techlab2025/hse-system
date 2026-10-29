<script setup lang="ts">
import { resolveProjectId } from '@/shared/utils/projectScope'
import { vProjectPanels } from '../../composables/projectPanels'

import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { formatDisplayDate, formatDisplayNumber } from '@/localization/formatters'
import { useRoute } from 'vue-router'
import { debounce } from '@/base/Presentation/utils/debouced'
import DropList from '@/shared/HelpersComponents/DropList.vue'
import Pagination from '@/shared/HelpersComponents/Pagination.vue'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import TableLoader from '@/shared/DataStatues/TableLoader.vue'
import DataEmpty from '@/shared/DataStatues/DataEmpty.vue'
import DataFailed from '@/shared/DataStatues/DataFailed.vue'
import PermissionBuilder from '@/shared/HelpersComponents/PermissionBuilder.vue'
import IconDelete from '@/shared/icons/IconDelete.vue'
import ActionsTableView from '@/shared/icons/ActionsTableView.vue'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
import IndexInductionController from '../../controllers/Induction/indexInductionController'
import DeleteInductionController from '../../controllers/Induction/deleteInductionController'
import IndexInductionParams from '../../../Core/params/induction/indexInductionParams'
import DeleteInductionParams from '../../../Core/params/induction/deleteInductionToolParams'
import PermissionHandler from '@/base/Presentation/utils/permission_handler'

const { t } = useI18n()
// Experimental copy is local to this page; existing application translations stay intact.
const { t: inductionCopy } = useI18n({
  useScope: 'local',
  messages: {
    en: {
      register: 'Induction register',
      records: 'records',
      subtitle: 'Manage induction sessions, instructors and site records.',
      noMatches: 'No matching inductions',
      searchHint: 'Try different keywords or clear your search to see all inductions.',
    },
    ar: {
      register: 'سجل التدريبات التعريفية',
      records: 'سجلات',
      subtitle: 'إدارة التدريبات التعريفية والمدربين وسجلات المواقع.',
      noMatches: 'لا توجد نتائج مطابقة للتهيئة',
      searchHint: 'جرّب كلمات بحث أخرى أو امسح البحث لعرض جميع سجلات التهيئة.',
    },
  },
})
const route = useRoute()
const initials = (name?: string) =>
  name
    ?.trim()
    .split(/\s+/u)
    .slice(0, 2)
    .map((part) => Array.from(part)[0])
    .join('')
    .toLocaleUpperCase() || '—'
// Format the calendar date without interpreting the API's timezone-free values as UTC.
const calendarDate = (value?: string | null) => {
  if (!value) return '—'
  const parts = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!parts) return value
  const [, year, month, day] = parts
  const date = new Date(Number(year), Number(month) - 1, Number(day))
  if (
    date.getFullYear() !== Number(year) ||
    date.getMonth() !== Number(month) - 1 ||
    date.getDate() !== Number(day)
  )
    return value
  return formatDisplayDate(date, { day: '2-digit', month: 'short', year: 'numeric' })
}
const createdDate = (value?: string | null) =>
  value && /^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}(?::\d{2})?$/.test(value)
    ? calendarDate(value.slice(0, 10))
    : value || '—'
const createdTime = (value?: string | null) =>
  value && /^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}(?::\d{2})?$/.test(value) ? value.slice(11) : ''
const openRowActions = (event: KeyboardEvent) => {
  const target = event.currentTarget as HTMLElement
  target.querySelector<HTMLElement>('.list-trigger')?.click()
}
const word = ref('')
const currentPage = ref(1)
const countPerPage = ref(10)
const controller = IndexInductionController.getInstance()
const state = ref(controller.state.value)
const basePath = '/organization'
const routeProjectId = computed(() => {
  const routeValue = route.query.project_id ?? route.params.project_id
  const rawValue = Array.isArray(routeValue) ? routeValue[0] : routeValue
  const parsedValue = Number(rawValue)

  return (
    resolveProjectId(Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : undefined) ??
    null
  )
})
const projectQuery = computed(() =>
  routeProjectId.value ? `?project_id=${routeProjectId.value}` : '',
)

const fetchPermissions = [
  PermissionsEnum.ADMIN,
  PermissionsEnum.inductions_ALL,
  PermissionsEnum.inductions_FETCH,
]
const createPermissions = [
  PermissionsEnum.ADMIN,
  PermissionsEnum.inductions_ALL,
  PermissionsEnum.inductions_CREATE,
]
const detailsPermissions = [
  PermissionsEnum.ADMIN,
  PermissionsEnum.inductions_ALL,
  PermissionsEnum.inductions_DETAILS,
]
const deletePermissions = [
  PermissionsEnum.ADMIN,
  PermissionsEnum.inductions_ALL,
  PermissionsEnum.inductions_DELETE,
]
const canFetch = computed(() => PermissionHandler.Instance.handle(fetchPermissions))
const canCreate = computed(() => PermissionHandler.Instance.handle(createPermissions))

const fetchInductions = async (query: string = '', page: number = 1, limit: number = 10) => {
  if (!canFetch.value) return
  await controller.getData(
    new IndexInductionParams(
      query,
      page,
      limit,
      1,
      false,
      undefined,
      routeProjectId.value ?? undefined,
    ),
  )
}

const searchInductions = debounce(() => fetchInductions(word.value))
const clearSearch = () => {
  word.value = ''
  searchInductions()
}
const changePage = (page: number) => {
  currentPage.value = page
  fetchInductions(word.value, page, countPerPage.value)
}
const changePageSize = (limit: number) => {
  countPerPage.value = limit
  fetchInductions(word.value, currentPage.value, limit)
}
const deleteInduction = async (id: number) => {
  if (!PermissionHandler.Instance.handle(deletePermissions)) return
  const deleteController = DeleteInductionController.getInstance()
  await deleteController.deleteInduction(new DeleteInductionParams(id))
  if (deleteController.isDataSuccess()) {
    await fetchInductions(word.value, currentPage.value, countPerPage.value)
  }
}

const rowActions = (id: number) => [
  {
    text: t('show'),
    icon: ActionsTableView,
    link: `${basePath}/induction/show/${id}${projectQuery.value}`,
    permission: detailsPermissions,
  },
  // {
  //   text: t('edit'),
  //   icon: ActionsTableEdit,
  //   link: `${basePath}/induction/${id}${projectQuery.value}`,
  //   permission: featurePermissions,
  // },
  {
    text: t('delete'),
    icon: IconDelete,
    action: () => deleteInduction(id),
    permission: deletePermissions,
  },
]

onMounted(() => fetchInductions())
watch(
  () => controller.state.value,
  (value) => {
    state.value = value
  },
  { deep: true },
)
</script>

<template>
  <PermissionBuilder :code="fetchPermissions">
    <section data-hse-project v-project-panels class="hse-project-root induction-register">
      <header class="induction-header">
        <div class="induction-heading">
          <h1>{{ $t('Inductions') }}</h1>
          <p>{{ inductionCopy('subtitle') }}</p>
        </div>
        <PermissionBuilder :code="createPermissions">
          <router-link
            :to="`${basePath}/induction/add${projectQuery}`"
            class="induction-add hse-project-button--primary"
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M12 5v14M5 12h14"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
              />
            </svg>
            <span>{{ $t('add_induction') }}</span>
          </router-link>
        </PermissionBuilder>
      </header>

      <div class="induction-panel">
        <div class="induction-toolbar">
          <div class="induction-toolbar-title">
            <h2>{{ inductionCopy('register') }}</h2>
            <span v-if="state.pagination" class="induction-count"
              >{{ formatDisplayNumber(state.pagination.total ?? 0) }}
              {{ inductionCopy('records') }}</span
            >
          </div>
          <div class="induction-search">
            <span aria-hidden="true"
              ><svg viewBox="0 0 24 24" fill="none">
                <circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" stroke-width="1.7" />
                <path
                  d="m16 16 4 4"
                  stroke="currentColor"
                  stroke-width="1.7"
                  stroke-linecap="round"
                /></svg
            ></span>
            <input
              v-model="word"
              dir="auto"
              type="text"
              :aria-label="$t('search')"
              :placeholder="$t('search')"
              @input="searchInductions"
            />
            <button
              v-if="word"
              class="induction-search-clear"
              type="button"
              :aria-label="$t('report_clear_search')"
              @click="clearSearch"
            >
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="m7 7 10 10M7 17 17 7"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linecap="round"
                />
              </svg>
            </button>
          </div>
        </div>

        <DataStatus :controller="state">
          <template #success>
            <div
              class="induction-table-scroll"
              role="region"
              :aria-label="$t('Inductions')"
              tabindex="0"
            >
              <table class="induction-table">
                <colgroup>
                  <col style="width: 4%" />
                  <col style="width: 24%" />
                  <col style="width: 15%" />
                  <col style="width: 12%" />
                  <col style="width: 10%" />
                  <col style="width: 13%" />
                  <col style="width: 16%" />
                  <col style="width: 6%" />
                </colgroup>
                <caption class="induction-sr-only">
                  {{
                    $t('Inductions')
                  }}
                </caption>
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">{{ $t('instractor') }}</th>
                    <th scope="col">{{ $t('project') }}</th>
                    <th scope="col">{{ $t('location') }}</th>
                    <th scope="col">{{ $t('zone') }}</th>
                    <th scope="col">{{ $t('date') }}</th>
                    <th scope="col">{{ $t('created_at') }}</th>
                    <th scope="col">
                      <span class="induction-sr-only">{{ $t('Actions') }}</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in state.data" :key="item.id">
                    <td class="induction-number">
                      {{ (currentPage - 1) * countPerPage + index + 1 }}
                    </td>
                    <td>
                      <div class="induction-person">
                        <span class="induction-avatar" aria-hidden="true">{{
                          initials(item.instructorName)
                        }}</span>
                        <span class="induction-name">{{ item.instructorName || '—' }}</span>
                      </div>
                    </td>
                    <td :class="{ 'induction-missing': !item.projectTitle }">
                      {{ item.projectTitle || '—' }}
                    </td>
                    <td :class="{ 'induction-missing': !item.projectLocationTitle }">
                      {{ item.projectLocationTitle || '—' }}
                    </td>
                    <td :class="{ 'induction-missing': !item.projectZoneTitle }">
                      {{ item.projectZoneTitle || '—' }}
                    </td>
                    <td class="induction-date" :title="item.date || undefined">
                      <span class="induction-date-main">{{ calendarDate(item.date) }}</span>
                    </td>
                    <td
                      class="induction-date induction-created"
                      :title="item.createdAt || undefined"
                    >
                      <span class="induction-date-main">{{ createdDate(item.createdAt) }}</span
                      ><span v-if="createdTime(item.createdAt)" class="induction-date-time">{{
                        createdTime(item.createdAt)
                      }}</span>
                    </td>
                    <td class="induction-actions">
                      <div
                        class="induction-action-trigger"
                        role="button"
                        tabindex="0"
                        :aria-label="`${$t('Actions')}: ${item.instructorName || '—'}`"
                        aria-haspopup="dialog"
                        @keydown.enter.prevent="openRowActions"
                        @keydown.space.prevent="openRowActions"
                      >
                        <DropList :action-list="rowActions(item.id)" />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <footer class="induction-footer">
              <Pagination
                v-if="state.pagination && state.pagination.last > 1"
                :pagination="state.pagination"
                @change-page="changePage"
                @count-per-page="changePageSize"
              />
              <span v-else-if="state.pagination" class="induction-results">
                {{
                  $t('pagination_results', {
                    from: formatDisplayNumber(state.pagination.prev ?? 0),
                    to: formatDisplayNumber(state.pagination.next ?? 0),
                    total: formatDisplayNumber(state.pagination.total ?? 0),
                  })
                }}
              </span>
            </footer>
          </template>
          <template #loader
            ><div
              class="induction-loading"
              role="status"
              aria-busy="true"
              :aria-label="$t('loading')"
            >
              <span class="induction-sr-only">{{ $t('loading') }}</span
              ><TableLoader :cols="8" :rows="10" aria-hidden="true" /></div
          ></template>
          <template #initial
            ><div
              class="induction-loading"
              role="status"
              aria-busy="true"
              :aria-label="$t('loading')"
            >
              <span class="induction-sr-only">{{ $t('loading') }}</span
              ><TableLoader :cols="8" :rows="10" aria-hidden="true" /></div
          ></template>
          <template #empty>
            <DataEmpty
              :link="`${basePath}/induction/add${projectQuery}`"
              :add-text="$t('add_induction')"
              :description="word ? inductionCopy('searchHint') : $t('no_inductions_description')"
              :title="word ? inductionCopy('noMatches') : $t('no_inductions')"
              :withbtn="canCreate && !word"
            />
            <button v-if="word" class="induction-empty-clear" type="button" @click="clearSearch">
              {{ $t('report_clear_search') }}
            </button>
          </template>
          <template #failed>
            <DataFailed
              :link="`${basePath}/induction/add${projectQuery}`"
              :add-text="$t('add_induction')"
              :description="$t('unable_to_load_inductions')"
              :title="$t('Failed to load data')"
              :withbtn="canCreate"
            />
          </template>
        </DataStatus>
      </div>
    </section>
    <template #notPermitted>
      <DataFailed
        :title="$t('have_not_permission')"
        :description="$t('permission_denied_description')"
        link=""
        :withbtn="false"
      />
    </template>
  </PermissionBuilder>
</template>

<style scoped>
/* Local design contract. Existing HSE identity tokens remain the color source. */
.induction-register {
  --induction-control: 40px;
  --induction-muted: color-mix(in srgb, var(--hse-project-muted) 80%, var(--hse-project-ink));
  --induction-radius: 14px;
  --induction-space: 16px;
  --induction-text: 13px;
  --induction-label: 12px;
  --induction-shadow: 0 4px 16px rgb(18 48 84 / 4%);
  color: var(--hse-project-ink);
  font-family: inherit;
  font-size: var(--induction-text);
}
.induction-header {
  margin-bottom: 20px;
}
.induction-heading {
  max-width: 760px;
}
.induction-heading h1 {
  margin: 0;
  color: var(--hse-project-ink);
  font-size: 26px;
  font-weight: 700;
  line-height: 1.3;
  letter-spacing: -0.6px;
}
.induction-heading p {
  margin: 8px 0 0;
  color: var(--induction-muted);
  font-size: var(--induction-text);
  line-height: 1.6;
}
.induction-panel {
  overflow: hidden;
  border: 1px solid var(--hse-project-line);
  border-radius: var(--induction-radius);
  background: var(--hse-project-surface);
  box-shadow: var(--induction-shadow);
}
.induction-toolbar {
  display: grid;
  grid-template-columns: 1fr minmax(200px, 300px) auto;
  align-items: center;
  gap: var(--induction-space);
  padding: 14px 16px;
}
.induction-toolbar-title {
  display: flex;
  align-items: center;
  gap: 9px;
}
/* Narrow overrides are necessary for the legacy global mobile heading/input rules. */
.induction-toolbar h2 {
  margin: 0;
  font-size: 14px !important;
  font-weight: 600;
  line-height: 1.5;
  letter-spacing: -0.1px;
}
.induction-count {
  display: inline-grid;
  place-items: center;
  min-width: 24px;
  height: 22px;
  padding-inline: 7px;
  border: 1px solid var(--hse-project-line);
  border-radius: 6px;
  background: var(--hse-project-surface-soft);
  color: var(--induction-muted);
  font-size: var(--induction-label);
  font-variant-numeric: tabular-nums;
}
.induction-search {
  position: relative;
  min-width: 0;
  width: 100%;
}
.induction-search > span {
  position: absolute;
  inset-inline-start: 12px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: var(--induction-muted);
}
.induction-search svg {
  display: block;
  width: 17px;
  height: 17px;
}
.induction-search input {
  box-sizing: border-box;
  width: 100%;
  height: var(--induction-control) !important;
  min-height: var(--induction-control) !important;
  padding: 8px 36px !important;
  border: 1px solid var(--hse-project-line);
  border-radius: 8px;
  background: var(--hse-project-surface);
  color: var(--hse-project-ink);
  font: inherit;
  font-size: var(--induction-text) !important;
}
.induction-search input::placeholder {
  color: var(--induction-muted);
}
.induction-search-clear {
  position: absolute;
  inset-inline-end: 4px;
  top: 4px;
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: 0;
  border-radius: 5px;
  color: var(--induction-muted);
  background: transparent;
  cursor: pointer;
}
.induction-search-clear:hover {
  background: var(--hse-project-surface-soft);
}
.induction-add {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: var(--induction-control);
  padding: 8px 16px;
  border-radius: 9px;
  background: var(--hse-project-blue);
  color: var(--identity-primaryButtonText, #fff);
  font-size: var(--induction-text);
  font-weight: 600;
  white-space: nowrap;
  text-decoration: none;
  box-shadow: none;
}
.induction-add svg {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}
.induction-add:hover {
  filter: brightness(0.95);
}
.induction-table-scroll {
  overflow-x: auto;
}
.induction-table {
  width: 100%;
  min-width: 960px;
  border-collapse: collapse;
  table-layout: fixed;
  text-align: start;
  font-size: var(--induction-text);
}
.induction-table th {
  padding: 12px 16px;
  border-block: 1px solid var(--hse-project-line);
  background: var(--hse-project-surface-soft);
  color: var(--induction-muted);
  font-size: var(--induction-label) !important;
  font-weight: 600;
  text-align: start;
  white-space: nowrap;
}
.induction-table td {
  padding: 14px 16px !important;
  border-bottom: 1px solid var(--hse-project-line-soft);
  vertical-align: middle;
  line-height: 1.5;
  overflow-wrap: anywhere;
}
.induction-table tbody tr:last-child td {
  border-bottom: 0;
}
.induction-table tbody tr:hover td {
  background: var(--hse-project-surface-soft);
}
.induction-number {
  color: var(--induction-muted);
  font-variant-numeric: tabular-nums;
}
.induction-person {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}
.induction-avatar {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  border-radius: 10px;
  background: var(--hse-project-ice);
  color: var(--hse-project-blue);
  font-size: 10px;
  font-weight: 700;
}
.induction-name {
  font-weight: 600;
  overflow-wrap: anywhere;
}
.induction-date {
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}
.induction-created {
  color: var(--induction-muted);
  font-size: 12px;
}
.induction-table td.induction-missing {
  color: var(--induction-muted);
}
/* Retain row actions while horizontally scrolling the real eight-column table. */
.induction-table :is(th, td):last-child {
  position: sticky;
  inset-inline-end: 0;
  background: var(--hse-project-surface);
  box-shadow: -1px 0 0 var(--hse-project-line-soft);
}
.induction-table th:last-child {
  background: var(--hse-project-surface-soft);
}
.induction-table tr:hover td:last-child {
  background: var(--hse-project-surface-soft);
}
.induction-table td.induction-actions {
  padding: 10px !important;
}
.induction-action-trigger {
  width: 36px;
  margin-inline: auto;
  border-radius: 7px;
}
.induction-action-trigger :deep(.list-trigger) {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border: 1px solid transparent;
  border-radius: 7px;
  background: transparent;
  cursor: pointer;
}
.induction-action-trigger :deep(.list-trigger svg) {
  display: none;
}
.induction-action-trigger :deep(.list-trigger)::before {
  content: '•••';
  display: block;
  color: var(--induction-muted);
  font-size: 12px;
  letter-spacing: 2px;
  line-height: 1;
}
.induction-action-trigger:hover :deep(.list-trigger) {
  background: var(--hse-project-ice);
  border-color: var(--hse-project-line);
}
.induction-footer {
  padding: 12px 20px;
  border-top: 1px solid var(--hse-project-line);
  color: var(--induction-muted);
  font-size: 12px;
}
.induction-footer :deep(.pagination-wrapper) {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  margin: 0;
  padding: 0;
  border: 0;
  box-shadow: none;
  background: transparent;
}
.induction-footer :deep(.pagination-btn),
.induction-footer :deep(.pagination-item) {
  min-height: 34px;
  min-width: 34px;
  border-radius: 6px;
  font-size: 12px;
  box-shadow: none;
}
.induction-register :deep(.data-state) {
  margin: 0;
  border: 0;
  border-radius: 0;
}
.induction-empty-clear {
  display: block;
  min-height: var(--induction-control);
  margin: -20px auto 24px;
  padding: 8px 14px;
  border: 1px solid var(--hse-project-line);
  border-radius: 8px;
  color: var(--hse-project-blue);
  background: var(--hse-project-surface);
  font: inherit;
  cursor: pointer;
}
.induction-loading {
  overflow: hidden;
}
.induction-loading :deep(.table-responsive) {
  margin: 0;
  padding: 0;
  border: 0;
  box-shadow: none;
  overflow: hidden;
}
.induction-loading :deep(table) {
  width: 100%;
  min-width: 960px;
  border-collapse: collapse;
}
.induction-loading :deep(th) {
  height: 42px;
  color: transparent;
  background: var(--hse-project-surface-soft);
  border-block: 1px solid var(--hse-project-line);
}
.induction-loading :deep(td) {
  height: 60px;
  padding: 14px 16px !important;
  border-bottom: 1px solid var(--hse-project-line-soft);
}
.induction-sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
.induction-register :is(a, button, input, [tabindex]):focus-visible {
  outline: 2px solid var(--hse-project-blue);
  outline-offset: 3px;
}
@media (max-width: 900px) {
  .induction-toolbar {
    grid-template-columns: 1fr auto;
  }
  .induction-toolbar-title {
    grid-column: 1 / -1;
  }
}
@media (max-width: 768px) {
  .induction-heading h1 {
    font-size: 24px;
  }
  .induction-footer {
    padding: 12px 16px;
  }
  .induction-action-trigger,
  .induction-action-trigger :deep(.list-trigger) {
    width: 40px;
    height: 40px;
  }
  .induction-table td.induction-actions {
    padding-inline: 8px !important;
  }
}
@media (max-width: 540px) {
  .induction-search input {
    font-size: 16px !important;
  }
  .induction-heading p {
    font-size: 12px;
  }
  .induction-toolbar {
    grid-template-columns: 1fr auto;
    padding: 14px 16px;
    gap: 14px 10px;
  }
  .induction-toolbar-title {
    grid-column: 1;
  }
  .induction-search {
    grid-row: 2;
    grid-column: 1 / -1;
  }
  .induction-add {
    grid-row: 1;
    grid-column: 2;
    padding: 8px 12px;
    font-size: 12px;
  }
  .induction-footer :deep(.pagination-wrapper),
  .induction-footer :deep(.pagination) {
    justify-content: flex-start;
  }
}

/* Iteration 5: a unified register rather than a floating title and separate card. */
.induction-register {
  --induction-text: 13px;
  --induction-control: 40px;
  border: 1px solid var(--hse-project-line);
  border-radius: 12px;
  background: var(--hse-project-surface);
  box-shadow: 0 3px 14px rgb(18 48 84 / 3%);
  overflow: hidden;
}
.induction-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  margin: 0;
  padding: 24px;
}
.induction-heading h1 {
  font-size: 30px;
  font-weight: 650;
  letter-spacing: -0.9px;
  line-height: 1.2;
}
.induction-heading p {
  margin-top: 9px;
  font-size: 13px;
}
.induction-panel {
  border: 0;
  border-radius: 0;
  box-shadow: none;
}
.induction-toolbar {
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 24px;
  border-top: 1px solid var(--hse-project-line-soft);
}
.induction-toolbar-title {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 3px;
}
.induction-toolbar h2 {
  font-size: 12px !important;
  font-weight: 500;
  color: var(--induction-muted);
}
.induction-count {
  display: block;
  height: auto;
  min-width: 0;
  padding: 0;
  border: 0;
  border-radius: 0;
  background: transparent;
  color: var(--hse-project-ink);
  font-size: 12px;
  font-weight: 600;
}
.induction-search {
  max-width: 340px;
}
.induction-search input {
  background: var(--hse-project-surface-soft);
  border-color: var(--hse-project-line);
  border-radius: 7px;
}
.induction-add {
  min-height: 40px;
  padding: 9px 16px;
  border-radius: 7px;
  font-size: 13px;
  box-shadow: none;
}
.induction-table {
  min-width: 880px;
}
.induction-table th {
  padding: 12px 18px;
  font-size: 12px !important;
  font-weight: 600;
  color: var(--hse-project-ink);
  background: var(--hse-project-surface-soft);
}
.induction-table td {
  height: 68px;
  padding: 14px 18px !important;
  font-size: 13px;
}
.induction-person {
  gap: 12px;
}
.induction-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: var(--hse-project-surface-soft);
  color: var(--hse-project-navy);
  border: 1px solid var(--hse-project-line);
  font-size: 11px;
  font-weight: 600;
}
.induction-name {
  font-size: 14px;
  font-weight: 600;
  line-height: 1.45;
}
.induction-date-main {
  display: block;
  color: var(--hse-project-ink);
  font-size: 13px;
  line-height: 1.5;
}
.induction-date-time {
  display: block;
  margin-top: 2px;
  color: var(--induction-muted);
  font-size: 11px;
  line-height: 1.45;
  direction: ltr;
  text-align: start;
}
.induction-footer {
  padding: 14px 24px;
  background: var(--hse-project-surface-soft);
}
.induction-table :is(th, td):first-child {
  padding-inline-start: 24px !important;
}
.induction-table td.induction-actions {
  padding: 8px !important;
}
.induction-action-trigger :deep(.list-trigger) {
  width: 36px;
  height: 36px;
  border-color: var(--hse-project-line);
  background: var(--hse-project-surface);
}
.induction-action-trigger :deep(.list-trigger)::before {
  font-size: 11px;
  letter-spacing: 1.5px;
  color: var(--hse-project-ink);
}
.induction-table-scroll {
  scrollbar-width: thin;
}
@media (max-width: 1024px) {
  .induction-header {
    padding: 22px 20px;
  }
  .induction-toolbar {
    padding: 14px 20px;
  }
  .induction-table th {
    padding-inline: 14px;
  }
  .induction-table td {
    padding-inline: 14px !important;
  }
  .induction-table :is(th, td):first-child {
    padding-inline-start: 16px !important;
  }
}
@media (max-width: 768px) {
  .induction-table {
    min-width: 880px;
  }
  .induction-heading h1 {
    font-size: 26px;
  }
  .induction-action-trigger :deep(.list-trigger) {
    width: 40px;
    height: 40px;
  }
}
@media (max-width: 540px) {
  .induction-header {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 10px;
    padding: 20px 16px;
  }
  .induction-heading {
    display: contents;
  }
  .induction-heading h1 {
    grid-row: 1;
    grid-column: 1;
    font-size: 24px;
  }
  .induction-heading p {
    grid-row: 2;
    grid-column: 1 / -1;
    margin: 0;
    font-size: 12px;
  }
  .induction-header .induction-add {
    grid-row: 1;
    grid-column: 2;
    padding: 8px 10px;
    font-size: 12px;
  }
  .induction-toolbar {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
    padding: 14px 16px;
  }
  .induction-toolbar-title {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
  .induction-search {
    max-width: none;
  }
  .induction-toolbar h2 {
    font-size: 12px !important;
  }
  .induction-table td {
    height: 68px;
  }
  .induction-footer {
    padding: 13px 16px;
  }
}
</style>
