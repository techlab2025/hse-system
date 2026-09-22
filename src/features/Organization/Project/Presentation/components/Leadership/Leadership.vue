<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import Accordion from 'primevue/accordion'
import AccordionPanel from 'primevue/accordionpanel'
import AccordionHeader from 'primevue/accordionheader'
import AccordionContent from 'primevue/accordioncontent'
import DatePicker from 'primevue/datepicker'
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
import CreateLeadershipPlanParams, { type LeadershipVisitInput } from '../../../Core/params/Leadership/CreateLeadershipPlanParams'
import FetchAllLeadershipVisitsParams from '../../../Core/params/Leadership/FetchAllLeadershipVisitsParams'
import CreateLeadershipPlanController from '../../controllers/Leadership/CreateLeadershipPlanController'
import FetchAllLeadershipVisitsController from '../../controllers/Leadership/FetchAllLeadershipVisitsController'
import type LeadershipVisitModel from '../../../Data/models/Leadership/LeadershipVisitModel'
import ReportVisit from './ReportVisit.vue'

defineOptions({ name: 'ProjectLeadership' })

type ProjectMonth = { key: string; label: string; shortLabel: string; monthNumber: number; firstDate: string; lastDate: string }
const route = useRoute()
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
const selectedVisit = ref<LeadershipVisitModel | null>(null)
const errorMessage = ref('')
const successMessage = ref('')

const newVisit = (): LeadershipVisitInput => ({
  date: '',
  location: '',
  orgnizationEmployeeId: 0,
  visitActivityId: 0,
})
const formatDate = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
const parseDate = (value: string): Date | null => value ? new Date(`${value}T00:00:00`) : null
const setVisitDate = (visit: LeadershipVisitInput, value: unknown) => {
  visit.date = value instanceof Date && !Number.isNaN(value.getTime()) ? formatDate(value) : ''
}
const selectedOption = (options: TitleInterface[], id: number): TitleInterface | null =>
  options.find((option) => option.id === id) ?? null
