<script lang="ts" setup>
import { translate as localizeUi } from '@/localization/i18n'

import { vProjectPanels } from '../../composables/projectPanels'

import PermissionHandler from '@/base/Presentation/utils/permission_handler'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
import { DataEmpty } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { computed, onMounted, ref } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import FetchRiskAssessmentsParams from '../../../Core/params/RiskAssessment/FetchRiskAssessmentsParams'
import FetchRiskAssessmentDetailsParams from '../../../Core/params/RiskAssessment/FetchRiskAssessmentDetailsParams'
import FetchRiskAssessmentsController from '../../controllers/RiskAssessment/FetchRiskAssessmentsController'
import FetchRiskAssessmentDetailsController from '../../controllers/RiskAssessment/FetchRiskAssessmentDetailsController'
import type RiskAssessmentModel from '../../../Data/models/RiskAssessment/RiskAssessmentModel'
import RiskAssessmentDetailsDialog from './RiskAssessmentDetailsDialog.vue'

const canFetch = computed(() =>
  PermissionHandler.Instance.handle([
    PermissionsEnum.ADMIN,
    PermissionsEnum.RISK_ASSESSMENT_ALL,
    PermissionsEnum.RISK_ASSESSMENT_FETCH,
  ]),
)
const canCreate = computed(() =>
  PermissionHandler.Instance.handle([
    PermissionsEnum.ADMIN,
    PermissionsEnum.RISK_ASSESSMENT_ALL,
    PermissionsEnum.RISK_ASSESSMENT_CREATE,
  ]),
)
const canViewDetails = computed(() =>
  PermissionHandler.Instance.handle([
    PermissionsEnum.ADMIN,
    PermissionsEnum.RISK_ASSESSMENT_ALL,
    PermissionsEnum.RISK_ASSESSMENT_DETAILS,
  ]),
)
const route = useRoute()
const items = ref<RiskAssessmentModel[]>([])
const selected = ref<RiskAssessmentModel | null>(null)
const loading = ref(false)
const detailsLoading = ref(false)
const detailsDialogVisible = ref(false)
const error = ref('')
const detailsError = ref('')
const projectId = Number(route.params.id)
const latestAssessmentDate = computed(() => {
  const dates = items.value
    .map((item) => item.date)
    .filter(Boolean)
    .sort()
  return dates[dates.length - 1] ?? '—'
})
const activityInitial = (activity: string) => activity.trim().charAt(0).toUpperCase() || 'R'

async function fetchAll() {
  if (!canFetch.value) return
  loading.value = true
  error.value = ''
  try {
    const state = await FetchRiskAssessmentsController.getInstance().execute(
      new FetchRiskAssessmentsParams({ projectId: projectId }),
    )
    if (
      FetchRiskAssessmentsController.getInstance().isDataSuccess() ||
      state.value instanceof DataEmpty
    )
      items.value = state.value.data ?? []
    else error.value = state.value.error?.title ?? 'Could not load risk assessments'
  } catch {
    error.value = localizeUi('Could not load risk assessments')
  } finally {
    loading.value = false
  }
}

async function fetchDetails(id: number) {
  if (!canViewDetails.value) return
  detailsDialogVisible.value = true
  detailsLoading.value = true
  selected.value = null
  detailsError.value = ''
  try {
    const state = await FetchRiskAssessmentDetailsController.getInstance().execute(
      new FetchRiskAssessmentDetailsParams(id),
    )
    if (FetchRiskAssessmentDetailsController.getInstance().isDataSuccess())
      selected.value = state.value.data ?? null
    else detailsError.value = state.value.error?.title ?? 'Could not load risk assessment details'
  } catch {
    detailsError.value = localizeUi('Could not load risk assessment details')
  } finally {
    detailsLoading.value = false
  }
}

function closeDetailsDialog() {
  detailsDialogVisible.value = false
  selected.value = null
  detailsError.value = ''
}

onMounted(fetchAll)
</script>

