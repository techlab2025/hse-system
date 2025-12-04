<script setup lang="ts">
import HeaderPage from '@/features/Organization/Project/Presentation/components/Details/DetailsHeader/HeaderPage.vue'
import allObservationImage from '@/assets/images/services 1.png'
import ObservationCard from './cards/ObservationCard.vue'
import observationImage  from "@/assets/images/thinking.png"
import hazardImage  from "@/assets/images/hazard-sign.png"
import incedantImage  from "@/assets/images/risk-assessment-document.png"
import inspectionImage  from "@/assets/images/inspection.png"


const items = [
  {
    title: 'Observation',
    image: observationImage,
    addRoute: '/organization/equipment-mangement/observation/add',
    indexRoute: '/organization/equipment-mangement/observation?isAll=1',
    description: 'You can Show all observations here'
  },
  {
    title: 'Hazard',
    image: hazardImage,

    addRoute: '/organization/equipment-mangement/hazard/add',
    indexRoute: '/organization/equipment-mangement/hazard?isAll=1',
    description: 'You can Show all hazards here'
  },
  {
    title: 'Incident',
    image: incedantImage,
    addRoute: '/organization/equipment-mangement/incedant/add',
    indexRoute: '/organization/equipment-mangement/incedant?isAll=1',
    description: 'You can Show all incidents here'
  },
  {
    title: 'Inspection',
    image: inspectionImage,
    addRoute: '/organization/equipment-mangement/inspection/add',
    indexRoute: '/organization/equipment-mangement/inspection?isAll=1',
    description: 'You can Show all inspections here'
  }
]
</script>

<template>
  <div class="all-observation">
    <HeaderPage :title="'all you need in one page'" subtitle="select what you want to do" :img="allObservationImage" />

    <div class="cards">
      <ObservationCard v-for="i in items" :key="i" :item="i" />
    </div>
  </div>
</template>
