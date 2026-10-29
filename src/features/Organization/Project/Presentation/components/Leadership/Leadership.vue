<script setup lang="ts">
import { getCurrentLocale } from '@/localization/i18n'

import { translate as localizeUi } from '@/localization/i18n'

import PermissionHandler from '@/base/Presentation/utils/permission_handler'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
import { vProjectPanels } from '../../composables/projectPanels'

import { computed, onMounted, reactive, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import Accordion from 'primevue/accordion'
import AccordionPanel from 'primevue/accordionpanel'
import AccordionHeader from 'primevue/accordionheader'
import AccordionContent from 'primevue/accordioncontent'
import DatePicker from 'primevue/datepicker'
import Dialog from 'primevue/dialog'
import UpdatedCustomInputSelect from '@/shared/FormInputs/UpdatedCustomInputSelect.vue'
import TitleInterface from '@/base/Data/Models/title_interface'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import TableLoader from '@/shared/DataStatues/TableLoader.vue'
import ShowProjectDetailsController from '@/features/Organization/Project/Presentation/controllers/ShowProjectDetailsController'
import ShowProjectDetailsParams from '@/features/Organization/Project/Core/params/ShowProjectDetailsParams'
import IndexOrganizatoinEmployeeController from '@/features/Organization/OrganizationEmployee/Presentation/controllers/indexOrganizatoinEmployeeController'
import IndexOrganizatoinEmployeeParams from '@/features/Organization/OrganizationEmployee/Core/params/indexOrganizatoinEmployeeParams'
import IndexVisitActivityController from '@/features/Organization/VisitActivity/Presentation/controllers/indexVisitActivityController'
import IndexVisitActivityParams from '@/features/Organization/VisitActivity/Core/params/indexVisitActivityParams'
import CreateLeadershipPlanParams, {
  type LeadershipVisitInput,
} from '../../../Core/params/Leadership/CreateLeadershipPlanParams'
import FetchAllLeadershipVisitsParams from '../../../Core/params/Leadership/FetchAllLeadershipVisitsParams'
import CreateLeadershipPlanController from '../../controllers/Leadership/CreateLeadershipPlanController'
import FetchAllLeadershipVisitsController from '../../controllers/Leadership/FetchAllLeadershipVisitsController'
import LeadershipPlanVisitParams from '../../../Core/params/Leadership/LeadershipPlanVisitParams'
import EditLeadershipVisitParams from '../../../Core/params/Leadership/EditLeadershipVisitParams'
import EditLeadershipVisitController from '../../controllers/Leadership/EditLeadershipVisitController'
import type LeadershipVisitModel from '../../../Data/models/Leadership/LeadershipVisitModel'

defineOptions({ name: 'ProjectLeadership' })

type ProjectMonth = {
  key: string
  label: string
  shortLabel: string
  monthNumber: number
  firstDate: string
  lastDate: string
}
const canFetch = computed(() =>
  PermissionHandler.Instance.handle([
    PermissionsEnum.ADMIN,
    PermissionsEnum.LEADERSHIP_ALL,
    PermissionsEnum.LEADERSHIP_FETCH,
  ]),
)
const canCreate = computed(() =>
  PermissionHandler.Instance.handle([
    PermissionsEnum.ADMIN,
    PermissionsEnum.LEADERSHIP_ALL,
    PermissionsEnum.LEADERSHIP_CRAETE,
  ]),
)
const route = useRoute()
const canEdit = computed(() =>
  PermissionHandler.Instance.handle([
    PermissionsEnum.ADMIN,
    PermissionsEnum.LEADERSHIP_ALL,
    PermissionsEnum.LEADERSHIP_UPDATE,
  ]),
)
const projectId = computed(() => Number(route.params.id))
const projectController = ShowProjectDetailsController.getInstance()
const projectState = projectController.state
const employeeController = IndexOrganizatoinEmployeeController.getInstance()
const employeeState = employeeController.state
const visitActivityController = IndexVisitActivityController.getInstance()
const visitActivityParams = new IndexVisitActivityParams('', 1, 10, 0)
const activityOptions = computed(() => visitActivityController.state.value.data ?? [])
const planController = CreateLeadershipPlanController.getInstance()
const visitsController = FetchAllLeadershipVisitsController.getInstance()
const visitsState = visitsController.state
const monthVisits = reactive<Record<string, LeadershipVisitInput[]>>({})
const errorMessage = ref('')
const successMessage = ref('')
const editController = EditLeadershipVisitController.getInstance()
const editDialogVisible = ref(false)
const editingVisit = ref<LeadershipVisitModel | null>(null)
const editedDate = ref<Date | null>(null)
const savingDate = ref(false)
const editError = ref('')

const newVisit = (): LeadershipVisitInput => ({
  date: '',
  location: '',
  orgnizationEmployeeIds: [],
  visitActivityIds: [],
})
const formatDate = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
const parseDate = (value: string): Date | null => (value ? new Date(`${value}T00:00:00`) : null)
const setVisitDate = (visit: LeadershipVisitInput, value: unknown) => {
  visit.date = value instanceof Date && !Number.isNaN(value.getTime()) ? formatDate(value) : ''
}
const selectedOptions = (options: TitleInterface[], ids: number[]): TitleInterface[] =>
  options.filter((option) => ids.includes(option.id))
const selectedIds = (value: TitleInterface | TitleInterface[] | null): number[] =>
  Array.isArray(value) ? value.map((option) => option.id) : value ? [value.id] : []
const months = computed<ProjectMonth[]>(() => {
  const startText = projectState.value.data?.startDate?.slice(0, 10)
  const endText = projectState.value.data?.endDate?.slice(0, 10)
  if (!startText || !endText) return []
  const start = new Date(`${startText}T00:00:00`)
  const end = new Date(`${endText}T00:00:00`)
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end < start) return []
  const result: ProjectMonth[] = []
  const cursor = new Date(start.getFullYear(), start.getMonth(), 1)
  const last = new Date(end.getFullYear(), end.getMonth(), 1)
  while (cursor <= last) {
    const year = cursor.getFullYear()
    const monthNumber = cursor.getMonth() + 1
    const first =
      year === start.getFullYear() && monthNumber === start.getMonth() + 1 ? start : cursor
    const endOfMonth = new Date(year, monthNumber, 0)
    const final =
      year === end.getFullYear() && monthNumber === end.getMonth() + 1 ? end : endOfMonth
    result.push({
      key: `${year}-${String(monthNumber).padStart(2, '0')}`,
      label: new Intl.DateTimeFormat(getCurrentLocale(), { month: 'long', year: 'numeric' }).format(
        cursor,
      ),
      shortLabel: new Intl.DateTimeFormat(getCurrentLocale(), { month: 'short' }).format(cursor),
      monthNumber,
      firstDate: formatDate(first),
      lastDate: formatDate(final),
    })
    cursor.setMonth(cursor.getMonth() + 1)
  }
  return result
})
const visits = computed(() => visitsState.value.data ?? [])
const employeeOptions = computed(() =>
  (employeeState.value.data ?? []).map(
    (employee) => new TitleInterface({ id: employee.id, title: employee.name }),
  ),
)
const rowsForMonth = (key: string) => monthVisits[key] ?? []
const savedVisitsForMonth = (key: string) => {
  return visits.value.filter((visit) => visit.date.slice(0, 7) === key)
}
const maxVisitsPerMonth = 4
const visitCountForMonth = (key: string) =>
  rowsForMonth(key).length + savedVisitsForMonth(key).length