const selectedId = (value: TitleInterface | TitleInterface[] | null): number =>
  value && !Array.isArray(value) ? value.id : 0
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
    const first = year === start.getFullYear() && monthNumber === start.getMonth() + 1 ? start : cursor
    const endOfMonth = new Date(year, monthNumber, 0)
    const final = year === end.getFullYear() && monthNumber === end.getMonth() + 1 ? end : endOfMonth
    result.push({
      key: `${year}-${String(monthNumber).padStart(2, '0')}`,
      label: new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' }).format(cursor),
      shortLabel: new Intl.DateTimeFormat(undefined, { month: 'short' }).format(cursor),
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
const addVisit = (key: string) => {
  if (!monthVisits[key]) monthVisits[key] = []
  monthVisits[key].push(newVisit())
}
const refreshVisits = async () => {
  if (projectId.value > 0) await visitsController.fetchVisits(new FetchAllLeadershipVisitsParams(projectId.value))
}
const saveMonth = async (month: ProjectMonth) => {
  errorMessage.value = ''
  successMessage.value = ''
  const rows = rowsForMonth(month.key)
  if (!rows.length) return
  if (rows.some((row) => !row.date || row.date < month.firstDate || row.date > month.lastDate || !row.location.trim() || !Number.isInteger(row.orgnizationEmployeeId) || row.orgnizationEmployeeId <= 0 || !Number.isInteger(row.visitActivityId) || row.visitActivityId <= 0)) {
    errorMessage.value = 'Complete every visit and choose a date within the selected month.'
    return
  }
  try {
    await planController.createPlan(new CreateLeadershipPlanParams(projectId.value, month.monthNumber, rows))
    if (planController.isDataSuccess()) {
      monthVisits[month.key] = []
      successMessage.value = `${month.label} visits saved.`
      await refreshVisits()
    } else errorMessage.value = planController.state.value.error?.title ?? 'Unable to save visits.'
  } catch {
    errorMessage.value = 'Unable to save visits.'
  }
}
const reportSubmitted = async () => {
  selectedVisit.value = null
  successMessage.value = 'Visit report submitted.'
  await refreshVisits()
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
    <header class="hero">
      <div class="hero__art" aria-hidden="true"><span></span><span></span><span></span></div>
      <div class="hero__content">
        <div class="hero__symbol" aria-hidden="true">✦</div>
        <div>
          <span class="eyebrow">Project leadership</span>
          <h1>Leadership visits</h1>
          <p>Plan visits month by month, then turn each visit into a clear record of actions and observations.</p>
        </div>
      </div>
      <RouterLink :to="`/organization/project-details/${projectId}`" class="back-link">← <span>Back to project</span>
      </RouterLink>
    </header>

    <div v-if="errorMessage" class="notice notice--error" role="alert"><span>!</span>{{ errorMessage }}</div>
    <div v-if="successMessage" class="notice notice--success" role="status"><span>✓</span>{{ successMessage }}</div>

    <DataStatus :controller="projectState">
      <template #success>
        <section class="workspace-card">
          <div class="section-intro">
            <div>
              <span class="eyebrow">Plan the journey</span>
              <h2>Monthly visit plan</h2>
              <p>Choose a project month, add one or more visits, and save them together.</p>
            </div>
            <div class="date-range"><span>Project duration</span><strong>{{ projectState.data?.startDate?.slice(0, 10)
                }} <i>→</i> {{ projectState.data?.endDate?.slice(0, 10) }}</strong></div>
          </div>

          <div class="overview">
            <div class="overview__item"><span class="overview__icon">▦</span>
              <div><small>Project months</small><strong>{{ months.length }}</strong></div>
            </div>
            <div class="overview__item"><span class="overview__icon">◎</span>
              <div><small>Planned visits</small><strong>{{ visits.length }}</strong></div>
            </div>
            <div class="overview__item"><span class="overview__icon">✦</span>
              <div><small>Planning status</small><strong>{{ months.length ? 'Active' : 'Pending' }}</strong></div>
            </div>
          </div>

          <Accordion v-if="months.length" :value="months[0]?.key" class="month-accordion">
            <AccordionPanel v-for="month in months" :key="month.key" :value="month.key" class="month-panel">
              <AccordionHeader>
                <div class="month-heading">
                  <span class="month-heading__badge">{{ month.shortLabel }}</span>
                  <div><strong>{{ month.label }}</strong><small>{{ month.firstDate }} → {{ month.lastDate }}</small>
                  </div>
                  <span class="draft-count">{{ rowsForMonth(month.key).length }} draft visits</span>
                </div>
              </AccordionHeader>
              <AccordionContent>
                <div class="month-body">
                  <div v-if="!rowsForMonth(month.key).length" class="month-empty">
                    <span class="month-empty__symbol">＋</span>
                    <div><strong>Start this month’s plan</strong>
                      <p>Add a visit with its date, location, employee, and activity.</p>
                    </div>
                    <button type="button" class="button button--primary" @click="addVisit(month.key)">Add first
                      visit</button>
                  </div>

                  <div v-else class="draft-list">
                    <article v-for="(visit, index) in rowsForMonth(month.key)" :key="index" class="draft-card">
                      <div class="draft-card__top">
                        <div class="draft-card__number">{{ String(index + 1).padStart(2, '0') }}</div>
                        <div><strong>Visit {{ index + 1 }}</strong><small>Complete the details for this planned
                            visit</small></div><button type="button" class="remove-button"
                          @click="monthVisits[month.key]?.splice(index, 1)">Remove</button>
                      </div>
                      <div class="visit-fields">
                        <label>Date <span>*</span>
                          <DatePicker :model-value="parseDate(visit.date)" date-format="yy-mm-dd" show-icon fluid
                            :min-date="parseDate(month.firstDate) ?? undefined"
                            :max-date="parseDate(month.lastDate) ?? undefined" placeholder="Select visit date"
                            @update:model-value="(value) => setVisitDate(visit, value)" />
                        </label>
                        <label>Location <span>*</span><input v-model="visit.location" type="text"
                            placeholder="e.g. Main site" required /></label>
                        <UpdatedCustomInputSelect :id="`visit-employee-${month.key}-${index}`"
                          label="Organization employee" placeholder="Select employee" :required="true" :reload="false"
                          :static-options="employeeOptions"
                          :model-value="selectedOption(employeeOptions, visit.orgnizationEmployeeId)"
                          @update:model-value="(value) => { visit.orgnizationEmployeeId = selectedId(value) }" />
                        <UpdatedCustomInputSelect :id="`visit-activity-${month.key}-${index}`" label="Visit activity"
                          placeholder="Select activity" :required="true" :reload="false"
                          :controller="visitActivityController" :params="visitActivityParams"
                          :model-value="selectedOption(activityOptions, visit.visitActivityId)"
                          @update:model-value="(value) => { visit.visitActivityId = selectedId(value) }" />
                      </div>
                    </article>
                    <div class="month-actions"><button type="button" class="button button--outline"
                        @click="addVisit(month.key)">＋ Add another visit</button><button type="button"
                        class="button button--primary" :disabled="planController.isDataLoading()"
                        @click="saveMonth(month)">{{ planController.isDataLoading() ? 'Saving…' : `Save ${month.label}
                        visits` }}</button></div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionPanel>
          </Accordion>
          <div v-else class="empty-state"><span>▦</span><strong>No valid project date range</strong>
            <p>Add valid start and end dates to the project before planning visits.</p>
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
        <div class="notice notice--error">Unable to load project dates.</div>
      </template>
    </DataStatus>

    <section class="workspace-card">
      <div class="section-intro">
        <div><span class="eyebrow">From plan to action</span>
          <h2>Saved visits</h2>
          <p>Review every visit and submit its report after the visit.</p>
        </div><span class="total-pill">{{ visits.length }} total</span>
      </div>
      <DataStatus :controller="visitsState">
        <template #success>
          <div v-if="visits.length" class="table-responsive visits-table">
            <table class="main-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Location</th>
                  <th>Employee</th>
                  <th>Activity</th>
                  <th>Report</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="visit in visits" :key="visit.id">
                  <td><strong>{{ visit.date }}</strong></td>
                  <td>{{ visit.location }}</td>
                  <td><span class="employee-cell"><span class="avatar">{{
                    visit.organizationEmployeeName?.charAt(0)?.toUpperCase() || 'E' }}</span>{{
                          visit.organizationEmployeeName || '—' }}</span></td>
                  <td><span class="activity-pill">{{ visit.visitActivityName || '—' }}</span></td>
                  <td><button type="button" class="report-link" @click="selectedVisit = visit">Report visit <span
                        aria-hidden="true">↗</span></button></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else class="empty-state"><span>◎</span><strong>No leadership visits yet</strong>
            <p>Start with a monthly plan above. Your saved visits will appear here.</p>
          </div>
        </template>
        <template #loader>
          <TableLoader :cols="5" :rows="4" />
        </template>
        <template #initial>
          <TableLoader :cols="5" :rows="4" />
        </template>
        <template #empty>
          <div class="empty-state"><strong>No visits have been planned yet.</strong></div>
        </template>
        <template #failed>
          <div class="notice notice--error">Unable to load visits.</div>
        </template>
      </DataStatus>
    </section>

    <ReportVisit :visit="selectedVisit" @close="selectedVisit = null" @submitted="reportSubmitted" />
  </main>
</template>

<style scoped>
.leadership-page {
  display: grid;
  gap: 22px;
  padding: clamp(14px, 2vw, 28px);
  min-height: 100%;
  background: var(--surface-2);
}

.hero {
  position: relative;
  isolation: isolate;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  overflow: hidden;
  padding: clamp(28px, 4vw, 46px);
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 18%, var(--main-border));
  border-radius: 26px;
  background: radial-gradient(circle at 90% 15%, color-mix(in srgb, var(--PrimaryColor) 15%, transparent), transparent 34%), linear-gradient(135deg, color-mix(in srgb, var(--PrimaryColor) 9%, var(--surface-1)), var(--surface-1));
  box-shadow: 0 20px 48px color-mix(in srgb, var(--brand-primary-900) 8%, transparent);
}

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
  border-radius: 22px;
  color: var(--text-on-brand);
  background: linear-gradient(145deg, var(--PrimaryColor), var(--brand-primary-700));
  box-shadow: 0 12px 26px color-mix(in srgb, var(--PrimaryColor) 27%, transparent);
  font-size: 2rem;
}

.hero__content h1 {
  margin: 4px 0 8px;
  color: var(--text-strong);
  font-size: clamp(1.8rem, 3vw, 2.6rem);
  line-height: 1.1;
}

.hero__content p {
  max-width: 630px;
  margin: 0;
  color: var(--text-soft);
  line-height: 1.6;
}

.hero__art {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.hero__art span {
  position: absolute;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 18%, transparent);
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
  color: var(--PrimaryColor);
  font-size: .7rem;
  font-weight: 850;
  text-transform: uppercase;
  letter-spacing: .14em;
}

.back-link {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  flex: none;
  padding: 11px 15px;
  border: 1px solid var(--main-border);
  border-radius: 11px;
  color: var(--text-strong);
  background: var(--surface-1);
  text-decoration: none;
  font-weight: 750;
}

.back-link:hover {
  border-color: var(--PrimaryColor);
  color: var(--PrimaryColor);
}

.notice {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  border-radius: 12px;
  font-weight: 700;
}

.notice span {
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  border-radius: 8px;
}

.notice--error {
  color: var(--status-danger);
  background: var(--status-danger-soft);
}

.notice--success {
  color: var(--status-success);
  background: var(--status-success-soft);
}

.workspace-card {
  padding: clamp(20px, 3vw, 30px);
  border: 1px solid var(--main-border);
  border-radius: 22px;
  background: var(--surface-1);
  box-shadow: 0 12px 32px color-mix(in srgb, var(--brand-primary-900) 5%, transparent);
}

.section-intro {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 18px;
  margin-bottom: 24px;
}

.section-intro h2 {
  margin: 5px 0 6px;
  color: var(--text-strong);
  font-size: clamp(1.3rem, 2vw, 1.7rem);
}

.section-intro p {
  margin: 0;
  color: var(--text-soft);
}

.date-range {
  display: grid;
  gap: 6px;
  min-width: 260px;
  padding: 13px 16px;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 15%, var(--main-border));
  border-radius: 14px;
  background: color-mix(in srgb, var(--PrimaryColor) 6%, var(--surface-1));
}

