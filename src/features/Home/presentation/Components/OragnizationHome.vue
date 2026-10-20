<script lang="ts" setup>
import '../styles/home-identity.css'
import { defineAsyncComponent } from 'vue'
import EmployeeTasksButton from '@/shared/HelpersComponents/EmployeeTasksButton.vue'
import ProjectsStatistics from './HomeStatistics/ProjectsStatistics.vue'
import HomeCards from './HomeUtils/HomeCards.vue'
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
import DashboardIcon from './Dashboard/DashboardIcon.vue'
import { useI18n } from 'vue-i18n'
import { useThemeMode } from '@/composables/useThemeMode'

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
const { locale } = useI18n()
const refreshing = ref(false)
const refreshedAt = ref<Date | null>(null)
const reportingMonth = computed(() =>
  new Intl.DateTimeFormat(locale.value, { month: 'long', year: 'numeric' }).format(new Date()),
)
const refreshTime = computed(() =>
  refreshedAt.value
    ? new Intl.DateTimeFormat(locale.value, { hour: 'numeric', minute: '2-digit' }).format(
        refreshedAt.value,
      )
    : '',
)

const ProgressValue = ref<number | null>(null)
const ProjectAppStatusStore = useProjectAppStatusStore()
const visited = ref(localStorage.getItem('visited'))
const fetchHomeInspectionController = FetchHomeInspectionController.getInstance()
const homeInspectionState = computed(() => fetchHomeInspectionController.state.value)
const indexProjectProgressController = IndexProjectProgressController.getInstance()
const indexProjectController = IndexProjectController.getInstance()
const ProjectStatics = computed(() => indexProjectController.state.value)
const projects = computed(() => ProjectStatics.value.data ?? [])
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

const refreshDashboard = async () => {
  if (refreshing.value) return
  refreshing.value = true
  try {
    await Promise.allSettled([
      GetEquipmentStatics(),
      fetchProject(),
      getProjectProgress(),
      GetHomeInspection(),
      fetchOverviewHazardChart(),
      fetchoverviewInvestigationsCharts(),
    ])
    refreshedAt.value = new Date()
  } finally {
    refreshing.value = false
  }
}
onMounted(() => {
  visited.value = localStorage.getItem('visited')
  void refreshDashboard()
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
    <header class="dashboard-hero">
      <div class="dashboard-hero__copy">
        <span class="dashboard-eyebrow"><i></i>{{ $t('Organization overview') }}</span>
        <h1>{{ $t('Your safety overview') }}</h1>
        <p>{{ $t('A clearer view of your people, projects, and safety performance.') }}</p>
      </div>
      <div class="dashboard-hero__actions">
        <span v-if="refreshTime" class="dashboard-refresh-time">{{
          $t('Last refreshed at', { time: refreshTime })
        }}</span
        ><button
          class="dashboard-refresh"
          type="button"
          :disabled="refreshing"
          :aria-busy="refreshing"
          @click="refreshDashboard"
        >
          <svg
            :class="{ 'is-refreshing': refreshing }"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.7"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M20 7v5h-5M4 17v-5h5M6 6a8 8 0 0 1 13 3M18 18a8 8 0 0 1-13-3" /></svg
          >{{ $t('Refresh overview') }}
        </button>
      </div>
    </header>
    <HomeCards :ProgressValue="Number(ProgressValue)" />

    <EmployeeTasksButton />
    <router-link
      @click="setVisited"
      to="/organization/project-progress"
      class="mb-5"
      :class="{ 'highlight-active': showOverlay && !visited }"
      v-if="(ProgressValue || ProgressValue == 0) && ProgressValue < 100"
    >
      <ProjectProgressHeader :progressValue="ProgressValue" style="margin-block: 20px" />
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
    </router-link>

    <div v-if="showOverlay && !visited" class="container-overlay"></div>

    <section class="home-analytics-shell" :aria-label="$t('Safety performance dashboard')">
      <div class="dashboard-section-heading">
        <div>
          <span class="dashboard-eyebrow">{{ $t('The monthly picture') }}</span>
          <h2>{{ $t('This month’s safety pulse') }}</h2>
        </div>
        <span class="dashboard-period"><DashboardIcon name="clock" />{{ reportingMonth }}</span>
      </div>
      <StaticsCardPerMonth :homeInspectionState="homeInspectionState" />
      <div class="dashboard-overview-grid">
        <ProjectsStatistics
          :projectStatistics="projects"
          :totalNumOfProjects="ProjectStatics.pagination?.total ?? undefined"
          :state="ProjectStatics"
        /><StaticCardsFullDetails :homeInspectionState="homeInspectionState" />
      </div>
      <EquipmentStaticss :EquipmentStatics="EquipmentStatics" />
      <InvestegationStatics
        :OverviewHazardChartstate="OverviewHazardChartstate"
        :overviewInvestigationsChartstate="overviewInvestigationsChartstate"
      />
    </section>
  </div>
</template>