const canAddVisit = (key: string) => canCreate.value && visitCountForMonth(key) < maxVisitsPerMonth
const addVisit = (key: string) => {
  if (!canAddVisit(key)) return
  if (!monthVisits[key]) monthVisits[key] = []
  monthVisits[key].push(newVisit())
}
const refreshVisits = async () => {
  if (!canFetch.value) return
  if (projectId.value > 0)
    await visitsController.fetchVisits(
      new FetchAllLeadershipVisitsParams({ projectId: projectId.value }),
    )
}
const openEditVisit = (visit: LeadershipVisitModel) => {
  if (!canEdit.value) return
  editingVisit.value = visit
  editedDate.value = parseDate(visit.date.slice(0, 10))
  editError.value = ''
  editDialogVisible.value = true
}
const saveVisitDate = async () => {
  if (!canEdit.value || !editingVisit.value || savingDate.value) return
  editError.value = ''
  const date = editedDate.value
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    editError.value = localizeUi('Choose a valid visit date.')
    return
  }
  const dateText = formatDate(date)
  const month = months.value.find(
    (month) => dateText >= month.firstDate && dateText <= month.lastDate,
  )
  if (!month) {
    editError.value = localizeUi('Choose a date within the project dates.')
    return
  }
  if (
    editingVisit.value.date.slice(0, 7) !== month.key &&
    visitCountForMonth(month.key) >= maxVisitsPerMonth
  ) {
    editError.value = `You can add a maximum of ${maxVisitsPerMonth} visits per month.`
    return
  }
  savingDate.value = true
  try {
    await editController.editVisit(new EditLeadershipVisitParams(editingVisit.value.id, dateText))
    if (!editController.isDataSuccess()) {
      editError.value =
        editController.state.value.error?.title ?? 'Unable to update the visit date.'
      return
    }
    editingVisit.value.date = dateText
    editDialogVisible.value = false
    await refreshVisits()
  } catch {
    editError.value = localizeUi('Unable to update the visit date.')
  } finally {
    savingDate.value = false
  }
}
const saveMonth = async (month: ProjectMonth) => {
  if (!canCreate.value) return
  errorMessage.value = ''
  successMessage.value = ''
  const rows = rowsForMonth(month.key)
  if (!rows.length) return
  if (visitCountForMonth(month.key) > maxVisitsPerMonth) {
    errorMessage.value = `You can add a maximum of ${maxVisitsPerMonth} visits per month.`
    return
  }
  if (
    rows.some(
      (row) =>
        !row.date ||
        row.date < month.firstDate ||
        row.date > month.lastDate ||
        !row.location.trim() ||
        !row.orgnizationEmployeeIds.length ||
        row.orgnizationEmployeeIds.some((id) => !Number.isInteger(id) || id <= 0) ||
        !row.visitActivityIds.length ||
        row.visitActivityIds.some((id) => !Number.isInteger(id) || id <= 0),
    )
  ) {
    errorMessage.value = localizeUi(
      'Complete every visit and choose a date within the selected month.',
    )
    return
  }
  try {
    // , month.monthNumber
    const AllVitis = rows.map(
      (el) =>
        new LeadershipPlanVisitParams(
          el.date,
          el.location,
          el.orgnizationEmployeeIds,
          el.visitActivityIds,
        ),
    )
    await planController.createPlan(new CreateLeadershipPlanParams(projectId.value, AllVitis))
    if (planController.isDataSuccess()) {
      monthVisits[month.key] = []
      successMessage.value = `${month.label} visits saved.`
      await refreshVisits()
    } else errorMessage.value = planController.state.value.error?.title ?? 'Unable to save visits.'
  } catch {
    errorMessage.value = localizeUi('Unable to save visits.')
  }
}
onMounted(async () => {
  if (!canFetch.value) return
  if (!Number.isInteger(projectId.value) || projectId.value <= 0) return
  await Promise.allSettled([
    projectController.showProjectDetails(new ShowProjectDetailsParams(projectId.value)),
    employeeController.getData(
      new IndexOrganizatoinEmployeeParams(
        '',
        0,
        0,
        0,
        null,
        undefined,
        undefined,
        undefined,
        undefined,
        false,
        projectId.value,
      ),
    ),
    refreshVisits(),
  ])
})
</script>