.date-range span {
  color: var(--text-soft);
  font-size: .72rem;
  font-weight: 700;
}

.date-range strong {
  color: var(--text-strong);
  font-size: .86rem;
  white-space: nowrap;
}

.date-range i {
  margin: 0 4px;
  color: var(--PrimaryColor);
  font-style: normal;
}

.overview {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 24px;
}

.overview__item {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
  padding: 16px;
  border: 1px solid var(--main-border);
  border-radius: 15px;
  background: var(--surface-2);
}

.overview__icon {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  flex: none;
  border-radius: 13px;
  color: var(--PrimaryColor);
  background: color-mix(in srgb, var(--PrimaryColor) 12%, var(--surface-1));
  font-size: 1.4rem;
}

.overview__item div {
  display: grid;
  gap: 2px;
}

.overview__item small {
  color: var(--text-soft);
}

.overview__item strong {
  color: var(--text-strong);
  font-size: 1.3rem;
}

.month-accordion {
  display: grid;
  gap: 10px;
}

.month-panel {
  overflow: hidden;
  border: 1px solid var(--main-border);
  border-radius: 14px;
  background: var(--surface-1);
}

.month-heading {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  text-align: start;
}

.month-heading__badge {
  display: grid;
  place-items: center;
  width: 54px;
  height: 48px;
  flex: none;
  border-radius: 11px;
  color: var(--PrimaryColor);
  background: color-mix(in srgb, var(--PrimaryColor) 10%, var(--surface-1));
  font-size: .79rem;
  font-weight: 850;
  text-transform: uppercase;
}

