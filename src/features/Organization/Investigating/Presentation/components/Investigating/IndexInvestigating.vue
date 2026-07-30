<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import InvestigatingSidebar from './InvestigatingSidebar.vue'
import InvestigatingCardsLoader from './InvestigatingCardsLoader.vue'
import { InvestegationStatusEnum } from '../../../Core/Enums/InvestegationStatusEnum'
// import { link } from 'fs'
import LiveLink from '@/assets/images/LiveLink.png'
import LiveIcon from '@/assets/images/LiveIcon.png'
import IndexInvestigationResultParams from '../../../Core/params/investegationResult/indexInvestigationResultParams'
import { useRouter } from 'vue-router'
import { DataFailed } from '@/base/core/networkStructure/Resources/dataState/data_state'
import IndexInvestigatingController from '../../controllers/indexInvestigatingController'
import { Observation } from '../../../Core/Enums/ObservationTypeEnum'
import mark from '@/assets/images/mark.png'
import Pagination from '@/shared/HelpersComponents/Pagination.vue'
import { RiskLevelEnum } from '../../../Core/Enums/risk_level_enum'
import ShowInvestegationDetailsDialog from './InvestegationDialogs/ShowInvestegationDetailsDialog.vue'
import Meeting from '@/shared/icons/meeting.vue'
import { useThemeMode } from '@/composables/useThemeMode'
import { formatJoinDate } from '@/base/Presentation/utils/date_format.ts'
import { formatTime } from '@/base/Presentation/utils/time_format.ts'
import IndexFilterDialog from '@/shared/HelpersComponents/IndexFilterDialog.vue'
import TitleInterface from '@/base/Data/Models/title_interface'

const word = ref('')
const currentPage = ref(1)
const countPerPage = ref(10)
const { isDarkMode } = useThemeMode()
const indexInvestigatingController = IndexInvestigatingController.getInstance()
const state = ref(indexInvestigatingController.state.value)
// const InvestigatingList = ref(InvestigatingData)
const router = useRouter()
const ShowDetails = ref<boolean[]>([])
const observationRiskLevel = ref<RiskLevelEnum | null>(null)
const filterDate = ref('')
const filterStatus = ref<number | null>(null)
const filterObservationType = ref<number | null>(null)
const filterFields = [
  {
    key: 'status',
    label: 'status',
    options: [
      new TitleInterface({ id: InvestegationStatusEnum.OPEN, title: 'Open' }),
      new TitleInterface({ id: InvestegationStatusEnum.NEW, title: 'New' }),
      new TitleInterface({ id: InvestegationStatusEnum.IN_PROGRESS, title: 'In Progress' }),
      new TitleInterface({ id: InvestegationStatusEnum.HOLD, title: 'Hold' }),
      new TitleInterface({ id: InvestegationStatusEnum.CLOSED, title: 'Closed' }),
      new TitleInterface({ id: InvestegationStatusEnum.COMPLETED, title: 'Completed' }),
    ],
  },
  {
    key: 'observationType',
    label: 'Observation Type',
    options: [
      new TitleInterface({ id: Observation.ObservationType, title: 'Observation' }),
      new TitleInterface({ id: Observation.HazardType, title: 'Hazard' }),
      new TitleInterface({ id: Observation.AccidentsType, title: 'Incident' }),
    ],
  },
]

const GetInvsetegationResult = async (
  query = '',
  pageNumber = 1,
  perPage = 10,
  withPage = 1,
  riskLevel: RiskLevelEnum | undefined = observationRiskLevel.value ?? undefined,
) => {
  const indexInvestigationResultParams = new IndexInvestigationResultParams(
    query,
    pageNumber,
    perPage,
    withPage,
    riskLevel,
    filterStatus.value ?? undefined,
    filterDate.value,
    filterObservationType.value ?? undefined,
  )
  await indexInvestigatingController.getData(indexInvestigationResultParams)
}

onMounted(() => {
  // ShowDetails.value = InvestigatingList.value.map(() => false)
  GetInvsetegationResult()
})

const ReturnStatusTitle = (status: InvestegationStatusEnum): string => {
  switch (status) {
    case InvestegationStatusEnum.NEW:
      return 'New'
    case InvestegationStatusEnum.IN_PROGRESS:
      return 'InProgress'
    case InvestegationStatusEnum.CLOSED:
      return 'Closed'
    case InvestegationStatusEnum.COMPLETED:
      return 'Completed'
    case InvestegationStatusEnum.HOLD:
      return 'Hold'
    case InvestegationStatusEnum.OPEN:
      return 'Open'
    default:
      return 'Unknown'
  }
}