<template>
  <main
    v-if="canFetch"
    data-hse-project
    v-project-panels
    class="hse-project-root hse-project-assurance hse-project-page leadership-page"
  >
    <header data-hse-project-head class="hse-project-page-head hero">
      <div class="hero__art" aria-hidden="true"><span></span><span></span><span></span></div>
      <div class="hero__content">
        <!-- <div class="hero__symbol" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M12 3 14.4 8.6 20 11l-5.6 2.4L12 19l-2.4-5.6L4 11l5.6-2.4L12 3Z" />
            <path d="m19 3 .7 1.3L21 5l-1.3.7L19 7l-.7-1.3L17 5l1.3-.7L19 3Z" />
          </svg>
        </div> -->
        <div>
          <h1>{{ $t('Leadership Engagement') }}</h1>
          <!-- <p>
            Plan visits month by month, then turn each visit into a clear record of actions and
            observations.
          </p> -->
        </div>
      </div>
      <div class="hero__actions">
        <RouterLink
          :to="`/organization/project-details/${projectId}/leadership/visits`"
          class="hse-project-button hse-project-button--primary back-link back-link--primary"
        >
          <span>{{ $t('View leadership plans') }}</span> →
        </RouterLink>
        <RouterLink
          :to="`/organization/project-details/${projectId}`"
          class="hse-project-button back-link"
        >
          ← <span>{{ $t('Back to project') }}</span>
        </RouterLink>
      </div>
    </header>

    <!-- <div v-if="errorMessage" class="notice notice--error" role="alert">
      <span>!</span>{{ errorMessage }}
    </div>
    <div v-if="successMessage" class="notice notice--success" role="status">
      <span>✓</span>{{ successMessage }}
    </div> -->

    <DataStatus :controller="projectState">
      <template #success>
        <section class="hse-project-panel workspace-card">
          <div class="section-intro">
            <!-- <div> -->
            <!-- <h2>plans</h2> -->
            <!-- <p>Choose a project month, add one or more visits, and save them together.</p> -->
            <!-- </div> -->
            <div class="date-range">
              <span>{{ $t('Project duration') }}</span
              ><strong
                >{{ projectState.data?.startDate?.slice(0, 10) }} <i>→</i>
                {{ projectState.data?.endDate?.slice(0, 10) }}</strong
              >
            </div>
          </div>

          <div class="overview">
            <div class="overview__item">
              <span class="overview__icon">▦</span>
              <div>
                <small>{{ $t('Project months') }}</small
                ><strong>{{ months.length }}</strong>
              </div>
            </div>
            <div class="overview__item">
              <span class="overview__icon">◎</span>
              <div>
                <small>{{ $t('Planned visits') }}</small
                ><strong>{{ visits.length }}</strong>
              </div>
            </div>
            <!-- <div class="overview__item">
              <span class="overview__icon">✦</span>
              <div>
                <small>Planning status</small
                ><strong>{{ months.length ? 'Active' : 'Pending' }}</strong>
              </div>
            </div> -->
          </div>

          <Accordion v-if="months.length" :value="months[0]?.key" class="month-accordion">
            <AccordionPanel
              v-for="month in months"
              :key="month.key"
              :value="month.key"
              class="month-panel"
            >
              <AccordionHeader>
                <div class="month-heading">
                  <span class="month-heading__badge" aria-hidden="true">
                    <small>{{ month.shortLabel }}</small>
                    <strong>{{ String(month.monthNumber).padStart(2, '0') }}</strong>
                  </span>
                  <div class="month-heading__details">
                    <!-- <span class="month-heading__kicker">Monthly plan</span> -->
                    <strong>{{ month.label }}</strong>
                    <small>
                      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M7 3v3M17 3v3M4 9h16M6 5h12a2 2 0 0 1 2 2v12H4V7a2 2 0 0 1 2-2Z" />
                      </svg>
                      {{ month.firstDate }} <i>→</i> {{ month.lastDate }}
                    </small>
                  </div>
                  <span
                    class="visit-count"
                    :class="{ 'visit-count--empty': !savedVisitsForMonth(month.key).length }"
                  >
                    <b>{{ savedVisitsForMonth(month.key).length }}</b>
                    <span>
                      {{
                        savedVisitsForMonth(month.key).length === 1
                          ? $t('planned visit')
                          : $t('Planned visits')
                      }}
                    </span>
                  </span>
                </div>
              </AccordionHeader>
              <AccordionContent>
                <div class="month-body">
                  <!-- <div v-if="!rowsForMonth(month.key).length" class="month-empty">
                    <span class="month-empty__symbol">＋</span> -->
                  <div
                    v-if="!rowsForMonth(month.key).length && !savedVisitsForMonth(month.key).length"
                    class="month-empty"
                  >
                    <div>
                      <strong>{{ $t('Start this month’s plan') }}</strong>
                      <p>
                        {{ $t('Add a visit with its date, location, employee, and activity.') }}
                      </p>
                    </div>
                    <button
                      v-if="canAddVisit(month.key)"
                      type="button"
                      class="hse-project-button hse-project-button--primary button button--primary"
                      @click="addVisit(month.key)"
                    >
                      {{ $t('Add first visit') }}
                    </button>
                  </div>
                  <div v-if="savedVisitsForMonth(month.key).length" class="month-actions">
                    <button
                      v-if="canAddVisit(month.key)"
                      type="button"
                      class="hse-project-button button button--outline"
                      @click="addVisit(month.key)"
                    >
                      {{ $t('＋ Add another visit') }}
                    </button>
                  </div>

                  <div v-if="savedVisitsForMonth(month.key).length" class="saved-visits-table">
                    <h3>{{ $t('plans') }}</h3>

                    <div class="hse-table-scroll">
                      <table v-table-identity class="hse-project-table hse-data-table">
                        <thead>
                          <tr>
                            <th>{{ $t('plan') }}</th>
                            <th>{{ $t('Date') }}</th>
                            <th>{{ $t('Visit Location') }}</th>
                            <th>{{ $t('Report Status') }}</th>
                            <th v-if="canEdit">{{ $t('Actions') }}</th>
                            <!-- <th>Employee</th> -->
                            <!-- <th>Activity</th> -->
                          </tr>
                        </thead>

                        <tbody>
                          <tr
                            v-for="(visit, index) in savedVisitsForMonth(month.key)"
                            :key="visit.id"
                          >
                            <td>{{ $t('plan') }} {{ index + 1 }}</td>

                            <td>
                              {{ visit.date }}
                            </td>

                            <td>
                              {{ visit.location }}
                            </td>
                            <td>
                              {{
                                visit.hasReport ? $t('Report Submitted') : $t('not submitted yet')
                              }}
                            </td>
                            <td v-if="canEdit">
                              <button
                                type="button"
                                class="hse-project-button hse-project-button--secondary"
                                @click="openEditVisit(visit)"
                              >
                                {{ $t('Edit') }}
                              </button>
                            </td>

                            <!-- <td>
                            {{ visit.employees?.[0]?.employeeName ?? '-' }}
                          </td>

                          <td>
                            {{ visit.activities?.[0]?.title ?? '-' }}
                          </td> -->
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <!-- <div v-else class="draft-list"> -->
                  <div v-if="rowsForMonth(month.key).length" class="draft-list">
                    <article
                      v-for="(visit, index) in rowsForMonth(month.key)"
                      :key="index"
                      class="hse-project-panel draft-card"
                    >
                      <div class="draft-card__top">
                        <div class="draft-card__number">
                          {{ String(index + 1).padStart(2, '0') }}
                        </div>
                        <div>
                          <strong>{{ $t('Visit') }} {{ index + 1 }}</strong
                          ><small>{{ $t('Complete the details for this planned visit') }}</small>
                        </div>
                        <button
                          v-if="canCreate"
                          :aria-label="$t('delete')"
                          type="button"
                          class="hse-project-button hse-project-button--danger remove-button"
                          @click="monthVisits[month.key]?.splice(index, 1)"
                        >
                          {{ $t('Remove') }}
                        </button>
                      </div>
                      <div class="visit-fields">
                        <div class="hse-project-field visit-field">
                          <label
                            :for="`visit-date-${month.key}-${index}`"
                            class="hse-project-field-label visit-field__label"
                          >
                            <span class="visit-field__icon" aria-hidden="true">
                              <svg viewBox="0 0 24 24" fill="none">
                                <path
                                  d="M7 3v3M17 3v3M4 9h16M6 5h12a2 2 0 0 1 2 2v12H4V7a2 2 0 0 1 2-2Z"
                                />
                              </svg>
                            </span>
                            <span>{{ $t('Date') }} <b>*</b></span>
                          </label>
                          <DatePicker
                            panel-class="hse-project-overlay hse-project-assurance"
                            :input-id="`visit-date-${month.key}-${index}`"
                            :model-value="parseDate(visit.date)"
                            date-format="yy-mm-dd"
                            show-icon
                            fluid
                            :min-date="parseDate(month.firstDate) ?? undefined"
                            :max-date="parseDate(month.lastDate) ?? undefined"
                            :placeholder="$t('Select visit date')"
                            @update:model-value="(value) => setVisitDate(visit, value)"
                          />
                        </div>
                        <div class="hse-project-field visit-field">
                          <label
                            :for="`visit-location-${month.key}-${index}`"
                            class="hse-project-field-label visit-field__label"
                          >
                            <span class="visit-field__icon" aria-hidden="true">
                              <svg viewBox="0 0 24 24" fill="none">
                                <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" />
                                <circle cx="12" cy="10" r="2.5" />
                              </svg>
                            </span>
                            <span>{{ $t('Visit Location') }} <b>*</b></span>
                          </label>
                          <input
                            dir="auto"
                            class="hse-project-input"
                            :id="`visit-location-${month.key}-${index}`"
                            v-model="visit.location"
                            type="text"
                            :placeholder="$t('e.g. Main site')"
                            required
                          />
                        </div>
                        <UpdatedCustomInputSelect
                          :id="`visit-employee-${month.key}-${index}`"
                          class="hse-project-field visit-field visit-field--select"
                          :label="$t('Organization employee')"
                          :placeholder="$t('Select Visiting Managers')"
                          :required="true"
                          :reload="true"
                          :has-header="true"
                          :type="2"
                          :static-options="employeeOptions"
                          :model-value="
                            selectedOptions(employeeOptions, visit.orgnizationEmployeeIds)
                          "
                          @update:model-value="
                            (value) => {
                              visit.orgnizationEmployeeIds = selectedIds(value)
                            }
                          "
                        >
                          <template #Header>
                            <label class="hse-project-field-label visit-field__label">
                              <span class="visit-field__icon" aria-hidden="true">
                                <svg viewBox="0 0 24 24" fill="none">
                                  <circle cx="12" cy="8" r="3.5" />
                                  <path d="M5.5 20c.7-3.8 3-5.7 6.5-5.7s5.8 1.9 6.5 5.7" />
                                </svg>
                              </span>
                              <span>{{ $t('Visiting Managers') }} <b>*</b></span>
                            </label>
                          </template>
                        </UpdatedCustomInputSelect>
                        <UpdatedCustomInputSelect
                          :id="`visit-activity-${month.key}-${index}`"
                          class="hse-project-field visit-field visit-field--select"
                          :label="$t('Visit activity')"
                          :placeholder="$t('Select Activities')"
                          :required="true"
                          :reload="true"
                          :has-header="true"
                          :controller="visitActivityController"
                          :params="visitActivityParams"
                          :type="2"
                          :model-value="selectedOptions(activityOptions, visit.visitActivityIds)"
                          @update:model-value="
                            (value) => {
                              visit.visitActivityIds = selectedIds(value)
                            }
                          "
                        >
                          <template #Header>
                            <label class="hse-project-field-label visit-field__label">
                              <span class="visit-field__icon" aria-hidden="true">
                                <svg viewBox="0 0 24 24" fill="none">
                                  <path d="M8 4h8M9 3h6a1 1 0 0 1 1 1v2H8V4a1 1 0 0 1 1-1Z" />
                                  <path
                                    d="M7 5H6a2 2 0 0 0-2 2v12h16V7a2 2 0 0 0-2-2h-1M8 11h8M8 15h5"
                                  />
                                </svg>
                              </span>
                              <span>{{ $t('Visit Activities') }} <b>*</b></span>
                            </label>
                          </template>
                        </UpdatedCustomInputSelect>
                      </div>
                    </article>
                    <!-- <div class="month-actions">
                      <button v-if="canCreate"
                        type="button"
                        class="button button--outline"
                        @click="addVisit(month.key)"
                      >
                        ＋ Add another visit</button
                      ><button v-if="canCreate"
                        type="button"
                        class="button button--primary"
                        :disabled="planController.isDataLoading()"
                        @click="saveMonth(month)"
                      >
                        {{
                          planController.isDataLoading()
                            ? 'Saving…'
                            : `Save ${month.label}
                        visits`
                        }}
                      </button>
                    </div> -->
                    <div class="month-actions">
                      <button
                        v-if="canAddVisit(month.key)"
                        type="button"
                        class="hse-project-button button button--outline"
                        @click="addVisit(month.key)"
                      >
                        {{ $t('＋ Add another plan') }}
                      </button>

                      <button
                        v-if="canCreate"
                        type="button"
                        class="hse-project-button hse-project-button--primary button button--primary"
                        @click="saveMonth(month)"
                      >
                        {{ $t('Save plan') }}
                      </button>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionPanel>
          </Accordion>
          <div v-else class="empty-state">
            <span>▦</span><strong>{{ $t('No valid project date range') }}</strong>
            <p>{{ $t('Add valid start and end dates to the project before planning visits.') }}</p>
          </div>
        </section>
      </template>
      <template #loader>
        <TableLoader :cols="4" :rows="3" />
      </template>
      <template #initial>
        <TableLoader :cols="4" :rows="3" />
      </template>
      <template #failed>
        <div class="notice notice--error">{{ $t('Unable to load project dates.') }}</div>
      </template>
    </DataStatus>
    <Dialog
      v-model:visible="editDialogVisible"
      data-hse-project
      :dir="$i18n.locale.startsWith('ar') ? 'rtl' : 'ltr'"
      modal
      :header="$t('Edit visit date')"
      class="hse-project-root hse-project-assurance hse-project-overlay"
      :style="{ width: 'min(420px, 96vw)' }"
      :closable="!savingDate"
      :close-on-escape="!savingDate"
    >
      <form id="edit-leadership-visit-date" @submit.prevent="saveVisitDate">
        <div class="hse-project-field">
          <label for="edit-visit-date" class="hse-project-field-label">{{ $t('Date') }}</label>
          <DatePicker
            v-model="editedDate"
            input-id="edit-visit-date"
            panel-class="hse-project-overlay hse-project-assurance"
            date-format="yy-mm-dd"
            show-icon
            fluid
            :disabled="savingDate"
            :min-date="parseDate(months[0]?.firstDate ?? '') ?? undefined"
            :max-date="parseDate(months[months.length - 1]?.lastDate ?? '') ?? undefined"
            :placeholder="$t('Select visit date')"
          />
        </div>
        <p v-if="editError" class="notice notice--error" role="alert">{{ editError }}</p>
      </form>
      <template #footer>
        <button
          type="button"
          class="hse-project-button hse-project-button--secondary"
          :disabled="savingDate"
          @click="editDialogVisible = false"
        >
          {{ $t('Cancel') }}
        </button>
        <button
          type="submit"
          form="edit-leadership-visit-date"
          class="hse-project-button hse-project-button--primary"
          :disabled="savingDate || !editedDate"
        >
          {{ savingDate ? $t('emailSettings.saving') : $t('save') }}
        </button>
      </template>
    </Dialog>
  </main>
  <p v-else role="status">{{ $t('have_not_permission') }}</p>
