<script lang="ts" setup>
import { PermissionsEnum } from '../users/Admin/Core/Enum/permission_enum';
import HomeRoutesCard from './HomeUtils/HomeRoutesCard.vue';
import CardProjectLogo from '@/assets/images/CardProjectLogo.png';
import Operation from '@/assets/images/Operation.png';
import DetectiveLogo from '@/assets/images/DetectiveLogo.png';
import EquipmentBag from '@/assets/images/EquipmentBag.png';
import TeamLogo from '@/assets/images/TeamLogo.png';
import HomeSetting from '@/assets/images/HomeSetting.png';

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
        <HomeRoutesCard :img-src="CardProjectLogo" :title="`project`" :description="`plan . tasks . hierarchy`" />
      </router-link>
    </PermissionBuilder>



    <PermissionBuilder :code="[
      PermissionsEnum.ORG_EQUIPMENT_MANGEMENT_ALL,
      PermissionsEnum.ORG_EQUIPMENT_MANGEMENT_CREATE,
      PermissionsEnum.ORG_EQUIPMENT_MANGEMENT_DELETE,
      PermissionsEnum.ORG_EQUIPMENT_MANGEMENT_FETCH,
      PermissionsEnum.ORG_EQUIPMENT_MANGEMENT_UPDATE,
    ]">
      <router-link to="/organization/equipment-mangement/all-observatin">
        <HomeRoutesCard :img-src="Operation" :title="`operation`"
          :description="`inspection . Observations . hazerd . incedant`" />
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
        <HomeRoutesCard :img-src="EquipmentBag" :title="`equipment`" :description="`add . assign insepction . show`" />
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
      <router-link to="/organization/organization-employee">
        <HomeRoutesCard :img-src="TeamLogo" :title="`employee`" :description="`add . show . edit . assign to`" />
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
      <router-link to="/organization/setting">
        <HomeRoutesCard :img-src="HomeSetting" :title="`setting`" :description="`hierarchy . theme . charts`" />
      </router-link>
    </PermissionBuilder>

  </div>
</template>
