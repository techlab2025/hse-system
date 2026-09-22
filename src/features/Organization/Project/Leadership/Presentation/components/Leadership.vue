<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import Accordion from 'primevue/accordion'
import AccordionPanel from 'primevue/accordionpanel'
import AccordionHeader from 'primevue/accordionheader'
import AccordionContent from 'primevue/accordioncontent'
import Dialog from 'primevue/dialog'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import TableLoader from '@/shared/DataStatues/TableLoader.vue'
import ShowProjectDetailsController from '@/features/Organization/Project/Presentation/controllers/ShowProjectDetailsController'
import ShowProjectDetailsParams from '@/features/Organization/Project/Core/params/ShowProjectDetailsParams'
import IndexOrganizatoinEmployeeController from '@/features/Organization/OrganizationEmployee/Presentation/controllers/indexOrganizatoinEmployeeController'
import IndexOrganizatoinEmployeeParams from '@/features/Organization/OrganizationEmployee/Core/params/indexOrganizatoinEmployeeParams'
import CreateLeadershipPlanParams, { type LeadershipVisitInput } from '../../Core/params/CreateLeadershipPlanParams'
import FetchAllLeadershipVisitsParams from '../../Core/params/FetchAllLeadershipVisitsParams'
import CreateLeadershipVisitReportParams, { type VisitImprovementInput } from '../../Core/params/CreateLeadershipVisitReportParams'
import { UnsafeVisitTypeEnum } from '../../Core/enums/UnsafeVisitTypeEnum'
import CreateLeadershipPlanController from '../controllers/CreateLeadershipPlanController'
import FetchAllLeadershipVisitsController from '../controllers/FetchAllLeadershipVisitsController'
import CreateLeadershipVisitReportController from '../controllers/CreateLeadershipVisitReportController'
import type LeadershipVisitModel from '../../Data/models/LeadershipVisitModel'

defineOptions({ name: 'ProjectLeadership' })

const route = useRoute()
const projectId = computed(() => Number(route.params.id))
const projectController = ShowProjectDetailsController.getInstance()
const projectState = projectController.state
const employeeController = IndexOrganizatoinEmployeeController.getInstance()
const employeeState = employeeController.state
const planController = CreateLeadershipPlanController.getInstance()
const planState = planController.state
const visitsController = FetchAllLeadershipVisitsController.getInstance()
const visitsState = visitsController.state
const reportController = CreateLeadershipVisitReportController.getInstance()
const reportState = reportController.state
const monthVisits = reactive<Record<string, LeadershipVisitInput[]>>({})
const selectedVisit = ref<LeadershipVisitModel | null>(null)
const topic = ref('')
const discussion = ref('')
const observations = ref('')
const improvements = ref<VisitImprovementInput[]>([])
const attachments = ref<string[]>([])
const errorMessage = ref('')
const successMessage = ref('')

const newVisit = (): LeadershipVisitInput => ({
  date: '',
  location: '',
  orgnizationEmployeeId: 0,
  visitActivityId: 0,
})
const newImprovement = (): VisitImprovementInput => ({
  areas: '',
  interventionCarriedOut: '',
  uaUc: UnsafeVisitTypeEnum.UnsafeAct,
  visitThemId: 0,
  visitCategoryId: 0,
})
const formatDate = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

const months = computed(() => {
  const startText = projectState.value.data?.startDate?.slice(0, 10)
  const endText = projectState.value.data?.endDate?.slice(0, 10)
  if (!startText || !endText) return []
  const start = new Date(`${startText}T00:00:00`)
  const end = new Date(`${endText}T00:00:00`)
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end < start) return []
  const result: { key: string; label: string; monthNumber: number; firstDate: string; lastDate: string }[] = []
  const cursor = new Date(start.getFullYear(), start.getMonth(), 1)
  const last = new Date(end.getFullYear(), end.getMonth(), 1)
  while (cursor <= last) {
    const year = cursor.getFullYear()
    const monthNumber = cursor.getMonth() + 1
    const first = year === start.getFullYear() && monthNumber === start.getMonth() + 1 ? start : cursor
    const endOfMonth = new Date(year, monthNumber, 0)
    const final = year === end.getFullYear() && monthNumber === end.getMonth() + 1 ? end : endOfMonth
    result.push({
      key: `${year}-${String(monthNumber).padStart(2, '0')}`,
      label: new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' }).format(cursor),
      monthNumber,
      firstDate: formatDate(first),
      lastDate: formatDate(final),
    })
    cursor.setMonth(cursor.getMonth() + 1)
  }
  return result
})

