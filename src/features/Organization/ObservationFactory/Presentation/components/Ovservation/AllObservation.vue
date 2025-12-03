<script setup lang="ts">
import HeaderPage from '@/features/Organization/Project/Presentation/components/Details/DetailsHeader/HeaderPage.vue'
import allObservationImage from '@/assets/images/services 1.png'
import ObservationCard from './cards/ObservationCard.vue'


const items = [
  {
    title: 'Observation',
    addRoute: 'equipment/observation/add',
    image: '/src/assets/images/thinking.png',
    indexRoute: 'equipment/observation',
    description: 'You can Show all observations here'
  },
  {
    title: 'Hazard',
    addRoute: 'equipment/hazard/add',
    image: '/src/assets/images/hazard-sign.png',
    indexRoute: 'equipment/hazard',
    description: 'You can Show all hazards here'
  },
  {
    title: 'Incident',
    addRoute: 'equipment/incedant/add',
    image: '/src/assets/images/risk-assessment-document.png',
    indexRoute: 'equipment/incedant',
    description: 'You can Show all incidents here'
  },
  {
    title: 'Inspection',
    addRoute: 'equipment/inspection/add',
    image: '/src/assets/images/inspection.png',
    indexRoute: 'equipment/inspection',
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
