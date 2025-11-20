<script setup lang="ts">
import HeaderPage from '@/features/Organization/Project/Presentation/components/Details/DetailsHeader/HeaderPage.vue'
import allObservationImage from '@/assets/images/services 1.png'
import ObservationCard from './cards/ObservationCard.vue'
</script>

<template>
  <div class="all-observation">
    <HeaderPage
      :title="'all you need in one page'"
      subtitle="select what you want to do"
      :img="allObservationImage"
    />

    <div class="cards">
      <ObservationCard v-for="i in 6" :key="i" />
    </div>
  </div>
</template>
