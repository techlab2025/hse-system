<script setup lang="ts">
import Location from "@/assets/images/Location.png";
import HeaderSection from "../DetailsHeader/HeaderSection.vue";
import LocationCard from "./LocationCard.vue";
import { ref } from "vue";
import type LocationDetailsModel from "@/features/setting/Location/Data/models/LocationModel";

const props = defineProps<{ locations: LocationDetailsModel[] }>()
</script>


<template>
  <div class="project-location">
    <div class="project-location-header">
      <HeaderSection :img="Location" :title="`project_location_&_site_overview`"
        :subtitle="`mapping_each_main_site_with_its_associated_working_areas`" />

      <button @click.prevent="" class="show-all-btn">{{ $t('show_all') }}</button>
    </div>

    <div class="card-section">
      <LocationCard v-for="(card, index) in locations" :key="index" :title="card.title" :zone="card.zoons.length"
        :zoons="card.zoons" />
    </div>
  </div>
</template>