.month-heading div {
  display: grid;
  gap: 3px;
}

.month-heading strong {
  color: var(--text-strong);
  font-size: .94rem;
}

.month-heading small {
  color: var(--text-soft);
  font-size: .75rem;
}

.draft-count {
  margin-inline-start: auto;
  padding: 6px 10px;
  border-radius: 999px;
  color: var(--PrimaryColor);
  background: color-mix(in srgb, var(--PrimaryColor) 9%, var(--surface-1));
  font-size: .7rem;
  font-weight: 800;
  white-space: nowrap;
}

.month-body {
  padding: 4px 2px 10px;
}

.month-empty,
.empty-state {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 22px;
  border: 1px dashed color-mix(in srgb, var(--PrimaryColor) 24%, var(--main-border));
  border-radius: 14px;
  background: color-mix(in srgb, var(--PrimaryColor) 3%, var(--surface-1));
}

.month-empty__symbol,
.empty-state>span {
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  flex: none;
  border-radius: 13px;
  color: var(--PrimaryColor);
  background: color-mix(in srgb, var(--PrimaryColor) 10%, var(--surface-1));
  font-size: 1.5rem;
}

.month-empty div {
  flex: 1;
}

.month-empty strong,
.empty-state strong {
  color: var(--text-strong);
}

