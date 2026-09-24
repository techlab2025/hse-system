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
import CreateLeadershipPlanParams, {
  type LeadershipVisitInput,
} from '../../../Core/params/Leadership/CreateLeadershipPlanParams'
import FetchAllLeadershipVisitsParams from '../../../Core/params/Leadership/FetchAllLeadershipVisitsParams'
import CreateLeadershipPlanController from '../../controllers/Leadership/CreateLeadershipPlanController'
import FetchAllLeadershipVisitsController from '../../controllers/Leadership/FetchAllLeadershipVisitsController'
import LeadershipPlanVisitParams from '../../../Core/params/Leadership/LeadershipPlanVisitParams'

defineOptions({ name: 'ProjectLeadership' })

type ProjectMonth = {
  key: string
  label: string
  shortLabel: string
  monthNumber: number
  firstDate: string
  lastDate: string
}
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
const parseDate = (value: string): Date | null => (value ? new Date(`${value}T00:00:00`) : null)
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
    const first =
      year === start.getFullYear() && monthNumber === start.getMonth() + 1 ? start : cursor
    const endOfMonth = new Date(year, monthNumber, 0)
    const final =
      year === end.getFullYear() && monthNumber === end.getMonth() + 1 ? end : endOfMonth
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
const savedVisitsForMonth = (key: string) => {
  return visits.value.filter((visit: any) => visit.date.slice(0, 7) === key)
}
const addVisit = (key: string) => {
  if (!monthVisits[key]) monthVisits[key] = []
  monthVisits[key].push(newVisit())
}
const refreshVisits = async () => {
  if (projectId.value > 0)
    await visitsController.fetchVisits(new FetchAllLeadershipVisitsParams(projectId.value))
}
const saveMonth = async (month: ProjectMonth) => {
  errorMessage.value = ''
  successMessage.value = ''
  const rows = rowsForMonth(month.key)
  if (!rows.length) return
  if (
    rows.some(
      (row) =>
        !row.date ||
        row.date < month.firstDate ||
        row.date > month.lastDate ||
        !row.location.trim() ||
        !Number.isInteger(row.orgnizationEmployeeId) ||
        row.orgnizationEmployeeId <= 0 ||
        !Number.isInteger(row.visitActivityId) ||
        row.visitActivityId <= 0,
    )
  ) {
    errorMessage.value = 'Complete every visit and choose a date within the selected month.'
    return
  }
  try {
    // , month.monthNumber
    const AllVitis = rows.map(
      (el) =>
        new LeadershipPlanVisitParams(
          el.date,
          el.location,
          el.orgnizationEmployeeId,
          el.visitActivityId,
        ),
    )
    await planController.createPlan(new CreateLeadershipPlanParams(projectId.value, AllVitis))
    if (planController.isDataSuccess()) {
      monthVisits[month.key] = []
      successMessage.value = `${month.label} visits saved.`
      await refreshVisits()
    } else errorMessage.value = planController.state.value.error?.title ?? 'Unable to save visits.'
  } catch {
    errorMessage.value = 'Unable to save visits.'
  }
}
onMounted(async () => {
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
  <main class="leadership-page">
    <header class="hero">
      <div class="hero__art" aria-hidden="true"><span></span><span></span><span></span></div>
      <div class="hero__content">
        <div class="hero__symbol" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M12 3 14.4 8.6 20 11l-5.6 2.4L12 19l-2.4-5.6L4 11l5.6-2.4L12 3Z" />
            <path d="m19 3 .7 1.3L21 5l-1.3.7L19 7l-.7-1.3L17 5l1.3-.7L19 3Z" />
          </svg>
        </div>
        <div>
          <span class="eyebrow">Project leadership</span>
          <h1>Leadership visits</h1>
          <p>
            Plan visits month by month, then turn each visit into a clear record of actions and
            observations.
          </p>
        </div>
      </div>
      <div class="hero__actions">
        <RouterLink
          :to="`/organization/project-details/${projectId}/leadership/visits`"
          class="back-link back-link--primary"
        >
          <span>View leadership visits</span> →
        </RouterLink>
        <RouterLink :to="`/organization/project-details/${projectId}`" class="back-link">
          ← <span>Back to project</span>
        </RouterLink>
      </div>
    </header>

    <div v-if="errorMessage" class="notice notice--error" role="alert">
      <span>!</span>{{ errorMessage }}
    </div>
    <div v-if="successMessage" class="notice notice--success" role="status">
      <span>✓</span>{{ successMessage }}
    </div>

    <DataStatus :controller="projectState">
      <template #success>
        <section class="workspace-card">
          <div class="section-intro">
            <div>
              <span class="eyebrow">Plan the journey</span>
              <h2>Monthly visit plan</h2>
              <p>Choose a project month, add one or more visits, and save them together.</p>
            </div>
            <div class="date-range">
              <span>Project duration</span
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
                <small>Project months</small><strong>{{ months.length }}</strong>
              </div>
            </div>
            <div class="overview__item">
              <span class="overview__icon">◎</span>
              <div>
                <small>Planned visits</small><strong>{{ visits.length }}</strong>
              </div>
            </div>
            <div class="overview__item">
              <span class="overview__icon">✦</span>
              <div>
                <small>Planning status</small
                ><strong>{{ months.length ? 'Active' : 'Pending' }}</strong>
              </div>
            </div>
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
                  <span class="month-heading__badge">{{ month.shortLabel }}</span>
                  <div>
                    <strong>{{ month.label }}</strong
                    ><small>{{ month.firstDate }} → {{ month.lastDate }}</small>
                  </div>
                  <span class="draft-count">{{ rowsForMonth(month.key).length }} draft visits</span>
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
                      <strong>Start this month’s plan</strong>
                      <p>Add a visit with its date, location, employee, and activity.</p>
                    </div>
                    <button
                      type="button"
                      class="button button--primary"
                      @click="addVisit(month.key)"
                    >
                      Add first visit
                    </button>
                  </div>
                  <div v-if="savedVisitsForMonth(month.key).length" class="month-actions">
                    <button
                      type="button"
                      class="button button--outline"
                      @click="addVisit(month.key)"
                    >
                      ＋ Add another visit
                    </button>
                  </div>

                  <div v-if="savedVisitsForMonth(month.key).length" class="saved-visits-table">
                    <h3>Planned Visits</h3>

                    <table>
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Date</th>
                          <th>Location</th>
                          <th>Employee</th>
                          <th>Activity</th>
                        </tr>
                      </thead>

                      <tbody>
                        <tr
                          v-for="(visit, index) in savedVisitsForMonth(month.key)"
                          :key="visit.id"
                        >
                          <td>
                            {{ index + 1 }}
                          </td>

                          <td>
                            {{ visit.date }}
                          </td>

                          <td>
                            {{ visit.location }}
                          </td>

                          <td>
                            {{ visit.employees?.[0]?.employeeName ?? '-' }}
                          </td>

                          <td>
                            {{ visit.activities?.[0]?.title ?? '-' }}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <!-- <div v-else class="draft-list"> -->
                  <div v-if="rowsForMonth(month.key).length" class="draft-list">
                    <article
                      v-for="(visit, index) in rowsForMonth(month.key)"
                      :key="index"
                      class="draft-card"
                    >
                      <div class="draft-card__top">
                        <div class="draft-card__number">
                          {{ String(index + 1).padStart(2, '0') }}
                        </div>
                        <div>
                          <strong>Visit {{ index + 1 }}</strong
                          ><small>Complete the details for this planned visit</small>
                        </div>
                        <button
                          type="button"
                          class="remove-button"
                          @click="monthVisits[month.key]?.splice(index, 1)"
                        >
                          Remove
                        </button>
                      </div>
                      <div class="visit-fields">
                        <div class="visit-field">
                          <label
                            :for="`visit-date-${month.key}-${index}`"
                            class="visit-field__label"
                          >
                            <span class="visit-field__icon" aria-hidden="true">
                              <svg viewBox="0 0 24 24" fill="none">
                                <path
                                  d="M7 3v3M17 3v3M4 9h16M6 5h12a2 2 0 0 1 2 2v12H4V7a2 2 0 0 1 2-2Z"
                                />
                              </svg>
                            </span>
                            <span>Date <b>*</b></span>
                          </label>
                          <DatePicker
                            :input-id="`visit-date-${month.key}-${index}`"
                            :model-value="parseDate(visit.date)"
                            date-format="yy-mm-dd"
                            show-icon
                            fluid
                            :min-date="parseDate(month.firstDate) ?? undefined"
                            :max-date="parseDate(month.lastDate) ?? undefined"
                            placeholder="Select visit date"
                            @update:model-value="(value) => setVisitDate(visit, value)"
                          />
                        </div>
                        <div class="visit-field">
                          <label
                            :for="`visit-location-${month.key}-${index}`"
                            class="visit-field__label"
                          >
                            <span class="visit-field__icon" aria-hidden="true">
                              <svg viewBox="0 0 24 24" fill="none">
                                <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" />
                                <circle cx="12" cy="10" r="2.5" />
                              </svg>
                            </span>
                            <span>Location <b>*</b></span>
                          </label>
                          <input
                            :id="`visit-location-${month.key}-${index}`"
                            v-model="visit.location"
                            type="text"
                            placeholder="e.g. Main site"
                            required
                          />
                        </div>
                        <UpdatedCustomInputSelect
                          :id="`visit-employee-${month.key}-${index}`"
                          class="visit-field visit-field--select"
                          label="Organization employee"
                          placeholder="Select Visiting Managers"
                          :required="true"
                          :reload="false"
                          :has-header="true"
                          :static-options="employeeOptions"
                          :model-value="
                            selectedOption(employeeOptions, visit.orgnizationEmployeeId)
                          "
                          @update:model-value="
                            (value) => {
                              visit.orgnizationEmployeeId = selectedId(value)
                            }
                          "
                        >
                          <template #Header>
                            <label class="visit-field__label">
                              <span class="visit-field__icon" aria-hidden="true">
                                <svg viewBox="0 0 24 24" fill="none">
                                  <circle cx="12" cy="8" r="3.5" />
                                  <path d="M5.5 20c.7-3.8 3-5.7 6.5-5.7s5.8 1.9 6.5 5.7" />
                                </svg>
                              </span>
                              <span>Visiting Managers <b>*</b></span>
                            </label>
                          </template>
                        </UpdatedCustomInputSelect>
                        <UpdatedCustomInputSelect
                          :id="`visit-activity-${month.key}-${index}`"
                          class="visit-field visit-field--select"
                          label="Visit activity"
                          placeholder="Select Activities"
                          :required="true"
                          :reload="false"
                          :has-header="true"
                          :controller="visitActivityController"
                          :params="visitActivityParams"
                          :model-value="selectedOption(activityOptions, visit.visitActivityId)"
                          @update:model-value="
                            (value) => {
                              visit.visitActivityId = selectedId(value)
                            }
                          "
                        >
                          <template #Header>
                            <label class="visit-field__label">
                              <span class="visit-field__icon" aria-hidden="true">
                                <svg viewBox="0 0 24 24" fill="none">
                                  <path d="M8 4h8M9 3h6a1 1 0 0 1 1 1v2H8V4a1 1 0 0 1 1-1Z" />
                                  <path
                                    d="M7 5H6a2 2 0 0 0-2 2v12h16V7a2 2 0 0 0-2-2h-1M8 11h8M8 15h5"
                                  />
                                </svg>
                              </span>
                              <span>Visit Activities <b>*</b></span>
                            </label>
                          </template>
                        </UpdatedCustomInputSelect>
                      </div>
                    </article>
                    <!-- <div class="month-actions">
                      <button
                        type="button"
                        class="button button--outline"
                        @click="addVisit(month.key)"
                      >
                        ＋ Add another visit</button
                      ><button
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
                        type="button"
                        class="button button--outline"
                        @click="addVisit(month.key)"
                      >
                        ＋ Add another visit
                      </button>

                      <button
                        type="button"
                        class="button button--primary"
                        @click="saveMonth(month)"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionPanel>
          </Accordion>
          <div v-else class="empty-state">
            <span>▦</span><strong>No valid project date range</strong>
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
  </main>
</template>

<style scoped>
.leadership-page {
  position: relative;
  display: grid;
  gap: 22px;
  /* padding: clamp(14px, 2vw, 28px); */
  min-height: 100%;
  /* background:
    radial-gradient(
      circle at 8% 4%,
      color-mix(in srgb, var(--PrimaryColor) 7%, transparent),
      transparent 24rem
    ),
    var(--surface-2); */
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
  border-radius: 28px;
  background:
    radial-gradient(
      circle at 87% 12%,
      color-mix(in srgb, var(--PrimaryColor) 20%, transparent),
      transparent 34%
    ),
    linear-gradient(
      125deg,
      color-mix(in srgb, var(--brand-primary-900) 96%, var(--surface-1)),
      color-mix(in srgb, var(--PrimaryColor) 76%, var(--brand-primary-900))
    );
  box-shadow: 0 24px 55px color-mix(in srgb, var(--brand-primary-900) 20%, transparent);
}

.hero::after {
  content: '';
  position: absolute;
  inset: auto 8% -55px auto;
  width: 220px;
  height: 105px;
  border-radius: 50%;
  background: color-mix(in srgb, var(--PrimaryColor) 36%, transparent);
  filter: blur(52px);
  pointer-events: none;
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
  color: var(--PrimaryColor);
  font-size: 0.7rem;
  font-weight: 850;
  text-transform: uppercase;
  letter-spacing: 0.14em;
}

.hero .eyebrow {
  color: color-mix(in srgb, white 68%, var(--PrimaryColor));
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
  border-radius: 12px;
  color: white;
  background: color-mix(in srgb, white 10%, transparent);
  backdrop-filter: blur(12px);
  text-decoration: none;
  font-weight: 750;
}

.back-link:hover {
  border-color: color-mix(in srgb, white 45%, transparent);
  color: white;
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
  color: var(--brand-primary-900);
  background: white;
}

.back-link--primary:hover {
  color: var(--brand-primary-900);
  background: color-mix(in srgb, white 90%, var(--PrimaryColor));
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
  position: relative;
  overflow: hidden;
  padding: clamp(20px, 3vw, 30px);
  border: 1px solid var(--main-border);
  border-radius: 22px;
  background: var(--surface-1);
  box-shadow: 0 16px 42px color-mix(in srgb, var(--brand-primary-900) 7%, transparent);
}

.workspace-card::before {
  content: '';
  position: absolute;
  inset: 0 0 auto;
  height: 3px;
  background: linear-gradient(
    90deg,
    var(--PrimaryColor),
    color-mix(in srgb, var(--PrimaryColor) 18%, transparent) 54%,
    transparent
  );
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
  border-radius: 15px;
  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--PrimaryColor) 8%, var(--surface-1)),
    var(--surface-1)
  );
  box-shadow: inset 0 1px 0 color-mix(in srgb, white 45%, transparent);
}

