<script setup lang="ts">
import Location from "@/assets/images/Location.png";
import HeaderSection from "../DetailsHeader/HeaderSection.vue";
import LocationCard from "./LocationCard.vue";
import { ref } from "vue";

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


</script>


<template>
  <div class="project-location">
    <HeaderSection :img="Location" :title="`Project Site & Location Overview`"
      :subtitle="`Mapping each main site with its associated working areas`" />

    <div class="card-section">
      <LocationCard v-for="(card, index) in Cards" :key="index" :title="card.title" :zone="card.zone"
        :location="card.location" :Locations="card.Locations" />
    </div>
  </div>
</template>
