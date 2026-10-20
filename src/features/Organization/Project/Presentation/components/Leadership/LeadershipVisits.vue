<script setup lang="ts">
import PermissionHandler from '@/base/Presentation/utils/permission_handler'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
import { vProjectPanels } from '../../composables/projectPanels'

import { computed, onMounted, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import TableLoader from '@/shared/DataStatues/TableLoader.vue'
import FetchAllLeadershipVisitsParams from '../../../Core/params/Leadership/FetchAllLeadershipVisitsParams'
import FetchLeadershipVisitDetailsParams from '../../../Core/params/Leadership/FetchLeadershipVisitDetailsParams'
import FetchAllLeadershipVisitsController from '../../controllers/Leadership/FetchAllLeadershipVisitsController'
import FetchLeadershipVisitDetailsController from '../../controllers/Leadership/FetchLeadershipVisitDetailsController'
import type LeadershipVisitDetailsModel from '../../../Data/models/Leadership/LeadershipVisitDetailsModel'
import ReportVisitDetailsDialog from './ReportVisitDetailsDialog.vue'
import { debounce } from '@/base/Presentation/utils/debouced.ts'
import DatePicker from 'primevue/datepicker'
import Search from '@/shared/icons/Search.vue'
import FieldHelpIcon from '@/shared/FormInputs/FieldHelpIcon.vue'
import { formatJoinDate } from '@/base/Presentation/utils/date_format.ts'

defineOptions({ name: 'ProjectLeadershipVisits' })

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
const canViewDetails = computed(() =>
  PermissionHandler.Instance.handle([
    PermissionsEnum.ADMIN,
    PermissionsEnum.LEADERSHIP_ALL,
    PermissionsEnum.LEADERSHIP_DETAILS,
  ]),
)
const route = useRoute()
const projectId = computed(() => Number(route.params.id))
const controller = FetchAllLeadershipVisitsController.getInstance()
const state = controller.state
const visits = computed(() => state.value.data ?? [])
const detailsController = FetchLeadershipVisitDetailsController.getInstance()
const selectedVisit = ref<LeadershipVisitDetailsModel | null>(null)
const detailsDialogVisible = ref(false)
const detailsLoading = ref(false)
const detailsError = ref('')
const loadingVisitId = ref<number | null>(null)
let detailsRequestSequence = 0

const fetchReportDetails = async (visitId: number) => {
  if (!canViewDetails.value) return
  const requestSequence = ++detailsRequestSequence
  detailsDialogVisible.value = true
  detailsLoading.value = true
  detailsError.value = ''
  selectedVisit.value = null
  loadingVisitId.value = visitId

  try {
    const detailsState = await detailsController.fetchDetails(
      new FetchLeadershipVisitDetailsParams(visitId),
    )

    if (requestSequence !== detailsRequestSequence) return

    if (detailsController.isDataSuccess()) {
      selectedVisit.value = detailsState.value.data ?? null
    } else {
      detailsError.value =
        detailsState.value.error?.title ?? 'Unable to load the leadership visit report.'
    }
  } catch {
    if (requestSequence === detailsRequestSequence) {
      detailsError.value = 'Unable to load the leadership visit report.'
    }
  } finally {
    if (requestSequence === detailsRequestSequence) {
      detailsLoading.value = false
      loadingVisitId.value = null
    }
  }
}

const closeDetailsDialog = () => {
  detailsRequestSequence += 1
  detailsDialogVisible.value = false
  selectedVisit.value = null
  detailsError.value = ''
  detailsLoading.value = false
  loadingVisitId.value = null
}

const fetchAllVisits = async (data?: { word?: string; date?: string }) => {
  if (!canFetch.value) return
  if (Number.isInteger(projectId.value) && projectId.value > 0) {
    await controller.fetchVisits(
      new FetchAllLeadershipVisitsParams({
        projectId: projectId.value,
        ...(data?.word && { word: data?.word }),
        ...(data?.date && { date: data?.date }),
      }),
    )
  }
}
onMounted(async () => {
  fetchAllVisits()
})

const word = ref('')

const searchVisits = debounce(() => {
  fetchAllVisits({ word: word.value })
})
const Customdate = ref<Date | null>(null)
const DateUpdate = (date: unknown) => {
  if (date instanceof Date) {
    fetchAllVisits({ date: String(formatJoinDate(date)) })
  }
}
</script>

<template>
  <main
    v-if="canFetch"
    data-hse-project
    v-project-panels
    class="hse-project-root hse-project-assurance hse-project-page visits-page"
  >
    <section class="hse-project-panel visits-card">
      <div class="section-heading">
        <div>
          <h2>Reports</h2>
          <p>Reports can be added once and reviewed here afterward.</p>
        </div>
        <span class="total-pill">{{ visits.length }} visits</span>
      </div>

      <div class="filters">
        <div class="search">
          <label class="hse-project-field-label" for="leadership-visit-search"
            >Visit location</label
          >
          <div class="input-search">
            <span class="icon-remove" @click="((word = ''), searchVisits())">
              <Search />
            </span>
            <input
              id="leadership-visit-search"
              v-model="word"
              :placeholder="'search'"
              class="hse-project-input input"
              type="text"
              @input="searchVisits"
            />
          </div>
        </div>
        <div class="date-filter">
          <div class="hse-project-field input-wrapper">
            <div class="hse-project-field field-label">
              <label class="hse-project-field-label" for="leadership-filter-date">{{
                $t('date')
              }}</label>
              <FieldHelpIcon text="Select the date." />
            </div>
            <DatePicker
              panel-class="hse-project-overlay hse-project-assurance"
              id="leadership-filter-date"
              v-model="Customdate"
              date-format="yy-mm-dd"
              show-icon
              fluid
              :manualInput="false"
              @update:model-value="DateUpdate"
            />
          </div>
        </div>
      </div>
      <DataStatus :controller="state">
        <template #success>
          <div v-if="visits.length" class="table-responsive visits-table">
            <table class="hse-project-table main-table">
              <thead>
                <tr>
                  <th>Visit Date</th>
                  <th>Visit Location</th>
                  <th>Visiting Managers</th>
                  <th>complete by</th>
                  <!-- <th>Activity</th> -->
                  <!-- <th>Status</th> -->
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="visit in visits" :key="visit.id">
                  <td data-label="Date">
                    <strong>{{ visit.date }}</strong>
                  </td>
                  <td data-label="Location">{{ visit.location || '—' }}</td>
                  <td data-label="Employee">
                    <span class="employee-cell">
                      <!-- <img
                        v-if="visit.organizationEmployeeName?.image"
                        :src="visit.organizationEmployeeName.image"
                        :alt="visit.organizationEmployeeName.name"
                        class="avatar avatar--image"
                      /> -->
                      <!-- <span v-else class=/"avatar">{{ employeeInitial(visit) }}</span> -->
                      <!-- {{ visit }} -->
                      <span>{{ visit.employees[0]?.employeeName || '—' }}</span>
                    </span>
                  </td>
                  <td data-label="Activity">
                    <span class="activity-pill">{{ visit?.creatable?.name || '—' }}</span>
                  </td>
                  <!-- <td data-label="Activity">
                    <span class="activity-pill">{{ visit.activities?.[0]?.title || '—' }}</span>
                  </td> -->
                  <!-- <td data-label="Status">
                    <span :class="['status-pill', { 'status-pill--complete': visit.reportAdded }]">
                      <span aria-hidden="true">{{ visit.reportAdded ? '✓' : '○' }}</span>
                      {{ visit.reportAdded ? 'Reported' : 'Pending report' }}
                    </span>
                  </td> -->
                  <td data-label="Action">
                    <div class="visit-actions">
                      <button
                        v-if="(visit.hasReport || visit.report) && canViewDetails"
                        type="button"
                        class="btn btn-secondary hse-project-button hse-project-button--secondary report-link report-link--details"
                        :disabled="detailsLoading"
                        :aria-busy="loadingVisitId === visit.id"
                        @click="fetchReportDetails(visit.id)"
                      >
                        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                        <span>{{
                          loadingVisitId === visit.id ? 'Loading…' : 'Report details'
                        }}</span>
                      </button>
                      <RouterLink
                        v-else-if="!visit.hasReport && !visit.report && canCreate"
                        :to="`/organization/project-details/${projectId}/leadership/visits/${visit.id}/report`"
                        class="btn btn-primary hse-project-button hse-project-button--primary report-link"
                      >
                        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <path
                            d="M8 4H6a2 2 0 0 0-2 2v14h16V6a2 2 0 0 0-2-2h-2M8 3h8v4H8V3ZM8 12h8M8 16h5"
                          />
                        </svg>
                        <span>Report visit</span>
                      </RouterLink>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else class="empty-state">
            <span aria-hidden="true">◎</span>
            <strong>No leadership visits yet</strong>
            <p>Create visits from the monthly leadership plan first.</p>
            <RouterLink :to="`/organization/project-details/${projectId}/leadership`">
              Open visit plan
            </RouterLink>
          </div>
        </template>
        <template #loader>
          <TableLoader :cols="6" :rows="5" />
        </template>
        <template #initial>
          <TableLoader :cols="6" :rows="5" />
        </template>
        <template #empty>
          <div class="empty-state"><strong>No visits have been planned yet.</strong></div>
        </template>
        <template #failed>
          <div class="notice notice--error">Unable to load leadership visits.</div>
        </template>
      </DataStatus>
    </section>

    <ReportVisitDetailsDialog
      :visible="detailsDialogVisible"
      :visit="selectedVisit"
      :loading="detailsLoading"
      :error="detailsError"
      @close="closeDetailsDialog"
    />
  </main>
  <p v-else role="status">{{ $t('have_not_permission') }}</p>
</template>

<style scoped lang="scss">
.search {
  display: grid;
  gap: var(--hse-space-2);
}

.visits-page {
  display: grid;
  gap: 22px;
  min-height: 100%;
  /* padding: clamp(14px, 2vw, 28px); */
  /* background:
    radial-gradient(
      circle at 8% 4%,
      color-mix(in srgb, var(--hse-project-blue) 7%, transparent),
      transparent 24rem
    ),
    var(--hse-project-surface-soft); */
}

.visits-hero {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 22px;
  overflow: hidden;
  padding: clamp(26px, 4vw, 42px);
  border: 1px solid color-mix(in srgb, var(--hse-project-blue) 18%, var(--hse-project-line));
  border-radius: var(--hse-project-radius-panel);
  background:
    radial-gradient(circle at 88% 8%, color-mix(in srgb, white 12%, transparent), transparent 30%),
    linear-gradient(125deg, var(--hse-project-navy), var(--hse-project-blue));
  box-shadow: 0 22px 52px color-mix(in srgb, var(--hse-project-navy) 19%, transparent);
}

.visits-hero__content {
  display: flex;
  align-items: center;
  gap: 18px;
}

.visits-hero__icon {
  display: grid;
  place-items: center;
  width: 66px;
  height: 66px;
  flex: none;
  border: 1px solid color-mix(in srgb, white 22%, transparent);
  border-radius: var(--hse-project-radius-panel);
  color: white;
  background: color-mix(in srgb, white 12%, transparent);
  font-size: 2rem;
}

.eyebrow {
  color: var(--hse-project-blue);
  font-size: 0.7rem;
  font-weight: 850;
  letter-spacing: 0.13em;
  text-transform: uppercase;
}

.visits-hero .eyebrow {
  color: color-mix(in srgb, white 72%, var(--hse-project-blue));
}

.visits-hero h1 {
  margin: 4px 0 7px;
  color: white;
  font-size: clamp(1.7rem, 3vw, 2.45rem);
}

.visits-hero p,
.section-heading p,
.empty-state p {
  margin: 0;
  color: var(--hse-project-muted);
}

.visits-hero p {
  color: color-mix(in srgb, white 72%, transparent);
}

.hero-link {
  flex: none;
  padding: 11px 15px;
  border: 1px solid color-mix(in srgb, white 22%, transparent);
  border-radius: var(--hse-project-radius-control);
  color: white;
  background: color-mix(in srgb, white 10%, transparent);
  font-weight: 750;
  text-decoration: none;
}

.visits-card {
  padding: clamp(20px, 3vw, 30px);
  border: 1px solid var(--hse-project-line);
  border-radius: var(--hse-project-radius-panel);
  background: var(--hse-project-surface);
  box-shadow: 0 16px 42px color-mix(in srgb, var(--hse-project-navy) 7%, transparent);
}

.section-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 22px;
}

