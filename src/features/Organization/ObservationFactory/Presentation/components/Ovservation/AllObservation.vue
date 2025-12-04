<script setup lang="ts">
import HeaderPage from '@/features/Organization/Project/Presentation/components/Details/DetailsHeader/HeaderPage.vue'
import allObservationImage from '@/assets/images/services 1.png'
import ObservationCard from './cards/ObservationCard.vue'


const items = [
  {
    title: 'Observation',
    addRoute: '/organization/equipment-mangement/observation/add',
    image: '/src/assets/images/thinking.png',
    indexRoute: '/organization/equipment-mangement/observation?isAll=1',
    description: 'You can Show all observations here'
  },
  {
    title: 'Hazard',
    addRoute: '/organization/equipment-mangement/hazard/add',
    image: '/src/assets/images/hazard-sign.png',
    indexRoute: '/organization/equipment-mangement/hazard?isAll=1',
    description: 'You can Show all hazards here'
  },
  {
    title: 'Incident',
    addRoute: '/organization/equipment-mangement/incedant/add',
    image: '/src/assets/images/risk-assessment-document.png',
    indexRoute: '/organization/equipment-mangement/incedant?isAll=1',
    description: 'You can Show all incidents here'
  },
  {
    title: 'Inspection',
    addRoute: '/organization/equipment-mangement/inspection/add',
    image: '/src/assets/images/inspection.png',
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
