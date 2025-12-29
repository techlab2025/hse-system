<script setup lang="ts">
// import type ProjectLocationZonesModel from '@/features/Organization/Project/Data/models/ProjectLocationZones';
import type SohwProjectZoonModel from '@/features/Organization/Project/Data/models/ShowProjectZone';

const props = defineProps<{
  title: string,
  zone: SohwProjectZoonModel[],
  zoons: string[]
}>()

</script>



<template>
  <div class="location-card">
    <div class="card-header">
      <div class="location-header">
        <p class="title">{{ title }}</p>
        <p class="zone"><span>{{ zone }}</span> {{ $t('site') }}</p>
      </div>
      <!-- <p class="location">{{ location }}</p> -->
    </div>
    <hr class="card-hr">
    <div class="locations">
      <p class="location-title" v-for="(location, index) in zoons" :key="index">{{ location.title }}</p>
    </div>
  </div>
</template>