.month-empty p,
.empty-state p {
  margin: 4px 0 0;
  color: var(--text-soft);
  font-size: .82rem;
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
  padding: 16px;
  border: 1px solid var(--main-border);
  border-radius: 14px;
  background: var(--surface-2);
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
  border-radius: 10px;
  color: var(--text-on-brand);
  background: var(--PrimaryColor);
  font-weight: 850;
}

.draft-card__top strong,
.draft-card__top small {
  display: block;
}

.draft-card__top strong {
  color: var(--text-strong);
}

.draft-card__top small {
  color: var(--text-soft);
  font-size: .7rem;
}

.remove-button {
  margin-inline-start: auto;
  border: 0;
  color: var(--status-danger);
  background: transparent;
  cursor: pointer;
  font-weight: 750;
}

.visit-fields {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.visit-fields label {
  display: grid;
  align-content: start;
  gap: 7px;
  color: var(--text-strong);
  font-size: .78rem;
  font-weight: 750;
}

.visit-fields label span {
  color: var(--status-danger);
}

.visit-fields input,
.visit-fields select {
  min-width: 0;
  width: 100%;
  padding: 10px 11px;
  border: 1px solid var(--main-border);
  border-radius: 9px;
  outline: none;
  color: var(--text-strong);
  background: var(--surface-1);
  font: inherit;
  font-weight: 500;
}

.visit-fields input:focus,
.visit-fields select:focus {
  border-color: var(--PrimaryColor);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--PrimaryColor) 14%, transparent);
}

.visit-fields :deep(.p-datepicker),
.visit-fields :deep(.p-inputtext),
.visit-fields :deep(.p-select) {
  width: 100%;
  min-width: 0;
}

.visit-fields :deep(.p-datepicker-input),
.visit-fields :deep(.p-select) {
  min-height: 42px;
  border-radius: 9px;
}

.month-actions {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-top: 3px;
}

.button {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: 7px;
  padding: 11px 15px;
  border: 1px solid transparent;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 800;
}

.button--primary {
  color: var(--text-on-brand);
  background: var(--PrimaryColor);
}

.button--primary:hover:not(:disabled) {
  background: var(--brand-primary-700);
}

.button--outline {
  border-color: color-mix(in srgb, var(--PrimaryColor) 40%, var(--main-border));
  color: var(--PrimaryColor);
  background: var(--surface-1);
}

.button:disabled {
  opacity: .55;
  cursor: wait;
}

.total-pill {
  padding: 8px 12px;
  border-radius: 999px;
  color: var(--PrimaryColor);
  background: color-mix(in srgb, var(--PrimaryColor) 10%, var(--surface-1));
  font-size: .78rem;
  font-weight: 850;
  white-space: nowrap;
}

.visits-table {
  overflow: hidden;
  border: 1px solid var(--main-border);
  border-radius: 14px;
}

.visits-table .main-table {
  width: 100%;
}

.visits-table th {
  color: var(--text-soft);
  background: var(--surface-2);
  text-transform: uppercase;
  font-size: .69rem;
  letter-spacing: .07em;
}

.visits-table td {
  color: var(--text-strong);
}

.employee-cell {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.avatar {
  display: grid;
  place-items: center;
  width: 31px;
  height: 31px;
  flex: none;
  border-radius: 50%;
  color: var(--PrimaryColor);
  background: color-mix(in srgb, var(--PrimaryColor) 10%, var(--surface-1));
  font-weight: 800;
}

.activity-pill {
  display: inline-block;
  padding: 6px 9px;
  border-radius: 8px;
  background: var(--surface-2);
  font-size: .75rem;
}

.report-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 11px;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 35%, var(--main-border));
  border-radius: 9px;
  color: var(--PrimaryColor);
  background: color-mix(in srgb, var(--PrimaryColor) 5%, var(--surface-1));
  cursor: pointer;
  font-weight: 800;
  white-space: nowrap;
}

.report-link:hover {
  color: var(--text-on-brand);
  background: var(--PrimaryColor);
}

:deep(.p-accordionheader) {
  padding: 12px 15px;
  background: var(--surface-1);
}

:deep(.p-accordioncontent-content) {
  padding: 12px 16px 16px;
  background: var(--surface-1);
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
}

@media (max-width: 520px) {
  .visit-fields {
    grid-template-columns: 1fr;
  }

  .month-heading__badge {
    display: none;
  }

  .draft-count {
    display: none;
  }

  .month-actions {
    flex-direction: column;
  }
}
</style>