.section-heading h2 {
  margin: 5px 0 6px;
  color: var(--hse-project-ink);
  font-size: clamp(1.25rem, 2vw, 1.65rem);
}

.total-pill {
  padding: 9px 13px;
  border-radius: 999px;
  color: var(--hse-project-blue);
  background: color-mix(in srgb, var(--hse-project-blue) 10%, var(--hse-project-surface));
  font-size: 0.78rem;
  font-weight: 850;
  white-space: nowrap;
}

.visits-table {
  overflow: hidden;
  border: 1px solid var(--hse-project-line);
  border-radius: var(--hse-project-radius-panel);
}

.visits-table .main-table {
  width: 100%;
}

.visits-table th {
  color: var(--hse-project-muted);
  background: var(--hse-project-surface-soft);
  font-size: 0.69rem;
  letter-spacing: 0.07em;
  text-transform: uppercase;
}

.visits-table td {
  color: var(--hse-project-ink);
}

.visits-table tbody tr {
  transition: background-color 0.2s ease;
}

.visits-table tbody tr:hover {
  background: color-mix(in srgb, var(--hse-project-blue) 4%, var(--hse-project-surface));
}

.employee-cell {
  display: inline-flex;
  align-items: center;
  gap: 9px;
}

.avatar {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  flex: none;
  border-radius: 50%;
  color: var(--hse-project-blue);
  background: color-mix(in srgb, var(--hse-project-blue) 11%, var(--hse-project-surface));
  font-weight: 850;
}

