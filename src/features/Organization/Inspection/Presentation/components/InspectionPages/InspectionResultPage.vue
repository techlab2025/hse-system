<script setup lang="ts">
import InspectionTaskbg from '@/assets/images/InspectionTaskbg.png'
import InspectionHeader from '@/assets/images/InspectionHeader.png'
import { computed, onMounted, ref, watch } from 'vue'
import AllResultIcon from '@/shared/icons/AllResultIcon.vue'
import ResulReceiveIcon from '@/shared/icons/ResulReceiveIcon.vue'
import ResultComlated from '@/shared/icons/ResultComlated.vue'
import ResultNotComlated from '@/shared/icons/ResultNotComlated.vue'
import DelayedResult from '@/shared/icons/DelayedResult.vue'
import { useI18n } from 'vue-i18n'
import FetchTaskResultDetailsController from '../../controllers/FetchTaskResultDetailsController'
import FetchTaskResultDetailsParams from '../../../Core/params/FetchTaskResultDetailsParams'
import { useRoute } from 'vue-router'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import TableLoader from '@/shared/DataStatues/TableLoader.vue'
import DataEmpty from '@/shared/DataStatues/DataEmpty.vue'
import DataFailed from '@/shared/DataStatues/DataFailed.vue'
import { AssignToTypeEnum } from '../../../Core/Enum/AssignToTypesEnum'
import FetchInspectionResultController from '../../controllers/FetchInspectionResultController'
import FetchInspectionResultParams from '../../../Core/params/FetchInspectionResultParams'
import EquipmentInspectionResultDialog from '@/features/setting/Equipment/Presentation/components/Dialogs/EquipmentInspectionResultDialog.vue'

const route = useRoute()
const routeId = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id
const id = Number(routeId)
const { t } = useI18n()
const fetchTaskResultDetailsController = FetchTaskResultDetailsController.getInstance()
const staticstate = ref(fetchTaskResultDetailsController.state.value)

const fetchInspectionResultController = FetchInspectionResultController.getInstance()
const state = ref(fetchInspectionResultController.state.value)

const GetInspectionDetails = () => {
  const fetchTaskResultDetailsParams = new FetchTaskResultDetailsParams(id)
  fetchTaskResultDetailsController.getData(fetchTaskResultDetailsParams)
}

const GetInspectionResult = () => {
  const fetchInspectionResultParams = new FetchInspectionResultParams(id)
  fetchInspectionResultController.getData(fetchInspectionResultParams)
}
onMounted(() => {
  GetInspectionDetails()
  GetInspectionResult()
})

watch(
  () => fetchTaskResultDetailsController?.state.value,
  (newVal) => {
    staticstate.value = newVal
  },
)
watch(
  () => fetchInspectionResultController?.state.value,
  (newVal) => {
    state.value = newVal
  },
)

const getInspectionType = (type?: number) => (type === undefined ? '' : AssignToTypeEnum[type])

const statistics = computed(() => [
  {
    label: t('All Results'),
    value: staticstate.value?.data?.allResult ?? 0,
    icon: AllResultIcon,
    tone: 'primary',
  },
  {
    label: t('Results received today'),
    value: staticstate.value?.data?.resultsReceivedToday ?? 0,
    icon: ResulReceiveIcon,
    tone: 'accent',
  },
  {
    label: t('Results completed'),
    value: staticstate.value?.data?.resultsCompleted ?? 0,
    icon: ResultComlated,
    tone: 'success',
  },
  // {
  //   label: t('Results not yet completed'),
  //   value: staticstate.value?.data?.resultsNotYetCompleted ?? 0,
  //   icon: ResultNotComlated,
  //   tone: 'danger',
  // },
  {
    label: t('Delayed results'),
    value: staticstate.value?.data?.delayedResults ?? 0,
    icon: DelayedResult,
    tone: 'warning',
  },
])

const resultCount = computed(() => state.value?.data?.length ?? 0)

