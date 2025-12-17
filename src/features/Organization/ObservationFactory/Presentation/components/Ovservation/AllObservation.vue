<script setup lang="ts">

import ObservationCard from './cards/ObservationCard.vue'
import Political from "@/assets/images/Political.png"
import ALERT from "@/assets/images/ALERT.png"
import PoliceLine from "@/assets/images/PoliceLine.png"
import ToDoLogo from "@/assets/images/ToDoLogo.png"


const items = [
  {
    title: 'Observation',
    image: Political,
    addRoute: '/organization/equipment-mangement/observation/add',
    indexRoute: '/organization/equipment-mangement/observation?isAll=1',
    description: 'Create . show'
  },
  {
    title: 'Hazard',
    image: ALERT,
    addRoute: '/organization/equipment-mangement/hazard/add',
    indexRoute: '/organization/equipment-mangement/hazard?isAll=1',
    description: 'Create . show'
  },
  {
    title: 'Incident',
    image: PoliceLine,
    addRoute: '/organization/equipment-mangement/incedant/add',
    indexRoute: '/organization/equipment-mangement/incedant?isAll=1',
    description: 'Create . show'
  },
  {
    title: 'Inspection',
    image: ToDoLogo,
    addRoute: '/organization/equipment-mangement/inspection/add',
    indexRoute: '/organization/equipment-mangement/inspection?isAll=1',
    description: 'Create . show'
  }
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
