<script lang="ts" setup>
import CardProjectLogo from '@/assets/images/CardProjectLogo.png'
import Operation from '@/assets/images/Operation.png'
import DetectiveLogo from '@/assets/images/DetectiveLogo.png'
import EquipmentBag from '@/assets/images/EquipmentBag.png'
import TeamLogo from '@/assets/images/TeamLogo.png'
import HomeSetting from '@/assets/images/HomeSetting.png'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
import HomeRoutesCard from './HomeUtils/HomeRoutesCard.vue'
import { RouterEnum } from '../../core/enums/SettingEnum/SettingEnum'
import ProjectsStatistics from './HomeStatistics/ProjectsStatistics.vue'
import FetchProjectStatisticsParams from '../../core/params/FetchProjectStatisticsParams'
import FetchPorjectStatisticsController from '../Controllers/FetchProjectStatisticsController'
import { computed, onMounted, ref, watch } from 'vue'
import TopTeams from './HomeStatistics/TopTeams.vue'
import TotalMachines from './HomeStatistics/TotalMachines.vue'
import MostIncidantFactor from './HomeStatistics/MostIncidantFactor.vue'
import ObservatoinFactoryStatistics from './HomeStatistics/ObservatoinFactoryStatistics.vue'
import InvestegationStatics from './HomeStatistics/InvestegationStatics.vue'
import HomeProjectIcon from '@/shared/icons/HomeProjectIcon.vue'
import HomeOperationIcon from '@/shared/icons/HomeOperationIcon.vue'
import HomeEquipmentIcon from '@/shared/icons/HomeEquipmentIcon.vue'
import HomeEmployeeIcon from '@/shared/icons/HomeEmployeeIcon.vue'
import HomeSettingIcon from '@/shared/icons/HomeSettingIcon.vue'
import NumberOfProjects from './HomeStatistics/NumberOfProjects.vue';
import MachineStatics from './HomeStatistics/MachineStatics.vue';
import ProjectProgressHeader from '@/features/Organization/ProjectPrgoress/Presentation/supcomponents/ProjectProgressHeader.vue';
import IndexProjectProgressController from '@/features/Organization/ProjectPrgoress/Presentation/controllers/indexProjectProgressController';
import IndexProjectProgressParams from '@/features/Organization/ProjectPrgoress/Core/params/indexProjectProgressParams';
import HeaderCard from './HomeStatistics/HeaderCard.vue'
import GenderStatistics from './HomeStatistics/GenderStatistics.vue'
import InvisttigationIcon from '@/shared/icons/InvisttigationIcon.vue'
import { useProjectAppStatusStore } from '@/stores/ProjectStatus'
import ProjectCard from '@/features/Organization/Project/Presentation/components/ProjectUtils/ProjectCard.vue'
import IndexProjectController from '@/features/Organization/Project/Presentation/controllers/indexProjectController'
import IndexProjectParams from '@/features/Organization/Project/Core/params/indexProjectParams'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import TableLoader from '@/shared/DataStatues/TableLoader.vue'
import DataEmpty from '@/shared/DataStatues/DataEmpty.vue'
import ProjectCardSkelaton from '@/features/Organization/Project/Presentation/components/ProjectUtils/ProjectCardSkelaton.vue'
import ToatlInsedant from './HomeStatistics/ToatlInsedant.vue'
import FetchHomeInspectionController from '../Controllers/FetchHomeInspectionController'
import FetchHomeInspectionParams from '../../core/params/FetchHomeInspectionParams'
import OverviewHazardChartController from '../Controllers/OverviewHazardChartController'
import OverviewHazardChartParams from '../../core/params/OverviewHazardChartParams'
import OverviewInvestigationsChartController from '../Controllers/OverviewInvestigationsChartController'
import FetchEquipmentStaticsController from '../Controllers/FetchEquipmentStaticsController'
import FetchEquipmentStaticsParams from '../../core/params/FetchEquipmentStaticsParams'


