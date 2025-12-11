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

const InvestigatingData = [
  {
    id: 1,
    title: 'Incedant',
    serial:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry printing and',
    date: '2025-01-05 10:00 AM',
    observer: { name: 'Ahmed Ali' },
    description: 'Oil leakage detected near the main engine.',
    zoon: { title: 'Zone A' },
    equipment: { title: 'Excavator CAT 320' },
    status: InvestegationStatusEnum.UNSOLVED,
    image: 'https://picsum.photos/220/150',
    link: '',
  },
  {
    id: 2,

    title: 'High observation',
    serial: 'Another dummy text for testing card 2',
    date: '2025-02-10 11:30 AM',
    observer: { name: 'Sara Mohamed' },
    description: 'Hydraulic failure detected.',
    zoon: { title: 'Zone B' },
    equipment: { title: 'Bulldozer CAT D6' },
    status: InvestegationStatusEnum.INPROGRESS,
    image: 'https://picsum.photos/221/150',
    link: 'https://meet.google.com/abc-defg-hij',
  },
  {
    id: 3,
    title: 'Medium observation',
    serial: 'Third card dummy text',
    date: '2025-03-15 09:45 AM',
    observer: { name: 'Khaled Samir' },
    description: 'Electrical issue near main control panel.',
    zoon: { title: 'Zone C' },
    equipment: { title: 'Crane Liebherr' },
    status: InvestegationStatusEnum.SOLVED,
    image: 'https://picsum.photos/222/150',
    link: '',
  },
]

const indexInvestigatingResultController = IndexInvestigatingResultController.getInstance()
const state = ref(indexInvestigatingResultController.state.value)
const InvestigatingList = ref(InvestigatingData)
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

  await indexInvestigatingResultController.IndexInvestigatingResult(indexInvestigationResultParams, router);

}

onMounted(() => {
  ShowDetails.value = InvestigatingList.value.map(() => false)
  GetInvsetegationResult();
})

const ReturnStatusTitle = (status: InvestegationStatusEnum): string => {
  switch (status) {
    case InvestegationStatusEnum.UNSOLVED:
      return 'Unsolved'
    case InvestegationStatusEnum.INPROGRESS:
      return 'In Progress'
    case InvestegationStatusEnum.SOLVED:
      return 'Solved'
    default:
      return 'Unknown'
  }
}

watch(
  () => indexInvestigatingResultController.state.value,
  (newState) => {
    if (newState) state.value = newState
  },
  { deep: true }
)
</script>

<template>
  <!-- <DataStatus :controller="state"> -->
    <!-- <template #success> -->
      <div class="grid grid-cols-12 gap-4 index-investigating">
        <!-- Sidebar -->
        <InvestigatingSidebar />

        <!-- Main content (Cards) -->
        <div class="col-span-9">
          <!-- Header -->
          <div class="flex items-center justify-between mb-4">
            <IndexFilter :filters="Filters" />
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
              <div class="index-table-card" v-for="(item, index) in InvestigatingData" :key="index">
                <div class="card-header-container" :class="ShowDetails[index] ? '' : 'show'">
                  <div class="first-container">
                    <div class="first-card">
                      <div class="first-card-header">
                        <div class="header">
                          <p class="first-label-item-primary" :class="{
                            'high-observation': item.title === 'High observation',
                            'medium-observation': item.title === 'Medium observation',
                          }">
                            {{ item.title }} <span>_OBS-2025-0112</span>
                          </p>
                          <p class="new">New</p>
                        </div>
                        <div class="first-card-details">
                          <p class="label-item-secondary">
                            Date & Time: <span>{{ item.date }}</span>
                          </p>
                          <p class="title">
                            {{ item.observer.name }}
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
                        <p class="label-item-secondary">{{ item.serial }}</p>
                      </div>

                      <div class="card-details">
                        <div class="project-details">
                          <p class="label-item-primary">
                            Zone: <span>{{ item.zoon.title }}</span>
                          </p>
                          <p class="label-item-primary">
                            Machine: <span>{{ item.equipment.title }}</span>
                          </p>
                          <p class="label-item-primary">
                            Status: <span>{{ ReturnStatusTitle(item?.status) }}</span>
                          </p>
                        </div>
                      </div>

                      <div class="btns-container">
                        <div class="unsolved-btns" v-if="item?.status == InvestegationStatusEnum.UNSOLVED">
                          <button class="btn first-btn">
                            <span>{{ $t('show details') }}</span>
                          </button>

                          <router-link :to="`/organization/investigating/add?id=${item?.id}`">
                            <button class="btn second-btn">
                              <span>{{ $t('assign investigation team') }}</span>
                            </button>
                          </router-link>
                        </div>

                        <div class="btn-inprogress" v-if="item?.status === InvestegationStatusEnum.INPROGRESS">
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

                        <div class="solved-btn" v-if="item?.status === InvestegationStatusEnum.SOLVED">
                          <router-link :to="`/organization/Investigating-result/${item?.id}`">
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
    <!-- </template> -->
    <!-- <template #loader>
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
    </template> -->
  <!-- </DataStatus> -->
</template>