</template>

<style scoped>
.visit-field--select :deep(.p-multiselect) {
  min-width: 0;
  max-width: 100%;
  overflow: hidden;
}

.visit-field--select :deep(.p-multiselect-label-container) {
  min-width: 0;
  overflow: hidden;
}

.visit-field--select :deep(.p-multiselect-label) {
  display: flex;
  flex-wrap: nowrap;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
}
.leadership-page {
  position: relative;
  display: grid;
  gap: 22px;
  /* padding: clamp(14px, 2vw, 28px); */
  min-height: 100%;
  /* background:
    radial-gradient(
      circle at 8% 4%,
      color-mix(in srgb, var(--hse-project-blue) 7%, transparent),
      transparent 24rem
    ),
    var(--hse-project-surface-soft); */
}

.hero {
  position: relative;
  isolation: isolate;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  overflow: hidden;
  padding: 20px;
  border: 1px solid color-mix(in srgb, var(--hse-project-blue) 18%, var(--hse-project-line));
  border-radius: var(--hse-project-radius-panel);
  background:
    radial-gradient(
      circle at 87% 12%,
      color-mix(in srgb, var(--hse-project-blue) 20%, transparent),
      transparent 34%
    ),
    linear-gradient(
      125deg,
      color-mix(in srgb, var(--hse-project-navy) 96%, var(--hse-project-surface)),
      color-mix(in srgb, var(--hse-project-blue) 76%, var(--hse-project-navy))
    );
  box-shadow: 0 24px 55px color-mix(in srgb, var(--hse-project-navy) 20%, transparent);
}