const fetchPorjectStatisticsController = FetchPorjectStatisticsController.getInstance()
const state = ref(fetchPorjectStatisticsController.state.value)

const GetProjectStatistics = async () => {
  const fetchPorjectStatisticsParams = new FetchProjectStatisticsParams('', 1, 10, 1)
  await fetchPorjectStatisticsController.getData(fetchPorjectStatisticsParams)
}

// onMounted(() => {
//   GetProjectStatistics()
// })

const ProgressValue = ref<number | null>(null)
const ProjectAppStatusStore = useProjectAppStatusStore()
const visited = ref(localStorage.getItem("visited"))

// fetchHomeInspectionController
const fetchHomeInspectionController = FetchHomeInspectionController.getInstance()
const homeInspectionState = ref(fetchHomeInspectionController.state.value)
const GetHomeInspection = async () => {
  const fetchHomeInspectionParams = new FetchHomeInspectionParams()
  await fetchHomeInspectionController.getData(fetchHomeInspectionParams)
}


const indexProjectProgressController = IndexProjectProgressController.getInstance()
const getProjectProgress = async () => {
  const indexProjectProgressParams = new IndexProjectProgressParams("", 1, 10, 0)
  const response = await indexProjectProgressController.getData(indexProjectProgressParams)
  if (response.value?.data) {
    console.log(response.value.data, "dadadad");
    ProgressValue.value = response.value?.data?.progress
    ProjectAppStatusStore.setProjectAppStatus(response.value?.data)
    console.log(response.value?.data?.progress, "response.value?.data?.progress");
  }
}

const showOverlay = computed(() => {
  return (ProgressValue.value == 0)
})
const setVisited = () => {
  localStorage.setItem("visited", "true")
}



// Project Statics Start
const indexProjectController = IndexProjectController.getInstance()
const ProjectStatics = ref(indexProjectController.state.value)

const fetchProject = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 0
) => {
  const indexProjects = new IndexProjectParams(query, pageNumber, perPage, withPage)
  await indexProjectController.getData(indexProjects)
}



// overview hazard chart
// const overviewHazardChartController = OverviewHazardChartController.getInstance()
// const OverviewHazardChart = ref(overviewHazardChartController.state.value)
// const fetchOverviewHazardChart = async () => {
//   const overviewHazardChartParams = new OverviewHazardChartParams()
//   await overviewHazardChartController.getData(overviewHazardChartParams)
// }
// onMounted(() => {
//   fetchOverviewHazardChart()
// })
// watch(() => overviewHazardChartController.state.value, (newVal) => {
//   if (newVal) {
//     OverviewHazardChart.value = newVal
//   }
// })
// overview investigations chart
// const overviewInvestigationsChartController = OverviewInvestigationsChartController.getInstance()
// const overviewInvestigationsChartstate = ref(overviewInvestigationsChartController.state.value)
// const fetchoverviewInvestigationsCharts = async()=>{
//   const overviewInvestigationsChartParams = new OverviewInvestigationsChartParams()
//   await overviewInvestigationsChartController.getData(overviewInvestigationsChartParams)

// }
// onMounted(()=>{
//   fetchoverviewInvestigationsCharts()
// })
// watch(()=>overviewInvestigationsChartController.state.value,(newVal)=>{
//   if(newVal){
//     overviewInvestigationsChartstate.value = newVal
//   }
// })



const fetchEquipmentStaticsController = FetchEquipmentStaticsController.getInstance()
const EquipmentStatics = ref(fetchEquipmentStaticsController.state.value)
const GetEquipmentStatics = async () => {
  const fetchEquipmentStaticsParams = new FetchEquipmentStaticsParams()
  await fetchEquipmentStaticsController.getData(fetchEquipmentStaticsParams)
}


// onMounted(() => {
//   GetEquipmentStatics()
// })
// onMounted(() => {
//   fetchProject()
// })
// onMounted(() => {
//   visited.value = localStorage.getItem("visited")
//   if (visited.value) {
//     setVisited()
//   }
// })
// onMounted(() => {
//   getProjectProgress()
// })
// onMounted(() => {
//   GetHomeInspection()
// })

