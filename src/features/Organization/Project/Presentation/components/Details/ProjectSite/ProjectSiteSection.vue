<script setup lang="ts">
import Location from '@/assets/images/Location.png'
import HeaderSection from '../DetailsHeader/HeaderSection.vue'
import LocationCard from './LocationCard.vue'
import type LocationDetailsModel from '@/features/setting/Location/Data/models/LocationModel'
import ShowAllZonesDialog from './ShowAllZonesDialog.vue'

const { locations, projectId } = defineProps<{
  locations: LocationDetailsModel[] | undefined
  projectId: number | undefined
}>()
</script>

<template>
  <div class="project-location">
    <div class="project-location-header">
      <HeaderSection
        :img="Location"
        :title="$t('project_location_&_site_overview')"
        :subtitle="$t('mapping_each_main_site_with_its_associated_working_areas')"
      />

      <ShowAllZonesDialog :locations="locations" :projectId="projectId" />
    </div>

    <div class="card-section">
      <LocationCard
        v-for="(card, index) in locations?.slice(0, 2)"
        :key="index"
        :title="card.title"
        :zoneLength="Number(card.zoons.length)"
        :zoons="card.zoons"
        :LocationId="Number(card?.id)"
        :projectId="Number(projectId)"
      />
    </div>
  </div>
</template>
