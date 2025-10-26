<script setup lang="ts">
const props = defineProps<{
  title: string,
  zone: number,
  location: string
  Locations: string[]
}>()

</script>



<template>
  <div class="location-card">
    <div class="card-header">
      <div class="location-header">
        <p class="title">{{ title }}</p>
        <p class="zone"><span>{{ zone }}</span> zone</p>
      </div>
      <p class="location">{{ location }}</p>
    </div>
    <hr class="card-hr">
    <div class="locations">
      <p class="location-title" v-for="(location, index) in Locations" :key="index">{{ location }}</p>
    </div>
  </div>
</template>