const getEmployeeInitial = (name?: string) => name?.trim().charAt(0).toUpperCase() || 'E'
</script>
<template>
  <DataStatus :controller="state">
    <template #success>
      <main class="inspection-results-page">
        <span class="page-glow page-glow--primary" aria-hidden="true"></span>
        <span class="page-glow page-glow--accent" aria-hidden="true"></span>

        <header class="results-hero">
          <img class="results-hero__texture" :src="InspectionTaskbg" alt="" aria-hidden="true" />

          <div class="results-hero__content">
            <span class="results-hero__eyebrow">
              <span class="results-hero__eyebrow-dot"></span>
              {{ $t('inspection') }} · {{ $t('Results') }}
            </span>
            <h1>{{ $t('Inspection Results') }}</h1>
            <p class="results-hero__subtitle">
              {{
                $t('Review progress, completion, and submitted inspection records in one place.')
              }}
            </p>

            <div class="results-meta">
              <div class="results-meta__item">
                <span class="results-meta__icon">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M4 7h16M7 4v6m10-6v6M5 11h14v9H5z" />
                  </svg>
                </span>
                <span class="results-meta__copy">
                  <small>{{ $t('Inspection Type') }}</small>
                  <strong>{{ getInspectionType(staticstate?.data?.morphType) || '—' }}</strong>
                </span>
              </div>

              <div class="results-meta__item">
                <span class="results-meta__icon">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm7 8a7 7 0 0 0-14 0" />
                  </svg>
                </span>
                <span class="results-meta__copy">
                  <small>{{ $t('Assigned by') }}</small>
                  <strong>{{ staticstate?.data?.createdBy?.name || '—' }}</strong>
                </span>
              </div>

              <div class="results-meta__item">
                <span class="results-meta__icon">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 7v5l3 2m6-2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                </span>
                <span class="results-meta__copy">
                  <small>{{ $t('Date&Time') }}</small>
                  <strong>{{ staticstate?.data?.createdAt || '—' }}</strong>
                </span>
              </div>
            </div>
          </div>

          <div class="results-hero__visual" aria-hidden="true">
            <span class="results-hero__visual-ring"></span>
            <img :src="InspectionHeader" alt="" />
          </div>
        </header>

        <section class="results-section" aria-labelledby="results-overview-heading">
          <div class="section-heading">
            <div>
              <span class="section-heading__eyebrow">{{ $t('Live overview') }}</span>
              <h2 id="results-overview-heading">{{ $t('Performance snapshot') }}</h2>
            </div>
            <span class="section-heading__badge">{{ resultCount }} {{ $t('records') }}</span>
          </div>

          <div class="results-statistics">
            <article
              v-for="statistic in statistics"
              :key="statistic.label"
              class="result-statistic"
              :data-tone="statistic.tone"
            >
              <span class="result-statistic__icon">
                <component :is="statistic.icon" />
              </span>
              <div class="result-statistic__copy">
                <strong>{{ statistic.value }}</strong>
                <span>{{ statistic.label }}</span>
              </div>
              <span class="result-statistic__accent" aria-hidden="true"></span>
            </article>
          </div>
        </section>

        <section class="results-table-card" aria-labelledby="submitted-results-heading">
          <div class="section-heading section-heading--table">
            <div>
              <span class="section-heading__eyebrow">{{ $t('Inspection activity') }}</span>
              <h2 id="submitted-results-heading">{{ $t('Submitted results') }}</h2>
            </div>
            <span class="section-heading__badge section-heading__badge--soft">
              {{ resultCount }} {{ $t('total') }}
            </span>
          </div>

          <div class="results-table-scroll">
            <table class="results-table">
              <thead>
                <tr>
                  <th>{{ $t('serial') }}</th>
                  <th>{{ $t('Emp') }}</th>
                  <th>{{ $t('Date') }}</th>
                  <th>{{ $t('Time') }}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="info in state.data" :key="info.id">
                  <td data-label="Serial">
                    <span class="result-serial">#{{ info.id }}</span>
                  </td>
                  <td data-label="Employee">
                    <div class="result-employee">
                      <span class="result-employee__avatar">
                        {{ getEmployeeInitial(info.employee?.name) }}
                      </span>
                      <span class="result-employee__name">{{ info.employee?.name || '—' }}</span>
                    </div>
                  </td>
                  <td data-label="Date">
                    <span class="result-date">{{ info.date || '—' }}</span>
                  </td>
                  <td data-label="Time">
                    <span class="result-time">
                      <span class="result-time__dot"></span>
                      {{ info.time || '—' }}
                    </span>
                  </td>
                  <td class="result-action">
                    <EquipmentInspectionResultDialog :taskId="id" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </template>
    <template #loader>
      <TableLoader :cols="3" :rows="10" />
    </template>
    <template #initial>
      <TableLoader :cols="3" :rows="10" />
    </template>
    <template #empty>
      <DataEmpty
        :link="`/organization/equipment-mangement/inspection/add`"
        addText="Add Inspection"
        description="Sorry .. You have no Inspection .. All your joined customers will appear here when you add your customer data"
        title="..ops! You have No Inspection"
      />
    </template>
    <template #failed>
      <DataFailed
        :link="`/organization/equipment-mangement/inspection/add`"
        addText="Add Inspection"
        description="Sorry .. You have no Inspection .. All your joined customers will appear here when you add your customer data"
        title="..ops! You have No Inspection"
      />
    </template>
  </DataStatus>
