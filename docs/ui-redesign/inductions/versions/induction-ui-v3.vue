<script setup lang="ts">
import { resolveProjectId } from '@/shared/utils/projectScope'
import { vProjectPanels } from '../../composables/projectPanels'

import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { formatDisplayNumber } from '@/localization/formatters'
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
const route = useRoute()
const initials = (name?: string) =>
  name
    ?.trim()
    .split(/\s+/u)
    .slice(0, 2)
    .map((part) => Array.from(part)[0])
    .join('')
    .toLocaleUpperCase() || '—'
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
          <p>
            {{
              $t('Record inductions and review the safety information needed before work begins.')
            }}
          </p>
        </div>
      </header>

      <div class="induction-panel">
        <div class="induction-toolbar">
          <div class="induction-toolbar-title">
            <h2>{{ $t('All Inductions') }}</h2>
            <span v-if="state.pagination" class="induction-count">{{
              formatDisplayNumber(state.pagination.total ?? 0)
            }}</span>
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
                  <col style="width: 22%" />
                  <col style="width: 14%" />
                  <col style="width: 12%" />
                  <col style="width: 10%" />
                  <col style="width: 13%" />
                  <col style="width: 19%" />
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
                    <td class="induction-date">{{ item.date || '—' }}</td>
                    <td class="induction-date induction-created">{{ item.createdAt || '—' }}</td>
                    <td class="induction-actions">
                      <div
                        class="induction-action-trigger"
                        role="button"
                        tabindex="0"
                        :aria-label="`${$t('Actions')}: ${item.instructorName || '—'}`"
                        aria-haspopup="menu"
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
            ><div class="induction-loading" aria-busy="true" :aria-label="$t('loading')">
              <span class="induction-sr-only">{{ $t('loading') }}</span
              ><TableLoader :cols="8" :rows="10" aria-hidden="true" /></div
          ></template>
          <template #initial
            ><div class="induction-loading" aria-busy="true" :aria-label="$t('loading')">
              <span class="induction-sr-only">{{ $t('loading') }}</span
              ><TableLoader :cols="8" :rows="10" aria-hidden="true" /></div
          ></template>
          <template #empty>
            <DataEmpty
              :link="`${basePath}/induction/add${projectQuery}`"
              :add-text="$t('add_induction')"
              :description="word ? $t('eq_no_results') : $t('no_inductions_description')"
              :title="word ? $t('eq_no_results') : $t('no_inductions')"
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
.induction-register {
  --induction-space: 24px;
  --induction-control: 40px;
  color: var(--hse-project-ink);
  font-family: inherit;
}
.induction-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 20px;
}
.induction-heading {
  max-width: 650px;
}
.induction-heading h1 {
  margin: 0;
  font-size: 26px;
  font-weight: 700;
  line-height: 1.3;
  letter-spacing: -0.7px;
  color: var(--hse-project-ink);
}
.induction-heading p {
  margin: 8px 0 0;
  font-size: 13px;
  line-height: 1.6;
  color: var(--hse-project-muted);
}
.induction-add {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex-shrink: 0;
  min-height: var(--induction-control);
  padding: 10px 16px;
  border-radius: 9px;
  background: var(--hse-project-blue);
  color: white;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
}
.induction-add :deep(svg) {
  width: 18px;
  height: 18px;
}
.induction-add:hover {
  filter: brightness(0.95);
}
.induction-panel {
  border: 1px solid var(--hse-project-line);
  border-radius: 14px;
  background: var(--hse-project-surface);
  box-shadow: 0 4px 16px rgb(18 48 84 / 4%);
  overflow: hidden;
}
.induction-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 14px 16px;
}
.induction-toolbar h2 {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
}
.induction-search {
  position: relative;
  width: 300px;
  max-width: 100%;
}
.induction-search > span {
  position: absolute;
  inset-inline-start: 12px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: var(--hse-project-muted);
}
.induction-search :deep(svg) {
  display: block;
  width: 17px;
  height: 17px;
}
.induction-search input {
  width: 100%;
  min-height: var(--induction-control);
  border: 1px solid var(--hse-project-line);
  border-radius: 8px;
  background: var(--hse-project-surface);
  padding: 8px 12px;
  padding-inline-start: 38px;
  font: inherit;
  font-size: 13px;
  color: var(--hse-project-ink);
}
.induction-search input::placeholder {
  color: var(--hse-project-muted);
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
  font-size: 13px;
}
.induction-table th {
  padding: 12px 16px;
  text-align: start;
  background: var(--hse-project-surface-soft);
  color: var(--hse-project-muted);
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
  border-block: 1px solid var(--hse-project-line);
}
.induction-table td {
  padding: 14px 16px;
  border-bottom: 1px solid var(--hse-project-line-soft);
  vertical-align: middle;
  line-height: 1.5;
}
.induction-table tbody tr:last-child td {
  border-bottom: 0;
}
.induction-table tbody tr:hover td {
  background: var(--hse-project-surface-soft);
}
.induction-number {
  width: 48px;
  color: var(--hse-project-muted);
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
  color: var(--hse-project-muted);
  font-size: 12px;
}
.induction-table td.induction-actions {
  width: 58px;
  padding-inline: 12px;
}
.induction-action-trigger {
  width: 32px;
  border-radius: 7px;
}
.induction-action-trigger :deep(.list-trigger) {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border: 1px solid var(--hse-project-line);
  border-radius: 7px;
  cursor: pointer;
  background: var(--hse-project-surface);
}
.induction-action-trigger :deep(svg) {
  width: 18px;
  height: 18px;
}
.induction-footer {
  padding: 14px 24px;
  border-top: 1px solid var(--hse-project-line);
  color: var(--hse-project-muted);
  font-size: 12px;
}
.induction-footer :deep(.pagination-wrapper) {
  margin: 0;
  padding: 0;
  border: 0;
  box-shadow: none;
  background: transparent;
}
.induction-register :deep(.data-state) {
  margin: 0;
  border: 0;
  border-radius: 0;
}
.induction-loading {
  overflow: hidden;
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
.induction-register :is(a, input, [tabindex]):focus-visible {
  outline: 2px solid var(--hse-project-blue);
  outline-offset: 3px;
}
@media (max-width: 768px) {
  .induction-header {
    align-items: flex-start;
    gap: 16px;
  }
  .induction-heading h1 {
    font-size: 24px;
  }
  .induction-toolbar {
    padding: 16px;
  }
  .induction-heading {
    max-width: 430px;
  }
  .induction-footer {
    padding: 14px 16px;
  }
}
@media (max-width: 540px) {
  .induction-header {
    flex-direction: column;
    margin-bottom: 18px;
  }
  .induction-add {
    width: 100%;
  }
  .induction-toolbar {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
  .induction-search {
    width: 100%;
  }
  .induction-heading p {
    font-size: 12px;
  }
}

/* Override the legacy global form/mobile rules only inside this experiment. */
.induction-toolbar h2 {
  font-size: 14px !important;
  line-height: 1.5;
  letter-spacing: -0.1px;
}
.induction-toolbar-title {
  display: flex;
  align-items: center;
  gap: 9px;
}
.induction-count {
  display: inline-grid;
  place-items: center;
  min-width: 24px;
  height: 22px;
  padding-inline: 7px;
  background: var(--hse-project-surface-soft);
  border: 1px solid var(--hse-project-line);
  border-radius: 6px;
  font-size: 11px;
  color: var(--hse-project-muted);
  font-variant-numeric: tabular-nums;
}
.induction-search input {
  height: var(--induction-control) !important;
  min-height: var(--induction-control) !important;
  padding: 8px 36px !important;
  font-size: 13px !important;
  box-sizing: border-box;
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
  color: var(--hse-project-muted);
  background: transparent;
  cursor: pointer;
}
.induction-search-clear:hover {
  background: var(--hse-project-surface-soft);
}
.induction-table td {
  overflow-wrap: anywhere;
  padding: 14px 16px !important;
}
.induction-table th {
  font-size: 11px !important;
}
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
.induction-actions .induction-action-trigger {
  margin-inline: auto;
}
.induction-action-trigger:hover :deep(.list-trigger) {
  background: var(--hse-project-ice);
  border-color: var(--hse-project-blue);
}
.induction-footer {
  padding: 12px 20px;
}
.induction-register :is(a, button, input, [tabindex]):focus-visible {
  outline: 2px solid var(--hse-project-blue);
  outline-offset: 3px;
}
@media (max-width: 540px) {
  .induction-header {
    gap: 14px;
  }
  .induction-toolbar {
    padding: 14px 16px;
    gap: 12px;
  }
  .induction-footer {
    padding: 12px 16px;
  }
}

.induction-toolbar {
  display: grid;
  grid-template-columns: 1fr minmax(200px, 300px) auto;
  gap: 16px;
}
.induction-heading {
  max-width: 760px;
}
.induction-add {
  box-shadow: none;
}
.induction-table td.induction-missing {
  color: var(--hse-project-muted);
}
.induction-action-trigger :deep(.list-trigger) {
  background: transparent;
  border-color: transparent;
}
.induction-action-trigger :deep(.list-trigger svg) {
  display: none;
}
.induction-action-trigger :deep(.list-trigger)::before {
  content: '•••';
  display: block;
  color: var(--hse-project-muted);
  font-size: 12px;
  letter-spacing: 2px;
  line-height: 1;
}
.induction-empty-clear {
  display: block;
  min-height: 40px;
  margin: -20px auto 24px;
  padding: 8px 14px;
  border: 1px solid var(--hse-project-line);
  border-radius: 8px;
  color: var(--hse-project-blue);
  background: var(--hse-project-surface);
  font: inherit;
  font-size: 13px;
  cursor: pointer;
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
.induction-footer :deep(.pagination-btn),
.induction-footer :deep(.pagination-item) {
  min-height: 34px;
  min-width: 34px;
  border-radius: 6px;
  font-size: 12px;
  box-shadow: none;
}
.induction-footer :deep(.pagination-wrapper) {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
}
@media (max-width: 900px) {
  .induction-toolbar {
    grid-template-columns: 1fr auto;
  }
  .induction-toolbar-title {
    grid-column: 1 / -1;
  }
  .induction-search {
    width: 100%;
  }
}
@media (max-width: 540px) {
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
    width: auto;
    padding: 8px 12px;
    font-size: 12px;
  }
  .induction-footer :deep(.pagination-wrapper),
  .induction-footer :deep(.pagination) {
    justify-content: flex-start;
  }
}
</style>