watch(
  () => indexInvestigatingController.state.value,
  (newState) => {
    if (newState) state.value = newState
  },
  { deep: true },
)

const GetInvestigationType = (type: number) => {
  switch (type) {
    case Observation.AccidentsType:
      return 'Incident'
    case Observation.ObservationType:
      return 'Observation'
    case Observation.HazardType:
      return 'Observation'
    default:
      return ''
  }

  // return Observation[type]
}

const handleChangePage = (page: number) => {
  currentPage.value = page
  GetInvsetegationResult(word.value, currentPage.value, countPerPage.value)
}

// Handle count per page change
const handleCountPerPage = (count: number) => {
  countPerPage.value = count
  GetInvsetegationResult(word.value, currentPage.value, countPerPage.value)
}

const applyFilters = ({
  date,
  values,
}: {
  date: string
  values: Record<string, number | null>
}) => {
  filterDate.value = date
  filterStatus.value = values.status ?? null
  filterObservationType.value = values.observationType ?? null
  currentPage.value = 1
  GetInvsetegationResult(word.value, 1, countPerPage.value)
}

const resetFilters = () => {
  filterDate.value = ''
  filterStatus.value = null
  filterObservationType.value = null
  currentPage.value = 1
  GetInvsetegationResult(word.value, 1, countPerPage.value)
}

const GetRiskLevel = (riskLevel: RiskLevelEnum) => {
  observationRiskLevel.value = riskLevel
  if (riskLevel == null) {
    GetInvsetegationResult('', currentPage.value, countPerPage.value)
  } else {
    GetInvsetegationResult('', currentPage.value, countPerPage.value, 1, observationRiskLevel.value)
  }
}

const GetObservationRiskLevel = (riskLevel: RiskLevelEnum) => {
  switch (riskLevel) {
    case RiskLevelEnum.High:
      return 'high'
    case RiskLevelEnum.Medium:
      return 'medium'
    case RiskLevelEnum.Low:
      return 'low'
    default:
      return ''
  }
}

const hasValue = (value: unknown) =>
  value !== null && value !== undefined && String(value).trim().length > 0

const getDateTime = (date?: string, time?: string) => [date, time].filter(hasValue).join(' , ')

const GethighObservationCount = (data: any): number => {
  console.log(
    data.filter((el) => el.observation.type),
    'elll',
  )
  return data.filter(
    (el) =>
      el.observation?.type == Observation.ObservationType ||
      el.observation?.type == Observation.HazardType,
  ).length
}

const GerIncidantCount = (data: any): number => {
  return data.filter((el) => el.observation?.type === Observation.AccidentsType).length
}
// const GetLowObservationCount = (data: any): number => {
// //   console.log(data.filter((el) => el.observation?.riskLevel === RiskLevelEnum.Low).length, "data.map((el) => el.observation?.riskLevel === RiskLevelEnum.Low).length");
// //   return data.filter((el) => el.observation?.riskLevel === RiskLevelEnum.Low).length
// // }
</script>

