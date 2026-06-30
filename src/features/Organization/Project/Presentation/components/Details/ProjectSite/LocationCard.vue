<script setup lang="ts">
import type SohwProjectZoonModel from '@/features/Organization/Project/Data/models/ShowProjectZone'
import ProjectLocationZoonDialog from './ProjectLocationZoonDialog.vue'
import EmptyZoons from './EmptyZoons.vue'

const { title, zoneLength, zoons, LocationId, projectId } = defineProps<{
  title: string | undefined
  zoneLength: number | undefined
  zoons: SohwProjectZoonModel[] | undefined
  LocationId: number | undefined
  projectId: number | undefined
}>()
</script>

<template>
  <div class="location-card">
    <div class="card-header">
      <div class="location-header-container">
        <div class="location-header">
          <p class="title">{{ title }}</p>
          <p class="zone">
            <span>{{ zoneLength }}</span> {{ $t('zone') }}
          </p>
        </div>
        <ProjectLocationZoonDialog :LocationId="LocationId" :projectId="projectId" />
      </div>
    </div>

    <hr class="card-hr" />

    <div class="locations">
      <p
        class="location-title"
        v-if="zoons && zoons?.length > 0"
        v-for="(zoon, index) in zoons"
        :key="index"
      >
        {{ zoon.title || zoon.zoonTitle }}
      </p>
      <EmptyZoons v-else />
    </div>
  </div>
</template>
<style scoped>
.location-card {
  border: 1px solid rgb(233, 232, 232);
  border-radius: 10px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px;
}
</style>