/* .hero::after {
  content: '';
  position: absolute;
  inset: auto 8% -55px auto;
  width: 220px;
  height: 105px;
  border-radius: 50%;
  background: color-mix(in srgb, var(--hse-project-blue) 36%, transparent);
  filter: blur(52px);
  pointer-events: none;
} */

.hero__content {
  display: flex;
  align-items: center;
  gap: 20px;
  position: relative;
  z-index: 1;
}

.hero__symbol {
  display: grid;
  place-items: center;
  flex: none;
  width: 72px;
  height: 72px;
  border-radius: var(--hse-project-radius-panel);
  border: 1px solid color-mix(in srgb, white 24%, transparent);
  color: white;
  background: color-mix(in srgb, white 12%, transparent);
  box-shadow:
    inset 0 1px 0 color-mix(in srgb, white 20%, transparent),
    0 14px 30px color-mix(in srgb, black 22%, transparent);
  backdrop-filter: blur(10px);
}

.hero__symbol svg {
  width: 36px;
  stroke: currentColor;
  stroke-width: 1.55;
  stroke-linejoin: round;
}

.hero__content h1 {
  margin: 4px 0 8px;
  color: white;
  font-size: clamp(1.8rem, 3vw, 2.6rem);
  line-height: 1.1;
}

.hero__content p {
  max-width: 630px;
  margin: 0;
  color: color-mix(in srgb, white 72%, transparent);
  line-height: 1.6;
}