// Home OnMounted
onMounted(() => {
  GetEquipmentStatics()
  fetchProject()
  visited.value = localStorage.getItem("visited")
  if (visited.value) {
    setVisited()
  }
  getProjectProgress()
  GetHomeInspection()
})


// Home Watchers
watch(() => fetchEquipmentStaticsController.state.value, (newVal) => {
  if (newVal) {
    EquipmentStatics.value = newVal
  }
})

watch(() => indexProjectController.state.value, (newVal) => {
  if (newVal) {
    ProjectStatics.value = newVal
  }
})

watch(() => indexProjectProgressController.state.value.data, (newVal) => {
  if (newVal) {
    ProjectAppStatusStore.setProjectAppStatus(newVal)
  }
})

watch(() => fetchPorjectStatisticsController.state.value, (newState) => {
  state.value = newState
})

watch(() => fetchHomeInspectionController.state.value, (newState) => {
  homeInspectionState.value = newState
})

</script>
<template>
  <router-link @click="setVisited" to="/organization/project-progress" class="mb-5"
    :class="{ 'highlight-active': showOverlay && !visited }"
    v-if="(ProgressValue || ProgressValue == 0) && (ProgressValue < 100)">
    <ProjectProgressHeader :progressValue="ProgressValue" style="margin-block: 20px;" />

    <div v-if="showOverlay && !visited" class="overlay-note sidebar-note">
      <h3>Step 1: Click Here To Start Adding Your Data</h3>
      <p>Fill All Data From this page</p>
      <!-- <button @click="goToContentNote" class="ok-btn">Next Tip</button> -->
    </div>
  </router-link>
  <!-- <HeaderCard /> -->
  <!-- <div class="home-routes-cards"> -->
  <div v-if="showOverlay && !visited" class="container-overlay"></div>

  <div class="home-routes-cards">
    <PermissionBuilder :code="[
      PermissionsEnum.PROJECT_ALL,
      PermissionsEnum.PROJECT_CREATE,
      PermissionsEnum.PROJECT_DELETE,
      PermissionsEnum.PROJECT_FETCH,
      PermissionsEnum.PROJECT_UPDATE,
      PermissionsEnum.PROJECT_DETAILS,
    ]">
      <router-link to="/organization/projects">
        <HomeRoutesCard :icon="HomeProjectIcon" :title="`${$t('project')}`"
          :description="`${$t('plan')} . ${$t('tasks')} . ${$t('hierarchy')}`" />
      </router-link>
    </PermissionBuilder>

    <PermissionBuilder :code="[
      PermissionsEnum.ORG_EQUIPMENT_MANGEMENT_ALL,
      PermissionsEnum.ORG_EQUIPMENT_MANGEMENT_CREATE,
      PermissionsEnum.ORG_EQUIPMENT_MANGEMENT_DELETE,
      PermissionsEnum.ORG_EQUIPMENT_MANGEMENT_FETCH,
      PermissionsEnum.ORG_EQUIPMENT_MANGEMENT_UPDATE,
    ]">
      <router-link :to="`/organization/equipment-mangement/all-observatin?type=${RouterEnum?.OPERATION}`">
        <HomeRoutesCard :icon="HomeOperationIcon" :title="`${$t('operations')}`"
          :description="`${$t('inspection')} . ${$t('Observations ')} . ${$t('hazerd')} . ${$t('incedant')} `" />
      </router-link>
    </PermissionBuilder>
    <!-- <PermissionBuilder :code="[
      PermissionsEnum.ORG_EQUIPMENT_MANGEMENT_ALL,
      PermissionsEnum.ORG_EQUIPMENT_MANGEMENT_CREATE,
      PermissionsEnum.ORG_EQUIPMENT_MANGEMENT_DELETE,
      PermissionsEnum.ORG_EQUIPMENT_MANGEMENT_FETCH,
      PermissionsEnum.ORG_EQUIPMENT_MANGEMENT_UPDATE,
    ]">
      <router-link to="/organization/equipment-mangement/all-observatin">
        <HomeRoutesCard :img-src="DetectiveLogo" :title="`investigation`" :description="`meetings . tasks . create`" />
      </router-link>
    </PermissionBuilder> -->

    <PermissionBuilder :code="[
      PermissionsEnum.ORG_EQUIPMENT_ALL,
      PermissionsEnum.ORG_EQUIPMENT_CREATE,
      PermissionsEnum.ORG_EQUIPMENT_DELETE,
      PermissionsEnum.ORG_EQUIPMENT_FETCH,
      PermissionsEnum.ORG_EQUIPMENT_UPDATE,
    ]">
      <router-link to="/organization/equipments">
        <HomeRoutesCard :icon="HomeEquipmentIcon" :title="`${$t('equipment')}`"
          :description="`${$t('add')} . ${$t('assign_insepction')} . ${$t('show')}  `" />
      </router-link>
    </PermissionBuilder>

    <PermissionBuilder :code="[
      PermissionsEnum.ORG_EMPLOYEE_ALL,
      PermissionsEnum.ORG_EMPLOYEE_CREATE,
      PermissionsEnum.ORG_EMPLOYEE_DELETE,
      PermissionsEnum.ORG_EMPLOYEE_FETCH,
      PermissionsEnum.ORG_EMPLOYEE_UPDATE,
      PermissionsEnum.ORG_EMPLOYEE_DETAILS,
    ]">
      <router-link :to="`/organization/organization-employee?type=${RouterEnum?.EMPLOYEES}`">
        <HomeRoutesCard :icon="HomeEmployeeIcon" :title="`${$t('employee')}`"
          :description="`${$t('add')} . ${$t('show')} . ${$t('edit')} . ${$t('assign_to')}`" />
      </router-link>
    </PermissionBuilder>

    <PermissionBuilder :code="[
      PermissionsEnum.ORG_EMPLOYEE_ALL,
      PermissionsEnum.ORG_EMPLOYEE_CREATE,
      PermissionsEnum.ORG_EMPLOYEE_DELETE,
      PermissionsEnum.ORG_EMPLOYEE_FETCH,
      PermissionsEnum.ORG_EMPLOYEE_UPDATE,
      PermissionsEnum.ORG_EMPLOYEE_DETAILS,
    ]">
      <!-- /organization?setting=1 -->
      <router-link :to="ProgressValue == 100 ? `/organization/certificate?type=1` : `/organization/project-progress`">
        <HomeRoutesCard :icon="HomeSettingIcon" :title="`${$t('settings')}`"
          :description="`${$t('hierarchy')} . ${$t('theme')} . ${$t('charts')} `" />
      </router-link>
    </PermissionBuilder>
    <!-- <PermissionBuilder :code="[
      PermissionsEnum.ORG_EMPLOYEE_ALL,
      PermissionsEnum.ORG_EMPLOYEE_CREATE,
      PermissionsEnum.ORG_EMPLOYEE_DELETE,
      PermissionsEnum.ORG_EMPLOYEE_FETCH,
      PermissionsEnum.ORG_EMPLOYEE_UPDATE,
      PermissionsEnum.ORG_EMPLOYEE_DETAILS,
    ]">
      <router-link :to="`/organization/Investigating`">
        <HomeRoutesCard :icon="InvisttigationIcon" :title="`${$t('investigation')}`"
          :description="`${$t('meetings')} . ${$t('tasks')} . ${$t('create')} `" />
      </router-link>
    </PermissionBuilder> -->


    <!-- <PermissionBuilder :code="[
      PermissionsEnum.ORG_EMPLOYEE_ALL,
      PermissionsEnum.ORG_EMPLOYEE_CREATE,
      PermissionsEnum.ORG_EMPLOYEE_DELETE,
      PermissionsEnum.ORG_EMPLOYEE_FETCH,
      PermissionsEnum.ORG_EMPLOYEE_UPDATE,
      PermissionsEnum.ORG_EMPLOYEE_DETAILS,
    ]">
      <router-link :to="`/organization/capa`">
        <HomeRoutesCard :icon="HomeSettingIcon" :title="`${$t('capa')}`"
          :description="`${$t('incidents')} . ${$t('hazard')} . ${$t('capa')} `" />
      </router-link>
    </PermissionBuilder> -->


  </div>


  <div class=statics>
    <ProjectsStatistics :projectStatistics="ProjectStatics?.data" />
    <div class="all-total-insedents">

      <ToatlInsedant :totalInsedant="homeInspectionState?.data?.totalIncidents" :title="`${$t('Total Incidents')}`"
        :subTitle="`${$t('per this month')}`" textClass="ToatlInsedant-one"
        link="/organization/equipment-mangement/incedant?isAll=1" />
      <ToatlInsedant :totalInsedant="homeInspectionState?.data?.totalInspection"
        :title="`${$t('High Severity Events')}`" :subTitle="`${$t('per this month')}`" textClass="ToatlInsedant-two"
        link="/organization/equipment-mangement/observation?isAll=1&type=2" />
      <ToatlInsedant :totalInsedant="homeInspectionState?.data?.inspectionCompliancePercentage"
        :title="`${$t('Inspection Compliance')}`" :subTitle="`${$t('per this month')}`" textClass="ToatlInsedant-three"
        link="/organization/equipment-mangement/inspection?inspectionType=1" />
      <ToatlInsedant :totalInsedant="homeInspectionState?.data?.openCorrectiveActions"
        :title="`${$t('Open Corrective Actions')}`" :subTitle="`${$t('per this month')}`"
        textClass="ToatlInsedant-four" />

    </div>
    <div class="most-incidat-factor">
      <MostIncidantFactor :title="$t('high-risk hazards unmitigated')" :data="[
        {
          value: homeInspectionState?.data?.Hazard[0]?.count,
          label: homeInspectionState?.data?.Hazard[0]?.hazard_title,
          spanClass: 'ToatlInsedant-one',
          link: `/organization/equipment-mangement/observation?isAll=1&type=2&hazard=${homeInspectionState?.data?.Hazard[0]?.hazard_id}`
        },
        {
          value: homeInspectionState?.data?.Hazard[1]?.count,
          label: homeInspectionState?.data?.Hazard[1]?.hazard_title,
          spanClass: 'ToatlInsedant-two',
          link: `/organization/equipment-mangement/observation?isAll=1&type=2&hazard=${homeInspectionState?.data?.Hazard[1]?.hazard_id}`
        },
        {
          value: homeInspectionState?.data?.Hazard[2]?.count,
          label: homeInspectionState?.data?.Hazard[2]?.hazard_title,
          spanClass: 'ToatlInsedant-three',
          link: `/organization/equipment-mangement/observation?isAll=1&type=2&hazard=${homeInspectionState?.data?.Hazard[2]?.hazard_id}`
        },
        // {
        //   value: homeInspectionState?.data?.Hazard[3]?.count,
        //   label: homeInspectionState?.data?.Hazard[3]?.hazard_title,
        //   spanClass: 'ToatlInsedant-three'
        // }
      ]" />
      <MostIncidantFactor :title="$t('Employee certificates status')" :data="[
        {
          value: homeInspectionState?.data?.employeeCertificates?.expired,
          label: `${$t('Expired')}`,
          spanClass: 'Expired',
          divClass: 'ExpiredClass',
          link: '/organization/employee-certificate'
        },
        {
          value: homeInspectionState?.data?.employeeCertificates?.inactive,
          label: `${$t('need to take')}`,
          spanClass: 'more-time',
          divClass: 'more-time-class',
          link: '/organization/employee-certificate'
        },
      ]" />
      <MostIncidantFactor :title="$t('Inspections status')" :data="[
        {
          value: homeInspectionState?.data?.Inspection?.completed,
          label: `${$t('finished')}`,
          spanClass: 'finished',
          divClass: 'finished-class'
        },
        {
          value: homeInspectionState?.data?.Inspection?.inProgress,
          label: `${$t('in progress')}`,
          spanClass: 'in-progress',
          divClass: 'in-progress-class'
        },
        {
          value: homeInspectionState?.data?.Inspection?.delayed,
          label: `${$t('duration-ended')}`,
          spanClass: 'duration-ended',
          divClass: 'duration-ended-class'
        },
      ]" />
      <MostIncidantFactor :title="$t('most used root causes')" :data="[
        {
          value: homeInspectionState?.data?.MostUsed[0]?.count,
          label: homeInspectionState?.data?.MostUsed[0]?.rootCauseTitle,
          spanClass: 'ToatlInsedant-one',
          link: `/organization/equipment-mangement/incedant?isAll=1&rootCause=${homeInspectionState?.data?.MostUsed[0]?.id}`
        },
        {
          value: homeInspectionState?.data?.MostUsed[1]?.count,
          label: homeInspectionState?.data?.MostUsed[1]?.rootCauseTitle,
          spanClass: 'ToatlInsedant-two',
          link: `/organization/equipment-mangement/incedant?isAll=1&rootCause=${homeInspectionState?.data?.MostUsed[1]?.id}`

        },
        {
          value: homeInspectionState?.data?.MostUsed[2]?.count,
          label: homeInspectionState?.data?.MostUsed[2]?.rootCauseTitle,
          spanClass: 'ToatlInsedant-three',
          link: `/organization/equipment-mangement/incedant?isAll=1&rootCause=${homeInspectionState?.data?.MostUsed[2]?.id}`

        }
      ]" />
    </div>
  </div>


  <!-- end -->

  <div class="flex gap-4 statics">
    <TotalMachines :totalMachines="EquipmentStatics.data?.statics" class="col-span-12 md:col-span-6" />
    <MachineStatics :statics="EquipmentStatics.data?.rentEquipments" class="col-span-12 md:col-span-3" />
  </div>

  <!-- <TopTeams :topTeams="state.data?.topTeams" class="col-span-12 md:col-span-3" />
    <TotalMachines :totalMachines="state.data?.machines" class="col-span-12 md:col-span-6" />


    <TopTeams :topTeams="state.data?.topTeams" class="col-span-12 md:col-span-3" />




    <MostIncidantFactor :incidantFactor="state.data?.incidantFactor" class="col-span-12 md:col-span-3" />
    <ObservatoinFactoryStatistics :totalMachines="state.data?.machines" class="col-span-12 md:col-span-8" />
    <InvestegationStatics class="col-span-12 md:col-span-4" />
    <NumberOfProjects :numberOfProjects="state.data?.numberOfProjects" class="col-span-12 md:col-span-3" />
    <MachineStatics class="col-span-12 md:col-span-3" />
    <GenderStatistics class="col-span-12 md:col-span-6" /> -->

  <!-- </div> -->
</template>

<style scoped>
.statics {

  margin-top: 20px;
}

.mb-5 {
  margin-block: 12px;
}


.container-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(6px);
  z-index: 998;
  pointer-events: all;
}

.highlight-active {
  position: relative !important;
  z-index: 999 !important;
  background: white;
  border-radius: 12px;
  box-shadow: 0 0 40px rgba(0, 0, 0, 0.11);
  pointer-events: all;
}

.overlay-note {
  position: absolute;
  width: 320px;
  background: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
  z-index: 1000;
  animation: fadeIn 0.4s ease-out;
}

.overlay-note h3 {
  color: #1d4ed8;
  font-weight: 700;
  font-size: 20px;
  margin-bottom: 8px;
}

.overlay-note p {
  color: #4b5563;
  font-size: 15px;
  line-height: 1.5;
  margin-bottom: 16px;
}
</style>
