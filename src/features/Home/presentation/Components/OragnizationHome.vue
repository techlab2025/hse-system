<script lang="ts" setup>
import CardProjectLogo from '@/assets/images/CardProjectLogo.png';
import Operation from '@/assets/images/Operation.png';
import DetectiveLogo from '@/assets/images/DetectiveLogo.png';
import EquipmentBag from '@/assets/images/EquipmentBag.png';
import TeamLogo from '@/assets/images/TeamLogo.png';
import HomeSetting from '@/assets/images/HomeSetting.png';
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum';
import HomeRoutesCard from './HomeUtils/HomeRoutesCard.vue';
import { RouterEnum } from '../../core/enums/SettingEnum/SettingEnum';
import ProjectsStatistics from './HomeStatistics/ProjectsStatistics.vue';
import FetchProjectStatisticsParams from '../../core/params/FetchProjectStatisticsParams';
import FetchPorjectStatisticsController from '../Controllers/FetchProjectStatisticsController';
import { onMounted, ref, watch } from 'vue';
import TopTeams from './HomeStatistics/TopTeams.vue';
import TotalMachines from './HomeStatistics/TotalMachines.vue';
import MostIncidantFactor from './HomeStatistics/MostIncidantFactor.vue';
import ObservatoinFactoryStatistics from './HomeStatistics/ObservatoinFactoryStatistics.vue';
import InvestegationStatics from './HomeStatistics/InvestegationStatics.vue';
import HomeProjectIcon from '@/shared/icons/HomeProjectIcon.vue';
import HomeOperationIcon from '@/shared/icons/HomeOperationIcon.vue';
import HomeEquipmentIcon from '@/shared/icons/HomeEquipmentIcon.vue';
import HomeEmployeeIcon from '@/shared/icons/HomeEmployeeIcon.vue';
import HomeSettingIcon from '@/shared/icons/HomeSettingIcon.vue';
import NumberOfProjects from './HomeStatistics/NumberOfProjects.vue';
import MachineStatics from './HomeStatistics/MachineStatics.vue';
import ProjectProgressHeader from '@/features/Organization/ProjectPrgoress/Presentation/supcomponents/ProjectProgressHeader.vue';
import IndexProjectProgressController from '@/features/Organization/ProjectPrgoress/Presentation/controllers/indexProjectProgressController';
import IndexProjectProgressParams from '@/features/Organization/ProjectPrgoress/Core/params/indexProjectProgressParams';

const fetchPorjectStatisticsController = FetchPorjectStatisticsController.getInstance()
const state = ref(fetchPorjectStatisticsController.state.value)


const GetProjectStatistics = async () => {  
  const fetchPorjectStatisticsParams = new FetchProjectStatisticsParams("", 1, 10, 1)
  await fetchPorjectStatisticsController.getData(fetchPorjectStatisticsParams)
}

onMounted(() => {
  GetProjectStatistics()
})

watch(() => fetchPorjectStatisticsController.state.value, (newState) => {
  state.value = newState
})

const ProgressValue = ref<number>(0)
const getProjectProgress = async () => {
  const indexProjectProgressController = IndexProjectProgressController.getInstance()
  const indexProjectProgressParams = new IndexProjectProgressParams("", 1, 10, 0)
  const response = await indexProjectProgressController.getData(indexProjectProgressParams)
  if (response.value?.data) {
    ProgressValue.value = response.value?.data?.progress
  }
}
onMounted(() => {
  getProjectProgress()
})


</script>
<template>
  <div class="mb-5">
    <ProjectProgressHeader :progressValue="ProgressValue" v-if="ProgressValue < 100" />
  </div>
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
      <router-link :to="`/organization/setting?type=${RouterEnum?.ORGANIZATION}`">
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
      <router-link :to="`/organization/capa`">
        <HomeRoutesCard :icon="HomeSettingIcon" :title="`${$t('capa')}`"
          :description="`${$t('incidents')} . ${$t('hazard')} . ${$t('capa')} `" />
      </router-link>
    </PermissionBuilder> -->

  </div>

  <div class="home-statistics gap-2">

    <ProjectsStatistics :projectStatistics="state?.data" />
    <TopTeams :topTeams="state.data?.topTeams" class="col-span-12 md:col-span-3" />
    <TotalMachines :totalMachines="state.data?.machines" class="col-span-12 md:col-span-6" />
    <MostIncidantFactor :incidantFactor="state.data?.incidantFactor" class="col-span-12 md:col-span-3" />
    <ObservatoinFactoryStatistics :totalMachines="state.data?.machines" class="col-span-12 md:col-span-8  "  />
     <InvestegationStatics class="col-span-12 md:col-span-4" />
        <!-- <NumberOfProjects :numberOfProjects="state.data?.numberOfProjects" class="col-span-12 md:col-span-3" /> -->
    <!-- <MachineStatics class="col-span-12 md:col-span-3" /> -->

  </div>


</template>

<style scoped>
.mb-5 {
  margin-block: 12px;
}
</style>