.avatar--image {
  object-fit: cover;
}

.activity-pill,
.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 10px;
  border-radius: var(--hse-project-radius-control);
  background: var(--hse-project-surface-soft);
  font-size: 0.75rem;
  font-weight: 750;
  white-space: nowrap;
}

.status-pill {
  color: var(--hse-project-amber);
  background: var(--hse-project-amber-soft);
}

.status-pill--complete {
  color: var(--hse-project-green);
  background: var(--hse-project-green-soft);
}

.visit-actions {
  display: flex;
  align-items: center;
  gap: var(--hse-space-2);
}

.visits-page .visit-actions .report-link {
  min-height: 36px;
  padding: 8px 12px;
  font-size: var(--hse-text-sm);
  font-weight: 600;
  white-space: nowrap;
}

.report-link svg {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  stroke: currentColor;
  stroke-width: 1.7;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.report-link:disabled {
  cursor: wait;
}

.empty-state {
  display: grid;
  place-items: center;
  gap: 9px;
  padding: 42px 20px;
  border: 1px dashed color-mix(in srgb, var(--hse-project-blue) 25%, var(--hse-project-line));
  border-radius: var(--hse-project-radius-panel);
  text-align: center;
  background: color-mix(in srgb, var(--hse-project-blue) 3%, var(--hse-project-surface));
}

.empty-state > span {
  font-size: 2rem;
  color: var(--hse-project-blue);
}

.empty-state strong {
  color: var(--hse-project-ink);
}

.empty-state a {
  margin-top: 5px;
  color: var(--hse-project-blue);
  font-weight: 800;
}

.notice--error {
  padding: 14px 16px;
  border-radius: var(--hse-project-radius-control);
  color: var(--hse-project-red);
  background: var(--hse-project-red-soft);
  font-weight: 750;
}

.notice--success {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 14px 16px;
  border-radius: var(--hse-project-radius-control);
  color: var(--hse-project-green);
  background: var(--hse-project-green-soft);
  font-weight: 750;
}

.notice--success span {
  display: grid;
  place-items: center;
  width: 25px;
  height: 25px;
  border-radius: var(--hse-project-radius-control);
  color: white;
  background: var(--hse-project-green);
}

@media (max-width: 760px) {
  .visits-hero,
  .section-heading {
    flex-wrap: wrap;
  }

  .hero-link {
    width: 100%;
    text-align: center;
  }
}

@media (max-width: 640px) {
  .visits-table table,
  .visits-table tbody,
  .visits-table tr,
  .visits-table td {
    display: block;
  }

  .visits-table thead {
    display: none;
  }

  .visits-table tr {
    padding: 12px;
    border-bottom: 1px solid var(--hse-project-line);
  }

  .visits-table td {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
    padding: 9px !important;
    text-align: end;
  }

  .visits-table td::before {
    content: attr(data-label);
    color: var(--hse-project-muted);
    font-size: 0.72rem;
    font-weight: 800;
    text-transform: uppercase;
  }
}
</style>
