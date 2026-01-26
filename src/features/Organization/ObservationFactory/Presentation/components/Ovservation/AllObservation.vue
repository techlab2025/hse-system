<script setup lang="ts">

import ObservationCard from './cards/ObservationCard.vue'
import Political from "@/assets/images/Political.png"
import ALERT from "@/assets/images/ALERT.png"
import PoliceLine from "@/assets/images/PoliceLine.png"
import ToDoLogo from "@/assets/images/ToDoLogo.png"
import { InspectionPageType, InspectionType } from '../../../Core/Enums/InspectionTypeEnum'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
import PermissionBuilder from '@/shared/HelpersComponents/PermissionBuilder.vue'

const items = [
  {
    title: 'Inspection',
    image: ToDoLogo,
    addRoute: '/organization/equipment-mangement/inspection/add',
    // indexRoute: '/organization/equipment-mangement/inspection?isAll=1',
    // overdueRoute: '/organization/equipment-mangement/inspection/overdue?isAll=1',
    inspectionFormRoute: `/organization/equipment-mangement/inspection?inspectionType=${InspectionPageType.InspectionForm}`,
    dragInspectionRoute: `/organization/equipment-mangement/inspection?inspectionType=${InspectionPageType.DragInspection}`,
    resultInspectionRoute: `/organization/equipment-mangement/inspection?inspectionType=${InspectionPageType.Result}`,
    description: 'Add . show',
    AddPermissions: [
      PermissionsEnum.ADMIN,
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum.ORG_INSPECTION_CREATE,
      PermissionsEnum.ORG_INSPECTION_ALL,
      PermissionsEnum.TASK_CREATE,
      PermissionsEnum.ORG_INSPECTION_CREATE,
    ],
    indexPermissions: [
      PermissionsEnum.ADMIN,
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum.ORG_INSPECTION_FETCH,
      PermissionsEnum.ORG_INSPECTION_ALL,
      PermissionsEnum.TASK_FETCH,
    ],
    DragInspectionPermissions: [
      PermissionsEnum.ADMIN,
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum.MY_TASKS_ALL,
      PermissionsEnum.ORG_INSPECTION_ALL,
    ],
    inspectionsResultsPermissions: [
      PermissionsEnum.ADMIN,
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum.INSPECTION_RESULTS_FETCH,
      PermissionsEnum.ORG_INSPECTION_ALL,
    ],

  },
  {
    title: 'Observation',
    image: Political,
    addRoute: '/organization/equipment-mangement/observation/add',
    indexRoute: '/organization/equipment-mangement/observation?isAll=1',
    description: 'Add . show',
    AddPermissions: [
      PermissionsEnum.ADMIN,
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum.ORG_OBSERVATION_CREATE,
      PermissionsEnum.ORG_OBSERVATION_ALL,
    ],
    indexPermissions: [
      PermissionsEnum.ADMIN,
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum.ORG_OBSERVATION_FETCH,
      PermissionsEnum.ORG_OBSERVATION_ALL,
    ]
  },
  {
    title: 'Incident',
    image: PoliceLine,
    addRoute: '/organization/equipment-mangement/incedant/add',
    indexRoute: '/organization/equipment-mangement/incedant?isAll=1',
    description: 'Add . show',
    AddPermissions: [
      PermissionsEnum.ADMIN,
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum.ORG_INCEDANT_CREATE,
      PermissionsEnum.ORG_INCEDANT_ALL,
    ],
    indexPermissions: [
      PermissionsEnum.ADMIN,
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum.ORG_INCEDANT_FETCH,
      PermissionsEnum.ORG_INCEDANT_ALL,
    ]
  },
  // {
  //   title: 'Hazard',
  //   image: ALERT,
  //   addRoute: '/organization/equipment-mangement/hazard/add',
  //   indexRoute: '/organization/equipment-mangement/hazard?isAll=1',
  //   description: 'Add . show'
  // },


]
</script>

<template>
  <div class="all-observation">
    <!-- <HeaderPage :title="'all you need in one page'" subtitle="select what you want to do" :img="allObservationImage" /> -->

    <div class="cards">
      <permission-builder v-for="i in items" :key="i" :code="i.indexPermissions || i.AddPermissions">
        <ObservationCard :item="i" />
      </permission-builder>
    </div>
  </div>
</template>