<template>
  <main
    v-if="canFetch"
    data-hse-project
    v-project-panels
    class="hse-project-root hse-project-assurance hse-project-page risk-page"
  >
    <header data-hse-project-head class="hse-project-page-head risk-hero">
      <!-- <div class="hero-art" aria-hidden="true"><span></span><span></span><span></span></div> -->
      <div class="hero-copy">
        <!-- <RouterLink class="back-link" :to="`/organization/project-details/${projectId}`">
          <span aria-hidden="true">←</span> Project details
        </RouterLink> -->
        <div class="hero-title">
          <span class="hero-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 3 4.5 6v5.2c0 4.6 3.1 8.2 7.5 9.8 4.4-1.6 7.5-5.2 7.5-9.8V6L12 3Z" />
              <path d="m8.5 12 2.2 2.2 4.8-5" />
            </svg>
          </span>
          <div>
            <!-- <span class="eyebrow">Project safety</span> -->
            <h1>{{ $t('Risk assessments') }}</h1>
            <p>{{ $t('Review work activities, control evidence, and approvals in one place.') }}</p>
          </div>
        </div>
      </div>
      <RouterLink
        v-if="canCreate"
        class="hse-project-button hse-project-button--primary primary-button"
        :to="`/organization/project-details/${projectId}/risk-assessments/create`"
      >
        <span class="primary-button__icon" aria-hidden="true">＋</span>
        <span>{{ $t('New assessment') }}</span>
      </RouterLink>
    </header>

    <section class="risk-summary" :aria-label="$t('Risk assessment overview')">
      <article class="summary-card">
        <span class="summary-card__icon" aria-hidden="true">◎</span>
        <div>
          <small>{{ $t('Total assessments') }}</small
          ><strong>{{ items.length }}</strong>
        </div>
        <!-- <span class="summary-card__trend">Register</span> -->
      </article>
      <!-- <article class="summary-card">
        <span class="summary-card__icon" aria-hidden="true">⌁</span>
        <div>
          <small>Supporting files</small><strong>{{ totalAttachments }}</strong>
        </div>
        <span class="summary-card__trend">Evidence</span>
      </article> -->
      <article class="summary-card">
        <span class="summary-card__icon" aria-hidden="true">◷</span>
        <div>
          <small>{{ $t('Latest assessment') }}</small
          ><strong class="summary-card__date">{{ latestAssessmentDate }}</strong>
        </div>
        <!-- <span class="summary-card__trend">Updated</span> -->
      </article>
    </section>

    <section class="hse-project-panel risk-panel">
      <div class="panel-heading">
        <div class="panel-heading__copy">
          <span class="section-icon" aria-hidden="true">▦</span>
          <div>
            <!-- <span class="eyebrow">Assessment register</span> -->
            <h2>
              {{ $t('Assessments') }} <span class="count">{{ items.length }}</span>
            </h2>
            <p>{{ $t('Open any record to review its approval and supporting evidence.') }}</p>
          </div>
        </div>
        <!-- <button class="refresh-button" type="button" :disabled="loading" @click="fetchAll">
          <span :class="{ 'is-spinning': loading }" aria-hidden="true">↻</span> Refresh
        </button> -->
      </div>
      <p v-if="error" class="message error" role="alert"><span>!</span>{{ error }}</p>
      <div v-if="loading" class="loading-state" role="status">
        <span class="loading-state__pulse"></span>
        <div>
          <strong>{{ $t('Loading assessments') }}</strong
          ><small>{{ $t('Preparing the safety register…') }}</small>
        </div>
      </div>
      <div v-else-if="items.length" class="table-scroll">
        <table class="hse-project-table">
          <thead>
            <tr>
              <th>{{ $t('Activity') }}</th>
              <th>{{ $t('Work area') }}</th>
              <th>{{ $t('Date') }}</th>
              <th>{{ $t('Created by') }}</th>
              <!-- <th>Attachments</th> -->
              <th>
                <span class="sr-only">{{ $t('Actions') }}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in items" :key="item.id ?? index">
              <td>
                <span class="activity-cell">
                  <span class="activity-avatar">{{ activityInitial(item.activity) }}</span>
                  <span
                    ><strong>{{ item.activity || $t('Untitled activity') }}</strong>
                    <!-- <small>Risk assessment</small> -->
                  </span>
                </span>
              </td>
              <td>
                <span class="area-cell">{{ item.workAreaStrign || '—' }}</span>
              </td>
              <td>
                <span class="date-pill">{{ item.date || '—' }}</span>
              </td>
              <td>
                <span class="approver-pill">{{ item.employeeApproverId?.name || '—' }}</span>
              </td>
              <!-- <td>
                <span class="attachment-count"
                  ><span aria-hidden="true">⌁</span>{{ item.media.length }}</span
                >
              </td> -->
              <td>
                <button
                  v-if="item.id != null && canViewDetails"
                  class="hse-project-button details-button"
                  type="button"
                  @click="fetchDetails(item.id)"
                >
                  {{ $t('View') }} <span aria-hidden="true">→</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else-if="!error" class="empty-state">
        <span class="empty-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M12 3 4.5 6v5.2c0 4.6 3.1 8.2 7.5 9.8 4.4-1.6 7.5-5.2 7.5-9.8V6L12 3Z" />
            <path d="M12 8v5M12 16.5v.1" />
          </svg>
        </span>
        <span class="eyebrow">{{ $t('Your register is ready') }}</span>
        <h3>{{ $t('No assessments yet') }}</h3>
        <p>
          {{ $t('Create the first assessment to start documenting project risks and approvals.') }}
        </p>
        <RouterLink
          v-if="canCreate"
          class="hse-project-button hse-project-button--primary empty-action"
          :to="`/organization/project-details/${projectId}/risk-assessments/create`"
        >
          {{ $t('Create first assessment') }} <span aria-hidden="true">→</span>
        </RouterLink>
      </div>
    </section>

    <RiskAssessmentDetailsDialog
      :visible="detailsDialogVisible"
      :assessment="selected"
      :loading="detailsLoading"
      :error="detailsError"
      @close="closeDetailsDialog"
    />
  </main>
  <p v-else role="status">{{ $t('have_not_permission') }}</p>