.hero__art {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.hero__art span {
  position: absolute;
  border: 1px solid color-mix(in srgb, white 14%, transparent);
  border-radius: 50%;
}

.hero__art span:nth-child(1) {
  width: 300px;
  height: 300px;
  right: -90px;
  top: -150px;
}

.hero__art span:nth-child(2) {
  width: 210px;
  height: 210px;
  right: 70px;
  bottom: -160px;
}

.hero__art span:nth-child(3) {
  width: 110px;
  height: 110px;
  right: 260px;
  top: -65px;
}

.eyebrow {
  color: var(--hse-project-blue);
  font-size: 0.7rem;
  font-weight: 850;
  text-transform: uppercase;
  letter-spacing: 0.14em;
}

.hero .eyebrow {
  color: color-mix(in srgb, white 68%, var(--hse-project-blue));
}

.back-link {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  flex: none;
  padding: 11px 15px;
  border: 1px solid color-mix(in srgb, white 20%, transparent);
  border-radius: var(--hse-project-radius-control);
  color: white;
  background: color-mix(in srgb, white 10%, transparent);
  backdrop-filter: blur(12px);
  text-decoration: none;
  font-weight: 750;
}

.back-link:hover {
  border-color: color-mix(in srgb, white 45%, transparent);
  color: black;
  background: color-mix(in srgb, white 17%, transparent);
  transform: translateY(-1px);
}

.hero__actions {
  position: relative;
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 9px;
}

.back-link--primary {
  border-color: color-mix(in srgb, white 55%, transparent);
  color: var(--hse-project-navy);
  background: white;
}

.back-link--primary:hover {
  color: var(--hse-project-navy);
  background: color-mix(in srgb, white 90%, var(--hse-project-blue));
}

.notice {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  border-radius: var(--hse-project-radius-control);
  font-weight: 700;
}

.notice span {
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  border-radius: var(--hse-project-radius-control);
}

.notice--error {
  color: var(--hse-project-red);
  background: var(--hse-project-red-soft);
}

.notice--success {
  color: var(--hse-project-green);
  background: var(--hse-project-green-soft);
}

.workspace-card {
  position: relative;
  overflow: hidden;
  padding: clamp(20px, 3vw, 30px);
  border: 1px solid var(--hse-project-line);
  border-radius: var(--hse-project-radius-panel);
  background: var(--hse-project-surface);
  box-shadow: 0 16px 42px color-mix(in srgb, var(--hse-project-navy) 7%, transparent);
}

/* .workspace-card::before {
  content: '';
  position: absolute;
  inset: 0 0 auto;
  height: 3px;
  background: linear-gradient(
    90deg,
    var(--hse-project-blue),
    color-mix(in srgb, var(--hse-project-blue) 18%, transparent) 54%,
    transparent
  );
} */

.section-intro {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 18px;
  margin-bottom: 24px;
}

.section-intro h2 {
  margin: 5px 0 6px;
  color: var(--hse-project-ink);
  font-size: clamp(1.3rem, 2vw, 1.7rem);
}

.section-intro p {
  margin: 0;
  color: var(--hse-project-muted);
}

.date-range {
  display: grid;
  gap: 6px;
  min-width: 260px;
  padding: 13px 16px;
  border: 1px solid color-mix(in srgb, var(--hse-project-blue) 15%, var(--hse-project-line));
  border-radius: var(--hse-project-radius-panel);
  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--hse-project-blue) 8%, var(--hse-project-surface)),
    var(--hse-project-surface)
  );
  box-shadow: inset 0 1px 0 color-mix(in srgb, white 45%, transparent);
}

.date-range span {
  color: var(--hse-project-muted);
  font-size: 0.72rem;
  font-weight: 700;
}

.date-range strong {
  color: var(--hse-project-ink);
  font-size: 0.86rem;
  white-space: nowrap;
}

.date-range i {
  margin: 0 4px;
  color: var(--hse-project-blue);
  font-style: normal;
}

.overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
  margin-bottom: 24px;
}

.overview__item {
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
  padding: 16px;
  border: 1px solid var(--hse-project-line);
  border-radius: var(--hse-project-radius-panel);
  background: linear-gradient(
    140deg,
    color-mix(in srgb, var(--hse-project-surface-soft) 76%, var(--hse-project-surface)),
    var(--hse-project-surface)
  );
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.overview__item::after {
  content: '';
  position: absolute;
  width: 80px;
  height: 80px;
  inset: -48px -34px auto auto;
  border-radius: 50%;
  background: color-mix(in srgb, var(--hse-project-blue) 9%, transparent);
}

.overview__item:hover {
  transform: translateY(-2px);
  border-color: color-mix(in srgb, var(--hse-project-blue) 28%, var(--hse-project-line));
  box-shadow: 0 12px 25px color-mix(in srgb, var(--hse-project-navy) 6%, transparent);
}

.overview__icon {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  flex: none;
  border-radius: var(--hse-project-radius-panel);
  color: var(--hse-project-on-primary);
  background: linear-gradient(145deg, var(--hse-project-blue), var(--hse-project-navy2));
  box-shadow: 0 8px 18px color-mix(in srgb, var(--hse-project-blue) 20%, transparent);
  font-size: 1.4rem;
}

.overview__item div {
  display: grid;
  gap: 2px;
}

.overview__item small {
  color: var(--hse-project-muted);
}

.overview__item strong {
  color: var(--hse-project-ink);
  font-size: 1.3rem;
}

.month-accordion {
  display: grid;
  gap: 14px;
}

.month-panel {
  position: relative;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--hse-project-blue) 12%, var(--hse-project-line));
  border-radius: var(--hse-project-radius-panel);
  background: linear-gradient(
    130deg,
    color-mix(in srgb, var(--hse-project-surface-soft) 42%, var(--hse-project-surface)),
    var(--hse-project-surface) 54%
  );
  box-shadow: 0 7px 20px color-mix(in srgb, var(--hse-project-navy) 4%, transparent);
  transition:
    transform 0.25s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.month-panel::before {
  content: '';
  position: absolute;
  inset-block: 18px;
  inset-inline-start: 0;
  z-index: 2;
  width: 4px;
  border-radius: 0 8px 8px 0;
  background: linear-gradient(180deg, var(--hse-project-blue), var(--hse-project-navy2));
  opacity: 0;
  transform: scaleY(0.35);
  transition:
    opacity 0.2s ease,
    transform 0.25s ease;
}

.month-panel:hover {
  transform: translateY(-2px);
  border-color: color-mix(in srgb, var(--hse-project-blue) 32%, var(--hse-project-line));
  box-shadow: 0 14px 32px color-mix(in srgb, var(--hse-project-navy) 8%, transparent);
}

.month-panel.p-accordionpanel-active {
  border-color: color-mix(in srgb, var(--hse-project-blue) 36%, var(--hse-project-line));
  background: var(--hse-project-surface);
  box-shadow: 0 18px 38px color-mix(in srgb, var(--hse-project-navy) 10%, transparent);
}

.month-panel.p-accordionpanel-active::before {
  opacity: 1;
  transform: scaleY(1);
}

.month-heading {
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
  min-width: 0;
  text-align: start;
}

.month-heading__badge {
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 66px;
  height: 66px;
  flex: none;
  border: 1px solid color-mix(in srgb, white 20%, transparent);
  border-radius: var(--hse-project-radius-panel);
  color: var(--hse-project-on-primary);
  background:
    radial-gradient(circle at 80% 12%, color-mix(in srgb, white 24%, transparent), transparent 32%),
    linear-gradient(145deg, var(--hse-project-blue), var(--hse-project-navy2));
  box-shadow: 0 10px 22px color-mix(in srgb, var(--hse-project-blue) 24%, transparent);
}