<template>
  <DataStatus :controller="state">
    <template #success>
      <!-- {{ console.log(state.data, 'state') }} -->
      <div class="grid grid-cols-12 gap-4 index-investigating" :class="{ 'is-dark': isDarkMode }">
        <!-- Sidebar -->
        <!--  :mediumObservationCount="GetMediumObservationCount(state.data)" -->

        <!-- <InvestigatingSidebar
          :selectedRiskLevel="observationRiskLevel"
          :highObservationCount="GethighObservationCount(state.data)"
          @update:data="GetRiskLevel"
          :mediumObservationCount="GerIncidantCount(state.data)"
          :allIncident="state.pagination?.total"
        /> -->

        <!-- Main content (Cards) -->
        <div class="col-span-12">
          <!-- Header -->
          <div class="flex items-center justify-between mb-4">
            <!-- <IndexFilter :filters="Filters" /> -->
            <div class="btns-filter">
              <!-- <IndexFilterDialog
                show-date
                :fields="filterFields"
                :initial-date="filterDate"
                :initial-values="{ status: filterStatus, observationType: filterObservationType }"
                @apply="applyFilters"
                @reset="resetFilters"
              /> -->
              <!-- <router-link :to="`/organization/investigating/add`">
            <button class="btn btn-primary">Create Investigating</button>
          </router-link> -->
            </div>
          </div>

          <!-- CARDS -->
          <div class="table-responsive">
            <div class="index-table-card-container">
              <!--  InvestigatingList-->
              <div class="index-table-card" v-for="(item, index) in state.data" :key="index">
                <div class="card-header-container" :class="ShowDetails[index] ? '' : 'show'">
                  <div class="first-container">
                    <router-link
                      :to="
                        item?.observation?.type === Observation.AccidentsType
                          ? `/organization/equipment-mangement/incedant/show/${item?.observation?.id}`
                          : `/organization/equipment-mangement/observation/show/${item?.observation?.id}`
                      "
                      class="first-card first-card-link"
                    >
                      <div class="first-card-header">
                        <div class="header">
                          <span
                            class="first-label-item-primary"
                            :class="GetObservationRiskLevel(item?.observation?.riskLevel)"
                          >
                            <!-- {{
                              GetObservationRiskLevel(item?.observation?.riskLevel) +
                              ' ' +
                              GetInvestigationType(item?.observation?.type)
                            }} -->
                            {{ GetInvestigationType(item?.observation?.type) }} Report
                            <span v-if="item?.observation?.serial">{{
                              `_` + item?.observation?.serialName || '_OBS-2025-0112'
                            }}</span>
                          </span>
                          <p :class="`status ${ReturnStatusTitle(item?.status)}`">
                            {{ ReturnStatusTitle(item?.status) }}
                          </p>
                        </div>
                        <div class="investigation-summary-grid">
                          <div
                            v-if="hasValue(item?.observation?.title)"
                            class="investigation-summary-box summary-title"
                          >
                            <span class="summary-label">
                              {{ GetInvestigationType(item?.observation?.type) }} {{ $t('title') }}
                            </span>
                            <span class="summary-value">{{ item?.observation?.title }}</span>
                          </div>

                          <div
                            v-if="getDateTime(item?.date, item?.observation?.time)"
                            class="investigation-summary-box"
                          >
                            <span class="summary-label">{{ $t('Date & Time') }}</span>
                            <span class="summary-value">
                              {{ getDateTime(item?.date, item?.observation?.time) }}
                            </span>
                          </div>

                          <div
                            v-if="hasValue(item?.observer?.name)"
                            class="investigation-summary-box"
                          >
                            <span class="summary-label">{{ $t('the victim') }}</span>
                            <span class="summary-value">
                              {{ item?.observer?.name }}
                              <small>({{ $t('observer') }})</small>
                            </span>
                          </div>

                          <div
                            v-if="hasValue(item?.location?.title)"
                            class="investigation-summary-box"
                          >
                            <span class="summary-label">{{ $t('Location') }}</span>
                            <span class="summary-value">{{ item?.location?.title }}</span>
                          </div>

                          <div
                            v-if="hasValue(item?.observation?.zoon?.title)"
                            class="investigation-summary-box"
                          >
                            <span class="summary-label summary-label-with-icon">
                              <img :src="mark" alt="zone" />
                              {{ $t('Zone') }}
                            </span>
                            <span class="summary-value">{{ item?.observation?.zoon?.title }}</span>
                          </div>
                        </div>
                      </div>
                    </router-link>
                  </div>

                  <!-- second container -->
                  <div class="header-container">
                    <div class="card-content">
                      <div class="card-header" v-if="item?.description">
                        <p class="label-item-secondary">{{ item?.description || 'N/A' }}</p>
                      </div>
                      <!-- {{ $t('take action') }} -->
                      <div class="card-details">
                        <div class="project-details">
                          <!-- <pre>{{ item?.observation }}</pre> -->
                          <p class="label-item-primary" v-if="item?.observation?.createdAt">
                            {{ $t('investigation date & time') }}:
                            <span
                              >{{ formatJoinDate(item?.observation?.createdAt) || 'N/A' }} &
                              {{ formatTime(item?.observation?.createdAt) }}</span
                            >
                          </p>

                          <!-- <p class="label-item-primary">
                            {{ $t('Status') }}:
                            <span>{{
                              item?.observation?.saveStatus == 1 ? 'Solved' : 'Unsolved'
                            }}</span>
                          </p> -->
                          <!-- <p class="label-item-primary" v-if="item?.observation?.isAction">
                            {{ $t('take action') }}:
                            <span>{{ item?.observation?.isAction == 1 ? 'true' : 'false' }}</span>
                          </p> -->
                        </div>
                        <div class="" v-if="item?.status == InvestegationStatusEnum.IN_PROGRESS">
                          <div class="show-investigation-meeting-details">
                            <div class="title">
                              <h6>{{ $t('Investigation Meeting') }}</h6>
                              <!-- <div class="imge"> -->
                              <!-- <img src="https://cdn-icons-png.flaticon.com/512/149/149071.png" alt="meeting" loading="lazy" /> -->
                              <!-- <Meeting /> -->
                              <!-- <p>{{ $t('Meeting Overview') }}</p> -->
                              <!-- </div> -->
                            </div>

                            <div class="dome-info">
                              <p>
                                {{ $t('Date & Time') }} :
                                <span>
                                  {{ item.investigation_meeting_date }}
                                  {{ item.investigation_meeting_time }}</span
                                >
                              </p>
                              <h6>
                                {{ $t('Investigation team leader') }} :
                                <span> {{ item.investigationTeamLeader?.Name }}</span>
                              </h6>
                              <h6>
                                {{ $t('Num of team') }} :
                                <span> {{ item.teamNumebr || '--' }} </span>
                              </h6>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div class="btns-container" style="margin-top: 20px">
                        <div
                          class="unsolved-btns gap-2"
                          v-if="item?.status == InvestegationStatusEnum.NEW"
                        >
                          <!-- <ShowInvestegationDetailsDialog :item="item" class="first-btn" /> -->

                          <router-link
                            :to="`/organization/investigating/add?id=${item?.Investegationid}`"
                          >
                            <button class="btn second-btn">
                              <span>{{ $t('assign_investigation_team') }}</span>
                            </button>
                          </router-link>
                        </div>

                        <div
                          class="btn-inprogress"
                          v-if="item?.status === InvestegationStatusEnum.COMPLETED"
                        >
                          <router-link :to="`/organization/investigating/view`">
                            <button class="btn view-btn">
                              <div>
                                <img :src="LiveLink" class="icon" />
                                <span class="live-link">{{ item?.link }}</span>
                              </div>
                              <div>
                                <span class="join">{{ $t('join_now') }}</span>
                                <img :src="LiveIcon" alt="" />
                              </div>
                            </button>
                          </router-link>
                        </div>

                        <div
                          class="solved-btn flex gap-2"
                          v-if="item?.status === InvestegationStatusEnum.IN_PROGRESS"
                        >
                          <router-link
                            :style="{ width: item?.hasResults ? '50%' : '100%' }"
                            :to="`/organization/Investigating-result/${item?.LatestInvestigatingMeetingId}?investigating_id=${item?.Investegationid}`"
                          >
                            <button class="btn btn-primary w-full">
                              <span>{{ $t('add_meeting_result') }}</span>
                            </button>
                          </router-link>

                          <router-link
                            v-if="item?.hasResults"
                            style="width: 50%"
                            :to="`/organization/Investigating-result-answer/${item?.Investegationid}`"
                          >
                            <button class="btn btn-primary w-full">
                              <span>{{ $t('view_results') }}</span>
                            </button>
                          </router-link>
                        </div>
                        <div
                          class="solved-btn"
                          v-if="item?.status == InvestegationStatusEnum.CLOSED"
                        >
                          <router-link
                            :to="`/organization/Investigating-result-answer/${item?.Investegationid}`"
                          >
                            <button class="btn btn-primary w-full">
                              <span>{{ $t('view_results') }}</span>
                            </button>
                          </router-link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Pagination
        :pagination="state.pagination"
        @changePage="handleChangePage"
        @countPerPage="handleCountPerPage"
      />
    </template>
    <template #loader>
      <InvestigatingCardsLoader :rows="5" />
    </template>
    <template #initial>
      <InvestigatingCardsLoader :rows="5" />
    </template>
    <template #empty>
      <!-- <DataEmpty :link="`/organization/hazard/add`" addText="Add Hazard"
        description="Sorry .. You have no Hazard .. All your joined customers will appear here when you add your customer data"
        title="..ops! You have No Hazard" /> -->
    </template>
    <template #failed>
      <!-- <DataFailed :link="`/organization/hazard/add`" addText="Add Hazard"
        description="Sorry .. You have no Hazard .. All your joined customers will appear here when you add your customer data"
        title="..ops! You have No Hazard" /> -->
    </template>

    <template #notPermitted>
      <DataFailed
        addText="Have not Permission"
        description="Sorry .. You have no Investigating .. All your joined customers will appear here when you add your customer data"
      />
    </template>
  </DataStatus>
