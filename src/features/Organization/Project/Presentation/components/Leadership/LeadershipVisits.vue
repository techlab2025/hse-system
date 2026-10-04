<script setup lang="ts">
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
import { formatJoinDate } from '@/base/Presentation/utils/date_format.ts'

defineOptions({ name: 'ProjectLeadershipVisits' })

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
const reportCreated = computed(() => route.query.report === 'created')

const fetchReportDetails = async (visitId: number) => {
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

const fetchAllVisits = async (data?: { word?: string, date?: string }) => {
  if (Number.isInteger(projectId.value) && projectId.value > 0) {
    await controller.fetchVisits(new FetchAllLeadershipVisitsParams({
      projectId: projectId.value, ...(data?.word && { word: data?.word }),
      ...(data?.date && { date: data?.date })
    }))
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
const DateUpdate = (date?: Date) => {
  if (date) {
    fetchAllVisits({ date: String(formatJoinDate(date!)) })
  }

}

</script>

<template>
  <main class="visits-page">
    <section class="visits-card">
      <div class="section-heading">
        <div>
          <h2>Reports</h2>
          <p>Reports can be added once and reviewed here afterward.</p>
        </div>
        <span class="total-pill">{{ visits.length }} visits</span>
      </div>

      <div class="filters">
        <div class="search">
          <div class="input-search col-span-1">
            <label for="">visit location</label>
            <span class="icon-remove" @click="((word = ''), searchVisits())">
              <Search />
            </span>
            <input v-model="word" :placeholder="'search'" class="input" type="text" @input="searchVisits" />
          </div>
        </div>
        <div class="date-filter">
          <div class="input-wrapper">
            <div class="field-label">
              <label for="drill_date">{{ $t('date') }}</label>
              <FieldHelpIcon text="Select the date." />
            </div>
            <DatePicker id="drill_date" v-model="Customdate" date-format="yy-mm-dd" show-icon fluid :manualInput="false"
              @update:model-value="DateUpdate" />
          </div>

        </div>
      </div>
      <DataStatus :controller="state">
        <template #success>
          <div v-if="visits.length" class="table-responsive visits-table">
            <table class="main-table">
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
                    <button v-if="visit.hasReport || visit.report" type="button"
                      class="report-link report-link--details" :disabled="detailsLoading"
                      @click="fetchReportDetails(visit.id)">
                      {{ loadingVisitId === visit.id ? 'Loading…' : 'Report details' }}
                      <span v-if="loadingVisitId !== visit.id" aria-hidden="true">⌕</span>
                    </button>
                    <a v-else :href="`/organization/project-details/${projectId}/leadership/visits/${visit.id}/report`"
                      class="report-link">
                      Report visit <span aria-hidden="true">↗</span>
                    </a>
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

    <ReportVisitDetailsDialog :visible="detailsDialogVisible" :visit="selectedVisit" :loading="detailsLoading"
      :error="detailsError" @close="closeDetailsDialog" />
  </main>
</template>

<style scoped lang="scss">
.filters {
  width: 100%;
  display: flex;
  justify-content: space-between;
  gap: 20px;

  div {
    width: 100% !important;

  }

  // .search {
  //   width: 50% !important;
  // }
}

.visits-page {
  display: grid;
  gap: 22px;
  min-height: 100%;
  /* padding: clamp(14px, 2vw, 28px); */
  /* background:
    radial-gradient(
      circle at 8% 4%,
      color-mix(in srgb, var(--PrimaryColor) 7%, transparent),
      transparent 24rem
    ),
    var(--surface-2); */
}

.visits-hero {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 22px;
  overflow: hidden;
  padding: clamp(26px, 4vw, 42px);
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 18%, var(--main-border));
  border-radius: 26px;
  background:
    radial-gradient(circle at 88% 8%, color-mix(in srgb, white 12%, transparent), transparent 30%),
    linear-gradient(125deg, var(--brand-primary-900), var(--PrimaryColor));
  box-shadow: 0 22px 52px color-mix(in srgb, var(--brand-primary-900) 19%, transparent);
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
  border-radius: 20px;
  color: white;
  background: color-mix(in srgb, white 12%, transparent);
  font-size: 2rem;
}

.eyebrow {
  color: var(--PrimaryColor);
  font-size: 0.7rem;
  font-weight: 850;
  letter-spacing: 0.13em;
  text-transform: uppercase;
}

.visits-hero .eyebrow {
  color: color-mix(in srgb, white 72%, var(--PrimaryColor));
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
  color: var(--text-soft);
}

.visits-hero p {
  color: color-mix(in srgb, white 72%, transparent);
}

.hero-link {
  flex: none;
  padding: 11px 15px;
  border: 1px solid color-mix(in srgb, white 22%, transparent);
  border-radius: 12px;
  color: white;
  background: color-mix(in srgb, white 10%, transparent);
  font-weight: 750;
  text-decoration: none;
}

.visits-card {
  padding: clamp(20px, 3vw, 30px);
  border: 1px solid var(--main-border);
  border-radius: 22px;
  background: var(--surface-1);
  box-shadow: 0 16px 42px color-mix(in srgb, var(--brand-primary-900) 7%, transparent);
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
  color: var(--text-strong);
  font-size: clamp(1.25rem, 2vw, 1.65rem);
}

.total-pill {
  padding: 9px 13px;
  border-radius: 999px;
  color: var(--PrimaryColor);
  background: color-mix(in srgb, var(--PrimaryColor) 10%, var(--surface-1));
  font-size: 0.78rem;
  font-weight: 850;
  white-space: nowrap;
}

.visits-table {
  overflow: hidden;
  border: 1px solid var(--main-border);
  border-radius: 16px;
}

.visits-table .main-table {
  width: 100%;
}

.visits-table th {
  color: var(--text-soft);
  background: var(--surface-2);
  font-size: 0.69rem;
  letter-spacing: 0.07em;
  text-transform: uppercase;
}

.visits-table td {
  color: var(--text-strong);
}

.visits-table tbody tr {
  transition: background-color 0.2s ease;
}

.visits-table tbody tr:hover {
  background: color-mix(in srgb, var(--PrimaryColor) 4%, var(--surface-1));
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
  color: var(--PrimaryColor);
  background: color-mix(in srgb, var(--PrimaryColor) 11%, var(--surface-1));
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
  border-radius: 9px;
  background: var(--surface-2);
  font-size: 0.75rem;
  font-weight: 750;
  white-space: nowrap;
}

.status-pill {
  color: var(--status-warning);
  background: var(--status-warning-soft);
}

.status-pill--complete {
  color: var(--status-success);
  background: var(--status-success-soft);
}

.report-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 12px;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 35%, var(--main-border));
  border-radius: 10px;
  color: white !important;
  background: var(--PrimaryColor);
  cursor: pointer;
  font: inherit;
  font-weight: 800;
  text-decoration: none;
  white-space: nowrap;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.report-link--details {
  color: var(--PrimaryColor) !important;
  background: color-mix(in srgb, var(--PrimaryColor) 7%, var(--surface-1));
}

.report-link:hover {
  transform: translateY(-1px);
  box-shadow: 0 9px 20px color-mix(in srgb, var(--PrimaryColor) 22%, transparent);
}

.report-link:disabled {
  opacity: 0.58;
  cursor: wait;
  transform: none;
  box-shadow: none;
}

.empty-state {
  display: grid;
  place-items: center;
  gap: 9px;
  padding: 42px 20px;
  border: 1px dashed color-mix(in srgb, var(--PrimaryColor) 25%, var(--main-border));
  border-radius: 16px;
  text-align: center;
  background: color-mix(in srgb, var(--PrimaryColor) 3%, var(--surface-1));
}

.empty-state>span {
  font-size: 2rem;
  color: var(--PrimaryColor);
}

.empty-state strong {
  color: var(--text-strong);
}

.empty-state a {
  margin-top: 5px;
  color: var(--PrimaryColor);
  font-weight: 800;
}

.notice--error {
  padding: 14px 16px;
  border-radius: 12px;
  color: var(--status-danger);
  background: var(--status-danger-soft);
  font-weight: 750;
}

.notice--success {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 14px 16px;
  border-radius: 12px;
  color: var(--status-success);
  background: var(--status-success-soft);
  font-weight: 750;
}

.notice--success span {
  display: grid;
  place-items: center;
  width: 25px;
  height: 25px;
  border-radius: 8px;
  color: white;
  background: var(--status-success);
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
    border-bottom: 1px solid var(--main-border);
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
    color: var(--text-soft);
    font-size: 0.72rem;
    font-weight: 800;
    text-transform: uppercase;
  }
}
</style>