</template>

<style scoped>
th {
  text-align: start;
}
.risk-page {
  /* max-width: 1440px; */
  margin: auto;
  padding: 24px;
  display: grid;
  gap: 22px;
  color: var(--hse-project-ink);
}
.risk-hero,
.risk-panel {
  border: 1px solid var(--hse-project-line);
  border-radius: var(--hse-project-radius-panel);
  background: var(--hse-project-surface-soft);
  box-shadow: 0 14px 38px rgba(22, 45, 65, 0.06);
}
.risk-hero {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 20px;
  padding: 34px;
  padding-top: 10px !important;
  background:
    radial-gradient(
      circle at 95% 10%,
      color-mix(in srgb, var(--hse-project-blue) 16%, transparent),
      transparent 35%
    ),
    var(--hse-project-surface-soft);
}
.back-link {
  display: block;
  margin-bottom: 24px;
  color: var(--hse-project-blue);
  font-weight: 700;
  text-decoration: none;
}
.eyebrow {
  display: block;
  color: var(--hse-project-blue);
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
  color: var(--hse-project-muted);
}
.primary-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 13px 20px;
  border-radius: var(--hse-project-radius-control);
  background: var(--hse-project-blue);
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
  border-radius: var(--hse-project-radius-panel);
  background: color-mix(in srgb, var(--hse-project-blue) 13%, transparent);
  color: var(--hse-project-blue);
}
.refresh-button,
.details-button {
  border: 0;
  background: none;
  color: var(--hse-project-blue);
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
  text-align: start;
}
th {
  background: var(--hse-project-surface);
  font-size: 0.73rem;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: var(--hse-project-muted);
}
th,
td {
  padding: 16px 25px;
  white-space: nowrap;
}
td {
  border-top: 1px solid var(--hse-project-line);
}
tbody tr:hover {
  background: color-mix(in srgb, var(--hse-project-blue) 4%, transparent);
}
.activity-cell {
  font-weight: 750;
}
.message {
  padding: 18px 26px;
}
.error {
  color: var(--hse-project-red);
}
.empty-state {
  text-align: center;
  padding: 58px 20px;
}
.empty-icon {
  display: block;
  font-size: 3rem;
  color: var(--hse-project-blue);
}
.empty-state h3 {
  margin: 8px 0;
}
.empty-state p {
  color: var(--hse-project-muted);
}
.empty-state a {
  color: var(--hse-project-blue);
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
  border-radius: var(--hse-project-radius-panel);
  background: var(--hse-project-surface);
}
.detail-grid span,
.description span {
  display: block;
  color: var(--hse-project-muted);
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
  color: var(--hse-project-blue);
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

/* Modern risk register */
.risk-page {
  min-height: 100%;
  margin: 0;
  /* padding: clamp(14px, 2vw, 28px);
  background:
    radial-gradient(
      circle at 7% 3%,
      color-mix(in srgb, var(--hse-project-blue) 7%, transparent),
      transparent 25rem
    ),
    var(--hse-project-surface-soft); */
  color: var(--hse-project-ink);
}

.risk-hero {
  position: relative;
  isolation: isolate;
  align-items: flex-end;
  overflow: hidden;
  padding: clamp(26px, 4vw, 44px);
  border-color: color-mix(in srgb, var(--hse-project-blue) 24%, transparent);
  border-radius: var(--hse-project-radius-panel);
  background:
    radial-gradient(
      circle at 88% 10%,
      color-mix(in srgb, var(--hse-project-blue) 24%, transparent),
      transparent 35%
    ),
    linear-gradient(
      125deg,
      color-mix(in srgb, var(--hse-project-navy) 96%, var(--hse-project-surface)),
      color-mix(in srgb, var(--hse-project-blue) 76%, var(--hse-project-navy))
    );
  box-shadow: 0 24px 55px color-mix(in srgb, var(--hse-project-navy) 20%, transparent);
}

.hero-copy,
.primary-button {
  position: relative;
  z-index: 2;
}
.hero-title {
  display: flex;
  align-items: center;
  gap: 18px;
}
.hero-icon {
  display: grid;
  place-items: center;
  width: 68px;
  height: 68px;
  flex: none;
  border: 1px solid color-mix(in srgb, white 22%, transparent);
  border-radius: var(--hse-project-radius-panel);
  color: white;
  background: color-mix(in srgb, white 11%, transparent);
  box-shadow:
    inset 0 1px 0 color-mix(in srgb, white 18%, transparent),
    0 14px 30px color-mix(in srgb, black 20%, transparent);
  backdrop-filter: blur(10px);
}
.hero-icon svg,
.empty-icon svg {
  width: 34px;
  stroke: currentColor;
  stroke-width: 1.7;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.back-link {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  margin-bottom: 25px;
  color: color-mix(in srgb, white 78%, transparent);
  font-size: 0.8rem;
}
.back-link:hover {
  color: white;
  transform: translateX(-2px);
}
.eyebrow {
  color: var(--hse-project-blue);
  font-size: 0.68rem;
  font-weight: 850;
  text-transform: uppercase;
}
.risk-hero .eyebrow {
  color: color-mix(in srgb, white 68%, var(--hse-project-blue));
}
.risk-hero h1 {
  margin: 5px 0 8px;
  color: white;
  line-height: 1.08;
}
.risk-hero p {
  max-width: 610px;
  color: color-mix(in srgb, white 72%, transparent);
  line-height: 1.55;
}
.hero-art {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.hero-art span {
  position: absolute;
  border: 1px solid color-mix(in srgb, white 13%, transparent);
  border-radius: 50%;
}
.hero-art span:nth-child(1) {
  width: 320px;
  height: 320px;
  inset: -190px -80px auto auto;
}
.hero-art span:nth-child(2) {
  width: 190px;
  height: 190px;
  inset: auto 12% -145px auto;
}
.hero-art span:nth-child(3) {
  width: 90px;
  height: 90px;
  inset: 30px 30% auto auto;
}

.primary-button,
.empty-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  text-decoration: none;
  font-weight: 800;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease;
}
.primary-button {
  padding: 12px 18px;
  border: 1px solid color-mix(in srgb, white 22%, transparent);
  border-radius: var(--hse-project-radius-control);
  color: white;
  background: color-mix(in srgb, white 12%, transparent);
  box-shadow: inset 0 1px 0 color-mix(in srgb, white 18%, transparent);
  backdrop-filter: blur(12px);
}
.primary-button__icon {
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  border-radius: var(--hse-project-radius-control);
  color: var(--hse-project-navy);
  background: white;
}
.primary-button:hover {
  filter: none;
  transform: translateY(-2px);
  background: color-mix(in srgb, white 18%, transparent);
  box-shadow: 0 14px 28px color-mix(in srgb, black 18%, transparent);
}

.risk-summary {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}
.summary-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 13px;
  overflow: hidden;
  min-width: 0;
  padding: 18px;
  border: 1px solid var(--hse-project-line);
  border-radius: var(--hse-project-radius-panel);
  background: linear-gradient(
    140deg,
    color-mix(in srgb, var(--hse-project-surface-soft) 66%, var(--hse-project-surface)),
    var(--hse-project-surface)
  );
  box-shadow: 0 10px 28px color-mix(in srgb, var(--hse-project-navy) 5%, transparent);
}
.summary-card::after {
  content: '';
  position: absolute;
  width: 95px;
  height: 95px;
  inset: -58px -42px auto auto;
  border-radius: 50%;
  background: color-mix(in srgb, var(--hse-project-blue) 10%, transparent);
}
.summary-card__icon,
.section-icon {
  display: grid;
  place-items: center;
  flex: none;
  color: var(--hse-project-on-primary);
  background: linear-gradient(145deg, var(--hse-project-blue), var(--hse-project-navy2));
  box-shadow: 0 8px 18px color-mix(in srgb, var(--hse-project-blue) 20%, transparent);
}
.summary-card__icon {
  width: 46px;
  height: 46px;
  border-radius: var(--hse-project-radius-panel);
  font-size: 1.25rem;
}
.summary-card > div {
  display: grid;
  gap: 2px;
  min-width: 0;
}
.summary-card small {
  color: var(--hse-project-muted);
  font-size: 0.72rem;
}
.summary-card strong {
  color: var(--hse-project-ink);
  font-size: 1.35rem;
}
.summary-card__date {
  overflow: hidden;
  font-size: 1rem !important;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.summary-card__trend {
  margin-inline-start: auto;
  padding: 6px 9px;
  border-radius: 999px;
  color: var(--hse-project-blue);
  background: color-mix(in srgb, var(--hse-project-blue) 9%, var(--hse-project-surface));
  font-size: 0.66rem;
  font-weight: 800;
}

.risk-panel {
  border-color: var(--hse-project-line);
  border-radius: var(--hse-project-radius-panel);
  background: var(--hse-project-surface);
  box-shadow: 0 15px 40px color-mix(in srgb, var(--hse-project-navy) 6%, transparent);
}
.panel-heading {
  padding: 24px 26px 20px;
}
.panel-heading__copy,
.details-heading__copy {
  display: flex;
  align-items: center;
  gap: 13px;
}
.section-icon {
  width: 44px;
  height: 44px;
  border-radius: var(--hse-project-radius-control);
  font-size: 1.2rem;
}
.panel-heading__copy > div {
  display: grid;
  gap: 2px;
}
.panel-heading p,
.details-heading p {
  margin: 2px 0 0;
  color: var(--hse-project-muted);
  font-size: 0.78rem;
}
.panel-heading h2 {
  color: var(--hse-project-ink);
  font-size: 1.3rem;
}
.count {
  display: inline-grid;
  place-items: center;
  min-width: 27px;
  margin-inline-start: 5px;
  color: var(--hse-project-blue);
  background: color-mix(in srgb, var(--hse-project-blue) 11%, var(--hse-project-surface));
  font-size: 0.75rem;
  vertical-align: middle;
}

.refresh-button,
.details-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  border-radius: var(--hse-project-radius-control);
  color: var(--hse-project-blue);
  font-weight: 800;
  transition:
    color 0.2s ease,
    background 0.2s ease,
    transform 0.2s ease;
}
.refresh-button {
  padding: 9px 12px;
  border: 1px solid color-mix(in srgb, var(--hse-project-blue) 24%, var(--hse-project-line));
  background: color-mix(in srgb, var(--hse-project-blue) 5%, var(--hse-project-surface));
}
.refresh-button:hover:not(:disabled) {
  transform: translateY(-1px);
  background: color-mix(in srgb, var(--hse-project-blue) 10%, var(--hse-project-surface));
}
.refresh-button .is-spinning,
.loading-state__pulse {
  animation: risk-spin 0.8s linear infinite;
}
@keyframes risk-spin {
  to {
    transform: rotate(360deg);
  }
}

.message {
  display: flex;
  align-items: center;
  gap: 9px;
  margin: 0 26px 20px;
  padding: 13px 15px;
  border-radius: var(--hse-project-radius-control);
}
.error {
  color: var(--hse-project-red);
  background: var(--hse-project-red-soft);
  font-weight: 700;
}
.error > span {
  display: grid;
  place-items: center;
  width: 22px;
  height: 22px;
  border-radius: 7px;
  color: white;
  background: var(--hse-project-red);
}
.loading-state {
  display: flex;
  align-items: center;
  gap: 13px;
  margin: 0 26px 24px;
  padding: 20px;
  border: 1px dashed color-mix(in srgb, var(--hse-project-blue) 24%, var(--hse-project-line));
  border-radius: var(--hse-project-radius-panel);
  background: color-mix(in srgb, var(--hse-project-blue) 3%, var(--hse-project-surface));
}
.loading-state__pulse {
  width: 40px;
  height: 40px;
  border: 3px solid color-mix(in srgb, var(--hse-project-blue) 18%, transparent);
  border-top-color: var(--hse-project-blue);
  border-radius: 50%;
}
.loading-state div {
  display: grid;
  gap: 3px;
}
.loading-state strong {
  color: var(--hse-project-ink);
}
.loading-state small {
  color: var(--hse-project-muted);
}

.table-scroll {
  border-top: 1px solid var(--hse-project-line);
}
table {
  text-align: start;
}
th {
  color: var(--hse-project-muted);
  background: color-mix(in srgb, var(--hse-project-surface-soft) 72%, var(--hse-project-surface));
  font-size: 0.67rem;
}
th,
td {
  padding: 15px 22px;
}
td {
  border-color: var(--hse-project-line);
  color: var(--hse-project-ink);
}
tbody tr {
  transition: background 0.2s ease;
}
tbody tr:hover {
  background: color-mix(in srgb, var(--hse-project-blue) 4%, var(--hse-project-surface));
}
.activity-cell,
.area-cell {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}
.activity-avatar,
.details-icon {
  display: grid;
  place-items: center;
  flex: none;
  color: var(--hse-project-blue);
  background: color-mix(in srgb, var(--hse-project-blue) 11%, var(--hse-project-surface));
  font-weight: 850;
}
.activity-avatar {
  width: 36px;
  height: 36px;
  border-radius: var(--hse-project-radius-control);
}
.activity-cell > span:last-child {
  display: grid;
  gap: 2px;
}
.activity-cell strong {
  color: var(--hse-project-ink);
  font-size: 0.82rem;
}
.activity-cell small {
  color: var(--hse-project-muted);
  font-size: 0.67rem;
}
.area-cell {
  color: var(--hse-project-muted);
}
.area-cell > span {
  color: var(--hse-project-blue);
}
.date-pill,
.approver-pill,
.attachment-count {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 6px 9px;
  border-radius: var(--hse-project-radius-control);
  font-size: 0.74rem;
  font-weight: 750;
}
.date-pill {
  background: var(--hse-project-surface-soft);
}
.approver-pill {
  color: var(--hse-project-blue);
  background: color-mix(in srgb, var(--hse-project-blue) 8%, var(--hse-project-surface));
}
.attachment-count {
  justify-content: center;
  min-width: 42px;
  color: var(--hse-project-muted);
  background: var(--hse-project-surface-soft);
}
.details-button {
  padding: 8px 11px;
  border: 1px solid color-mix(in srgb, var(--hse-project-blue) 24%, var(--hse-project-line));
  background: var(--hse-project-surface);
}
.details-button:hover {
  color: var(--hse-project-on-primary);
  background: var(--hse-project-blue);
  transform: translateY(-1px);
}

.empty-state {
  display: grid;
  justify-items: center;
  padding: clamp(46px, 8vw, 78px) 20px;
  background: radial-gradient(
    circle at 50% 35%,
    color-mix(in srgb, var(--hse-project-blue) 6%, transparent),
    transparent 35%
  );
}
.empty-icon {
  display: grid;
  place-items: center;
  width: 70px;
  height: 70px;
  margin-bottom: 17px;
  border: 1px solid color-mix(in srgb, var(--hse-project-blue) 18%, var(--hse-project-line));
  border-radius: var(--hse-project-radius-panel);
  color: var(--hse-project-blue);
  background: var(--hse-project-surface);
  box-shadow: 0 14px 30px color-mix(in srgb, var(--hse-project-navy) 7%, transparent);
}
.empty-state h3 {
  margin: 6px 0;
  color: var(--hse-project-ink);
  font-size: 1.25rem;
}
.empty-state p {
  max-width: 440px;
  margin: 0 0 18px;
  color: var(--hse-project-muted);
  line-height: 1.55;
}
.empty-action {
  padding: 11px 15px;
  border-radius: var(--hse-project-radius-control);
  color: var(--hse-project-on-primary) !important;
  background: linear-gradient(135deg, var(--hse-project-blue), var(--hse-project-navy2));
  box-shadow: 0 10px 22px color-mix(in srgb, var(--hse-project-blue) 22%, transparent);
}
.empty-action:hover {
  transform: translateY(-1px);
  box-shadow: 0 14px 28px color-mix(in srgb, var(--hse-project-blue) 28%, transparent);
}

.details-panel {
  padding-bottom: 26px;
}
.details-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 24px 26px;
  border-bottom: 1px solid var(--hse-project-line);
  background: linear-gradient(
    110deg,
    color-mix(in srgb, var(--hse-project-blue) 6%, var(--hse-project-surface)),
    var(--hse-project-surface)
  );
}
.details-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--hse-project-radius-panel);
}
.details-heading h2 {
  margin: 4px 0 0;
  color: var(--hse-project-ink);
  font-size: 1.35rem;
}
.close-button {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  flex: none;
  border: 1px solid var(--hse-project-line);
  border-radius: var(--hse-project-radius-control);
  color: var(--hse-project-muted);
  background: var(--hse-project-surface);
  cursor: pointer;
  font-size: 1.25rem;
}
.close-button:hover {
  border-color: color-mix(in srgb, var(--hse-project-red) 25%, var(--hse-project-line));
  color: var(--hse-project-red);
  background: var(--hse-project-red-soft);
}
.detail-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
  padding: 22px 26px 0;
}
.detail-grid > div {
  display: flex;
  align-items: center;
  gap: 11px;
  min-width: 0;
  padding: 16px;
  border: 1px solid var(--hse-project-line);
  border-radius: var(--hse-project-radius-panel);
  background: color-mix(in srgb, var(--hse-project-surface-soft) 68%, var(--hse-project-surface));
}
.detail-grid__icon {
  display: grid !important;
  place-items: center;
  width: 36px;
  height: 36px;
  flex: none;
  border-radius: var(--hse-project-radius-control);
  color: var(--hse-project-blue) !important;
  background: color-mix(in srgb, var(--hse-project-blue) 10%, var(--hse-project-surface));
  font-size: 1rem !important;
}
.detail-grid > div > div {
  display: grid;
  min-width: 0;
  gap: 3px;
}
.detail-grid span {
  color: var(--hse-project-muted);
  font-size: 0.72rem;
}
.detail-grid strong {
  overflow: hidden;
  margin: 0;
  color: var(--hse-project-ink);
  font-size: 0.85rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.description {
  margin: 16px 26px 0;
  padding: 18px;
  border: 1px solid var(--hse-project-line);
  border-radius: var(--hse-project-radius-panel);
  background: var(--hse-project-surface);
}
.description__heading {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--hse-project-ink);
}
.description__heading > span {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border-radius: var(--hse-project-radius-control);
  color: var(--hse-project-blue);
  background: color-mix(in srgb, var(--hse-project-blue) 9%, var(--hse-project-surface));
}
.description__heading small {
  margin-inline-start: auto;
  color: var(--hse-project-muted);
  font-size: 0.7rem;
}
.description--text p {
  margin: 12px 0 0;
  color: var(--hse-project-muted);
  line-height: 1.65;
}
.attachment-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  margin: 14px 0 0;
  padding: 0;
  list-style: none;
}
.attachment-list a {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  border: 1px solid var(--hse-project-line);
  border-radius: var(--hse-project-radius-control);
  color: var(--hse-project-ink);
  background: var(--hse-project-surface-soft);
  text-decoration: none;
}
.attachment-list a:hover {
  transform: translateY(-1px);
  border-color: color-mix(in srgb, var(--hse-project-blue) 32%, var(--hse-project-line));
}
.attachment-list a > span:nth-child(2) {
  display: grid;
  flex: 1;
  gap: 2px;
}
.attachment-list small {
  color: var(--hse-project-muted);
  font-size: 0.67rem;
}
.attachment-icon {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: var(--hse-project-radius-control);
  color: var(--hse-project-blue);
  background: color-mix(in srgb, var(--hse-project-blue) 10%, var(--hse-project-surface));
}