.month-heading__badge::after {
  content: '';
  position: absolute;
  inset: 25px 9px auto;
  height: 1px;
  background: color-mix(in srgb, white 24%, transparent);
}

.month-heading__badge small {
  color: color-mix(in srgb, white 82%, transparent);
  font-size: 0.62rem;
  font-weight: 850;
  line-height: 1;
  text-transform: uppercase;
  letter-spacing: 0.12em;
}

.month-heading__badge strong {
  margin-top: 8px;
  color: white;
  font-size: 1.22rem;
  line-height: 1;
}

.month-heading__details {
  display: grid;
  gap: 4px;
  min-width: 0;
}

.month-heading__kicker {
  color: var(--hse-project-blue);
  font-size: 0.61rem;
  font-weight: 850;
  text-transform: uppercase;
  letter-spacing: 0.13em;
}

.month-heading__details > strong {
  color: var(--hse-project-ink);
  font-size: 1rem;
  line-height: 1.25;
}

.month-heading__details > small {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--hse-project-muted);
  font-size: 0.75rem;
}

.month-heading__details > small svg {
  width: 14px;
  height: 14px;
  flex: none;
  stroke: var(--hse-project-blue);
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.month-heading__details > small i {
  color: var(--hse-project-blue);
  font-style: normal;
}

.visit-count {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-inline-start: auto;
  padding: 7px 12px 7px 7px;
  border: 1px solid color-mix(in srgb, var(--hse-project-blue) 16%, var(--hse-project-line));
  border-radius: 999px;
  color: var(--hse-project-blue);
  background: color-mix(in srgb, var(--hse-project-blue) 7%, var(--hse-project-surface));
  font-size: 0.68rem;
  font-weight: 800;
  white-space: nowrap;
}

.visit-count b {
  display: grid;
  place-items: center;
  width: 27px;
  height: 27px;
  border-radius: 50%;
  color: var(--hse-project-on-primary);
  background: var(--hse-project-blue);
  box-shadow: 0 5px 12px color-mix(in srgb, var(--hse-project-blue) 22%, transparent);
  font-size: 0.74rem;
}

.visit-count--empty {
  color: var(--hse-project-muted);
  background: color-mix(in srgb, var(--hse-project-surface-soft) 70%, var(--hse-project-surface));
}

.visit-count--empty b {
  color: var(--hse-project-muted);
  background: color-mix(in srgb, var(--hse-project-muted) 10%, var(--hse-project-surface));
  box-shadow: none;
}

.month-body {
  padding: 8px 4px 12px;
}

.month-empty,
.empty-state {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 22px;
  border: 1px dashed color-mix(in srgb, var(--hse-project-blue) 24%, var(--hse-project-line));
  border-radius: var(--hse-project-radius-panel);
  background: color-mix(in srgb, var(--hse-project-blue) 3%, var(--hse-project-surface));
}

.month-empty__symbol,
.empty-state > span {
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  flex: none;
  border-radius: var(--hse-project-radius-control);
  color: var(--hse-project-blue);
  background: color-mix(in srgb, var(--hse-project-blue) 10%, var(--hse-project-surface));
  font-size: 1.5rem;
}

.month-empty div {
  flex: 1;
}

.month-empty strong,
.empty-state strong {
  color: var(--hse-project-ink);
}

.month-empty p,
.empty-state p {
  margin: 4px 0 0;
  color: var(--hse-project-muted);
  font-size: 0.82rem;
}

.empty-state {
  flex-direction: column;
  text-align: center;
}

.draft-list {
  display: grid;
  gap: 12px;
}

.draft-card {
  position: relative;
  overflow: hidden;
  padding: 16px;
  border: 1px solid var(--hse-project-line);
  border-radius: var(--hse-project-radius-panel);
  background: color-mix(in srgb, var(--hse-project-surface-soft) 68%, var(--hse-project-surface));
}

.draft-card::before {
  content: '';
  position: absolute;
  inset-block: 0;
  inset-inline-start: 0;
  width: 3px;
  background: linear-gradient(var(--hse-project-blue), var(--hse-project-navy2));
}

.draft-card__top {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}

.draft-card__number {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  flex: none;
  border-radius: var(--hse-project-radius-control);
  color: var(--hse-project-on-primary);
  background: var(--hse-project-blue);
  font-weight: 850;
}

.draft-card__top strong,
.draft-card__top small {
  display: block;
}

.draft-card__top strong {
  color: var(--hse-project-ink);
}

.draft-card__top small {
  color: var(--hse-project-muted);
  font-size: 0.7rem;
}

.remove-button {
  margin-inline-start: auto;
  border: 0;
  color: var(--hse-project-red);
  background: transparent;
  cursor: pointer;
  font-weight: 750;
}

.visit-fields {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.visit-field {
  display: grid;
  align-content: start;
  gap: 10px;
  min-width: 0;
  padding: 14px;
  border: 1px solid color-mix(in srgb, var(--hse-project-blue) 10%, var(--hse-project-line));
  border-radius: var(--hse-project-radius-panel);
  background: var(--hse-project-surface);
  box-shadow: 0 5px 16px color-mix(in srgb, var(--hse-project-navy) 4%, transparent);
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;
}

.visit-field:hover,
.visit-field:focus-within {
  border-color: color-mix(in srgb, var(--hse-project-blue) 34%, var(--hse-project-line));
  box-shadow: 0 10px 24px color-mix(in srgb, var(--hse-project-navy) 7%, transparent);
  transform: translateY(-1px);
}

.visit-field__label {
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 9px;
  min-width: 0;
  color: var(--hse-project-ink);
  font-size: 0.8rem;
  font-weight: 800;
  line-height: 1.25;
}

.visit-field__label > span:last-child {
  min-width: 0;
}

.visit-field__label b {
  color: var(--hse-project-red);
  font-weight: 850;
}

.visit-field__icon {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  flex: none;
  border-radius: var(--hse-project-radius-control);
  color: var(--hse-project-blue);
  background: color-mix(in srgb, var(--hse-project-blue) 10%, var(--hse-project-surface));
}

.visit-field__icon svg {
  width: 15px;
  height: 15px;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.visit-fields input,
.visit-fields select {
  min-width: 0;
  width: 100%;
  min-height: 46px;
  padding: 11px 13px;
  border: 1px solid color-mix(in srgb, var(--hse-project-blue) 10%, var(--hse-project-line));
  border-radius: var(--hse-project-radius-control);
  outline: none;
  color: var(--hse-project-ink);
  background: color-mix(in srgb, var(--hse-project-surface-soft) 52%, var(--hse-project-surface));
  font: inherit;
  font-weight: 500;
}

.visit-fields input:focus,
.visit-fields select:focus {
  border-color: var(--hse-project-blue);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--hse-project-blue) 14%, transparent);
}

.visit-fields :deep(.p-datepicker),
.visit-fields :deep(.p-inputtext),
.visit-fields :deep(.p-select) {
  width: 100%;
  min-width: 0;
}

.visit-fields :deep(.p-select) {
  min-height: 46px;
  border-color: color-mix(in srgb, var(--hse-project-blue) 10%, var(--hse-project-line));
  border-radius: var(--hse-project-radius-control);
  background: color-mix(in srgb, var(--hse-project-surface-soft) 52%, var(--hse-project-surface));
}

.visit-field--select.updated-custom-input-select {
  display: grid;
  gap: 10px;
}

.visit-field--select :deep(.input-label) {
  min-height: 28px;
  align-items: start;
}

.visit-field--select :deep(.p-select-label) {
  display: flex;
  align-items: start;
  padding-inline: 13px;
}

.visit-field--select :deep(.p-select-dropdown) {
  width: 44px;
  color: var(--hse-project-blue);
}

@media (min-width: 1380px) {
  .visit-fields {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

.month-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-block: 20px;
}

.button {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: 7px;
  padding: 11px 15px;
  border: 1px solid transparent;
  border-radius: var(--hse-project-radius-control);
  cursor: pointer;
  font-weight: 800;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease;
}

.button--primary {
  color: var(--hse-project-on-primary);
  background: linear-gradient(135deg, var(--hse-project-blue), var(--hse-project-navy2));
  box-shadow: 0 9px 20px color-mix(in srgb, var(--hse-project-blue) 22%, transparent);
}

.button--primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 13px 26px color-mix(in srgb, var(--hse-project-blue) 28%, transparent);
}

.button--outline {
  border-color: color-mix(in srgb, var(--hse-project-blue) 40%, var(--hse-project-line));
  color: var(--hse-project-blue);
  background: var(--hse-project-surface);
}

.button:disabled {
  opacity: 0.55;
  cursor: wait;
}

:deep(.p-accordionheader) {
  position: relative;
  z-index: 1;
  min-height: 92px;
  padding: 13px 18px;
  border: 0;
  background: transparent !important;
  transition: background 0.2s ease;
}

:deep(.p-accordionheader:hover) {
  background: color-mix(in srgb, var(--hse-project-blue) 3%, transparent) !important;
}

.month-panel.p-accordionpanel-active :deep(.p-accordionheader) {
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--hse-project-blue) 7%, transparent),
    transparent 48%
  ) !important;
}

