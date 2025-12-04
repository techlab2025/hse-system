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
    addRoute: 'equipment/observation/add',
    image: observationImage,
    indexRoute: '/organization/equipment/observation',
    description: 'You can Show all observations here'
  },
  {
    title: 'Hazard',
    addRoute: 'equipment/hazard/add',
    image: hazardImage,
    indexRoute: '/organization/equipment/hazard',
    description: 'You can Show all hazards here'
  },
  {
    title: 'Incident',
    addRoute: 'equipment/incedant/add',
    image: incedantImage,
    indexRoute: '/organization/equipment/incedant',
    description: 'You can Show all incidents here'
  },
  {
    title: 'Inspection',
    addRoute: 'equipment/inspection/add',
    image: inspectionImage,
    indexRoute: '/organization/equipment/inspection',
    description: 'You can Show all inspections here'
  }
]
</script>

<template>
  <div class="all-observation">
    <HeaderPage
      :title="'all you need in one page'"
      subtitle="select what you want to do"
      :img="allObservationImage"
    />

    <div class="cards">
      <ObservationCard v-for="i in items" :key="i" :item="i" />
    </div>
  </div>
</template>