</template>

<style lang="scss" scoped>
.index-investigating {
  align-items: flex-start;

  > .col-span-9 {
    min-width: 0;
  }
}

.table-responsive {
  overflow: visible;
}

.index-table-card-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

.index-table-card {
  position: relative;
  overflow: hidden;
  width: 100% !important;
  border: 1px solid var(--main-border);
  border-radius: 18px;
  background: var(--BgWhite);
  box-shadow: 0 10px 28px color-mix(in srgb, var(--text-strong) 8%, transparent);
  transition:
    transform 0.2s ease-in-out,
    box-shadow 0.2s ease-in-out,
    border-color 0.2s ease-in-out;
}

// .index-table-card::before {
//   content: '';
//   position: absolute;
//   inset: 0 auto 0 0;
//   width: 5px;
//   background: var(--PrimaryColor);
// }

.index-table-card:hover {
  border-color: color-mix(in srgb, var(--PrimaryColor) 28%, var(--main-border));
  box-shadow: 0 16px 36px color-mix(in srgb, var(--text-strong) 12%, transparent);
  transform: translateY(-2px);
}

.card-header-container {
  display: grid;
  grid-template-columns: minmax(280px, 0.85fr) minmax(0, 1.5fr);
  gap: 1rem;
  padding: 1rem;
}

