<script setup lang="ts">
import HomeProjectIcon from '@/shared/icons/HomeProjectIcon.vue'
import HomeOperationIcon from '@/shared/icons/HomeOperationIcon.vue'
import HomeEquipmentIcon from '@/shared/icons/HomeEquipmentIcon.vue'
import HomeEmployeeIcon from '@/shared/icons/HomeEmployeeIcon.vue'
import HomeSettingIcon from '@/shared/icons/HomeSettingIcon.vue'
import HomeRoutesCard from './HomeRoutesCard.vue'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
import CapaIcon from '@/shared/icons/CapaIcon.vue'
import InvisttigationIcon from '@/shared/icons/InvisttigationIcon.vue'
import { RouterEnum } from '@/features/Home/core/enums/SettingEnum/SettingEnum'

const {ProgressValue} = defineProps<{
  ProgressValue: number
}>()
</script>

<template>
  <div class="home-routes-cards">
    <PermissionBuilder
      :code="[
        PermissionsEnum.PROJECT_ALL,
        PermissionsEnum.PROJECT_CREATE,
        PermissionsEnum.PROJECT_DELETE,
        PermissionsEnum.PROJECT_FETCH,
        PermissionsEnum.PROJECT_UPDATE,
        PermissionsEnum.PROJECT_DETAILS,
      ]"
    >
      <router-link to="/organization/projects">
        <HomeRoutesCard
          :icon="HomeProjectIcon"
          :title="`${$t('project')}`"
          :description="`${$t('plan')} . ${$t('tasks')} . ${$t('hierarchy')}`"
        />
      </router-link>
    </PermissionBuilder>

    <PermissionBuilder
      :code="[
        PermissionsEnum.ORG_EQUIPMENT_MANGEMENT_ALL,
        PermissionsEnum.ORG_EQUIPMENT_MANGEMENT_CREATE,
        PermissionsEnum.ORG_EQUIPMENT_MANGEMENT_DELETE,
        PermissionsEnum.ORG_EQUIPMENT_MANGEMENT_FETCH,
        PermissionsEnum.ORG_EQUIPMENT_MANGEMENT_UPDATE,
      ]"
    >
      <router-link
        :to="`/organization/equipment-mangement/all-observatin?type=${RouterEnum?.OPERATION}`"
      >
        <HomeRoutesCard
          :icon="HomeOperationIcon"
          :title="`${$t('operations')}`"
          :description="`${$t('inspection')} . ${$t('Observations ')} . ${$t('hazerd')} . ${$t('incedant')} `"
        />
      </router-link>
    </PermissionBuilder>

    <PermissionBuilder
      :code="[
        PermissionsEnum.ORG_EQUIPMENT_ALL,
        PermissionsEnum.ORG_EQUIPMENT_CREATE,
        PermissionsEnum.ORG_EQUIPMENT_DELETE,
        PermissionsEnum.ORG_EQUIPMENT_FETCH,
        PermissionsEnum.ORG_EQUIPMENT_UPDATE,
      ]"
    >
      <router-link to="/organization/equipments">
        <HomeRoutesCard
          :icon="HomeEquipmentIcon"
          :title="`${$t('equipment')}`"
          :description="`${$t('add')} . ${$t('assign_insepction')} . ${$t('show')}  `"
        />
      </router-link>
    </PermissionBuilder>

    <PermissionBuilder
      :code="[
        PermissionsEnum.ORG_EMPLOYEE_ALL,
        PermissionsEnum.ORG_EMPLOYEE_CREATE,
        PermissionsEnum.ORG_EMPLOYEE_DELETE,
        PermissionsEnum.ORG_EMPLOYEE_FETCH,
        PermissionsEnum.ORG_EMPLOYEE_UPDATE,
        PermissionsEnum.ORG_EMPLOYEE_DETAILS,
      ]"
    >
      <router-link :to="`/organization/organization-employee?type=${RouterEnum?.EMPLOYEES}`">
        <HomeRoutesCard
          :icon="HomeEmployeeIcon"
          :title="`${$t('employee')}`"
          :description="`${$t('add')} . ${$t('show')} . ${$t('edit')} . ${$t('assign_to')}`"
        />
      </router-link>
    </PermissionBuilder>

    <PermissionBuilder
      :code="[
        PermissionsEnum.ORG_EMPLOYEE_ALL,
        PermissionsEnum.ORG_EMPLOYEE_CREATE,
        PermissionsEnum.ORG_EMPLOYEE_DELETE,
        PermissionsEnum.ORG_EMPLOYEE_FETCH,
        PermissionsEnum.ORG_EMPLOYEE_UPDATE,
        PermissionsEnum.ORG_EMPLOYEE_DETAILS,
      ]"
    >
      <router-link
        :to="
          ProgressValue == 100
            ? `/organization/certificate?type=1`
            : `/organization/project-progress`
        "
      >
        <HomeRoutesCard
          :icon="HomeSettingIcon"
          :title="`${$t('settings')}`"
          :description="`${$t('hierarchy')} . ${$t('theme')} . ${$t('charts')} `"
        />
      </router-link>
    </PermissionBuilder>

    <PermissionBuilder
      :code="[
        PermissionsEnum.ORG_EMPLOYEE_ALL,
        PermissionsEnum.ORG_EMPLOYEE_CREATE,
        PermissionsEnum.ORG_EMPLOYEE_DELETE,
        PermissionsEnum.ORG_EMPLOYEE_FETCH,
        PermissionsEnum.ORG_EMPLOYEE_UPDATE,
        PermissionsEnum.ORG_EMPLOYEE_DETAILS,
      ]"
    >
      <router-link :to="`/organization/Investigating`">
        <HomeRoutesCard
          :icon="InvisttigationIcon"
          :title="`${$t('investigation')}`"
          :description="`${$t('meetings')} . ${$t('tasks')} . ${$t('create')} `"
        />
      </router-link>
    </PermissionBuilder>

    <PermissionBuilder
      :code="[
        PermissionsEnum.ORG_EMPLOYEE_ALL,
        PermissionsEnum.ORG_EMPLOYEE_CREATE,
        PermissionsEnum.ORG_EMPLOYEE_DELETE,
        PermissionsEnum.ORG_EMPLOYEE_FETCH,
        PermissionsEnum.ORG_EMPLOYEE_UPDATE,
        PermissionsEnum.ORG_EMPLOYEE_DETAILS,
      ]"
    >
      <router-link :to="`/organization/capa`">
        <HomeRoutesCard
          :icon="CapaIcon"
          :title="`${$t('capa')}`"
          :description="`${$t('incidents')} . ${$t('hazard')} . ${$t('capa')} `"
        />
      </router-link>
    </PermissionBuilder>
  </div>
</template>
