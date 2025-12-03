<script lang="ts" setup>
import LoactionTeams from '@/assets/images/LoactionTeams.png'
import HeaderSection from '../DetailsHeader/HeaderSection.vue'
import LocationsSection from './LocationsSection.vue'
import EmptyData from './EmptyData.vue'
import EmptyFolder from '@/assets/images/EmptyFolder.png'
import { useRoute } from 'vue-router'
import type TeamLocation from '@/features/Organization/Project/Data/models/TeamLocationModel'

const route = useRoute()
const id = route.params.id
const props = defineProps<{
  teamLocations: TeamLocation[]
}>()

</script>

<template>
  <div class="locations-teams">
    <div class="locations-teams-header">
      <HeaderSection :img="LoactionTeams" title="Teams by Operational location"
        subtitle="View all working teams assigned to each operational zone" />
      <RouterLink :to="`/organization/employee-details/${id}`" class="show-all">Show all</RouterLink>
    </div>
    <div class="locations-sections" v-if="teamLocations?.length > 0">
      <LocationsSection v-for="(location, index) in teamLocations" :key="index" :location="location" />
    </div>
  </div>
</template>
