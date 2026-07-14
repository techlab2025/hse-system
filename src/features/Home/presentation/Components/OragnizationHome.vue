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
const HomeCards = defineAsyncComponent(() => import('./HomeUtils/HomeCards.vue'))
const { isDarkMode } = useThemeMode()

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
  <div :class="['home-page organization-home-page', { 'is-dark': isDarkMode }]">
    <router-link
      @click="setVisited"
      to="/organization/project-progress"
      class="mb-5"
      :class="{ 'highlight-active': showOverlay && !visited }"
      v-if="(ProgressValue || ProgressValue == 0) && ProgressValue < 100"
    >
      <ProjectProgressHeader :progressValue="ProgressValue" style="margin-block: 20px" />
      <div v-if="showOverlay && !visited" class="overlay-note sidebar-note">
        <span class="tip-kicker">Step 1 of 3</span>
        <h3>{{ $t('Step_1_Click_Here_To_Start_Adding_Your_Data') }}</h3>
        <p>{{ $t('Fill_All_Data_From_this_page') }}</p>
        <div class="tip-progress" aria-hidden="true">
          <span class="active"></span>
          <span></span>
          <span></span>
        </div>
        <span class="tip-action">Click this setup card to continue</span>
      </div>
    </router-link>

    <div v-if="showOverlay && !visited" class="container-overlay"></div>

    <HomeCards :ProgressValue="Number(ProgressValue)" />

    <template v-if="ProjectStatics?.data">
      <section class="home-analytics-shell">
        <!-- <div class="home-analytics-heading">
          <span>{{ $t('dashboard') }}</span>
          <h2>{{ $t('overview') }}</h2>
        </div> -->

        <div class="home-overview-grid">
          <div class="home-panel home-panel-projects">
            <ProjectsStatistics :projectStatistics="ProjectStatics?.data" />
          </div>

          <div class="home-panel home-panel-kpis">
            <StaticsCardPerMonth :homeInspectionState="homeInspectionState" />
          </div>

          <div class="home-panel home-panel-details">
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
    <HomeSkelaton v-if="!ProjectStatics?.data" />
  </div>
</template>

<style scoped lang="scss">
.home-analytics-shell {
  display: flex;
  flex-direction: column;
  gap: 22px;
  min-width: 0;
  margin-top: 24px;
}

.home-analytics-heading {
  display: flex;
  flex-direction: column;
  gap: 4px;

  span {
    width: fit-content;
    padding: 6px 12px;
    border: 1px solid color-mix(in srgb, var(--PrimaryColor) 16%, transparent);
    border-radius: 999px;
    background: color-mix(in srgb, var(--PrimaryColor) 8%, transparent);
    color: var(--PrimaryColor);
    font-size: 12px;
    font-weight: 900;
  }

  h2 {
    margin: 0;
    color: var(--header-page-color);
    font-family: 'bold';
    font-size: clamp(22px, 2vw, 30px);
    font-weight: 900;
  }
}

.home-overview-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 18px;
  align-items: stretch;
  min-width: 0;
}

.home-panel {
  min-width: 0;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--main-border) 78%, transparent);
  border-radius: 24px;
  background:
    radial-gradient(
      circle at 100% 0%,
      color-mix(in srgb, var(--PrimaryColor) 8%, transparent),
      transparent 38%
    ),
    linear-gradient(180deg, var(--BgWhite), var(--Gray-1));
  box-shadow:
    0 1px 2px color-mix(in srgb, var(--brand-primary-900) 4%, transparent),
    0 18px 42px color-mix(in srgb, var(--brand-primary-900) 7%, transparent);
}

.organization-home-page.is-dark {
  .home-panel {
    border-color: var(--main-border);
    background:
      radial-gradient(
        circle at 100% 0%,
        color-mix(in srgb, var(--PrimaryColor) 12%, transparent),
        transparent 40%
      ),
      linear-gradient(180deg, var(--surface-1), var(--surface-2));
    box-shadow: 0 18px 42px color-mix(in srgb, var(--text-strong) 22%, transparent);
  }

  .home-analytics-heading h2 {
    color: var(--text-strong);
  }

  :deep(.project-statistics .header) {
    border-color: var(--main-border) !important;
    background:
      linear-gradient(
        180deg,
        color-mix(in srgb, var(--PrimaryColor) 7%, transparent),
        transparent
      ),
      var(--surface-1) !important;
  }

  :deep(.project-statistics .header-img) {
    background-color: color-mix(in srgb, var(--PrimaryColor) 14%, var(--surface-2)) !important;
    border: 1px solid var(--main-border);
  }

  :deep(.project-statistics .title-content .title) {
    color: var(--text-strong) !important;
  }

  :deep(.project-statistics .title-content .description) {
    color: var(--text-soft) !important;
  }

  :deep(.project-statistics .title-content .count) {
    background-color: var(--surface-2) !important;
    border-color: var(--main-border) !important;
    color: var(--text-soft) !important;
  }

  :deep(.project-statistics .title-content .counter) {
    color: var(--PrimaryColor) !important;
  }
}

.home-panel-projects {
  grid-row: auto;
}

.home-panel-kpis,
.home-panel-details {
  padding: 14px;
}

@media (max-width: 640px) {
  .home-analytics-shell {
    gap: 16px;
    margin-top: 16px;
  }

  .home-panel {
    border-radius: 18px;
  }

  .home-panel-kpis,
  .home-panel-details {
    padding: 10px;
  }
}
</style>
