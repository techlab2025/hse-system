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
import { link } from 'fs'
import LiveLink from '@/assets/images/LiveLink.png'
import LiveIcon from '@/assets/images/LiveIcon.png'
import ShowInvestigatingResultController from '../../controllers/investegationResult/ShowInvestigatingResultController'
import IndexInvestigationResultParams from '../../../Core/params/investegationResult/indexInvestigationResultParams'
import IndexInvestigatingResultController from '../../controllers/investegationResult/IndexInvestigatingResultController'
import { useRouter } from 'vue-router'
import { DataFailed } from '@/base/core/networkStructure/Resources/dataState/data_state'
import IndexInvestigatingController from '../../controllers/indexInvestigatingController'
import { Observation } from '../../../Core/Enums/ObservationTypeEnum'


const indexInvestigatingController = IndexInvestigatingController.getInstance()
const state = ref(indexInvestigatingController.state.value)
// const InvestigatingList = ref(InvestigatingData)
const router = useRouter()
const ShowDetails = ref<boolean[]>([])

const GetInvsetegationResult = async (
  query = '',
  pageNumber = 1,
  perPage = 10,
  withPage = 1,
) => {
  const indexInvestigationResultParams = new IndexInvestigationResultParams(
    query,
    pageNumber,
    perPage,
    withPage
  );

  await indexInvestigatingController.getData(indexInvestigationResultParams);

}

onMounted(() => {
  // ShowDetails.value = InvestigatingList.value.map(() => false)
  GetInvsetegationResult();
})

const ReturnStatusTitle = (status: InvestegationStatusEnum): string => {
  switch (status) {
    case InvestegationStatusEnum.NEW:
      return 'New'
    case InvestegationStatusEnum.IN_PROGRESS:
      return 'In Progress'
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
  { deep: true }
)

const GetInvestigationType = (type: number) => {
  return Observation[type]
}
</script>

<template>
  <DataStatus :controller="state">
    <template #success>
      <div class="grid grid-cols-12 gap-4 index-investigating">
        <!-- Sidebar -->
        <InvestigatingSidebar />

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
                          <p class="first-label-item-primary" :class="{
                            'high-observation': item.title === 'High observation',
                            'medium-observation': item.title === 'Medium observation',
                          }">
                            {{ GetInvestigationType(item?.observation?.type) }} <span>_OBS-2025-0112</span>
                          </p>
                          <p class="new">{{ ReturnStatusTitle(item?.status) }}</p>
                        </div>
                        <div class="first-card-details">
                          <p class="label-item-secondary">
                            Date & Time: <span>{{ item?.date }}</span>
                          </p>
                          <p class="title label-item-secondary">
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
                      <div class="card-header">
                        <p class="label-item-secondary">{{ item?.serial }}</p>
                      </div>

                      <div class="card-details">
                        <div class="project-details">
                          <p class="label-item-primary" v-if="item?.zoon">
                            Zone: <span>{{ item?.zoon?.title }}</span>
                          </p>
                          <p class="label-item-primary" v-if="item?.equipment">
                            Machine: <span>{{ item?.equipment?.title }}</span>
                          </p>
                          <p class="label-item-primary">
                            Status: <span>{{ ReturnStatusTitle(item?.status) }}</span>
                          </p>
                        </div>
                      </div>

                      <div class="btns-container">
                        <div class="unsolved-btns gap-2" v-if="item?.status == InvestegationStatusEnum.NEW">
                          <button class="btn first-btn">
                            <span>{{ $t('show details') }}</span>
                          </button>

                          <router-link :to="`/organization/investigating/add?id=${item?.Investegationid}`">
                            <button class="btn second-btn">
                              <span>{{ $t('assign investigation team') }}</span>
                            </button>
                          </router-link>
                        </div>

                        <div class="btn-inprogress" v-if="item?.status === InvestegationStatusEnum.COMPLETED">
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

                        <div class="solved-btn" v-if="item?.status === InvestegationStatusEnum.IN_PROGRESS">
                          <router-link :to="`/organization/Investigating-result/${item?.LatestInvestigatingMeetingId}?investigating_id=${item?.Investegationid}`">
                            <button class="btn btn-primary w-full">
                              <span>{{ $t('add_meeting_result') }}</span>
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
    </template>
    <template #loader>
      <TableLoader :cols="3" :rows="10" />
    </template>
    <template #initial>
      <TableLoader :cols="3" :rows="10" />
    </template>
    <template #empty>
      <DataEmpty :link="`/organization/hazard/add`" addText="Add Hazard"
        description="Sorry .. You have no Hazard .. All your joined customers will appear here when you add your customer data"
        title="..ops! You have No Hazard" />
    </template>
    <template #failed>
      <DataFailed :link="`/organization/hazard/add`" addText="Add Hazard"
        description="Sorry .. You have no Hazard .. All your joined customers will appear here when you add your customer data"
        title="..ops! You have No Hazard" />
    </template>

    <template #notPermitted>
      <DataFailed addText="Have not Permission"
        description="Sorry .. You have no Hazard .. All your joined customers will appear here when you add your customer data" />
    </template>
  </DataStatus>
</template>