</template>

<style scoped>
.inspection-results-page {
  position: relative;
  overflow: hidden;
  display: grid;
  gap: 1.25rem;
  width: 100%;
  padding: 1.25rem;
  border: 1px solid color-mix(in srgb, var(--brand-primary-200) 64%, transparent);
  border-radius: 30px;
  background:
    radial-gradient(
      circle at top left,
      color-mix(in srgb, var(--brand-primary-500) 9%, transparent),
      transparent 26%
    ),
    linear-gradient(
      145deg,
      color-mix(in srgb, var(--surface-1) 98%, transparent),
      color-mix(in srgb, var(--brand-primary-50) 82%, var(--surface-1))
    );
  box-shadow: 0 28px 70px color-mix(in srgb, var(--brand-primary-900) 9%, transparent);
}

.inspection-results-page::before {
  position: absolute;
  inset: 0;
  pointer-events: none;
  content: '';
  background-image:
    linear-gradient(
      color-mix(in srgb, var(--brand-primary-500) 3.5%, transparent) 1px,
      transparent 1px
    ),
    linear-gradient(
      90deg,
      color-mix(in srgb, var(--brand-primary-500) 3.5%, transparent) 1px,
      transparent 1px
    );
  background-size: 28px 28px;
  mask-image: linear-gradient(180deg, #000, transparent 72%);
}

.page-glow {
  position: absolute;
  z-index: 0;
  border-radius: 999px;
  pointer-events: none;
  filter: blur(10px);
}

.page-glow--primary {
  top: 280px;
  inset-inline-end: -80px;
  width: 230px;
  height: 230px;
  background: color-mix(in srgb, var(--brand-primary-500) 10%, transparent);
}

.page-glow--accent {
  inset-inline-start: -90px;
  bottom: 70px;
  width: 210px;
  height: 210px;
  background: color-mix(in srgb, var(--status-success) 9%, transparent);
}

.results-hero,
.results-section,
.results-table-card {
  position: relative;
  z-index: 1;
}

.results-hero {
  isolation: isolate;
  overflow: hidden;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 250px;
  align-items: center;
  gap: 1.5rem;
  min-height: 290px;
  padding: clamp(1.4rem, 3vw, 2.25rem);
  border: 1px solid color-mix(in srgb, var(--surface-1) 18%, transparent);
  border-radius: 26px;
  color: var(--text-on-brand);
  background:
    radial-gradient(circle at 82% 18%, rgb(255 255 255 / 14%), transparent 28%),
    linear-gradient(
      130deg,
      var(--brand-primary-900),
      color-mix(in srgb, var(--brand-primary-700) 90%, var(--status-success))
    );
  box-shadow: 0 24px 56px color-mix(in srgb, var(--brand-primary-900) 22%, transparent);
}

.results-hero::after {
  position: absolute;
  inset: 0;
  z-index: -1;
  content: '';
  background-image: linear-gradient(105deg, rgb(255 255 255 / 5%) 1px, transparent 1px);
  background-size: 42px 100%;
}

.results-hero__texture {
  position: absolute;
  z-index: -1;
  inset-inline-end: -35px;
  bottom: -55px;
  width: 360px;
  height: 360px;
  opacity: 0.65;
  object-fit: contain;
  transform: rotate(-18deg);
}

.results-hero__content {
  min-width: 0;
}

.results-hero__eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  width: fit-content;
  padding: 0.42rem 0.75rem;
  border: 1px solid rgb(255 255 255 / 18%);
  border-radius: 999px;
  color: rgb(255 255 255 / 82%);
  background: rgb(255 255 255 / 9%);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  backdrop-filter: blur(8px);
}

