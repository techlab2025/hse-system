<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue'
import ShowMoreIcon from '@/shared/icons/ShowMoreIcon.vue'
import ViewIcon from '@/shared/icons/ViewIcon.vue'
import Image from 'primevue/image'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import TableLoader from '@/shared/DataStatues/TableLoader.vue'
import DataEmpty from '@/shared/DataStatues/DataEmpty.vue'
import IndexFilter from './InvestigatingUtils/IndexFilter.vue'
import FilterDialog from './InvestigatingUtils/FilterDialog.vue'
import TitleInterface from '@/base/Data/Models/title_interface'
import InvestigatingSidebar from './InvestigatingSidebar.vue'
import { InvestegationStatusEnum } from '../../../Core/Enums/InvestegationStatusEnum'
// import { link } from 'fs'
import LiveLink from '@/assets/images/LiveLink.png'
import LiveIcon from '@/assets/images/LiveIcon.png'
import ShowInvestigatingResultController from '../../controllers/investegationResult/ShowInvestigatingResultController'
import IndexInvestigationResultParams from '../../../Core/params/investegationResult/indexInvestigationResultParams'
import IndexInvestigatingResultController from '../../controllers/investegationResult/IndexInvestigatingResultController'
import { useRouter } from 'vue-router'
import { DataFailed } from '@/base/core/networkStructure/Resources/dataState/data_state'
import IndexInvestigatingController from '../../controllers/indexInvestigatingController'
import { Observation } from '../../../Core/Enums/ObservationTypeEnum'
import mark from '@/assets/images/mark.png'
import Pagination from '@/shared/HelpersComponents/Pagination.vue'
import { RiskLevelEnum } from '../../../Core/Enums/risk_level_enum'
import ShowInvestegationDetailsDialog from './InvestegationDialogs/ShowInvestegationDetailsDialog.vue'

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
  GetInvsetegationResult('', page, countPerPage.value)
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
</script>

<template>
  <DataStatus :controller="state">
    <template #success>
      {{ console.log(state.data, 'state') }}
      <div class="grid grid-cols-12 gap-4 index-investigating">
        <!-- Sidebar -->
        <InvestigatingSidebar
          :selectedRiskLevel="observationRiskLevel"
          :highObservationCount="5"
          :mediumObservationCount="5"
          @update:data="GetRiskLevel"
        />

        <!-- Main content (Cards) -->
        <div class="col-span-9">
          <!-- Header -->
          <div class="flex items-center justify-between mb-4">
            <!-- <IndexFilter :filters="Filters" /> -->
            <div class="btns-filter">
              <FilterDialog />
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


                          <p class="first-label-item-primary"
                            :class="GetObservationRiskLevel(item?.observation?.riskLevel)">
                            {{ GetObservationRiskLevel(item?.observation?.riskLevel) + " " +
                              GetInvestigationType(item?.observation?.type) }} <span v-if="item?.observation?.serial">{{
                              `_` + item?.observation?.serial ||
                              '_OBS-2025-0112'
                              }}</span>

                          </p>
                          <p :class="`status ${ReturnStatusTitle(item?.status)}`">
                            {{ ReturnStatusTitle(item?.status) }}
                          </p>
                        </div>
                        <div class="first-card-details">
                          <p class="label-item-secondary">
                            Date & Time: <span>{{ item?.date }}</span>
                          </p>
                          <p class="title label-item-secondary" v-if="item?.observer?.name">
                            the victim : <span>{{ item?.observer?.name }}</span>
                            <span>(observer)</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- second container -->
                  <div class="header-container">
                    <div class="card-content">
                      <div class="card-header" v-if="item?.description">
                        <p class="label-item-secondary">{{ item?.description }}</p>
                      </div>

                      <div class="card-details">
                        <div class="project-details">
                          <!-- <pre>{{ item?.observation }}</pre> -->
                          <p class="label-item-primary flex" v-if="item?.observation?.zoon">
                            <img :src="mark" alt="zone" />
                            Zone: <span>{{ item?.observation?.zoon?.title }}</span>
                          </p>
                          <p class="label-item-primary" v-if="item?.observation?.equipment">
                            Machine: <span>{{ item?.observation?.equipment?.title }}</span>
                          </p>
                          <p class="label-item-primary">
                            Status:
                            <span>{{
                              item?.observation?.saveStatus == 1 ? 'Solved' : 'Unsolved'
                            }}</span>
                          </p>
                          <p class="label-item-primary" v-if="item?.observation?.isAction">
                            take action:
                            <span>{{ item?.observation?.isAction == 1 ? 'true' : 'false' }}</span>
                          </p>
                        </div>
                      </div>

                      <div class="btns-container" style="margin-top: 20px">
                        <div
                          class="unsolved-btns gap-2"
                          v-if="item?.status == InvestegationStatusEnum.NEW"
                        >
                          <ShowInvestegationDetailsDialog :item="item" />

                          <router-link
                            :to="`/organization/investigating/add?id=${item?.Investegationid}`"
                          >
                            <button class="btn second-btn">
                              <span>{{ $t('assign investigation team') }}</span>
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


                        <div class="solved-btn flex gap-2" v-if="item?.status === InvestegationStatusEnum.IN_PROGRESS">
                          <router-link :style="{ width: item?.hasResults ? '50%' : '100%' }"
                            :to="`/organization/Investigating-result/${item?.LatestInvestigatingMeetingId}?investigating_id=${item?.Investegationid}`">
                            <button class="btn btn-primary w-full">
                              <span>{{ $t('add_meeting_result') }}</span>
                            </button>
                          </router-link>


                          <router-link v-if="item?.hasResults" style="width: 50%;"
                            :to="`/organization/Investigating-result-answer/${item?.Investegationid}`">

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
      <DataFailed addText="Have not Permission"
        description="Sorry .. You have no Investigating .. All your joined customers will appear here when you add your customer data" />

    </template>
  </DataStatus>
</template>
