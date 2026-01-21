<script setup lang="ts">
import Location from "@/assets/images/Location.png";
import HeaderSection from "../DetailsHeader/HeaderSection.vue";
import LocationCard from "./LocationCard.vue";
import { ref } from "vue";
import type LocationDetailsModel from "@/features/setting/Location/Data/models/LocationModel";
import ShowAllZonesDialog from "./ShowAllZonesDialog.vue";

const props = defineProps<{
  locations: LocationDetailsModel[]
  projectId: number
}>()


</script>


<template>
  <div class="project-location">
    <div class="project-location-header">
      <HeaderSection :img="Location" :title="`project_location_&_site_overview`"
        :subtitle="`mapping_each_main_site_with_its_associated_working_areas`" />

      <ShowAllZonesDialog :locations="locations" :projectId="projectId" />
    </div>

    <div class="card-section">
      <LocationCard v-for="(card, index) in locations?.slice(0, 2)" :key="index" :title="card.title"
        :zone="card.zoons.length" :zoons="card.zoons" :LocationId="card?.id" :projectId="projectId" />
    </div>
  </div>
</template>