.first-container,
.header-container {
  min-width: 0;
}

.first-card,
.card-content,
.show-investigation-meeting-details {
  border: 1px solid var(--main-border);
  border-radius: 16px;
  background: var(--Gray-1);
}

.first-card {
  height: 100%;
  padding: 1rem;
}

.first-card-link {
  display: block;
  color: inherit;
  cursor: pointer;
  text-decoration: none;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;
}

.first-card-link:hover {
  border-color: color-mix(in srgb, var(--PrimaryColor) 32%, var(--main-border));
  box-shadow: 0 10px 24px color-mix(in srgb, var(--PrimaryColor) 9%, transparent);
  transform: translateY(-1px);
}

.first-card-link:focus-visible {
  outline: 2px solid var(--PrimaryColor);
  outline-offset: 3px;
}

.first-card-header {
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;
}

.investigation-summary-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
}

.investigation-summary-box {
  display: flex;
  min-width: 0;
  min-height: 76px;
  flex-direction: column;
  justify-content: center;
  gap: 0.35rem;
  padding: 0.8rem;
  border: 1px solid var(--main-border);
  border-radius: 14px;
  background: var(--BgWhite);
}

.investigation-summary-box.summary-title {
  grid-column: 1 / -1;
}

.summary-label {
  color: var(--GrayText-1);
  font-size: 0.76rem;
  font-weight: 800;
  line-height: 1.35;
}

.summary-label-with-icon {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}

.summary-label img {
  width: 17px;
  height: 17px;
  object-fit: contain;
}

.summary-value {
  overflow-wrap: anywhere;
  color: var(--header-page-color);
  font-size: 0.92rem;
  font-weight: 900;
  line-height: 1.45;
}

.summary-value small {
  color: var(--GrayText-1);
  font-size: 0.75rem;
  font-weight: 700;
}

.header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
}

.first-label-item-primary {
  display: inline-flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.35rem;
  margin: 0;
  border-radius: 999px;
  background: var(--primary-dark);
  color: var(--PrimaryColor);
  font-size: 0.78rem;
  font-weight: 900;
  letter-spacing: 0.04em;
  line-height: 1.4;
  padding: 0.45rem 0.75rem;
  text-transform: uppercase;
}

.first-label-item-primary.high {
  background: var(--Red-opacity);
  color: var(--danger-color);
}

.first-label-item-primary.medium {
  background: var(--delay-color);
  color: var(--medium-color);
}

.first-label-item-primary.low {
  background: var(--green-done);
  color: var(--green);
}

.first-label-item-primary span {
  color: inherit;
  font-weight: 800;
}

.status {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  flex-shrink: 0;
  margin: 0;
  border: 1px solid var(--main-border);
  border-radius: 999px;
  background: var(--BgWhite);
  color: var(--GrayText-1);
  font-size: 0.78rem;
  font-weight: 900;
  padding: 0.42rem 0.75rem;
}

