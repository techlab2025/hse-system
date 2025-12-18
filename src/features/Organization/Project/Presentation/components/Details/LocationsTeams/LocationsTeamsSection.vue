<script lang="ts" setup>
import LoactionTeams from '@/assets/images/LoactionTeams.png'
import HeaderSection from '../DetailsHeader/HeaderSection.vue'
import LocationsSection from './LocationsSection.vue'
import EmptyData from './EmptyData.vue'
import EmptyFolder from '@/assets/images/EmptyFolder.png'
import { useRoute } from 'vue-router'
import type TeamLocation from '@/features/Organization/Project/Data/models/TeamLocationModel'
import { computed } from 'vue'

const route = useRoute()
const id = route.params.id
const props = defineProps<{
  teamLocations: TeamLocation[]
}>()

const CheckTeamsEmpty = computed(() => props.teamLocations?.map((p) => p.projectLocationTeams?.length).reduce((a, b) => a + b, 0) === 0)
</script>

<template>
  <div class="locations-teams">
    <div class="locations-teams-header">
      <HeaderSection :img="LoactionTeams" title="teams_by_operational_location"
        subtitle="view_all_working_teams_assigned_to_each_operational_zone" />
      <RouterLink :to="`/organization/employee-details/${id}`" class="show-all">Show all</RouterLink>
    </div>
    <pre>
    </pre>
    <div class="locations-sections" v-if="teamLocations?.length > 0 && !CheckTeamsEmpty">
      <LocationsSection v-for="(location, index) in teamLocations" :key="index" :location="location" />
    </div>
    <div class="empty-teams" v-else>
      <EmptyData :img="EmptyFolder" title="No Team Members Yet"
        subtitle="You haven’t added any employees to this team. Start building your crew now!"
        :link="`/organization/employee-details/${id}`" linkText=" Start building your crew now!" />
    </div>
  </div>
</template>
