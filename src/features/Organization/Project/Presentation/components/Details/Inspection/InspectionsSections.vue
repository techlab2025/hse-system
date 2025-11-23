<script setup lang="ts">
import HeaderSection from '../DetailsHeader/HeaderSection.vue'
import InspectionsCard from './InspectionsCard.vue'

const { inspectionsImage, inspectionHeaderTitle, inspectionHeaderSubtitle } = defineProps<{
  inspectionsImage: string
  inspectionHeaderTitle: string
  inspectionHeaderSubtitle: string
}>()
</script>

<template>
  <div class="inspections">
    <HeaderSection
      :img="inspectionsImage"
      :title="inspectionHeaderTitle"
      :subtitle="inspectionHeaderSubtitle"
    />

    <div class="inspections-cards">
      <InspectionsCard />
    </div>
  </div>
</template>
