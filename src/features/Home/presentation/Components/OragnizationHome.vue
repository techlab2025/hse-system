<script lang="ts" setup>
import '../styles/home-identity.css'
import { defineAsyncComponent } from 'vue'
import EmployeeTasksButton from '@/shared/HelpersComponents/EmployeeTasksButton.vue'
import ProjectsStatistics from './HomeStatistics/ProjectsStatistics.vue'
import HomeCards from './HomeUtils/HomeCards.vue'
import HomeSetupHint from './HomeUtils/HomeSetupHint.vue'
import { computed, onMounted, watch } from 'vue'
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
import { useThemeMode } from '@/composables/useThemeMode'
import { useOrganizationOnboarding } from '@/composables/useOrganizationOnboarding'
import {
  DataInitial,
  DataLoading,
} from '@/base/core/networkStructure/Resources/dataState/data_state'

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
const { isDarkMode } = useThemeMode()

const indexProjectProgressController = IndexProjectProgressController.getInstance()
const ProgressValue = computed(
  () => indexProjectProgressController.state.value.data?.progress ?? null,
)
const setupItems = computed(
  () => indexProjectProgressController.state.value.data?.progressItems ?? [],
)
const ProjectAppStatusStore = useProjectAppStatusStore()
const { visited, setVisited } = useOrganizationOnboarding('visited')
const fetchHomeInspectionController = FetchHomeInspectionController.getInstance()
const homeInspectionState = computed(() => fetchHomeInspectionController.state.value)
const indexProjectController = IndexProjectController.getInstance()
const ProjectStatics = computed(() => indexProjectController.state.value)
const projects = computed(() => ProjectStatics.value.data ?? [])
const projectsLoading = computed(
  () => ProjectStatics.value instanceof DataInitial || ProjectStatics.value instanceof DataLoading,
)
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
    ProjectAppStatusStore.setProjectAppStatus(response.value?.data)
  }
}
const showOverlay = computed(() => {
  return ProgressValue.value == 0
})

const fetchProject = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 1,
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
  await Promise.allSettled([
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
  <div
    :class="[
      'home-page organization-home-page hse-identity hse-home-dashboard',
      { 'is-dark': isDarkMode },
    ]"
  >
    <HomeCards :ProgressValue="Number(ProgressValue)" />

    <EmployeeTasksButton />
    <section
      class="home-setup-reminder"
      :class="{ 'highlight-active': showOverlay && !visited }"
      v-if="ProgressValue !== null && ProgressValue < 100"
    >
      <HomeSetupHint :items="setupItems" :progress-value="ProgressValue" @continue="setVisited" />
      <div v-if="showOverlay && !visited" class="overlay-note sidebar-note">
        <span class="tip-kicker">{{ $t('step_1_of_3') }}</span>
        <h3>{{ $t('Step_1_Click_Here_To_Start_Adding_Your_Data') }}</h3>
        <p>{{ $t('Fill_All_Data_From_this_page') }}</p>
        <div class="tip-progress" aria-hidden="true">
          <span class="active"></span>
          <span></span>
          <span></span>
        </div>
        <span class="tip-action">{{ $t('click_setup_card_to_continue') }}</span>
      </div>
    </section>

    <div v-if="showOverlay && !visited" class="container-overlay"></div>

    <template v-if="!projectsLoading">
      <section class="home-analytics-shell">
        <!-- <div class="home-analytics-heading">
          <span>{{ $t('dashboard') }}</span>
          <h2>{{ $t('overview') }}</h2>
        </div> -->

        <div class="home-overview-grid">
          <div class="hse-home-panel home-panel-projects">
            <ProjectsStatistics
              :projectStatistics="projects"
              :totalNumOfProjects="ProjectStatics.pagination?.total"
            />
          </div>

          <div class="home-panel-kpis">
            <StaticsCardPerMonth :homeInspectionState="homeInspectionState" />
          </div>

          <div class="home-panel-details">
            <StaticCardsFullDetails :homeInspectionState="homeInspectionState" />
          </div>
        </div>

        <EquipmentStaticss :EquipmentStatics="EquipmentStatics" />
        <InvestegationStatics
          :OverviewHazardChartstate="OverviewHazardChartstate"
          :overviewInvestigationsChartstate="overviewInvestigationsChartstate"
        />
      </section>
    </template>
    <HomeSkelaton v-if="projectsLoading" />
  </div>
</template>