:deep(.p-accordionheader-toggle-icon) {
  width: 18px;
  height: 18px;
  margin-inline-start: 12px;
  padding: 5px;
  box-sizing: content-box;
  border-radius: 50%;
  color: var(--hse-project-blue);
  background: color-mix(in srgb, var(--hse-project-blue) 9%, var(--hse-project-surface));
  transition:
    transform 0.25s ease,
    background 0.2s ease;
}

.month-panel.p-accordionpanel-active :deep(.p-accordionheader-toggle-icon) {
  background: color-mix(in srgb, var(--hse-project-blue) 15%, var(--hse-project-surface));
}

:deep(.p-accordioncontent-content) {
  padding: 14px 20px 20px;
  border-top: 1px solid color-mix(in srgb, var(--hse-project-blue) 10%, var(--hse-project-line));
  background: linear-gradient(
    180deg,
    color-mix(in srgb, var(--hse-project-blue) 2%, var(--hse-project-surface)),
    var(--hse-project-surface) 80px
  ) !important;
}

button:focus-visible,
a:focus-visible,
input:focus-visible,
select:focus-visible {
  outline: 3px solid color-mix(in srgb, var(--hse-project-blue) 24%, transparent);
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  .back-link,
  .overview__item,
  .month-panel,
  .button {
    transition: none;
  }
}

@media (max-width: 1050px) {
  .visit-fields {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 720px) {
  .hero,
  .section-intro,
  .month-empty {
    flex-wrap: wrap;
  }

  .overview {
    grid-template-columns: 1fr;
  }

  .hero__symbol {
    width: 55px;
    height: 55px;
  }

  .date-range {
    min-width: 0;
    width: 100%;
  }

  .month-empty .button {
    width: 100%;
  }

  .hero__actions,
  .hero__actions .back-link {
    width: 100%;
  }

  .hero__actions .back-link {
    justify-content: center;
  }
}

@media (max-width: 520px) {
  .visit-fields {
    grid-template-columns: 1fr;
  }

  .month-heading__badge {
    width: 52px;
    height: 56px;
    border-radius: var(--hse-project-radius-panel);
  }

  .month-heading__badge::after {
    inset-block-start: 22px;
  }

  .month-heading__badge strong {
    margin-top: 7px;
    font-size: 1rem;
  }

  .month-heading {
    gap: 10px;
  }

  .month-heading__details > small svg,
  .month-heading__details > small i,
  .visit-count span {
    display: none;
  }

  .visit-count {
    padding: 4px;
  }

  :deep(.p-accordionheader) {
    min-height: 78px;
    padding: 10px 12px;
  }

  :deep(.p-accordionheader-toggle-icon) {
    margin-inline-start: 5px;
  }

  :deep(.p-accordioncontent-content) {
    padding: 12px;
  }

  .month-actions {
    flex-direction: column;
  }
}

.input-label label {
  width: 100% !important;
}

.saved-visits-table {
  margin-bottom: 18px;
  overflow-x: auto;
}

.saved-visits-table h3 {
  margin-bottom: 12px;
  color: var(--hse-project-ink);
  font-size: 1rem;
}

.saved-visits-table table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid var(--hse-project-line);
  border-radius: var(--hse-project-radius-control);
  overflow: hidden;
}

.saved-visits-table th {
  padding: 12px;
  text-align: start;
  background: var(--hse-project-surface-soft);
  color: var(--hse-project-ink);
  font-weight: 800;
}

.saved-visits-table td {
  padding: 12px;
  border-top: 1px solid var(--hse-project-line);
  color: var(--hse-project-muted);
}

.saved-visits-table tbody tr:hover {
  background: color-mix(in srgb, var(--hse-project-blue) 5%, transparent);
}
</style>
