<script setup lang="ts">
// import type ProjectLocationZonesModel from '@/features/Organization/Project/Data/models/ProjectLocationZones';
import type SohwProjectZoonModel from '@/features/Organization/Project/Data/models/ShowProjectZone';

import EmptyZoon from "@/assets/images/EmptyZoon.png";
import ProjectLocationZoonDialog from './ProjectLocationZoonDialog.vue';
const props = defineProps<{
  title: string,
  zone: SohwProjectZoonModel[],
  zoons: string[]
  LocationId: number
  projectId: number
}>()

</script>



<template>
  <div class="location-card">
    <div class="card-header">

      <div class="location-header-container">
        <div class="location-header">
          <p class="title">{{ title }}</p>
          <p class="zone"><span>{{ zone }}</span> {{ $t('zone') }}</p>
        </div>
        <ProjectLocationZoonDialog :LocationId="LocationId" :projectId="projectId" />

        <!-- <button class="add-zone">{{ $t('add Zone') }}</button> -->
      </div>
      <!-- <p class="location">{{ location }}</p> -->
    </div>
    <hr class="card-hr">
    <div class="locations">
      <p v-if="zoons.length > 0" class="location-title" v-for="(location, index) in zoons" :key="index">{{
        location.title }}</p>

      <div class="empty-zoon" v-else>
        <div class="empty-zoon-info">
          <p class="no-zoon">{{ $t('No Zoons Yet') }}</p>
          <p class="no-zoon-description">{{ $t('No Zoons has been assigned to this location yet. You can add new areas at any time') }}</p>
        </div>
        <img :src="EmptyZoon" alt="empty-zoon">
      </div>

    </div>
  </div>
</template>