.results-hero__eyebrow-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #6ee7b7;
  box-shadow: 0 0 0 5px rgb(110 231 183 / 13%);
}

.results-hero h1 {
  margin: 0.75rem 0 0;
  color: #fff;
  font-size: clamp(2rem, 4vw, 3.35rem);
  font-weight: 900;
  letter-spacing: -0.035em;
  line-height: 1.06;
}

.results-hero__subtitle {
  margin: 0.65rem 0 0;
  max-width: 650px;
  color: rgb(255 255 255 / 70%);
  font-size: 0.95rem;
  line-height: 1.7;
}

.results-meta {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.7rem;
  margin-top: 1.35rem;
}

.results-meta__item {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 0.65rem;
  padding: 0.7rem;
  border: 1px solid rgb(255 255 255 / 12%);
  border-radius: 16px;
  background: rgb(255 255 255 / 8%);
  backdrop-filter: blur(9px);
}

.results-meta__icon {
  display: grid;
  width: 34px;
  height: 34px;
  flex: 0 0 34px;
  place-items: center;
  border-radius: 11px;
  color: #bfdbfe;
  background: rgb(255 255 255 / 10%);
}

.results-meta__icon svg {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.8;
}

.results-meta__copy {
  min-width: 0;
}

.results-meta__copy small,
.results-meta__copy strong {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.results-meta__copy small {
  color: rgb(255 255 255 / 56%);
  font-size: 0.65rem;
  font-weight: 700;
}

.results-meta__copy strong {
  margin-top: 0.15rem;
  color: #fff;
  font-size: 0.78rem;
  font-weight: 800;
}

.results-hero__visual {
  position: relative;
  display: grid;
  width: 220px;
  height: 220px;
  place-items: center;
  justify-self: center;
}

.results-hero__visual-ring {
  position: absolute;
  inset: 8px;
  border: 1px solid rgb(255 255 255 / 17%);
  border-radius: 50%;
  box-shadow:
    0 0 0 18px rgb(255 255 255 / 4%),
    0 0 0 38px rgb(255 255 255 / 2%);
}

.results-hero__visual img {
  position: relative;
  width: 175px;
  height: 175px;
  object-fit: contain;
  filter: drop-shadow(0 22px 24px rgb(4 15 45 / 35%));
  transform: scale(1.18);
}

.results-section,
.results-table-card {
  padding: 1.1rem;
  border: 1px solid color-mix(in srgb, var(--brand-primary-100) 82%, transparent);
  border-radius: 24px;
  background: color-mix(in srgb, var(--surface-1) 90%, transparent);
  box-shadow: 0 18px 42px color-mix(in srgb, var(--brand-primary-900) 6%, transparent);
  backdrop-filter: blur(10px);
}

.section-heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
}

.section-heading__eyebrow {
  display: block;
  margin-bottom: 0.2rem;
  color: var(--brand-primary-500);
  font-size: 0.68rem;
  font-weight: 900;
  letter-spacing: 0.09em;
  text-transform: uppercase;
}

.section-heading h2 {
  margin: 0;
  color: var(--brand-primary-900);
  font-size: clamp(1.2rem, 2vw, 1.55rem);
  font-weight: 900;
  line-height: 1.2;
}