const employeeOptions = computed(() => employeeState.value.data ?? [])
const visits = computed(() => visitsState.value.data ?? [])
const rowsForMonth = (key: string) => monthVisits[key] ?? []
const addVisit = (key: string) => {
  if (!monthVisits[key]) monthVisits[key] = []
  monthVisits[key].push(newVisit())
}
const refreshVisits = async () => {
  if (projectId.value > 0) await visitsController.fetchVisits(new FetchAllLeadershipVisitsParams(projectId.value))
}
const saveMonth = async (month: (typeof months.value)[number]) => {
  errorMessage.value = ''
  successMessage.value = ''
  const rows = rowsForMonth(month.key)
  if (!rows.length) return
  if (rows.some((row) => !row.date || row.date < month.firstDate || row.date > month.lastDate || !row.location.trim() || row.orgnizationEmployeeId <= 0 || row.visitActivityId <= 0)) {
    errorMessage.value = 'Complete every visit and choose a date within the selected month.'
    return
  }
  await planController.createPlan(new CreateLeadershipPlanParams(projectId.value, month.monthNumber, rows))
  if (planController.isDataSuccess()) {
    monthVisits[month.key] = []
    successMessage.value = `${month.label} visits saved.`
    await refreshVisits()
  } else errorMessage.value = planState.value.error?.title ?? 'Unable to save visits.'
}
const openReport = (visit: LeadershipVisitModel) => {
  selectedVisit.value = visit
  topic.value = ''
  discussion.value = ''
  observations.value = ''
  improvements.value = [newImprovement()]
  attachments.value = []
  errorMessage.value = ''
  successMessage.value = ''
}
const saveReport = async () => {
  if (!selectedVisit.value) return
  errorMessage.value = ''
  if (!topic.value.trim() || !discussion.value.trim() || !observations.value.trim() || improvements.value.some((row) => !row.areas.trim() || !row.interventionCarriedOut.trim() || row.visitThemId <= 0 || row.visitCategoryId <= 0)) {
    errorMessage.value = 'Complete the report and every improvement row.'
    return
  }
  await reportController.createReport(new CreateLeadershipVisitReportParams(
    selectedVisit.value.id,
    topic.value.trim(),
    discussion.value.trim(),
    observations.value.trim(),
    improvements.value,
    attachments.value.map((item) => item.trim()).filter(Boolean),
  ))
  if (reportController.isDataSuccess()) {
    selectedVisit.value = null
    successMessage.value = 'Visit report submitted.'
    await refreshVisits()
  } else errorMessage.value = reportState.value.error?.title ?? 'Unable to submit the report.'
}
onMounted(async () => {
  if (!Number.isInteger(projectId.value) || projectId.value <= 0) return
  await Promise.allSettled([
    projectController.showProjectDetails(new ShowProjectDetailsParams(projectId.value)),
    employeeController.getData(new IndexOrganizatoinEmployeeParams('', 0, 0, 0, null, undefined, undefined, undefined, undefined, false, projectId.value)),
    refreshVisits(),
  ])
})
</script>
<template>
  <main class="leadership-page">
    <!-- =========================
         HERO / PAGE HEADER
    ========================== -->
    <header class="page-hero">
      <div class="hero-decoration hero-decoration--one"></div>
      <div class="hero-decoration hero-decoration--two"></div>

      <div class="hero-content">
        <div class="hero-icon">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M8 6V4M16 6V4M5 9H19M6 20H18C19.1046 20 20 19.1046 20 18V7C20 5.89543 19.1046 5 18 5H6C4.89543 5 4 5.89543 4 7V18C4 19.1046 4.89543 20 6 20Z"
              stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M9 14L11 16L15 12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"
              stroke-linejoin="round" />
          </svg>
        </div>

        <div class="hero-copy">
          <div class="hero-badge">
            Leadership Management
          </div>

          <h1>Leadership Visits</h1>

          <p>
            Plan monthly leadership visits, assign employees and activities,
            and document completed visit reports.
          </p>
        </div>
      </div>

      <RouterLink :to="`/organization/project-details/${projectId}`" class="back-button">
        <span class="back-button__icon">←</span>
        <span>Back to project</span>
      </RouterLink>
    </header>

    <!-- =========================
         FEEDBACK
    ========================== -->
    <Transition name="message">
      <div v-if="errorMessage" role="alert" class="feedback feedback--error">
        <div class="feedback__icon">!</div>

        <div>
          <strong>Something needs your attention</strong>
          <p>{{ errorMessage }}</p>
        </div>
      </div>
    </Transition>

    <Transition name="message">
      <div v-if="successMessage" role="status" class="feedback feedback--success">
        <div class="feedback__icon">✓</div>

        <div>
          <strong>Successfully completed</strong>
          <p>{{ successMessage }}</p>
        </div>
      </div>
    </Transition>

    <!-- =========================
         PROJECT / MONTHLY PLAN
    ========================== -->
    <DataStatus :controller="projectState">
      <template #success>
        <section class="dashboard-section">
          <div class="section-heading">
            <div>
              <div class="section-heading__eyebrow">
                Visit planning
              </div>

              <h2>Monthly Plan</h2>

              <p>
                Create leadership visits for every month within your project
                duration.
              </p>
            </div>

            <div class="project-duration-card">
              <div class="project-duration-card__icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M8 2V5M16 2V5M3.5 9H20.5M5 4H19C20.1046 4 21 4.89543 21 6V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V6C3 4.89543 3.89543 4 5 4Z"
                    stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
                </svg>
              </div>

              <div>
                <span>Project duration</span>

                <strong>
                  {{ projectState.data?.startDate?.slice(0, 10) }}
                  <span class="date-separator">→</span>
                  {{ projectState.data?.endDate?.slice(0, 10) }}
                </strong>
              </div>
            </div>
          </div>

          <!-- Summary -->
          <div class="summary-grid">
            <article class="summary-card">
              <div class="summary-card__icon summary-card__icon--purple">
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M8 2V5M16 2V5M3.5 9H20.5M5 4H19C20.1046 4 21 4.89543 21 6V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V6C3 4.89543 3.89543 4 5 4Z"
                    stroke="currentColor" stroke-width="1.8" />
                </svg>
              </div>

              <div>
                <span>Project Months</span>
                <strong>{{ months.length }}</strong>
              </div>
            </article>

            <article class="summary-card">
              <div class="summary-card__icon summary-card__icon--blue">
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M16 21V19C16 16.7909 14.2091 15 12 15H6C3.79086 15 2 16.7909 2 19V21M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11ZM17 11L19 13L22 9"
                    stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </div>

              <div>
                <span>Planned Visits</span>
                <strong>{{ visits.length }}</strong>
              </div>
            </article>

            <article class="summary-card">
              <div class="summary-card__icon summary-card__icon--orange">
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 8V12L14.5 14.5M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                    stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
                </svg>
              </div>

              <div>
                <span>Planning Status</span>
                <strong>{{ months.length ? 'Active' : 'Pending' }}</strong>
              </div>
            </article>
          </div>

          <!-- Months -->
          <div v-if="months.length" class="monthly-plan-container">
            <Accordion :value="months[0]?.key">
              <AccordionPanel v-for="month in months" :key="month.key" :value="month.key" class="month-panel">
                <AccordionHeader>
                  <div class="month-header">
                    <div class="month-header__left">
                      <div class="month-icon">
                        {{ month.label.slice(0, 3) }}
                      </div>

                      <div>
                        <strong>{{ month.label }}</strong>

                        <span>
                          {{ month.firstDate }}
                          →
                          {{ month.lastDate }}
                        </span>
                      </div>
                    </div>

                    <span class="visit-count">
                      {{ rowsForMonth(month.key).length }}
                      {{
                        rowsForMonth(month.key).length === 1
                          ? 'draft visit'
                          : 'draft visits'
                      }}
                    </span>
                  </div>
                </AccordionHeader>

                <AccordionContent>
                  <div class="month-content">
                    <!-- Empty Month -->
                    <div v-if="!rowsForMonth(month.key).length" class="month-empty">
                      <div class="month-empty__icon">
                        <svg viewBox="0 0 24 24" fill="none">
                          <path d="M12 8V16M8 12H16" stroke="currentColor" stroke-width="2" stroke-linecap="round" />

                          <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.6" />
                        </svg>
                      </div>

                      <div>
                        <strong>No visits added yet</strong>

                        <p>
                          Start planning this month by creating your first
                          leadership visit.
                        </p>
                      </div>

                      <button type="button" class="modern-button modern-button--primary" @click="addVisit(month.key)">
                        <span class="button-plus">+</span>
                        Add first visit
                      </button>
                    </div>

                    <!-- Visit Cards -->
                    <TransitionGroup name="visit-list" tag="div" class="visit-list">
                      <article v-for="(visit, index) in rowsForMonth(month.key)" :key="index" class="visit-card">
                        <div class="visit-card__header">
                          <div class="visit-number">
                            <span>{{ index + 1 }}</span>

                            <div>
                              <strong>Leadership Visit</strong>
                              <small>Complete the visit details below</small>
                            </div>
                          </div>

                          <button type="button" class="icon-button icon-button--danger" title="Remove visit"
                            @click="monthVisits[month.key]?.splice(index, 1)">
                            <svg viewBox="0 0 24 24" fill="none">
                              <path d="M4 7H20M10 11V17M14 11V17M6 7L7 20H17L18 7M9 7V4H15V7" stroke="currentColor"
                                stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                          </button>
                        </div>

                        <div class="visit-fields">
                          <label class="form-field">
                            <span class="form-label">
                              Date
                              <b>*</b>
                            </span>

                            <div class="input-wrapper">
                              <input v-model="visit.date" type="date" :min="month.firstDate" :max="month.lastDate"
                                required />
                            </div>
                          </label>

                          <label class="form-field">
                            <span class="form-label">
                              Location
                              <b>*</b>
                            </span>

                            <div class="input-wrapper">
                              <input v-model="visit.location" type="text" placeholder="e.g. Main construction site"
                                required />
                            </div>
                          </label>

                          <label class="form-field">
                            <span class="form-label">
                              Organization employee
                              <b>*</b>
                            </span>

                            <div class="input-wrapper">
                              <select v-model.number="visit.orgnizationEmployeeId" required>
                                <option :value="0" disabled>
                                  Select employee
                                </option>

                                <option v-for="employee in employeeOptions" :key="employee.id" :value="employee.id">
                                  {{ employee.name }}
                                </option>
                              </select>
                            </div>
                          </label>

                          <label class="form-field">
                            <span class="form-label">
                              Visit activity ID
                              <b>*</b>
                            </span>

                            <div class="input-wrapper">
                              <input v-model.number="visit.visitActivityId" type="number" min="1"
                                placeholder="Activity ID" required />
                            </div>
                          </label>
                        </div>
                      </article>
                    </TransitionGroup>

                    <div v-if="rowsForMonth(month.key).length" class="month-footer">
                      <button type="button" class="modern-button modern-button--ghost" @click="addVisit(month.key)">
                        <span class="button-plus">+</span>
                        Add another visit
                      </button>

                      <button type="button" class="modern-button modern-button--primary modern-button--save" :disabled="!rowsForMonth(month.key).length ||
                        planController.isDataLoading()
                        " @click="saveMonth(month)">
                        <svg viewBox="0 0 24 24" fill="none">
                          <path d="M5 4H16L20 8V20H5V4ZM8 4V9H16V4M8 20V14H17V20" stroke="currentColor"
                            stroke-width="1.7" stroke-linejoin="round" />
                        </svg>

                        {{
                          planController.isDataLoading()
                            ? 'Saving...'
                            : `Save ${month.label} visits`
                        }}
                      </button>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionPanel>
            </Accordion>
          </div>

          <div v-else class="empty-state">
            <div class="empty-state__illustration">
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M8 2V5M16 2V5M3.5 9H20.5M5 4H19C20.1046 4 21 4.89543 21 6V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V6C3 4.89543 3.89543 4 5 4Z"
                  stroke="currentColor" stroke-width="1.7" />
              </svg>
            </div>

            <strong>No valid project date range</strong>

            <p>
              Add valid project start and end dates before creating a
              leadership visit plan.
            </p>
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
        <div class="state-error">
          Unable to load project dates.
        </div>
      </template>
    </DataStatus>

    <!-- =========================
         SAVED VISITS
    ========================== -->
    <section class="dashboard-section">
      <div class="section-heading section-heading--visits">
        <div>
          <div class="section-heading__eyebrow">
            Visit history
          </div>

          <h2>Leadership Visits</h2>

          <p>
            Review planned visits and submit detailed reports once visits are
            completed.
          </p>
        </div>

        <div class="total-visits-pill">
          <span>{{ visits.length }}</span>
          Total visits
        </div>
      </div>

      <DataStatus :controller="visitsState">
        <template #success>
          <div v-if="visits.length" class="visits-table-card">
            <div class="table-responsive">
              <table class="modern-table">
                <thead>
                  <tr>
                    <th>Visit date</th>
                    <th>Location</th>
                    <th>Employee</th>
                    <th>Activity</th>
                    <th class="action-column">Action</th>
                  </tr>
                </thead>

                <tbody>
                  <tr v-for="visit in visits" :key="visit.id">
                    <td>
                      <div class="table-date">
                        <div class="table-date__icon">
                          <svg viewBox="0 0 24 24" fill="none">
                            <path
                              d="M8 3V6M16 3V6M4 9H20M6 5H18C19.1046 5 20 5.89543 20 7V19C20 20.1046 19.1046 21 18 21H6C4.89543 21 4 20.1046 4 19V7C4 5.89543 4.89543 5 6 5Z"
                              stroke="currentColor" stroke-width="1.7" />
                          </svg>
                        </div>

                        <strong>{{ visit.date }}</strong>
                      </div>
                    </td>

                    <td>
                      <div class="location-cell">
                        <span class="location-dot"></span>
                        {{ visit.location }}
                      </div>
                    </td>

                    <td>
                      <div class="employee-cell">
                        <div class="employee-avatar">
                          {{
                            visit.organizationEmployeeName
                              ?.charAt(0)
                              ?.toUpperCase() || 'E'
                          }}
                        </div>

                        <span>
                          {{ visit.organizationEmployeeName }}
                        </span>
                      </div>
                    </td>

                    <td>
                      <span class="activity-chip">
                        {{ visit.visitActivityName }}
                      </span>
                    </td>

                    <td class="action-column">
                      <button type="button" class="report-button" @click="openReport(visit)">
                        <svg viewBox="0 0 24 24" fill="none">
                          <path
                            d="M8 4H6C4.89543 4 4 4.89543 4 6V20H18C19.1046 20 20 19.1046 20 18V8M8 4V8H16V4M8 4H16M8 12H16M8 16H14"
                            stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>

                        Report visit
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div v-else class="empty-state empty-state--visits">
            <div class="empty-state__illustration">
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M8 6V4M16 6V4M5 9H19M6 20H18C19.1046 20 20 19.1046 20 18V7C20 5.89543 19.1046 5 18 5H6C4.89543 5 4 5.89543 4 7V18C4 19.1046 4.89543 20 6 20Z"
                  stroke="currentColor" stroke-width="1.7" />
              </svg>
            </div>

            <strong>No leadership visits yet</strong>

            <p>
              Create your first visit from the monthly planning section above.
            </p>
          </div>
        </template>

        <template #loader>
          <TableLoader :cols="5" :rows="4" />
        </template>

        <template #initial>
          <TableLoader :cols="5" :rows="4" />
        </template>

        <template #empty>
          <div class="empty-state">
            No visits have been planned yet.
          </div>
        </template>

        <template #failed>
          <div class="state-error">
            Unable to load visits.
          </div>
        </template>
      </DataStatus>
    </section>

    <!-- =========================
         REPORT DIALOG
    ========================== -->
    <Dialog :visible="Boolean(selectedVisit)" modal :style="{ width: 'min(920px, 96vw)' }"
      class="leadership-report-dialog" @update:visible="
        (visible: boolean) => {
          if (!visible) selectedVisit = null
        }
      ">
      <template #header>
        <div class="dialog-custom-header">
          <div class="dialog-header-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="M8 4H6C4.89543 4 4 4.89543 4 6V20H18C19.1046 20 20 19.1046 20 18V8M8 4V8H16V4M8 4H16M8 12H16M8 16H14"
                stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </div>

          <div>
            <h3>Leadership Visit Report</h3>
            <p>Document observations and improvement actions.</p>
          </div>
        </div>
      </template>

      <form class="report-form" @submit.prevent="saveReport">
        <!-- Visit info -->
        <div class="selected-visit-banner">
          <div>
            <span class="selected-visit-banner__label">
              Selected visit
            </span>

            <strong>
              {{ selectedVisit?.location }}
            </strong>
          </div>

          <span class="selected-visit-date">
            {{ selectedVisit?.date }}
          </span>
        </div>

        <!-- Basic Information -->
        <section class="dialog-section">
          <div class="dialog-section__heading">
            <div class="dialog-step">01</div>

            <div>
              <h4>Visit Details</h4>
              <p>Provide the main discussion information.</p>
            </div>
          </div>

          <div class="dialog-fields">
            <label class="form-field form-field--full">
              <span class="form-label">
                Topic
                <b>*</b>
              </span>

              <input v-model="topic" type="text" placeholder="Enter visit topic" required />
            </label>

            <label class="form-field form-field--full">
              <span class="form-label">
                Discussion
                <b>*</b>
              </span>

              <textarea v-model="discussion" rows="4" placeholder="Describe what was discussed during the visit..."
                required></textarea>
            </label>

            <label class="form-field form-field--full">
              <span class="form-label">
                Observations
                <b>*</b>
              </span>

              <textarea v-model="observations" rows="4" placeholder="Write your main observations..."
                required></textarea>
            </label>
          </div>
        </section>

        <!-- Improvements -->
        <section class="dialog-section">
          <div class="dialog-section__heading">
            <div class="dialog-step">02</div>

            <div>
              <h4>Improvement Actions</h4>
              <p>
                Document unsafe acts, conditions, and corrective interventions.
              </p>
            </div>
          </div>

          <TransitionGroup name="visit-list" tag="div" class="improvements-list">
            <article v-for="(improvement, index) in improvements" :key="index" class="improvement-card">
              <div class="improvement-card__header">
                <div>
                  <span class="improvement-index">
                    Improvement {{ index + 1 }}
                  </span>
                </div>

                <button v-if="improvements.length > 1" type="button" class="icon-button icon-button--danger"
                  title="Remove improvement" @click="improvements.splice(index, 1)">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M4 7H20M10 11V17M14 11V17M6 7L7 20H17L18 7M9 7V4H15V7" stroke="currentColor"
                      stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </button>
              </div>

              <div class="improvement-fields">
                <label class="form-field">
                  <span class="form-label">
                    Area
                    <b>*</b>
                  </span>

                  <input v-model="improvement.areas" type="text" placeholder="Improvement area" required />
                </label>

                <label class="form-field">
                  <span class="form-label">
                    Intervention carried out
                    <b>*</b>
                  </span>

                  <input v-model="improvement.interventionCarriedOut" type="text" placeholder="Action taken" required />
                </label>

                <label class="form-field">
                  <span class="form-label">
                    UA / UC
                    <b>*</b>
                  </span>

                  <select v-model.number="improvement.uaUc">
                    <option :value="UnsafeVisitTypeEnum.UnsafeAct">
                      Unsafe act
                    </option>

                    <option :value="UnsafeVisitTypeEnum.UnsafeCondition">
                      Unsafe condition
                    </option>
                  </select>
                </label>

                <label class="form-field">
                  <span class="form-label">
                    Visit theme ID
                    <b>*</b>
                  </span>

                  <input v-model.number="improvement.visitThemId" type="number" min="1" placeholder="Theme ID"
                    required />
                </label>

                <label class="form-field">
                  <span class="form-label">
                    Visit category ID
                    <b>*</b>
                  </span>

                  <input v-model.number="improvement.visitCategoryId" type="number" min="1" placeholder="Category ID"
                    required />
                </label>
              </div>
            </article>
          </TransitionGroup>

          <button type="button" class="add-improvement-button" @click="improvements.push(newImprovement())">
            <span>+</span>
            Add improvement
          </button>
        </section>

        <!-- Attachments -->
        <section class="dialog-section">
          <div class="dialog-section__heading">
            <div class="dialog-step">03</div>

            <div>
              <h4>Attachments</h4>
              <p>Add supporting documents or attachment paths if needed.</p>
            </div>
          </div>

          <div v-if="attachments.length" class="attachments-list">
            <div v-for="(_, index) in attachments" :key="index" class="attachment-field">
              <div class="attachment-input-wrapper">
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M8 12.5L13.5 7C14.8807 5.61929 17.1193 5.61929 18.5 7C19.8807 8.38071 19.8807 10.6193 18.5 12L11 19.5C8.79086 21.7091 5.20914 21.7091 3 19.5C0.790861 17.2909 0.790861 13.7091 3 11.5L10 4.5"
                    stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
                </svg>

                <input v-model="attachments[index]" type="text" placeholder="Attachment URL or path" />
              </div>

              <button type="button" class="icon-button icon-button--danger" @click="attachments.splice(index, 1)">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M4 7H20M10 11V17M14 11V17M6 7L7 20H17L18 7M9 7V4H15V7" stroke="currentColor"
                    stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </button>
            </div>
          </div>

          <button type="button" class="add-improvement-button" @click="attachments.push('')">
            <span>+</span>
            Add attachment
          </button>
        </section>

        <footer class="dialog-footer">
          <button type="button" class="modern-button modern-button--ghost" @click="selectedVisit = null">
            Cancel
          </button>

          <button type="submit" class="modern-button modern-button--primary submit-report-button"
            :disabled="reportController.isDataLoading()">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M5 4H16L20 8V20H5V4ZM8 4V9H16V4M8 20V14H17V20" stroke="currentColor" stroke-width="1.7"
                stroke-linejoin="round" />
            </svg>

            {{
              reportController.isDataLoading()
                ? 'Submitting...'
                : 'Submit visit report'
            }}
          </button>
        </footer>
      </form>
    </Dialog>
  </main>
