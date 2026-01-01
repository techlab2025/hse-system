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
</script>
<template>
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
        <HomeRoutesCard :img-src="CardProjectLogo" :title="`${$t('project')}`"
          :description="`${$t('plan')} . ${$t('tasks ')} . ${$t('hierarchy')}`" />
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
        <HomeRoutesCard :img-src="Operation" :title="`${$t('operations')}`"
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
        <HomeRoutesCard :img-src="EquipmentBag" :title="`${$t('equipment')}`"
          :description="`${$t('add')} . ${$t('assign_insepction ')} . ${$t('show')}  `" />
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
        <HomeRoutesCard :img-src="TeamLogo" :title="`${$t('employee')}`"
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
        <HomeRoutesCard :img-src="HomeSetting" :title="`${$t('setting')}`"
          :description="`${$t('hierarchy')} . ${$t('theme')} . ${$t('charts')} `" />
      </router-link>
    </PermissionBuilder>

  </div>

  <div class="home-statistics">
    <!-- <ProjectsStatistics :projectStatistics="state?.data" /> -->
  </div>
</template>
