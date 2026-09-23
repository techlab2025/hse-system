<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import FetchRiskAssessmentsParams from '../../../Core/params/RiskAssessment/FetchRiskAssessmentsParams'
import FetchRiskAssessmentDetailsParams from '../../../Core/params/RiskAssessment/FetchRiskAssessmentDetailsParams'
import FetchRiskAssessmentsController from '../../controllers/RiskAssessment/FetchRiskAssessmentsController'
import FetchRiskAssessmentDetailsController from '../../controllers/RiskAssessment/FetchRiskAssessmentDetailsController'
import type RiskAssessmentModel from '../../../Data/models/RiskAssessment/RiskAssessmentModel'

const route = useRoute()
const items = ref<RiskAssessmentModel[]>([])
const selected = ref<RiskAssessmentModel | null>(null)
const loading = ref(false)
const detailsLoading = ref(false)
const error = ref('')
const projectId = Number(route.params.id)

async function fetchAll() {
  loading.value = true
  error.value = ''
  try {
    const state = await FetchRiskAssessmentsController.getInstance().execute(
      new FetchRiskAssessmentsParams(),
    )
    if (FetchRiskAssessmentsController.getInstance().isDataSuccess())
      items.value = state.value.data ?? []
    else error.value = state.value.error?.title ?? 'Could not load risk assessments'
  } catch {
    error.value = 'Could not load risk assessments'
  } finally {
    loading.value = false
  }
}

async function fetchDetails(id: number) {
  detailsLoading.value = true
  selected.value = null
  error.value = ''
  try {
    const state = await FetchRiskAssessmentDetailsController.getInstance().execute(
      new FetchRiskAssessmentDetailsParams(id),
    )
    if (FetchRiskAssessmentDetailsController.getInstance().isDataSuccess())
      selected.value = state.value.data ?? null
    else error.value = state.value.error?.title ?? 'Could not load risk assessment details'
  } catch {
    error.value = 'Could not load risk assessment details'
  } finally {
    detailsLoading.value = false
  }
}

onMounted(fetchAll)
</script>

<template>
  <main class="risk-page">
    <header class="risk-hero">
      <div>
        <RouterLink class="back-link" :to="`/organization/project-details/${projectId}`"
          >← Project details</RouterLink
        >
        <span class="eyebrow">PROJECT SAFETY</span>
        <h1>Risk assessments</h1>
        <p>Review work activities, areas and approvals in one place.</p>
      </div>
      <RouterLink
        class="primary-button"
        :to="`/organization/project-details/${projectId}/risk-assessments/create`"
      >
        <span aria-hidden="true">＋</span> Add assessment
      </RouterLink>
    </header>

    <section class="risk-panel">
      <div class="panel-heading">
        <div>
          <span class="eyebrow">ASSESSMENT REGISTER</span>
          <h2>
            All assessments <span class="count">{{ items.length }}</span>
          </h2>
        </div>
        <button class="refresh-button" type="button" :disabled="loading" @click="fetchAll">
          Refresh
        </button>
      </div>
      <p v-if="error" class="message error" role="alert">{{ error }}</p>
      <p v-if="loading" class="message" role="status">Loading assessments…</p>
      <div v-else-if="items.length" class="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Activity</th>
              <th>Work area</th>
              <th>Date</th>
              <th>Approver ID</th>
              <th>Attachments</th>
              <th><span class="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in items" :key="item.id ?? index">
              <td class="activity-cell">{{ item.activity || '—' }}</td>
              <td>{{ item.workAreaStrign || '—' }}</td>
              <td>{{ item.date || '—' }}</td>
              <td>{{ item.employeeApproverId || '—' }}</td>
              <td>{{ item.attachents.length }}</td>
              <td>
                <button
                  v-if="item.id != null"
                  class="details-button"
                  type="button"
                  @click="fetchDetails(item.id)"
                >
                  View details →
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else-if="!error" class="empty-state">
        <span class="empty-icon">◇</span>
        <h3>No assessments yet</h3>
        <p>Create the first risk assessment for this project.</p>
        <RouterLink :to="`/organization/project-details/${projectId}/risk-assessments/create`"
          >Add assessment →</RouterLink
        >
      </div>
    </section>

    <section v-if="detailsLoading || selected" class="risk-panel details-panel" aria-live="polite">
      <p v-if="detailsLoading">Loading details…</p>
      <template v-else-if="selected">
        <div class="panel-heading">
          <div>
            <span class="eyebrow">ASSESSMENT DETAILS</span>
            <h2>{{ selected.activity }}</h2>
          </div>
          <button class="refresh-button" type="button" @click="selected = null">Close</button>
        </div>
        <div class="detail-grid">
          <div>
            <span>Work area</span><strong>{{ selected.workAreaStrign || '—' }}</strong>
          </div>
          <div>
            <span>Date</span><strong>{{ selected.date || '—' }}</strong>
          </div>
          <div>
            <span>Approver ID</span><strong>{{ selected.employeeApproverId || '—' }}</strong>
          </div>
        </div>
        <div class="description">
          <span>Description</span>
          <p>{{ selected.desctiprion || '—' }}</p>
        </div>
        <div v-if="selected.attachents.length" class="description">
          <span>Attachments</span>
          <ul>
            <li v-for="(attachment, index) in selected.attachents" :key="index">
              <a :href="attachment" target="_blank" rel="noopener noreferrer"
                >Attachment {{ index + 1 }} ↗</a
              >
            </li>
          </ul>
        </div>
      </template>
    </section>
  </main>