.status::before {
  content: '';
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: currentColor;
}

.status.New,
.status.Open {
  color: var(--PrimaryColor);
}

.status.InProgress,
.status.Hold {
  color: var(--medium-color);
}

.status.Closed,
.status.Completed {
  color: var(--green);
}

.first-card-details {
  display: grid;
  gap: 0.65rem;
}

.label-item-primary,
.label-item-secondary {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin: 0;
  color: var(--GrayText-1);
  font-size: 0.88rem;
  font-weight: 800;
  line-height: 1.55;
}
.label-item-secondary.title {
  font-size: 1rem;
  width: fit-content;
  background-color: none !important;
  border: none !important;
}

.label-item-primary span,
.label-item-secondary span {
  color: var(--header-page-color);
  font-weight: 900;
}

.label-item-primary img,
.label-item-secondary img {
  width: 18px;
  height: 18px;
  object-fit: contain;
}

.card-content {
  padding: 1rem;
}

.card-header {
  border-bottom: 1px solid var(--main-border);
  margin-bottom: 1rem;
  padding-bottom: 0.85rem;
}

.card-header .label-item-secondary {
  color: var(--header-page-color);
  font-weight: 700;
}

.card-details {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(280px, 0.9fr);
  gap: 1rem;
}

.project-details {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
  align-content: start;
}

.project-details .label-item-primary {
  border: 1px solid var(--main-border);
  border-radius: 14px;
  background: var(--BgWhite);
  padding: 0.75rem;
}

.show-investigation-meeting-details {
  padding: 1rem;
}

.show-investigation-meeting-details .title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  border-bottom: 1px solid var(--main-border);
  padding-bottom: 0.85rem;
}

.show-investigation-meeting-details .title h6,
.show-investigation-meeting-details .dome-info h6,
.show-investigation-meeting-details .dome-info p {
  margin: 0;
}

.show-investigation-meeting-details .title h6 {
  color: var(--header-page-color);
  font-size: 1rem;
  font-weight: 900;
}

.show-investigation-meeting-details .title .imge {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  border-radius: 999px;
  background: var(--BgWhite);
  color: var(--PrimaryColor);
  font-size: 0.78rem;
  font-weight: 900;
  padding: 0.45rem 0.7rem;
}

.show-investigation-meeting-details .title .imge p {
  margin: 0;
}

.show-investigation-meeting-details .dome-info {
  display: grid;
  gap: 0.65rem;
  margin-top: 0.85rem;
}

.show-investigation-meeting-details .dome-info p,
.show-investigation-meeting-details .dome-info h6 {
  color: var(--GrayText-1);
  font-size: 0.86rem;
  font-weight: 800;
  line-height: 1.5;
}

.show-investigation-meeting-details .dome-info span {
  color: var(--header-page-color);
  font-weight: 900;
}

.btns-container {
  margin-top: 1rem !important;
}

.solved-btn {
  width: 100% !important;
  a {
    width: 50%;
  }
}
.unsolved-btns,
.solved-btn {
  display: flex;
  gap: 0.75rem;
}

.unsolved-btns a,
.solved-btn a,
.btn-inprogress a {
  min-width: 0;
}

.btns-container .btn {
  min-height: 44px;
  border-radius: 12px;
  font-weight: 900;
  transition:
    transform 0.2s ease-in-out,
    box-shadow 0.2s ease-in-out;
}

.btns-container .btn:hover {
  transform: translateY(-1px);
}

@media (max-width: 640px) {
  .investigation-summary-grid {
    grid-template-columns: 1fr;
  }

  .investigation-summary-box.summary-title {
    grid-column: auto;
  }
}

.second-btn,
.view-btn {
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 24%, var(--main-border));
  background: var(--BgWhite);
  color: var(--PrimaryColor);
}

.view-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  width: 100%;
}

.view-btn > div {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
}

.view-btn .icon {
  width: 20px;
  height: 20px;
}

