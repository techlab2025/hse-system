<script setup lang="ts">
import type TeamLocation from '@/features/Organization/Project/Data/models/TeamLocationModel';
import TeamCard from './TeamCard.vue';
import EmptyData from './EmptyData.vue';
import EmptyFolder from '@/assets/images/EmptyFolder.png'
import { useRoute } from 'vue-router';


const route = useRoute()
const id = route.params.id
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

    <div class="teams" v-if="location?.projectLocationTeams?.length > 0">
      <TeamCard v-for="(team, index) in location.projectLocationTeams" :key="index" :team="team" />
    </div>
    <div class="empty-teams" v-else>
      <EmptyData :img="EmptyFolder" title="No Team Members Yet"
        subtitle="You haven’t added any employees to this team. Start building your crew now!"
        :link="`/organization/employee-details/${id}`" linkText=" Start building your crew now!" />
    </div>
  </div>

</template>
