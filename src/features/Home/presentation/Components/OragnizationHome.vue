<script lang="ts" setup>
import { defineAsyncComponent } from 'vue'
import ProjectsStatistics from './HomeStatistics/ProjectsStatistics.vue'
import FetchPorjectStatisticsController from '../Controllers/FetchProjectStatisticsController'
import { computed, onMounted, ref, watch } from 'vue'
import ProjectProgressHeader from '@/features/Organization/ProjectPrgoress/Presentation/supcomponents/ProjectProgressHeader.vue'
import IndexProjectProgressController from '@/features/Organization/ProjectPrgoress/Presentation/controllers/indexProjectProgressController'
import IndexProjectProgressParams from '@/features/Organization/ProjectPrgoress/Core/params/indexProjectProgressParams'
import { useProjectAppStatusStore } from '@/stores/ProjectStatus'
import IndexProjectController from '@/features/Organization/Project/Presentation/controllers/indexProjectController'
import IndexProjectParams from '@/features/Organization/Project/Core/params/indexProjectParams'
import FetchHomeInspectionController from '../Controllers/FetchHomeInspectionController'
import FetchHomeInspectionParams from '../../core/params/FetchHomeInspectionParams'
import OverviewHazardChartController from '../Controllers/OverviewHazardChartController'
import OverviewHazardChartParams from '../../core/params/OverviewHazardChartParams'
import OverviewInvestigationsChartController from '../Controllers/OverviewInvestigationsChartController'
import FetchEquipmentStaticsController from '../Controllers/FetchEquipmentStaticsController'
import FetchEquipmentStaticsParams from '../../core/params/FetchEquipmentStaticsParams'
import OverviewInvestigationsChartParams from '../../core/params/OverviewInvestigationsChartParams'
import HomeSkelaton from '../subComponent/HomeSkelaton.vue'

const InvestegationStatics = defineAsyncComponent(
  () => import('./HomeUtils/InvestegationStatics.vue'),
)
const EquipmentStaticss = defineAsyncComponent(() => import('./HomeUtils/EquipmentStatics.vue'))
const StaticCardsFullDetails = defineAsyncComponent(
  () => import('./HomeUtils/StaticCardsFullDetails.vue'),
)
const StaticsCardPerMonth = defineAsyncComponent(
  () => import('./HomeUtils/StaticsCardPerMonth.vue'),
)
const HomeCards = defineAsyncComponent(() => import('./HomeUtils/HomeCards.vue'))

const fetchPorjectStatisticsController = FetchPorjectStatisticsController.getInstance()
const state = computed(() => fetchPorjectStatisticsController.state.value)
const ProgressValue = ref<number | null>(null)
const ProjectAppStatusStore = useProjectAppStatusStore()
const visited = ref(localStorage.getItem('visited'))
const fetchHomeInspectionController = FetchHomeInspectionController.getInstance()
const homeInspectionState = computed(() => fetchHomeInspectionController.state.value)
const indexProjectProgressController = IndexProjectProgressController.getInstance()
const indexProjectController = IndexProjectController.getInstance()
const ProjectStatics = computed(() => indexProjectController.state.value)
const overviewHazardChartController = OverviewHazardChartController.getInstance()
const OverviewHazardChartstate = computed(() => overviewHazardChartController.state.value)
const overviewInvestigationsChartController = OverviewInvestigationsChartController.getInstance()
const overviewInvestigationsChartstate = computed(
  () => overviewInvestigationsChartController.state.value,
)
const fetchEquipmentStaticsController = FetchEquipmentStaticsController.getInstance()
const EquipmentStatics = computed(() => fetchEquipmentStaticsController.state.value)
const GetHomeInspection = async () => {
  const fetchHomeInspectionParams = new FetchHomeInspectionParams()
  await fetchHomeInspectionController.getData(fetchHomeInspectionParams)
}

const getProjectProgress = async () => {
  const indexProjectProgressParams = new IndexProjectProgressParams('', 1, 10, 0)
  const response = await indexProjectProgressController.getData(indexProjectProgressParams)
  if (response.value?.data) {
    ProgressValue.value = response.value?.data?.progress
    ProjectAppStatusStore.setProjectAppStatus(response.value?.data)
  }
}
const showOverlay = computed(() => {
  return ProgressValue.value == 0
})
const setVisited = () => {
  localStorage.setItem('visited', 'true')
}

const fetchProject = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 0,
) => {
  const indexProjects = new IndexProjectParams(query, pageNumber, perPage, withPage)
  await indexProjectController.getData(indexProjects)
}

const fetchOverviewHazardChart = async () => {
  const overviewHazardChartParams = new OverviewHazardChartParams()
  await overviewHazardChartController.getData(overviewHazardChartParams)
}

const fetchoverviewInvestigationsCharts = async () => {
  const overviewInvestigationsChartParams = new OverviewInvestigationsChartParams()
  await overviewInvestigationsChartController.getData(overviewInvestigationsChartParams)
}

const GetEquipmentStatics = async () => {
  const fetchEquipmentStaticsParams = new FetchEquipmentStaticsParams()
  await fetchEquipmentStaticsController.getData(fetchEquipmentStaticsParams)
}

onMounted(async () => {
  visited.value = localStorage.getItem('visited')

  await Promise.all([
    GetEquipmentStatics(),
    fetchProject(),
    getProjectProgress(),
    GetHomeInspection(),
    fetchOverviewHazardChart(),
    fetchoverviewInvestigationsCharts(),
  ])
})

watch([() => indexProjectProgressController.state.value.data], ([UpdatedProjectProgressState]) => {
  if (UpdatedProjectProgressState) {
    ProjectAppStatusStore.setProjectAppStatus(UpdatedProjectProgressState)
  }
})
</script>
<template>
  <div class="home-page">
    <router-link
      @click="setVisited"
      to="/organization/project-progress"
      class="mb-5"
      :class="{ 'highlight-active': showOverlay && !visited }"
      v-if="(ProgressValue || ProgressValue == 0) && ProgressValue < 100"
    >
      <ProjectProgressHeader :progressValue="ProgressValue" style="margin-block: 20px" />
      <div v-if="showOverlay && !visited" class="overlay-note sidebar-note">
        <h3>Step 1: Click Here To Start Adding Your Data</h3>
        <p>Fill All Data From this page</p>
      </div>
    </router-link>

    <div v-if="showOverlay && !visited" class="container-overlay"></div>

    <HomeCards :ProgressValue="Number(ProgressValue)" />

    <template v-if="ProjectStatics?.data">
      <div class="statics">
        <ProjectsStatistics :projectStatistics="ProjectStatics?.data" />
        <StaticsCardPerMonth :homeInspectionState="homeInspectionState" />
        <StaticCardsFullDetails :homeInspectionState="homeInspectionState" />
      </div>
      <EquipmentStaticss :EquipmentStatics="EquipmentStatics" />
      <InvestegationStatics
        :OverviewHazardChartstate="OverviewHazardChartstate"
        :overviewInvestigationsChartstate="overviewInvestigationsChartstate"
      />
    </template>
    <HomeSkelaton v-if="!ProjectStatics?.data" />
  </div>
</template>
