<script setup lang="ts">
import TeamCard from './TeamCard.vue';

interface LocationInterface {
  location: string,
  teams: {
    members: number,
    teamMembers: {
      img: string,
      name: string,
      poistion: string
    }[]
  }[]
}

const props = defineProps<{
  location: LocationInterface
}>()

</script>

<template>
  <div class="teams-locations">
    <div class="location">
      <hr class="location-hr">
      <p class="location-title">{{ location.location }}</p>
    </div>
    <div class="teams">
      <TeamCard v-for="(team, index) in location.teams" :key="index" :team="team" />
    </div>
  </div>
</template>