</template>

<style scoped>
/* ========================================
   PAGE
======================================== */

.leadership-page {
  --leadership-primary: #5b5bd6;
  --leadership-primary-dark: #4747bd;
  --leadership-primary-soft: rgba(91, 91, 214, 0.1);

  --leadership-blue: #2f80ed;
  --leadership-orange: #f2994a;

  --leadership-danger: #e5484d;
  --leadership-danger-soft: rgba(229, 72, 77, 0.08);

  --leadership-success: #20a779;
  --leadership-success-soft: rgba(32, 167, 121, 0.09);

  --leadership-card:
    var(--surface-card, var(--surface-0, #ffffff));

  --leadership-bg:
    var(--surface-ground, #f7f8fc);

  --leadership-border:
    var(--surface-border, #e8eaf0);

  --leadership-text:
    var(--text-color, #25262b);

  --leadership-muted:
    var(--text-color-secondary, #73767c);

  min-height: 100%;
  display: grid;
  gap: 24px;
  padding: 24px;
  background:
    radial-gradient(circle at 0 0,
      rgba(91, 91, 214, 0.055),
      transparent 32%),
    var(--leadership-bg);
}

/* ========================================
   HERO
======================================== */

.page-hero {
  position: relative;
  isolation: isolate;
  overflow: hidden;

  display: flex;
  align-items: center;
  justify-content: space-between;

  min-height: 180px;
  padding: 32px;

  border: 1px solid rgba(91, 91, 214, 0.13);
  border-radius: 24px;

  background:
    linear-gradient(130deg,
      rgba(91, 91, 214, 0.14),
      rgba(91, 91, 214, 0.035) 48%,
      transparent 80%),
    var(--leadership-card);

  box-shadow:
    0 1px 2px rgba(16, 24, 40, 0.03),
    0 14px 40px rgba(16, 24, 40, 0.055);
}

.hero-content {
  position: relative;
  z-index: 2;

  display: flex;
  align-items: center;
  gap: 20px;
}

.hero-icon {
  width: 68px;
  height: 68px;

  display: grid;
  place-items: center;
  flex: 0 0 auto;

  border-radius: 20px;

  color: white;

  background:
    linear-gradient(135deg,
      var(--leadership-primary),
      #7c5ce5);

  box-shadow:
    0 12px 28px rgba(91, 91, 214, 0.3);
}

.hero-icon svg {
  width: 32px;
  height: 32px;
}

.hero-copy {
  max-width: 680px;
}

.hero-badge {
  width: fit-content;

  margin-bottom: 9px;
  padding: 5px 10px;

  border-radius: 999px;

  color: var(--leadership-primary);

  background: var(--leadership-primary-soft);

  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.07em;
  text-transform: uppercase;
}

.hero-copy h1 {
  margin: 0;

  color: var(--leadership-text);

  font-size: clamp(27px, 3vw, 38px);
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.035em;
}

.hero-copy p {
  max-width: 600px;

  margin: 10px 0 0;

  color: var(--leadership-muted);

  font-size: 14px;
  line-height: 1.7;
}

.hero-decoration {
  position: absolute;
  z-index: -1;

  border-radius: 999px;

  pointer-events: none;

  filter: blur(2px);
}

.hero-decoration--one {
  width: 280px;
  height: 280px;

  top: -170px;
  right: 100px;

  background: rgba(91, 91, 214, 0.1);
}

.hero-decoration--two {
  width: 180px;
  height: 180px;

  right: -55px;
  bottom: -115px;

  background: rgba(47, 128, 237, 0.08);
}

.back-button {
  position: relative;
  z-index: 2;

  display: inline-flex;
  align-items: center;
  gap: 9px;

  min-height: 42px;
  padding: 0 17px;

  border: 1px solid var(--leadership-border);
  border-radius: 12px;

  color: var(--leadership-text);

  background: var(--leadership-card);

  font-size: 13px;
  font-weight: 700;
  text-decoration: none;

  box-shadow: 0 3px 10px rgba(16, 24, 40, 0.04);

  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.back-button:hover {
  transform: translateY(-2px);

  border-color: rgba(91, 91, 214, 0.35);

  box-shadow: 0 8px 18px rgba(16, 24, 40, 0.08);
}

.back-button__icon {
  font-size: 18px;
  line-height: 1;
}

/* ========================================
   MESSAGES
======================================== */

.feedback {
  display: flex;
  align-items: flex-start;
  gap: 12px;

  padding: 14px 16px;

  border: 1px solid transparent;
  border-radius: 14px;
}

.feedback__icon {
  width: 28px;
  height: 28px;

  display: grid;
  place-items: center;
  flex: 0 0 auto;

  border-radius: 9px;

  font-size: 13px;
  font-weight: 900;
}

.feedback strong {
  display: block;

  margin-bottom: 2px;

  color: var(--leadership-text);

  font-size: 13px;
}

.feedback p {
  margin: 0;

  color: var(--leadership-muted);

  font-size: 12px;
}

.feedback--error {
  border-color: rgba(229, 72, 77, 0.16);

  background: var(--leadership-danger-soft);
}

.feedback--error .feedback__icon {
  color: var(--leadership-danger);

  background: rgba(229, 72, 77, 0.12);
}

.feedback--success {
  border-color: rgba(32, 167, 121, 0.17);

  background: var(--leadership-success-soft);
}

.feedback--success .feedback__icon {
  color: var(--leadership-success);

  background: rgba(32, 167, 121, 0.12);
}

/* ========================================
   MAIN SECTION
======================================== */

.dashboard-section {
  padding: 26px;

  border: 1px solid var(--leadership-border);
  border-radius: 22px;

  background: var(--leadership-card);

  box-shadow:
    0 1px 2px rgba(16, 24, 40, 0.02),
    0 10px 30px rgba(16, 24, 40, 0.035);
}

.section-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;

  margin-bottom: 24px;
}

.section-heading__eyebrow {
  margin-bottom: 5px;

  color: var(--leadership-primary);

  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.07em;
  text-transform: uppercase;
}

.section-heading h2 {
  margin: 0;

  color: var(--leadership-text);

  font-size: 23px;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.section-heading p {
  margin: 6px 0 0;

  color: var(--leadership-muted);

  font-size: 13px;
  line-height: 1.65;
}

/* ========================================
   PROJECT DATE
======================================== */

.project-duration-card {
  min-width: 300px;

  display: flex;
  align-items: center;
  gap: 12px;

  padding: 11px 15px;

  border: 1px solid var(--leadership-border);
  border-radius: 14px;

  background:
    var(--surface-50, rgba(0, 0, 0, 0.018));
}

.project-duration-card__icon {
  width: 40px;
  height: 40px;

  display: grid;
  place-items: center;

  border-radius: 11px;

  color: var(--leadership-primary);

  background: var(--leadership-primary-soft);
}

.project-duration-card__icon svg {
  width: 20px;
  height: 20px;
}

.project-duration-card span {
  display: block;

  margin-bottom: 2px;

  color: var(--leadership-muted);

  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
}

.project-duration-card strong {
  color: var(--leadership-text);

  font-size: 12px;
  font-weight: 700;
}

.date-separator {
  display: inline !important;

  margin: 0 5px !important;

  color: var(--leadership-primary) !important;

  font-size: 13px !important;
}

/* ========================================
   SUMMARY
======================================== */

.summary-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;

  margin-bottom: 24px;
}

.summary-card {
  display: flex;
  align-items: center;
  gap: 13px;

  padding: 16px;

  border: 1px solid var(--leadership-border);
  border-radius: 16px;

  background:
    var(--surface-50, rgba(0, 0, 0, 0.014));

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.summary-card:hover {
  transform: translateY(-2px);

  box-shadow: 0 9px 22px rgba(16, 24, 40, 0.05);
}

.summary-card__icon {
  width: 44px;
  height: 44px;

  display: grid;
  place-items: center;
  flex: 0 0 auto;

  border-radius: 13px;
}

.summary-card__icon svg {
  width: 21px;
  height: 21px;
}

.summary-card__icon--purple {
  color: var(--leadership-primary);
  background: rgba(91, 91, 214, 0.1);
}

.summary-card__icon--blue {
  color: var(--leadership-blue);
  background: rgba(47, 128, 237, 0.1);
}

.summary-card__icon--orange {
  color: var(--leadership-orange);
  background: rgba(242, 153, 74, 0.11);
}

.summary-card span {
  display: block;

  margin-bottom: 3px;

  color: var(--leadership-muted);

  font-size: 11px;
  font-weight: 600;
}

.summary-card strong {
  color: var(--leadership-text);

  font-size: 20px;
  font-weight: 800;
}

/* ========================================
   ACCORDION
======================================== */

.monthly-plan-container {
  overflow: hidden;

  border: 1px solid var(--leadership-border);
  border-radius: 17px;
}

:deep(.p-accordionpanel) {
  border: 0 !important;
  border-bottom: 1px solid var(--leadership-border) !important;
}

:deep(.p-accordionpanel:last-child) {
  border-bottom: 0 !important;
}

:deep(.p-accordionheader) {
  padding: 16px 18px !important;

  border: 0 !important;

  background:
    var(--surface-50, rgba(0, 0, 0, 0.014)) !important;

  color: var(--leadership-text) !important;
}

:deep(.p-accordionheader:hover) {
  background:
    var(--surface-100, rgba(0, 0, 0, 0.025)) !important;
}

:deep(.p-accordioncontent-content) {
  padding: 0 !important;

  border: 0 !important;

  background: var(--leadership-card) !important;
}

.month-header {
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  padding-right: 10px;
}

.month-header__left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.month-icon {
  width: 45px;
  height: 45px;

  display: grid;
  place-items: center;

  border-radius: 12px;

  color: var(--leadership-primary);

  background: var(--leadership-primary-soft);

  font-size: 11px;
  font-weight: 900;
  text-transform: uppercase;
}

.month-header strong {
  display: block;

  color: var(--leadership-text);

  font-size: 14px;
  font-weight: 800;
}

.month-header span {
  display: block;

  margin-top: 3px;

  color: var(--leadership-muted);

  font-size: 11px;
  font-weight: 500;
}

.visit-count {
  width: fit-content;

  margin: 0 !important;
  padding: 5px 9px;

  border-radius: 999px;

  color: var(--leadership-primary) !important;

  background: var(--leadership-primary-soft);

  font-size: 10px !important;
  font-weight: 700 !important;
}

.month-content {
  padding: 18px;
}

/* ========================================
   MONTH EMPTY
======================================== */

.month-empty {
  display: flex;
  align-items: center;
  gap: 14px;

  padding: 18px;

  border: 1px dashed rgba(91, 91, 214, 0.24);
  border-radius: 15px;

  background: rgba(91, 91, 214, 0.025);
}

.month-empty__icon {
  width: 42px;
  height: 42px;

  display: grid;
  place-items: center;
  flex: 0 0 auto;

  border-radius: 13px;

  color: var(--leadership-primary);

  background: var(--leadership-primary-soft);
}

.month-empty__icon svg {
  width: 23px;
  height: 23px;
}

.month-empty>div:nth-child(2) {
  flex: 1;
}

.month-empty strong {
  color: var(--leadership-text);

  font-size: 13px;
}

.month-empty p {
  margin: 3px 0 0;

  color: var(--leadership-muted);

  font-size: 11px;
}

/* ========================================
   VISIT CARDS
======================================== */

.visit-list {
  display: grid;
  gap: 13px;
}

.visit-card {
  padding: 17px;

  border: 1px solid var(--leadership-border);
  border-radius: 16px;

  background:
    var(--surface-50, rgba(0, 0, 0, 0.012));

  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.visit-card:hover {
  border-color: rgba(91, 91, 214, 0.22);

  box-shadow: 0 8px 22px rgba(16, 24, 40, 0.04);
}

.visit-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  margin-bottom: 17px;
}

.visit-number {
  display: flex;
  align-items: center;
  gap: 10px;
}

.visit-number>span {
  width: 31px;
  height: 31px;

  display: grid;
  place-items: center;

  border-radius: 9px;

  color: var(--leadership-primary);

  background: var(--leadership-primary-soft);

  font-size: 12px;
  font-weight: 900;
}

.visit-number strong {
  display: block;

  color: var(--leadership-text);

  font-size: 12px;
  font-weight: 800;
}

.visit-number small {
  display: block;

  margin-top: 1px;

  color: var(--leadership-muted);

  font-size: 10px;
}

.visit-fields {
  display: grid;
  grid-template-columns:
    minmax(140px, 0.8fr) minmax(180px, 1.2fr) minmax(200px, 1.3fr) minmax(140px, 0.8fr);
  gap: 13px;
}

/* ========================================
   FORM
======================================== */

.form-field {
  display: grid;
  gap: 7px;

  min-width: 0;
}

.form-label {
  color: var(--leadership-text);

  font-size: 11px;
  font-weight: 700;
}

.form-label b {
  color: var(--leadership-danger);

  font-weight: 800;
}

.input-wrapper {
  min-width: 0;
}

.form-field input,
.form-field select,
.form-field textarea,
.visit-fields input,
.visit-fields select,
.dialog-fields input,
.dialog-fields textarea,
.improvement-fields input,
.improvement-fields select,
.attachment-input-wrapper input {
  width: 100%;

  min-height: 42px;

  padding: 9px 11px;

  outline: none;

  border: 1px solid var(--leadership-border);
  border-radius: 11px;

  color: var(--leadership-text);

  background:
    var(--surface-card, #fff);

  font-family: inherit;
  font-size: 12px;

  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease;
}

.form-field textarea,
.dialog-fields textarea {
  min-height: 110px;

  resize: vertical;

  line-height: 1.6;
}

.form-field input:hover,
.form-field select:hover,
.form-field textarea:hover,
.visit-fields input:hover,
.visit-fields select:hover,
.dialog-fields input:hover,
.dialog-fields textarea:hover,
.improvement-fields input:hover,
.improvement-fields select:hover {
  border-color: rgba(91, 91, 214, 0.35);
}

.form-field input:focus,
.form-field select:focus,
.form-field textarea:focus,
.visit-fields input:focus,
.visit-fields select:focus,
.dialog-fields input:focus,
.dialog-fields textarea:focus,
.improvement-fields input:focus,
.improvement-fields select:focus,
.attachment-input-wrapper input:focus {
  border-color: var(--leadership-primary);

  box-shadow:
    0 0 0 3px rgba(91, 91, 214, 0.1);
}

input::placeholder,
textarea::placeholder {
  color: var(--leadership-muted);

  opacity: 0.58;
}

/* ========================================
   BUTTONS
======================================== */

.modern-button {
  min-height: 42px;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  padding: 0 16px;

  border-radius: 11px;

  cursor: pointer;

  font-family: inherit;
  font-size: 12px;
  font-weight: 750;

  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease,
    background 0.18s ease,
    border-color 0.18s ease;
}

.modern-button svg {
  width: 17px;
  height: 17px;
}

.modern-button--primary {
  border: 1px solid transparent;

  color: white;

  background:
    linear-gradient(135deg,
      var(--leadership-primary),
      #6d5bdd);

  box-shadow:
    0 7px 16px rgba(91, 91, 214, 0.2);
}

.modern-button--primary:hover:not(:disabled) {
  transform: translateY(-1px);

  box-shadow:
    0 10px 22px rgba(91, 91, 214, 0.28);
}

.modern-button--ghost {
  border: 1px solid var(--leadership-border);

  color: var(--leadership-text);

  background: var(--leadership-card);
}

.modern-button--ghost:hover {
  border-color: rgba(91, 91, 214, 0.3);

  color: var(--leadership-primary);

  background: var(--leadership-primary-soft);
}

.modern-button:disabled {
  cursor: not-allowed;

  opacity: 0.56;

  transform: none !important;
  box-shadow: none !important;
}

.button-plus {
  font-size: 19px;
  font-weight: 400;
  line-height: 1;
}

.icon-button {
  width: 35px;
  height: 35px;

  display: grid;
  place-items: center;

  padding: 0;

  border: 1px solid transparent;
  border-radius: 10px;

  cursor: pointer;

  background: transparent;

  transition:
    background 0.2s ease,
    transform 0.2s ease;
}

.icon-button svg {
  width: 17px;
  height: 17px;
}

.icon-button--danger {
  color: var(--leadership-danger);

  background: var(--leadership-danger-soft);
}

.icon-button--danger:hover {
  transform: scale(1.05);

  background: rgba(229, 72, 77, 0.15);
}

.month-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  margin-top: 16px;
  padding-top: 16px;

  border-top: 1px solid var(--leadership-border);
}

/* ========================================
   VISITS TABLE
======================================== */

.total-visits-pill {
  display: flex;
  align-items: center;
  gap: 7px;

  padding: 7px 11px;

  border-radius: 999px;

  color: var(--leadership-muted);

  background:
    var(--surface-100, rgba(0, 0, 0, 0.035));

  font-size: 11px;
  font-weight: 700;
}

.total-visits-pill span {
  min-width: 24px;
  height: 24px;

  display: grid;
  place-items: center;

  border-radius: 999px;

  color: white;

  background: var(--leadership-primary);

  font-size: 10px;
}

.visits-table-card {
  overflow: hidden;

  border: 1px solid var(--leadership-border);
  border-radius: 16px;
}

.table-responsive {
  width: 100%;

  overflow-x: auto;
}

.modern-table {
  width: 100%;

  border-collapse: collapse;
  border-spacing: 0;

  color: var(--leadership-text);
}

.modern-table thead {
  background:
    var(--surface-50, rgba(0, 0, 0, 0.018));
}

.modern-table th {
  padding: 13px 16px;

  border-bottom: 1px solid var(--leadership-border);

  color: var(--leadership-muted);

  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.035em;
  text-align: left;
  text-transform: uppercase;
  white-space: nowrap;
}

.modern-table td {
  padding: 14px 16px;

  border-bottom: 1px solid var(--leadership-border);

  font-size: 12px;

  vertical-align: middle;
}

.modern-table tbody tr:last-child td {
  border-bottom: 0;
}

.modern-table tbody tr {
  transition: background 0.18s ease;
}

.modern-table tbody tr:hover {
  background:
    var(--surface-50, rgba(0, 0, 0, 0.015));
}

.table-date {
  display: flex;
  align-items: center;
  gap: 9px;
}

.table-date__icon {
  width: 32px;
  height: 32px;

  display: grid;
  place-items: center;

  border-radius: 9px;

  color: var(--leadership-primary);

  background: var(--leadership-primary-soft);
}

.table-date__icon svg {
  width: 16px;
  height: 16px;
}

.table-date strong {
  white-space: nowrap;

  font-size: 11px;
  font-weight: 750;
}

.location-cell {
  display: flex;
  align-items: center;
  gap: 7px;
}

.location-dot {
  width: 7px;
  height: 7px;

  flex: 0 0 auto;

  border-radius: 999px;

  background: var(--leadership-orange);

  box-shadow:
    0 0 0 3px rgba(242, 153, 74, 0.1);
}

.employee-cell {
  display: flex;
  align-items: center;
  gap: 9px;
}

.employee-avatar {
  width: 32px;
  height: 32px;

  display: grid;
  place-items: center;
  flex: 0 0 auto;

  border-radius: 10px;

  color: var(--leadership-primary);

  background:
    linear-gradient(135deg,
      rgba(91, 91, 214, 0.13),
      rgba(47, 128, 237, 0.08));

  font-size: 11px;
  font-weight: 900;
}

.activity-chip {
  display: inline-flex;

  padding: 5px 9px;

  border: 1px solid rgba(47, 128, 237, 0.12);
  border-radius: 999px;

  color: var(--leadership-blue);

  background: rgba(47, 128, 237, 0.075);

  font-size: 10px;
  font-weight: 700;
}

.action-column {
  text-align: right !important;
}

.report-button {
  display: inline-flex;
  align-items: center;
  gap: 7px;

  min-height: 36px;
  padding: 0 12px;

  border: 1px solid rgba(91, 91, 214, 0.14);
  border-radius: 10px;

  cursor: pointer;

  color: var(--leadership-primary);

  background: var(--leadership-primary-soft);

  font-family: inherit;
  font-size: 10px;
  font-weight: 800;

  transition:
    background 0.2s ease,
    transform 0.2s ease;
}

.report-button svg {
  width: 15px;
  height: 15px;
}

.report-button:hover {
  transform: translateY(-1px);

  color: white;

  background: var(--leadership-primary);
}

/* ========================================
   EMPTY STATES
======================================== */

.empty-state {
  min-height: 210px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  padding: 30px;

  border: 1px dashed var(--leadership-border);
  border-radius: 16px;

  text-align: center;

  background:
    var(--surface-50, rgba(0, 0, 0, 0.012));
}

.empty-state__illustration {
  width: 56px;
  height: 56px;

  display: grid;
  place-items: center;

  margin-bottom: 13px;

  border-radius: 17px;

  color: var(--leadership-primary);

  background: var(--leadership-primary-soft);
}

.empty-state__illustration svg {
  width: 26px;
  height: 26px;
}

.empty-state strong {
  color: var(--leadership-text);

  font-size: 14px;
}

.empty-state p {
  max-width: 440px;

  margin: 5px 0 0;

  color: var(--leadership-muted);

  font-size: 11px;
  line-height: 1.6;
}

.state-error {
  padding: 17px;

  border: 1px solid rgba(229, 72, 77, 0.13);
  border-radius: 13px;

  color: var(--leadership-danger);

  background: var(--leadership-danger-soft);

  font-size: 12px;
  font-weight: 600;
}

/* ========================================
   DIALOG
======================================== */

:deep(.leadership-report-dialog) {
  overflow: hidden;

  border: 1px solid var(--leadership-border) !important;
  border-radius: 22px !important;

  background: var(--leadership-card) !important;

  box-shadow:
    0 24px 80px rgba(16, 24, 40, 0.18) !important;
}

:deep(.leadership-report-dialog .p-dialog-header) {
  padding: 21px 23px !important;

  border-bottom: 1px solid var(--leadership-border);

  background: var(--leadership-card) !important;
}

:deep(.leadership-report-dialog .p-dialog-content) {
  padding: 0 !important;

  background: var(--leadership-card) !important;
}

.dialog-custom-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.dialog-header-icon {
  width: 43px;
  height: 43px;

  display: grid;
  place-items: center;

  border-radius: 13px;

  color: white;

  background:
    linear-gradient(135deg,
      var(--leadership-primary),
      #7761e6);

  box-shadow:
    0 8px 16px rgba(91, 91, 214, 0.2);
}

.dialog-header-icon svg {
  width: 21px;
  height: 21px;
}

.dialog-custom-header h3 {
  margin: 0;

  color: var(--leadership-text);

  font-size: 16px;
  font-weight: 800;
}

.dialog-custom-header p {
  margin: 3px 0 0;

  color: var(--leadership-muted);

  font-size: 10px;
}

.report-form {
  display: grid;
  gap: 0;
}

.selected-visit-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;

  margin: 20px 22px 0;
  padding: 13px 15px;

  border: 1px solid rgba(91, 91, 214, 0.13);
  border-radius: 13px;

  background: var(--leadership-primary-soft);
}

.selected-visit-banner__label {
  display: block;

  margin-bottom: 2px;

  color: var(--leadership-muted);

  font-size: 9px;
  font-weight: 800;
  text-transform: uppercase;
}

.selected-visit-banner strong {
  color: var(--leadership-text);

  font-size: 12px;
}

.selected-visit-date {
  padding: 5px 9px;

  border-radius: 8px;

  color: var(--leadership-primary);

  background: var(--leadership-card);

  font-size: 10px;
  font-weight: 800;
}

.dialog-section {
  padding: 22px;

  border-bottom: 1px solid var(--leadership-border);
}

.dialog-section__heading {
  display: flex;
  align-items: center;
  gap: 10px;

  margin-bottom: 17px;
}

.dialog-step {
  width: 35px;
  height: 35px;

  display: grid;
  place-items: center;
  flex: 0 0 auto;

  border-radius: 10px;

  color: var(--leadership-primary);

  background: var(--leadership-primary-soft);

  font-size: 10px;
  font-weight: 900;
}

.dialog-section__heading h4 {
  margin: 0;

  color: var(--leadership-text);

  font-size: 13px;
  font-weight: 800;
}

.dialog-section__heading p {
  margin: 2px 0 0;

  color: var(--leadership-muted);

  font-size: 10px;
}

.dialog-fields {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 13px;
}

.form-field--full {
  grid-column: 1 / -1;
}

/* ========================================
   IMPROVEMENTS
======================================== */

.improvements-list {
  display: grid;
  gap: 12px;
}

.improvement-card {
  padding: 15px;

  border: 1px solid var(--leadership-border);
  border-radius: 14px;

  background:
    var(--surface-50, rgba(0, 0, 0, 0.012));
}

.improvement-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  margin-bottom: 14px;
}

.improvement-index {
  color: var(--leadership-primary);

  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
}

.improvement-fields {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.add-improvement-button {
  width: 100%;
  min-height: 42px;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;

  margin-top: 12px;

  border: 1px dashed rgba(91, 91, 214, 0.34);
  border-radius: 11px;

  cursor: pointer;

  color: var(--leadership-primary);

  background: rgba(91, 91, 214, 0.035);

  font-family: inherit;
  font-size: 11px;
  font-weight: 750;

  transition:
    background 0.2s ease,
    border-color 0.2s ease;
}

.add-improvement-button span {
  font-size: 18px;
  line-height: 1;
}

.add-improvement-button:hover {
  border-color: var(--leadership-primary);

  background: var(--leadership-primary-soft);
}

/* ========================================
   ATTACHMENTS
======================================== */

.attachments-list {
  display: grid;
  gap: 9px;
}

.attachment-field {
  display: flex;
  align-items: center;
  gap: 8px;
}

.attachment-input-wrapper {
  position: relative;

  flex: 1;
}

.attachment-input-wrapper svg {
  position: absolute;
  z-index: 2;

  width: 16px;
  height: 16px;

  left: 12px;
  top: 50%;

  color: var(--leadership-muted);

  transform: translateY(-50%);

  pointer-events: none;
}

.attachment-input-wrapper input {
  padding-left: 37px;
}

/* ========================================
   DIALOG FOOTER
======================================== */

.dialog-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;

  padding: 17px 22px;

  background:
    var(--surface-50, rgba(0, 0, 0, 0.015));
}

.submit-report-button {
  min-width: 175px;
}

/* ========================================
   TRANSITIONS
======================================== */

.message-enter-active,
.message-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}

.message-enter-from,
.message-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.visit-list-enter-active,
.visit-list-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.visit-list-enter-from,
.visit-list-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

/* ========================================
   RESPONSIVE
======================================== */

@media (max-width: 1100px) {
  .visit-fields {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 900px) {
  .leadership-page {
    padding: 16px;
  }

  .page-hero {
    align-items: flex-start;
    flex-direction: column;

    padding: 24px;
  }

  .back-button {
    margin-top: 5px;
  }

  .section-heading {
    flex-direction: column;
  }

  .project-duration-card {
    width: 100%;
    min-width: 0;
  }

  .summary-grid {
    grid-template-columns: 1fr;
  }

  .improvement-fields {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .leadership-page {
    gap: 16px;
    padding: 12px;
  }

  .page-hero {
    min-height: auto;

    padding: 19px;

    border-radius: 18px;
  }

  .hero-content {
    align-items: flex-start;
    flex-direction: column;
  }

  .hero-icon {
    width: 54px;
    height: 54px;

    border-radius: 16px;
  }

  .hero-icon svg {
    width: 26px;
    height: 26px;
  }

  .hero-copy h1 {
    font-size: 25px;
  }

  .back-button {
    width: 100%;

    justify-content: center;
  }

  .dashboard-section {
    padding: 17px;

    border-radius: 18px;
  }

  .section-heading h2 {
    font-size: 20px;
  }

  .month-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .visit-count {
    margin-left: 57px !important;
  }

  .month-empty {
    align-items: flex-start;
    flex-direction: column;
  }

  .month-empty .modern-button {
    width: 100%;
  }

  .visit-fields {
    grid-template-columns: 1fr;
  }

  .month-footer {
    align-items: stretch;
    flex-direction: column;
  }

  .month-footer .modern-button {
    width: 100%;
  }

  .dialog-fields {
    grid-template-columns: 1fr;
  }

  .selected-visit-banner {
    align-items: flex-start;
    flex-direction: column;
  }

  .dialog-footer {
    align-items: stretch;
    flex-direction: column-reverse;
  }

  .dialog-footer .modern-button {
    width: 100%;
  }

  .attachment-field {
    align-items: stretch;
  }
}
</style>