.section-heading__badge {
  flex: 0 0 auto;
  padding: 0.42rem 0.72rem;
  border: 1px solid color-mix(in srgb, var(--brand-primary-400) 24%, transparent);
  border-radius: 999px;
  color: var(--brand-primary-700);
  background: color-mix(in srgb, var(--brand-primary-50) 90%, transparent);
  font-size: 0.7rem;
  font-weight: 900;
}

.section-heading__badge--soft {
  color: var(--text-soft);
  border-color: color-mix(in srgb, var(--brand-primary-200) 68%, transparent);
  background: color-mix(in srgb, var(--surface-2) 56%, transparent);
}

.results-statistics {
  display: grid;
  grid-template-columns: repeat(5, minmax(145px, 1fr));
  gap: 0.75rem;
}

.result-statistic {
  --stat-color: var(--brand-primary-500);
  position: relative;
  overflow: hidden;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: center;
  gap: 0.75rem;
  min-height: 108px;
  padding: 0.85rem;
  border: 1px solid color-mix(in srgb, var(--stat-color) 16%, var(--surface-2));
  border-radius: 19px;
  background: linear-gradient(
    145deg,
    color-mix(in srgb, var(--surface-1) 96%, transparent),
    color-mix(in srgb, var(--stat-color) 6%, var(--surface-1))
  );
  transition:
    transform 0.22s ease,
    border-color 0.22s ease,
    box-shadow 0.22s ease;
}

.result-statistic:hover {
  transform: translateY(-3px);
  border-color: color-mix(in srgb, var(--stat-color) 32%, transparent);
  box-shadow: 0 16px 28px color-mix(in srgb, var(--stat-color) 10%, transparent);
}

.result-statistic[data-tone='accent'] {
  --stat-color: var(--brand-accent-500);
}

.result-statistic[data-tone='success'] {
  --stat-color: var(--status-success);
}

.result-statistic[data-tone='danger'] {
  --stat-color: var(--status-danger);
}

.result-statistic[data-tone='warning'] {
  --stat-color: #f59e0b;
}

.result-statistic__icon {
  display: grid;
  width: 46px;
  height: 46px;
  place-items: center;
  border-radius: 15px;
  color: var(--stat-color);
  background: color-mix(in srgb, var(--stat-color) 11%, var(--surface-1));
}

.result-statistic__icon :deep(svg) {
  width: 30px;
  height: 30px;
}

.result-statistic__copy {
  min-width: 0;
}

.result-statistic__copy strong,
.result-statistic__copy span {
  display: block;
}

.result-statistic__copy strong {
  color: var(--brand-primary-900);
  font-size: 1.55rem;
  font-weight: 900;
  line-height: 1;
}

.result-statistic__copy span {
  margin-top: 0.35rem;
  color: var(--text-soft);
  font-size: 0.7rem;
  font-weight: 750;
  line-height: 1.35;
  overflow-wrap: anywhere;
}

.result-statistic__accent {
  position: absolute;
  inset: auto 0 0;
  height: 3px;
  background: linear-gradient(90deg, var(--stat-color), transparent 76%);
}

.results-table-card {
  padding-bottom: 0.75rem;
}

.results-table-scroll {
  overflow-x: auto;
  width: 100%;
  border: 1px solid color-mix(in srgb, var(--brand-primary-100) 72%, transparent);
  border-radius: 19px;
  background: color-mix(in srgb, var(--surface-1) 94%, transparent);
  scrollbar-width: thin;
}

.results-table {
  width: 100%;
  min-width: 720px;
  border-collapse: separate;
  border-spacing: 0;
}

.results-table th {
  padding: 0.85rem 1rem;
  border-bottom: 1px solid color-mix(in srgb, var(--brand-primary-100) 78%, transparent);
  color: var(--text-soft);
  background: color-mix(in srgb, var(--brand-primary-50) 58%, var(--surface-1));
  font-size: 0.68rem;
  font-weight: 900;
  letter-spacing: 0.07em;
  text-align: start;
  text-transform: uppercase;
}

.results-table th:first-child {
  border-start-start-radius: 18px;
}

.results-table th:last-child {
  border-start-end-radius: 18px;
  text-align: center;
}