</template>

<style scoped>
.risk-page {
  /* max-width: 1440px; */
  margin: auto;
  padding: 24px;
  display: grid;
  gap: 22px;
  color: var(--text-primary, #172334);
}
.risk-hero,
.risk-panel {
  border: 1px solid var(--main-border, #e5eaf0);
  border-radius: 24px;
  background: var(--surface-2, #fff);
  box-shadow: 0 14px 38px rgba(22, 45, 65, 0.06);
}
.risk-hero {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 20px;
  padding: 34px;
  background:
    radial-gradient(
      circle at 95% 10%,
      color-mix(in srgb, var(--PrimaryColor, #0b8c8c) 16%, transparent),
      transparent 35%
    ),
    var(--surface-2, #fff);
}
.back-link {
  display: block;
  margin-bottom: 24px;
  color: var(--PrimaryColor, #087d80);
  font-weight: 700;
  text-decoration: none;
}
.eyebrow {
  display: block;
  color: var(--PrimaryColor, #087d80);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.14em;
}
.risk-hero h1 {
  font-size: clamp(1.8rem, 3vw, 2.7rem);
  margin: 8px 0;
}
.risk-hero p {
  margin: 0;
  color: var(--text-secondary, #687787);
}
.primary-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 13px 20px;
  border-radius: 12px;
  background: var(--PrimaryColor, #087d80);
  color: #fff;
  text-decoration: none;
  font-weight: 750;
  white-space: nowrap;
}
.primary-button:hover {
  filter: brightness(0.92);
}
.risk-panel {
  overflow: hidden;
}
.panel-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 24px 26px;
}
.panel-heading h2 {
  margin: 5px 0 0;
  font-size: 1.25rem;
}
.count {
  font-size: 0.8rem;
  padding: 4px 9px;
  border-radius: 20px;
  background: color-mix(in srgb, var(--PrimaryColor, #087d80) 13%, transparent);
  color: var(--PrimaryColor, #087d80);
}
.refresh-button,
.details-button {
  border: 0;
  background: none;
  color: var(--PrimaryColor, #087d80);
  font-weight: 750;
  cursor: pointer;
}
.refresh-button:disabled {
  opacity: 0.5;
}
.table-scroll {
  overflow-x: auto;
}
table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}
th {
  background: var(--surface-1, #f6f8fa);
  font-size: 0.73rem;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: var(--text-secondary, #687787);
}
th,
td {
  padding: 16px 25px;
  white-space: nowrap;
}
td {
  border-top: 1px solid var(--main-border, #e5eaf0);
}
tbody tr:hover {
  background: color-mix(in srgb, var(--PrimaryColor, #087d80) 4%, transparent);
}
.activity-cell {
  font-weight: 750;
}
.message {
  padding: 18px 26px;
}
.error {
  color: var(--status-danger, #bf3333);
}
.empty-state {
  text-align: center;
  padding: 58px 20px;
}
.empty-icon {
  display: block;
  font-size: 3rem;
  color: var(--PrimaryColor, #087d80);
}
.empty-state h3 {
  margin: 8px 0;
}
.empty-state p {
  color: var(--text-secondary, #687787);
}
.empty-state a {
  color: var(--PrimaryColor, #087d80);
  font-weight: 750;
}
.details-panel {
  padding-bottom: 25px;
}
.detail-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  padding: 0 26px;
}
.detail-grid > div {
  padding: 16px;
  border-radius: 14px;
  background: var(--surface-1, #f6f8fa);
}
.detail-grid span,
.description span {
  display: block;
  color: var(--text-secondary, #687787);
  font-size: 0.8rem;
}
.detail-grid strong {
  display: block;
  margin-top: 7px;
}
.description {
  padding: 18px 26px 0;
}
.description p {
  margin: 6px 0;
}
.description a {
  color: var(--PrimaryColor, #087d80);
}
@media (max-width: 700px) {
  .risk-page {
    padding: 12px;
  }
  .risk-hero {
    display: block;
    padding: 24px;
  }
  .primary-button {
    margin-top: 20px;
  }
  .detail-grid {
    grid-template-columns: 1fr;
  }
  .panel-heading {
    padding: 20px;
  }
}
</style>
