<script setup lang="ts">
import type TeamLocation from '@/features/Organization/Project/Data/models/TeamLocationModel';
import TeamCard from './TeamCard.vue';


const props = defineProps<{
  location: TeamLocation
}>()

</script>

<template>
  <div class="teams-locations">
    <div class="location">
      <hr class="location-hr">
      <p class="location-title">{{ location.location_title }}</p>
    </div>
    <div class="teams">
      <TeamCard v-for="(team, index) in location.projectLocationTeams" :key="index" :team="location.projectLocationTeams" />
    </div>
  </div>
</template>
