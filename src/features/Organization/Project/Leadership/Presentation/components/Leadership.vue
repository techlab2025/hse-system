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
    <header class="leadership-header">
      <div>
        <h1>Leadership visits</h1>
        <p>Plan visits by project month and report completed visits.</p>
      </div>
      <RouterLink :to="`/organization/project-details/${projectId}`" class="btn btn-secondary">Back to project</RouterLink>
    </header>

    <p v-if="errorMessage" role="alert" class="leadership-error">{{ errorMessage }}</p>
    <p v-if="successMessage" role="status" class="leadership-success">{{ successMessage }}</p>

    <DataStatus :controller="projectState">
      <template #success>
        <section>
          <h2>Monthly plan</h2>
          <p>Project dates: {{ projectState.data?.startDate }} to {{ projectState.data?.endDate }}</p>
          <Accordion v-if="months.length" :value="months[0]?.key">
            <AccordionPanel v-for="month in months" :key="month.key" :value="month.key">
              <AccordionHeader>{{ month.label }}</AccordionHeader>
              <AccordionContent>
                <div v-for="(visit, index) in rowsForMonth(month.key)" :key="index" class="visit-fields">
                  <label>Date <input v-model="visit.date" type="date" :min="month.firstDate" :max="month.lastDate" required /></label>
                  <label>Location <input v-model="visit.location" type="text" required /></label>
                  <label>Organization employee
                    <select v-model.number="visit.orgnizationEmployeeId" required>
                      <option :value="0" disabled>Select employee</option>
                      <option v-for="employee in employeeOptions" :key="employee.id" :value="employee.id">{{ employee.name }}</option>
                    </select>
                  </label>
                  <label>Visit activity ID <input v-model.number="visit.visitActivityId" type="number" min="1" required /></label>
                  <button type="button" class="btn btn-secondary" @click="monthVisits[month.key]?.splice(index, 1)">Remove</button>
                </div>
                <div class="leadership-actions">
                  <button type="button" class="btn btn-secondary" @click="addVisit(month.key)">Add visit</button>
                  <button type="button" class="btn btn-primary" :disabled="!rowsForMonth(month.key).length || planController.isDataLoading()" @click="saveMonth(month)">Save {{ month.label }} visits</button>
                </div>
              </AccordionContent>
            </AccordionPanel>
          </Accordion>
          <p v-else>No valid project date range is available.</p>
        </section>
      </template>
      <template #loader><TableLoader :cols="4" :rows="3" /></template>
      <template #initial><TableLoader :cols="4" :rows="3" /></template>
      <template #failed><p role="alert">Unable to load project dates.</p></template>
    </DataStatus>

    <section>
      <h2>Visits</h2>
      <DataStatus :controller="visitsState">
        <template #success>
          <div class="table-responsive">
            <table class="main-table">
              <thead><tr><th>Date</th><th>Location</th><th>Employee</th><th>Activity</th><th>Report</th></tr></thead>
              <tbody>
                <tr v-for="visit in visits" :key="visit.id">
                  <td>{{ visit.date }}</td><td>{{ visit.location }}</td><td>{{ visit.organizationEmployeeName }}</td><td>{{ visit.visitActivityName }}</td>
                  <td><button type="button" class="btn btn-primary" @click="openReport(visit)">Report visit</button></td>
                </tr>
              </tbody>
            </table>
          </div>
          <p v-if="!visits.length">No visits have been planned yet.</p>
        </template>
        <template #loader><TableLoader :cols="5" :rows="4" /></template>
        <template #initial><TableLoader :cols="5" :rows="4" /></template>
        <template #empty><p>No visits have been planned yet.</p></template>
        <template #failed><p role="alert">Unable to load visits.</p></template>
      </DataStatus>
    </section>

    <Dialog :visible="Boolean(selectedVisit)" modal header="Report visit" :style="{ width: 'min(900px, 95vw)' }" @update:visible="(visible: boolean) => { if (!visible) selectedVisit = null }">
      <form class="report-form" @submit.prevent="saveReport">
        <p>Visit: {{ selectedVisit?.date }} · {{ selectedVisit?.location }}</p>
        <label>Topic <input v-model="topic" type="text" required /></label>
        <label>Discussion <textarea v-model="discussion" required /></label>
        <label>Observations <textarea v-model="observations" required /></label>
        <h3>Improvements</h3>
        <div v-for="(improvement, index) in improvements" :key="index" class="improvement-fields">
          <label>Areas <input v-model="improvement.areas" type="text" required /></label>
          <label>Intervention carried out <input v-model="improvement.interventionCarriedOut" type="text" required /></label>
          <label>UA/UC
            <select v-model.number="improvement.uaUc">
              <option :value="UnsafeVisitTypeEnum.UnsafeAct">Unsafe act</option>
              <option :value="UnsafeVisitTypeEnum.UnsafeCondition">Unsafe condition</option>
            </select>
          </label>
          <label>Visit theme ID <input v-model.number="improvement.visitThemId" type="number" min="1" required /></label>
          <label>Visit category ID <input v-model.number="improvement.visitCategoryId" type="number" min="1" required /></label>
          <button type="button" class="btn btn-secondary" @click="improvements.splice(index, 1)">Remove row</button>
        </div>
        <button type="button" class="btn btn-secondary" @click="improvements.push(newImprovement())">Add improvement row</button>
        <h3>Attachments</h3>
        <div v-for="(_, index) in attachments" :key="index" class="attachment-field">
          <input v-model="attachments[index]" type="text" placeholder="Attachment URL or path" />
          <button type="button" class="btn btn-secondary" @click="attachments.splice(index, 1)">Remove</button>
        </div>
        <button type="button" class="btn btn-secondary" @click="attachments.push('')">Add attachment</button>
        <button type="submit" class="btn btn-primary" :disabled="reportController.isDataLoading()">Submit report</button>
      </form>
    </Dialog>
  </main>
</template>

<style scoped>
.leadership-page { display: grid; gap: 24px; padding: 20px; }
.leadership-header, .leadership-actions, .attachment-field { display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap; }
.visit-fields, .improvement-fields { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); align-items: end; gap: 12px; padding: 14px 0; border-bottom: 1px solid var(--main-border); }
.report-form { display: grid; gap: 16px; }
label { display: grid; gap: 6px; }
input, select, textarea { width: 100%; border: 1px solid var(--main-border); border-radius: 6px; padding: 9px; background: var(--surface-1); color: var(--text-strong); }
.leadership-error { color: var(--status-danger); }
.leadership-success { color: var(--status-success); }
</style>
