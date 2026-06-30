<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import TableLoader from '@/shared/DataStatues/TableLoader.vue'
import InvestigatingSidebar from './InvestigatingSidebar.vue'
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

const word = ref('')
const currentPage = ref(1)
const countPerPage = ref(10)
const indexInvestigatingController = IndexInvestigatingController.getInstance()
const state = ref(indexInvestigatingController.state.value)
// const InvestigatingList = ref(InvestigatingData)
const router = useRouter()
const ShowDetails = ref<boolean[]>([])
const observationRiskLevel = ref<RiskLevelEnum | null>(null)

const GetInvsetegationResult = async (
  query = '',
  pageNumber = 1,
  perPage = 10,
  withPage = 1,
  observationRiskLevel?: RiskLevelEnum,
) => {
  const indexInvestigationResultParams = new IndexInvestigationResultParams(
    query,
    pageNumber,
    perPage,
    withPage,
    observationRiskLevel,
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
      return 'Accidents'
    case Observation.ObservationType:
      return 'Observation'
    case Observation.HazardType:
      return 'Hazard'
    default:
      return ''
  }

  // return Observation[type]
}

const handleChangePage = (page: number) => {
  currentPage.value = page
  GetInvsetegationResult('', currentPage.value, countPerPage.value)
}

// Handle count per page change
const handleCountPerPage = (count: number) => {
  countPerPage.value = count
  GetInvsetegationResult('', currentPage.value, countPerPage.value)
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

const GethighObservationCount = (data: any): number => {
  console.log(
    data.filter((el) => el.observation?.riskLevel == RiskLevelEnum.High),
    'el.observation?.riskLevel',
  )
  return data.filter((el) => el.observation?.riskLevel == RiskLevelEnum.High).length
}

const GetMediumObservationCount = (data: any): number => {
  console.log(
    data.filter((el) => el.observation?.riskLevel === RiskLevelEnum.Medium).length,
    'data.map((el) => el.observation?.riskLevel === RiskLevelEnum.Medium).length',
  )
  return data.filter((el) => el.observation?.riskLevel === RiskLevelEnum.Medium).length
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
      <div class="grid grid-cols-12 gap-4 index-investigating">
        <!-- Sidebar -->
        <!--  :mediumObservationCount="GetMediumObservationCount(state.data)" -->
        <InvestigatingSidebar
          :selectedRiskLevel="observationRiskLevel"
          :highObservationCount="GethighObservationCount(state.data)"
          @update:data="GetRiskLevel"
          :mediumObservationCount="GetMediumObservationCount(state.data)"
          :allIncident="state.pagination?.total"
        />

        <!-- Main content (Cards) -->
        <div class="col-span-9">
          <!-- Header -->
          <div class="flex items-center justify-between mb-4">
            <!-- <IndexFilter :filters="Filters" /> -->
            <div class="btns-filter">
              <!-- <FilterDialog /> -->
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
                    <div class="first-card">
                      <div class="first-card-header">
                        <div class="header">
                          <p
                            class="first-label-item-primary"
                            :class="GetObservationRiskLevel(item?.observation?.riskLevel)"
                          >
                            <!-- {{
                              GetObservationRiskLevel(item?.observation?.riskLevel) +
                              ' ' +
                              GetInvestigationType(item?.observation?.type)
                            }} -->
                            incident Report
                            <span v-if="item?.observation?.serial">{{
                              `_` + item?.observation?.serialName || '_OBS-2025-0112'
                            }}</span>
                          </p>
                          <p :class="`status ${ReturnStatusTitle(item?.status)}`">
                            {{ ReturnStatusTitle(item?.status) }}
                          </p>
                        </div>
                        <div class="first-card-details">
                          <p class="label-item-secondary">
                            {{ $t('Date & Time') }}:
                            <span>{{ item?.date }} , {{ item?.observation?.time }}</span>
                          </p>
                          <p class="title label-item-secondary" v-if="item?.observer?.name">
                            {{ $t('the victim') }} : <span>{{ item?.observer?.name }}</span>
                            <span>({{ $t('observer') }})</span>
                          </p>
                        </div>
                      </div>
                    </div>
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
                          <p class="label-item-primary flex" v-if="item?.observation?.zoon">
                            <img :src="mark" alt="zone" />
                            {{ $t('Zone') }}:
                            <span>{{ item?.observation?.zoon?.title || 'N/A' }}</span>
                          </p>
                          <!-- <p class="label-item-primary" v-if="item?.observation?.equipment">
                            {{ $t('Machine') }}:
                            <span>{{ item?.observation?.equipment?.title || 'N/A' }}</span>
                          </p> -->
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
                          <ShowInvestegationDetailsDialog :item="item" class="first-btn" />

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
      <TableLoader :cols="3" :rows="10" />
    </template>
    <template #initial>
      <TableLoader :cols="3" :rows="10" />
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
  box-shadow: 0 10px 28px color-mix(in srgb, var(--Black) 8%, transparent);
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
  box-shadow: 0 16px 36px color-mix(in srgb, var(--Black) 12%, transparent);
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

.first-card-header {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: 100%;
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