.live-link {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.join {
  white-space: nowrap;
}

.index-investigating.is-dark {
  .table-responsive,
  .index-table-card-container,
  .card-header-container,
  .first-container,
  .header-container,
  .first-card-header .header,
  .card-details,
  .project-details,
  .first-card-details,
  .btns-container,
  .unsolved-btns,
  .solved-btn,
  .btn-inprogress {
    background: transparent !important;
  }

  .index-table-card,
  .card-header-container.show,
  .first-card,
  .first-card-header,
  .card-content,
  .show-investigation-meeting-details,
  .project-details .label-item-primary,
  .status,
  .second-btn,
  .view-btn,
  :deep(.investigation-show-details-btn) {
    border-color: var(--main-border) !important;
    background:
      radial-gradient(
        circle at 100% 0%,
        color-mix(in srgb, var(--PrimaryColor) 8%, transparent),
        transparent 38%
      ),
      linear-gradient(180deg, var(--surface-1), var(--surface-2)) !important;
    color: var(--text-strong) !important;
    box-shadow: 0 14px 34px color-mix(in srgb, var(--text-strong) 22%, transparent) !important;
  }

  .index-table-card:hover {
    border-color: color-mix(in srgb, var(--PrimaryColor) 34%, var(--main-border)) !important;
    box-shadow: 0 18px 42px color-mix(in srgb, var(--text-strong) 30%, transparent) !important;
  }

  .first-card-header {
    overflow: hidden;
    border-radius: 14px !important;
    padding: 0.9rem !important;
  }

  .first-card-header .label-item-secondary.title,
  .first-card-details .label-item-secondary {
    width: 100%;
    border: 1px solid var(--main-border) !important;
    border-radius: 12px !important;
    background: color-mix(in srgb, var(--surface-3) 72%, transparent) !important;
    color: var(--text-soft) !important;
    padding: 0.7rem 0.85rem !important;
  }

  .label-item-secondary,
  .label-item-primary,
  .show-investigation-meeting-details .dome-info p,
  .show-investigation-meeting-details .dome-info h6 {
    color: var(--text-soft) !important;
  }

  .label-item-secondary span,
  .label-item-primary span,
  .show-investigation-meeting-details .title h6,
  .show-investigation-meeting-details .dome-info span,
  .live-link,
  .join {
    color: var(--text-strong) !important;
  }

  .card-header,
  .show-investigation-meeting-details .title {
    border-color: var(--main-border) !important;
  }

  .first-label-item-primary {
    border: 1px solid color-mix(in srgb, var(--PrimaryColor) 24%, var(--main-border)) !important;
    background: color-mix(in srgb, var(--PrimaryColor) 14%, var(--surface-2)) !important;
    color: var(--PrimaryColor) !important;
  }

  .first-label-item-primary.high {
    background: color-mix(in srgb, var(--danger-color) 18%, var(--surface-2)) !important;
    color: var(--status-danger-soft) !important;
  }

  .first-label-item-primary.medium {
    background: color-mix(in srgb, var(--medium-color) 18%, var(--surface-2)) !important;
    color: var(--brand-accent-500) !important;
  }

  .first-label-item-primary.low {
    background: color-mix(in srgb, var(--green) 18%, var(--surface-2)) !important;
    color: var(--status-success) !important;
  }

  .status.New,
  .status.Open {
    color: var(--PrimaryColor) !important;
  }

  .status.InProgress,
  .status.Hold {
    color: var(--medium-color) !important;
  }

  .status.Closed,
  .status.Completed {
    color: var(--green) !important;
  }

  .second-btn,
  .view-btn,
  :deep(.investigation-show-details-btn) {
    border: 1px solid color-mix(in srgb, var(--PrimaryColor) 24%, var(--main-border)) !important;
    color: var(--PrimaryColor) !important;
  }

  .second-btn:hover,
  .view-btn:hover,
  :deep(.investigation-show-details-btn:hover) {
    border-color: var(--PrimaryColor) !important;
    background: color-mix(in srgb, var(--PrimaryColor) 16%, var(--surface-2)) !important;
  }
}

@media (max-width: 1180px) {
  .card-header-container,
  .card-details {
    grid-template-columns: 1fr;
  }

  .project-details {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 900px) {
  .index-investigating {
    grid-template-columns: 1fr;
  }

  .index-investigating > :deep(.col-span-3),
  .index-investigating > .col-span-9 {
    grid-column: auto / span 1;
  }
}

@media (max-width: 640px) {
  .card-header-container {
    padding: 0.75rem;
  }

  .header,
  .show-investigation-meeting-details .title,
  .unsolved-btns,
  .solved-btn {
    flex-direction: column;
    align-items: stretch;
  }

  .unsolved-btns a,
  .solved-btn a,
  .solved-btn :deep(a) {
    width: 100% !important;
  }
}
</style>