.date-range span {
  color: var(--text-soft);
  font-size: 0.72rem;
  font-weight: 700;
}

.date-range strong {
  color: var(--text-strong);
  font-size: 0.86rem;
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
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
  padding: 16px;
  border: 1px solid var(--main-border);
  border-radius: 16px;
  background: linear-gradient(
    140deg,
    color-mix(in srgb, var(--surface-2) 76%, var(--surface-1)),
    var(--surface-1)
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
  background: color-mix(in srgb, var(--PrimaryColor) 9%, transparent);
}

.overview__item:hover {
  transform: translateY(-2px);
  border-color: color-mix(in srgb, var(--PrimaryColor) 28%, var(--main-border));
  box-shadow: 0 12px 25px color-mix(in srgb, var(--brand-primary-900) 6%, transparent);
}

.overview__icon {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  flex: none;
  border-radius: 14px;
  color: var(--text-on-brand);
  background: linear-gradient(145deg, var(--PrimaryColor), var(--brand-primary-700));
  box-shadow: 0 8px 18px color-mix(in srgb, var(--PrimaryColor) 20%, transparent);
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
  border-radius: 16px;
  background: var(--surface-1);
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.month-panel:hover {
  border-color: color-mix(in srgb, var(--PrimaryColor) 25%, var(--main-border));
  box-shadow: 0 8px 24px color-mix(in srgb, var(--brand-primary-900) 5%, transparent);
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
  color: var(--text-on-brand);
  background: linear-gradient(145deg, var(--PrimaryColor), var(--brand-primary-700));
  box-shadow: 0 7px 16px color-mix(in srgb, var(--PrimaryColor) 20%, transparent);
  font-size: 0.79rem;
  font-weight: 850;
  text-transform: uppercase;
}

.month-heading div {
  display: grid;
  gap: 3px;
}

.month-heading strong {
  color: var(--text-strong);
  font-size: 0.94rem;
}

.month-heading small {
  color: var(--text-soft);
  font-size: 0.75rem;
}

.draft-count {
  margin-inline-start: auto;
  padding: 6px 10px;
  border-radius: 999px;
  color: var(--PrimaryColor);
  background: color-mix(in srgb, var(--PrimaryColor) 9%, var(--surface-1));
  font-size: 0.7rem;
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
.empty-state > span {
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
  border: 1px solid var(--main-border);
  border-radius: 16px;
  background: color-mix(in srgb, var(--surface-2) 68%, var(--surface-1));
}

.draft-card::before {
  content: '';
  position: absolute;
  inset-block: 0;
  inset-inline-start: 0;
  width: 3px;
  background: linear-gradient(var(--PrimaryColor), var(--brand-primary-700));
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
  font-size: 0.7rem;
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
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.visit-field {
  display: grid;
  align-content: start;
  gap: 10px;
  min-width: 0;
  padding: 14px;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 10%, var(--main-border));
  border-radius: 15px;
  background: var(--surface-1);
  box-shadow: 0 5px 16px color-mix(in srgb, var(--brand-primary-900) 4%, transparent);
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;
}

.visit-field:hover,
.visit-field:focus-within {
  border-color: color-mix(in srgb, var(--PrimaryColor) 34%, var(--main-border));
  box-shadow: 0 10px 24px color-mix(in srgb, var(--brand-primary-900) 7%, transparent);
  transform: translateY(-1px);
}

.visit-field__label {
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 9px;
  min-width: 0;
  color: var(--text-strong);
  font-size: 0.8rem;
  font-weight: 800;
  line-height: 1.25;
}

.visit-field__label > span:last-child {
  min-width: 0;
}

.visit-field__label b {
  color: var(--status-danger);
  font-weight: 850;
}

.visit-field__icon {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  flex: none;
  border-radius: 9px;
  color: var(--PrimaryColor);
  background: color-mix(in srgb, var(--PrimaryColor) 10%, var(--surface-1));
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
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 10%, var(--main-border));
  border-radius: 11px;
  outline: none;
  color: var(--text-strong);
  background: color-mix(in srgb, var(--surface-2) 52%, var(--surface-1));
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

.visit-fields :deep(.p-select) {
  min-height: 46px;
  border-color: color-mix(in srgb, var(--PrimaryColor) 10%, var(--main-border));
  border-radius: 11px;
  background: color-mix(in srgb, var(--surface-2) 52%, var(--surface-1));
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
  color: var(--PrimaryColor);
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
  border-radius: 11px;
  cursor: pointer;
  font-weight: 800;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease;
}

.button--primary {
  color: var(--text-on-brand);
  background: linear-gradient(135deg, var(--PrimaryColor), var(--brand-primary-700));
  box-shadow: 0 9px 20px color-mix(in srgb, var(--PrimaryColor) 22%, transparent);
}

.button--primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 13px 26px color-mix(in srgb, var(--PrimaryColor) 28%, transparent);
}

.button--outline {
  border-color: color-mix(in srgb, var(--PrimaryColor) 40%, var(--main-border));
  color: var(--PrimaryColor);
  background: var(--surface-1);
}

.button:disabled {
  opacity: 0.55;
  cursor: wait;
}

:deep(.p-accordionheader) {
  padding: 12px 15px;
  background: var(--surface-1);
}

:deep(.p-accordioncontent-content) {
  padding: 12px 16px 16px;
  background: var(--surface-1);
}

button:focus-visible,
a:focus-visible,
input:focus-visible,
select:focus-visible {
  outline: 3px solid color-mix(in srgb, var(--PrimaryColor) 24%, transparent);
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
    display: none;
  }

  .draft-count {
    display: none;
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
  color: var(--text-strong);
  font-size: 1rem;
}

.saved-visits-table table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid var(--main-border);
  border-radius: 12px;
  overflow: hidden;
}

.saved-visits-table th {
  padding: 12px;
  text-align: start;
  background: var(--surface-2);
  color: var(--text-strong);
  font-weight: 800;
}

.saved-visits-table td {
  padding: 12px;
  border-top: 1px solid var(--main-border);
  color: var(--text-soft);
}

.saved-visits-table tbody tr:hover {
  background: color-mix(in srgb, var(--PrimaryColor) 5%, transparent);
}
</style>
