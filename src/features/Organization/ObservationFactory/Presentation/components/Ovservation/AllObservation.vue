<script setup lang="ts">

import ObservationCard from './cards/ObservationCard.vue'
import Political from "@/assets/images/Political.png"
import ALERT from "@/assets/images/ALERT.png"
import PoliceLine from "@/assets/images/PoliceLine.png"
import ToDoLogo from "@/assets/images/ToDoLogo.png"
import { InspectionPageType, InspectionType } from '../../../Core/Enums/InspectionTypeEnum'


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
    description: 'Add . show'
  },
  {
    title: 'Observation',
    image: Political,
    addRoute: '/organization/equipment-mangement/observation/add',
    indexRoute: '/organization/equipment-mangement/observation?isAll=1',
    description: 'Add . show'
  },
  {
    title: 'Incident',
    image: PoliceLine,
    addRoute: '/organization/equipment-mangement/incedant/add',
    indexRoute: '/organization/equipment-mangement/incedant?isAll=1',
    description: 'Add . show'
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
      <ObservationCard v-for="i in items" :key="i" :item="i" />
    </div>
  </div>
</template>