.results-table td {
  padding: 0.9rem 1rem;
  border-bottom: 1px solid color-mix(in srgb, var(--brand-primary-100) 56%, transparent);
  color: var(--text-strong);
  font-size: 0.82rem;
  vertical-align: middle;
}

.results-table tbody tr {
  transition:
    background 0.2s ease,
    transform 0.2s ease;
}

.results-table tbody tr:hover {
  background: color-mix(in srgb, var(--brand-primary-50) 52%, transparent);
}

.results-table tbody tr:last-child td {
  border-bottom: 0;
}

.result-serial {
  display: inline-flex;
  padding: 0.34rem 0.58rem;
  border-radius: 10px;
  color: var(--brand-primary-700);
  background: color-mix(in srgb, var(--brand-primary-100) 68%, transparent);
  font-size: 0.7rem;
  font-weight: 900;
}

.result-employee {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 0.65rem;
}

.result-employee__avatar {
  display: grid;
  width: 38px;
  height: 38px;
  flex: 0 0 38px;
  place-items: center;
  border: 2px solid color-mix(in srgb, var(--surface-1) 90%, transparent);
  border-radius: 13px;
  color: var(--text-on-brand);
  background: linear-gradient(135deg, var(--brand-primary-500), var(--brand-primary-800));
  font-size: 0.82rem;
  font-weight: 900;
  box-shadow: 0 9px 16px color-mix(in srgb, var(--brand-primary-500) 18%, transparent);
}

.result-employee__name {
  min-width: 0;
  color: var(--brand-primary-900);
  font-weight: 800;
  overflow-wrap: anywhere;
}

.result-date {
  color: var(--text-soft);
  font-weight: 700;
}

.result-time {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  color: var(--text-soft);
  font-weight: 700;
}

.result-time__dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--status-success);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--status-success) 12%, transparent);
}

.result-action {
  width: 72px;
  text-align: center;
}

.result-action :deep(.card) {
  margin: 0;
  padding: 0;
  background: transparent;
  box-shadow: none;
}

.result-action :deep(button) {
  display: inline-grid;
  width: 42px;
  height: 42px;
  place-items: center;
  border: 1px solid color-mix(in srgb, var(--brand-primary-300) 44%, transparent);
  border-radius: 13px;
  color: var(--brand-primary-600);
  background: color-mix(in srgb, var(--brand-primary-50) 80%, var(--surface-1));
  transition:
    transform 0.2s ease,
    color 0.2s ease,
    background 0.2s ease;
}

.result-action :deep(button:hover) {
  transform: translateY(-2px);
  color: var(--text-on-brand);
  background: var(--brand-primary-600);
}

.result-action :deep(button svg) {
  width: 21px;
  height: 21px;
}

@media (max-width: 1200px) {
  .results-statistics {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 900px) {
  .inspection-results-page {
    padding: 1rem;
    border-radius: 24px;
  }

  .results-hero {
    grid-template-columns: minmax(0, 1fr);
  }

  .results-hero__visual {
    position: absolute;
    inset-inline-end: 0.5rem;
    bottom: 0.5rem;
    width: 150px;
    height: 150px;
    opacity: 0.22;
  }

  .results-hero__visual-ring {
    display: none;
  }

  .results-meta {
    position: relative;
    z-index: 1;
  }
}

@media (max-width: 700px) {
  .results-hero {
    min-height: unset;
  }

  .results-meta,
  .results-statistics {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .section-heading {
    align-items: flex-start;
  }
}

@media (max-width: 480px) {
  .inspection-results-page {
    gap: 0.85rem;
    padding: 0.7rem;
    border-radius: 20px;
  }

  .results-hero,
  .results-section,
  .results-table-card {
    border-radius: 19px;
  }

  .results-hero {
    padding: 1.15rem;
  }

  .results-hero h1 {
    font-size: 1.85rem;
  }

  .results-meta,
  .results-statistics {
    grid-template-columns: minmax(0, 1fr);
  }

  .results-meta__copy small,
  .results-meta__copy strong {
    white-space: normal;
    overflow-wrap: anywhere;
  }

  .section-heading {
    flex-direction: column;
  }

  .result-statistic {
    min-height: 92px;
  }
}
</style>
