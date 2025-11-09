<script setup lang="ts">
import Location from "@/assets/images/Location.png";
import HeaderSection from "../DetailsHeader/HeaderSection.vue";
import LocationCard from "./LocationCard.vue";
import { ref } from "vue";
import type LocationDetailsModel from "@/features/setting/Location/Data/models/LocationModel";

const Cards = ref([
  {
    title: "Alexandria",
    zone: 10,
    location: "31.2°N, 29.9°E · Egypt",
    Locations: [
      "Heliopolis",
      "Heliopolis",
      "Heliopolis",
      "Heliopolis",
      "Heliopolis",
    ],
  },
  {
    title: "Alexandria",
    zone: 10,
    location: "31.2°N, 29.9°E · Egypt",
    Locations: [
      "Heliopolis",
      "Heliopolis",
      "Heliopolis",
      "Heliopolis",
      "Heliopolis",
    ],
  },
])

const props = defineProps<{ locations: LocationDetailsModel[] }>()
</script>


<template>
  <div class="project-location">
    <HeaderSection :img="Location" :title="`Project Site & Location Overview`"
      :subtitle="`Mapping each main site with its associated working areas`" />

    <div class="card-section">
      <LocationCard v-for="(card, index) in locations" :key="index" :title="card.title" :zone="card.zoons.length"
        :zoons="card.zoons" />
    </div>
  </div>
</template>