button:focus-visible,
a:focus-visible {
  outline: 3px solid color-mix(in srgb, var(--hse-project-blue) 25%, transparent);
  outline-offset: 2px;
}

@media (max-width: 900px) {
  .risk-summary {
    grid-template-columns: 1fr;
  }
  .detail-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 700px) {
  .risk-page {
    padding: 12px;
    gap: 14px;
  }
  .risk-hero {
    display: flex;
    align-items: stretch;
    flex-direction: column;
    padding: 22px;
    border-radius: var(--hse-project-radius-panel);
  }
  .hero-title {
    align-items: flex-start;
  }
  .hero-icon {
    width: 52px;
    height: 52px;
    border-radius: var(--hse-project-radius-panel);
  }
  .hero-icon svg {
    width: 27px;
  }
  .primary-button {
    width: 100%;
    margin: 0;
  }
  .panel-heading {
    align-items: flex-start;
    padding: 20px;
  }
  .panel-heading__copy {
    align-items: flex-start;
  }
  .panel-heading p {
    display: none;
  }
  th,
  td {
    padding: 14px 17px;
  }
  .details-heading {
    padding: 20px;
  }
  .detail-grid {
    padding: 18px 20px 0;
  }
  .description {
    margin-inline: 20px;
  }
  .attachment-list {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .hero-title {
    display: block;
  }
  .hero-icon {
    margin-bottom: 14px;
  }
  .section-icon,
  .summary-card__trend {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .back-link,
  .primary-button,
  .empty-action,
  .refresh-button,
  .details-button,
  tbody tr,
  .attachment-list a {
    transition: none;
  }
}
</style>
