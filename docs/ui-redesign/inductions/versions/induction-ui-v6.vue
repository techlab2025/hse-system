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
                  <col style="width: 23%" />
                  <col style="width: 15%" />
                  <col style="width: 12%" />
                  <col style="width: 10%" />
                  <col style="width: 13%" />
                  <col style="width: 16%" />
                  <col style="width: 7%" />
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

<style scoped src="./inductions-register.css"></style>
